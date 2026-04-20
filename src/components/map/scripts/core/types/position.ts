import type { MarkerOptions } from '../layers/locations-layer'

/**
 * Displayable property value for a position.
 *
 * Can be a simple string, or an object that separates the displayed value
 * from the value used when copying (e.g. formatted vs raw).
 */
type Property =
  /** Simple display value. */
  | string
  | {
      /** Value shown in the UI. */
      value: string

      /** Value used when copied. */
      copyValue: string
    }

/**
 * Geographic position associated with a Crime or Electronic Monitoring device.
 */
type Position = {
  /** Latitude in decimal degrees (WGS84). */
  latitude: number

  /** Longitude in decimal degrees (WGS84). */
  longitude: number

  /** Position accuracy in metres. */
  precision: number

  /** Optional metadata for display in overlays. */
  properties?: Record<string, Property>

  /** Optional short label for display in overlays. */
  label?: string

  /** Optional map marker configuration. */
  marker?: MarkerOptions
}

export type { Position, Property }
