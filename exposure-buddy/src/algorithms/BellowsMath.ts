export const bellowsStopAdjustment = (
  focalLength: number,
  bellows: number
): number => Math.log2(Math.pow(bellows / focalLength, 2.0));
