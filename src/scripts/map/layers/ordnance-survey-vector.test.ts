import { applyStyle } from 'ol-mapbox-style'
import { OrdnanceSurveyVectorTileLayer, resolveTileType } from './ordnance-survey-vector'
import { supportsWebGL } from '../../helpers/browser'

jest.mock('ol-mapbox-style', () => ({
  applyStyle: jest.fn().mockResolvedValue('STYLE_APPLIED'),
}))

jest.mock('../../helpers/browser', () => ({
  supportsWebGL: jest.fn(),
}))

jest.mock('ol/layer/VectorTile', () => {
  return {
    __esModule: true,
    default: class MockVectorTileLayer {
      private props: Record<string, unknown>

      constructor(opts: Record<string, unknown> = {}) {
        this.props = opts
      }

      get(key: string) {
        return this.props[key]
      }
    },
  }
})

describe('resolveTileType', () => {
  it('returns vector if explicitly requested', () => {
    expect(resolveTileType('vector')).toBe('vector')
  })

  it('returns raster if explicitly requested', () => {
    expect(resolveTileType('raster')).toBe('raster')
  })

  it('returns vector when supportsWebGL = true', () => {
    ;(supportsWebGL as jest.Mock).mockReturnValue(true)
    expect(resolveTileType(null)).toBe('vector')
  })

  it('returns raster when supportsWebGL = false', () => {
    ;(supportsWebGL as jest.Mock).mockReturnValue(false)
    expect(resolveTileType(null)).toBe('raster')
  })
})

describe('OrdnanceSurveyVectorTileLayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initialises with declutter = true', () => {
    const layer = new OrdnanceSurveyVectorTileLayer()
    expect(layer).toBeInstanceOf(OrdnanceSurveyVectorTileLayer)
    expect(layer.get('declutter')).toBe(true)
  })

  it('strips a single trailing slash before passing to applyStyle', async () => {
    const layer = new OrdnanceSurveyVectorTileLayer()
    await layer.applyVectorStyle('https://tiles.os.uk/styles/')
    expect(applyStyle).toHaveBeenCalledWith(layer, 'https://tiles.os.uk/styles')
  })

  it('returns the result of applyStyle', async () => {
    const layer = new OrdnanceSurveyVectorTileLayer()
    const result = await layer.applyVectorStyle('https://tiles.os.uk/styles/os.json')
    expect(result).toBe('STYLE_APPLIED')
  })
})
