export const degreesToOpenLayersRotation = (degrees: number): number => {
  const normalised = ((degrees % 360) + 360) % 360
  return (normalised * Math.PI) / 180
}
