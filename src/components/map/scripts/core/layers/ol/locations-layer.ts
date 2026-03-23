import { Position } from '@map/scripts/core/types/position'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style, Icon } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { createPointFeatureCollectionFromPositions } from '../../features/point'
import { ICON_REGISTRY } from '../../icons/icon-registry'

type OLLocationsLayerStyle = {
  fill?: string | CanvasPattern | CanvasGradient | null
  radius?: number
  stroke?: {
    color?: string
    width?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    miterLimit?: number
  }
  displacement?: [number, number]
  rotation?: number
  rotateWithView?: boolean
  scale?: number | [number, number]
}

type MarkerType = 'point' | 'pin' | 'image'

export type MarkerOptions = {
  type?: MarkerType
  scale?: number

  point?: {
    radius?: number
    fill?: string | CanvasPattern | CanvasGradient
    stroke?: {
      color?: string
      lineDash?: number[]
      lineDashOffset?: number
      lineCap?: CanvasLineCap
      width?: number
    }
  }

  pin?: {
    color?: string
    strokeColor?: string
    iconSrc?: string
    iconSvg?: string
    scale?: number
    iconScale?: number
  }

  image?: {
    src?: string
    svg?: string
    name?: string
    scale?: number
    anchor?: [number, number]
  }
}

type OLLocationsLayerOptions = {
  positions: Array<Position>
  style?: OLLocationsLayerStyle
  marker?: MarkerOptions
  title: string
  visible?: boolean
  zIndex?: number
}

const DEFAULT_RADIUS = 6
const DEFAULT_FILL = '#d4351c'
const DEFAULT_STROKE_COLOR = '#505a5f'
const DEFAULT_STROKE_WIDTH = 2
const DEFAULT_VISIBILITY = true

export class OLLocationsLayer extends VectorLayer<VectorSource<Feature<Point>>> {
  private static iconCache = new Map<string, string>()

  constructor({ positions, style = {}, marker, title, visible = DEFAULT_VISIBILITY, zIndex }: OLLocationsLayerOptions) {
    super({
      properties: {
        title,
      },
      source: new VectorSource({
        features: createPointFeatureCollectionFromPositions(positions),
      }),
      style: feature => {
        const featureMarker = feature.get('marker')
        return this.createStyle(style, featureMarker ?? marker)
      },
      visible,
      zIndex,
    })

    this.preloadIcons(positions, marker)
  }

  // Converts a Blob to a Data URL for use in OpenLayers Icon styles.
  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  // Preloads and caches external icon sources (e.g. PNG/SVG URLs) as data URLs
  // for use in pin markers, ensuring they are available before rendering.
  private async preloadIcons(positions: Position[], marker?: MarkerOptions) {
    const sources = new Set<string>()

    positions.forEach(position => {
      const featureMarker = (position as Position & { marker?: MarkerOptions }).marker
      if (featureMarker?.pin?.iconSrc) sources.add(featureMarker.pin.iconSrc)
    })

    if (marker?.pin?.iconSrc) sources.add(marker.pin.iconSrc)

    const uncachedSources = Array.from(sources).filter(src => !OLLocationsLayer.iconCache.has(src))

    await Promise.all(
      uncachedSources.map(async src => {
        try {
          const res = await fetch(src)
          const blob = await res.blob()
          const dataUrl = await this.blobToDataUrl(blob)

          OLLocationsLayer.iconCache.set(src, dataUrl)
        } catch (e) {
          console.warn(`Failed to preload icon: ${src}`, e)
        }
      }),
    )

    if (uncachedSources.length > 0) {
      this.changed()
    }
  }

  // Creates an OpenLayers Style based on the provided style and marker options.
  private createStyle(style: OLLocationsLayerStyle, marker: MarkerOptions | undefined): Style {
    const type = marker?.type ?? 'point'

    if (type === 'image' && marker?.image) {
      const baseSize = 64
      const baseScale = marker.image.scale ?? 24 / baseSize
      const svg = marker.image.svg ?? (marker.image.name ? ICON_REGISTRY[marker.image.name] : undefined)
      const src = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : marker.image.src

      return new Style({
        zIndex: 1,
        image: new Icon({
          src,
          scale: baseScale,
          anchor: marker.image.anchor ?? [0.5, 0.5],
        }),
      })
    }

    if (type === 'pin') {
      return this.createPinStyle(marker?.pin)
    }

    // Default to 'point' style if type is 'point' or not specified
    const radius = marker?.point?.radius ?? style.radius ?? DEFAULT_RADIUS
    const fillColor = marker?.point?.fill ?? style.fill ?? DEFAULT_FILL
    const strokeColor = marker?.point?.stroke?.color ?? style.stroke?.color ?? DEFAULT_STROKE_COLOR
    const strokeWidth = marker?.point?.stroke?.width ?? style.stroke?.width ?? DEFAULT_STROKE_WIDTH

    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({
          color: strokeColor,
          width: strokeWidth,
          lineDash: marker?.point?.stroke?.lineDash ?? style.stroke?.lineDash,
          lineDashOffset: style.stroke?.lineDashOffset,
          lineCap: style.stroke?.lineCap,
          lineJoin: style.stroke?.lineJoin,
          miterLimit: style.stroke?.miterLimit,
        }),
      }),
    })
  }

  // Creates a Style for a pin marker, generating an SVG data URL with the specified colour and optional icon.
  private createPinStyle(pin: MarkerOptions['pin'] | undefined): Style {
    const colour = pin?.color ?? DEFAULT_FILL
    const pinScale = pin?.scale ?? 1

    return new Style({
      zIndex: 2,
      image: new Icon({
        src: this.generatePinSvg(colour, pin),
        scale: pinScale,
        anchor: [0.5, 0.6],
      }),
    })
  }

  // Generates an SVG data URL for a pin marker, optionally including an icon.
  private generatePinSvg(colour: string, pin?: MarkerOptions['pin']): string {
    const iconSvg = pin?.iconSvg
    const iconSrc = pin?.iconSrc
    const iconScale = pin?.iconScale ?? 1

    let iconContent = ''

    if (iconSvg) {
      iconContent = `
        <circle cx="18" cy="13" r="6" fill="white"/>
        <g transform="translate(12.5,8) scale(${iconScale})">
          ${iconSvg}
        </g>
      `
    } else if (iconSrc) {
      const cached = OLLocationsLayer.iconCache.get(iconSrc)

      if (cached) {
        const size = 10
        const scaled = size * iconScale

        const centerX = 18
        const centerY = 13

        const x = centerX - scaled / 2
        const y = centerY - scaled / 2

        iconContent = `
          <circle cx="18" cy="13" r="6" fill="white"/>
          <image
            href="${cached}"
            x="${x}"
            y="${y}"
            width="${scaled}"
            height="${scaled}"
            preserveAspectRatio="xMidYMid meet"
          />
        `
      }
    }

    const svg = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">

        <ellipse
          cx="18"
          cy="34"
          rx="7"
          ry="2.5"
          fill="rgba(0,0,0,0.22)"
        />

        <path
          d="M18 3
            C10.5 3 7 8.5 7 13
            C7 20 14 30 18 34
            C22 30 29 20 29 13
            C29 8.5 25.5 3 18 3Z"
          fill="${colour}"
        />

        ${iconContent}

      </svg>
    `

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }
}
