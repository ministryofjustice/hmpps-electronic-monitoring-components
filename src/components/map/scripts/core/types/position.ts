import type { MarkerOptions } from '../layers/locations-layer'

type Position = {
  latitude: number
  longitude: number
  marker?: MarkerOptions
}

type PositionWithPrecision = Position & {
  precision: number
}

export type { Position, PositionWithPrecision }
