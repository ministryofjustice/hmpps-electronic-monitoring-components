import { degreesToOpenLayersRotation } from './viewport'

describe('degreesToOpenLayersRotation', () => {
  it('returns 0 for 0 degrees', () => {
    expect(degreesToOpenLayersRotation(0)).toBeCloseTo(0)
  })

  it('converts 270 degrees correctly', () => {
    expect(degreesToOpenLayersRotation(270)).toBeCloseTo((-3 * Math.PI) / 2)
  })

  it('normalises values > 360', () => {
    expect(degreesToOpenLayersRotation(450)).toBeCloseTo(-Math.PI / 2)
  })

  it('normalises negative values', () => {
    expect(degreesToOpenLayersRotation(-90)).toBeCloseTo((-3 * Math.PI) / 2)
  })
})
