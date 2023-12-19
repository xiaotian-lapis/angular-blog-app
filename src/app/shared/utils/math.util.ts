export const roundTo = (num: number, decimalPlaces = 2) =>
  Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
