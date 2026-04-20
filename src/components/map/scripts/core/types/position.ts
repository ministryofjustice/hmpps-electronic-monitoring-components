import type { MarkerOptions } from '../layers/locations-layer'

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
  properties?: Record<
    string,
    | string
    | {
        value: string
        copyValue: string
      }
  >

  /** Short label for display in overlays. */
  label?: string

  /** Optional map marker configuration. */
  marker?: MarkerOptions
}

export type { Position }
