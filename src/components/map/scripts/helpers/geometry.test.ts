import { Coordinate } from 'ol/coordinate'
import { fromLonLat, getPointResolution } from 'ol/proj'
import {
  bearingToVector,
  calculateAngleOfInclination,
  calculateInterpolatedCoordinate,
  isCoordinateWithinDistance,
  normalise,
  getNumericProperty,
  extendCoordinate,
  metersToProjectionUnits,
  toCoordinate,
} from './geometry'

jest.mock('ol/proj', () => ({
  fromLonLat: jest.fn(),
  getPointResolution: jest.fn(),
}))

const mockGetPointResolution = getPointResolution as jest.MockedFunction<typeof getPointResolution>
const mockFromLonLat = fromLonLat as jest.MockedFunction<typeof fromLonLat>

describe('geometry', () => {
  describe('calculateInterpolatedCoordinate', () => {
    it.each([
      ['North', [10, 5], 5, 0, [10, 10]],
      ['East', [10, 5], 5, Math.PI / 2, [15, 5]],
      ['South', [10, 5], 5, Math.PI, [10, 0]],
      ['West', [10, 5], 5, (3 * Math.PI) / 2, [5, 5]],
      ['Zero distance', [10, 5], 0, Math.PI / 6, [10, 5]],
    ])(
      '[%s] calculateInterpolatedCoordinate(%s, %s, %s)',
      (_: string, coord: Coordinate, distance: number, azimuth: number, expected: Coordinate) => {
        const actual = calculateInterpolatedCoordinate(coord, distance, azimuth)

        expect(actual[0]).toBeCloseTo(expected[0])
        expect(actual[1]).toBeCloseTo(expected[1])
      },
    )
  })

  describe('calculateAngleOfInclination', () => {
    it.each([
      ['North', [5, 5], [5, 10], Math.PI / 2],
      ['East', [5, 5], [10, 5], 0],
      ['South', [5, 5], [5, 0], -Math.PI / 2],
      ['East', [5, 5], [0, 5], Math.PI],
    ])(
      '[%s] calculateAngleOfInclination(%s, %s, %s)',
      (_: string, start: Coordinate, end: Coordinate, expected: number) => {
        expect(calculateAngleOfInclination(start, end)).toBeCloseTo(expected)
      },
    )
  })

  describe('isCoordinateWithinDistance', () => {
    it.each([
      [
        'inside distance to single point',
        [0, 0],
        [[3, 4]], // distance = 5
        6,
        true,
      ],
      [
        'exactly at max distance',
        [0, 0],
        [[3, 4]], // distance = 5
        5,
        true,
      ],
      [
        'outside distance to single point',
        [0, 0],
        [[6, 8]], // distance = 10
        5,
        false,
      ],
      ['no other coordinates', [0, 0], [], 5, false],
      [
        'inside distance to one of many points',
        [10, 10],
        [
          [100, 100],
          [13, 14], // distance = 5
          [50, 50],
        ],
        5,
        true,
      ],
    ])(
      '[%s] isCoordinateWithinDistance(%s, %s, %s)',
      (_: string, coord: Coordinate, others: Array<Coordinate>, maxDistance: number, expected: boolean) => {
        expect(isCoordinateWithinDistance(coord, others, maxDistance)).toBe(expected)
      },
    )
  })

  describe('bearingToVector', () => {
    it.each([
      ['0° (North)', 0, 'degrees', [0, 1]],
      ['90° (East)', 90, 'degrees', [1, 0]],
      ['180° (South)', 180, 'degrees', [0, -1]],
      ['270° (West)', 270, 'degrees', [-1, 0]],
      ['π/2 radians (East)', Math.PI / 2, 'radians', [1, 0]],
    ])('%s', (_label, input, units, expected) => {
      const result = bearingToVector(input, units as any)

      expect(result[0]).toBeCloseTo(expected[0])
      expect(result[1]).toBeCloseTo(expected[1])
    })
  })

  describe('normalise', () => {
    it('normalises a vector', () => {
      const result = normalise(3, 4)
      expect(result![0]).toBeCloseTo(0.6)
      expect(result![1]).toBeCloseTo(0.8)
    })

    it('returns null for zero vector', () => {
      expect(normalise(0, 0)).toBeNull()
    })
  })

  describe('getNumericProperty', () => {
    it('returns numeric value when present', () => {
      const obj = { direction: 123 }
      expect(getNumericProperty(obj as any, 'direction')).toBe(123)
    })

    it('returns undefined for non-number', () => {
      const obj = { direction: '123' }
      expect(getNumericProperty(obj as any, 'direction')).toBeUndefined()
    })

    it('returns undefined if key missing', () => {
      const obj = {}
      expect(getNumericProperty(obj as any, 'direction')).toBeUndefined()
    })

    it('returns undefined if key not provided', () => {
      const obj = { direction: 100 }
      expect(getNumericProperty(obj as any)).toBeUndefined()
    })
  })

  describe('metersToProjectionUnits', () => {
    it('converts meters using resolution', () => {
      mockGetPointResolution.mockReturnValue(2)

      const result = metersToProjectionUnits([0, 0], 10)

      expect(result).toBe(5)
      expect(getPointResolution).toHaveBeenCalled()
    })
  })

  describe('extendCoordinate', () => {
    it('extends coordinate in direction', () => {
      mockGetPointResolution.mockReturnValue(1)

      const result = extendCoordinate([0, 0], [1, 0], 10)

      expect(result).toEqual([10, 0])
    })

    it('uses projection scaling', () => {
      mockGetPointResolution.mockReturnValue(2)

      const result = extendCoordinate([0, 0], [1, 0], 10)

      expect(result).toEqual([5, 0])
    })
  })

  describe('toCoordinate', () => {
    it('returns projected coordinate unchanged', () => {
      const result = toCoordinate({ longitude: 1000, latitude: 1000 } as any)
      expect(result).toEqual([1000, 1000])
    })

    it('converts lon/lat using fromLonLat', () => {
      mockFromLonLat.mockReturnValue([123, 456])

      const result = toCoordinate({ longitude: -2, latitude: 53 } as any)

      expect(fromLonLat).toHaveBeenCalledWith([-2, 53])
      expect(result).toEqual([123, 456])
    })
  })
})
