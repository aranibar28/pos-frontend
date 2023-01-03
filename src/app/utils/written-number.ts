const writtenNumber = require('written-number');
writtenNumber.defaults.lang = 'es';

export function numberToCardinal(number: number): string {
  const integerPart = Math.trunc(number);
  const decimalPart = Math.round((number - integerPart) * 100);

  const integerString = writtenNumber(integerPart).toUpperCase();

  return `${integerString} CON ${decimalPart}/100 SOLES`;
}
