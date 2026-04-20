import Overlay from 'ol/Overlay'
import { Coordinate } from 'ol/coordinate'

export default class FeatureOverlay extends Overlay {
  private container: HTMLElement

  private title: HTMLElement | null

  private content: HTMLElement

  private closeButton: HTMLButtonElement

  constructor(container: HTMLElement) {
    const header = container.querySelector('.app-map__overlay-header') as HTMLElement
    const title = container.querySelector('.app-map__overlay-title') as HTMLElement
    const content = container.querySelector('.app-map__overlay-body') as HTMLElement
    const closeButton = container.querySelector('.app-map__overlay-close') as HTMLButtonElement

    container.setAttribute('part', 'app-map__overlay')
    content.setAttribute('part', 'app-map__overlay-body')
    header.setAttribute('part', 'app-map__overlay-header')
    title.setAttribute('part', 'app-map__overlay-title')
    closeButton.setAttribute('part', 'app-map__overlay-close')

    super({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
        margin: 80,
      },
      offset: [0, 0],
      positioning: 'top-center',
      stopEvent: true,
    })

    this.container = container
    this.title = title
    this.content = content
    this.closeButton = closeButton

    this.closeButton.addEventListener('click', () => this.close())
  }

  private replacer(html: string, data: Record<string, unknown>) {
    return html.replace(/{{(.*?)}}/g, (_, key) => {
      const value = data[key.trim()]
      return value !== undefined ? String(value) : ''
    })
  }

  showAtCoordinate(coordinate: Coordinate, data: Record<string, unknown>) {
    const titleTemplateId = data.overlayTitleTemplateId
    const bodyTemplateId = data.overlayBodyTemplateId

    const titleTemplate = typeof titleTemplateId === 'string' ? document.getElementById(titleTemplateId) : null

    const bodyTemplate = typeof bodyTemplateId === 'string' ? document.getElementById(bodyTemplateId) : null

    if (titleTemplate instanceof HTMLTemplateElement && this.title) {
      this.title.innerHTML = this.replacer(titleTemplate.innerHTML, data)
    }

    if (bodyTemplate instanceof HTMLTemplateElement) {
      this.content.innerHTML = this.replacer(bodyTemplate.innerHTML, data)
    } else {
      console.warn(`[FeatureOverlay] No valid template found for overlayBodyTemplateId="${bodyTemplateId}"`)
    }

    this.attachCopyHandlers()

    this.container.hidden = false
    this.setPosition(coordinate)

    this.container.dispatchEvent(new CustomEvent('map:overlay:open', { bubbles: true }))
  }

  private attachCopyHandlers() {
    const copyLinks = this.content.querySelectorAll<HTMLAnchorElement>('.app-map__copy-link')

    copyLinks.forEach(link => {
      const el = link

      if (el.dataset.copyBound === 'true') return
      el.dataset.copyBound = 'true'

      el.addEventListener('click', async event => {
        event.preventDefault()

        const row = el.closest('.app-map__overlay-row')
        if (!row) return

        const valueEl = row.querySelector<HTMLElement>('[data-copy-value]')
        const valueToCopy = valueEl?.dataset.copyValue
        if (!valueToCopy) return

        try {
          await navigator.clipboard.writeText(valueToCopy)
        } catch (err) {
          console.error('[FeatureOverlay] Copy failed', err)
        }
      })
    })
  }

  close() {
    this.container.hidden = true
    this.setPosition(undefined)

    this.container.dispatchEvent(new CustomEvent('map:overlay:close', { bubbles: true }))
  }
}
