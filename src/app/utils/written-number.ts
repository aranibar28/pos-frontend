import writtenNumber from 'written-number';
writtenNumber.defaults.lang = 'es';

export function numberToCardinal(number: number, currency: string): string {
  const integerPart = Math.trunc(number);
  const decimalPart = Math.round((number - integerPart) * 100);

  const integerString = writtenNumber(integerPart).toUpperCase();
  const formatCurrency = typeCurrency(currency);

  return `${integerString} CON ${decimalPart}/100 ${formatCurrency}`;
}

function typeCurrency(currency: string) {
  switch (currency) {
    case 'PEN':
      return 'SOLES';
    case 'USD':
      return 'DOLARES';
    case 'EUR':
      return 'EUROS';
    default:
      return '';
  }
}
