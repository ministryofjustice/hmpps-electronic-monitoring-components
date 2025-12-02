type Position = {
  latitude: number
  longitude: number
}

type PositionWithPrecision = Position & {
  precision: number
}

export type { Position, PositionWithPrecision }
