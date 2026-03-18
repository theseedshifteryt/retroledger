import { NumberFormatType } from '@/lib/types';

/**
 * Formats a number according to the selected number format.
 * 
 * 'us'    → 10,000.00  (comma thousands, period decimal)
 * 'eu'    → 10.000,00  (period thousands, comma decimal)
 * 'space' → 10 000.00  (space thousands, period decimal)
 */
export function formatNumber(
  value: number,
  format: NumberFormatType,
  decimals: number = 2,
): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  let formattedInt: string;
  switch (format) {
    case 'eu':
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      break;
    case 'space':
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      break;
    case 'us':
    default:
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      break;
  }

  const decimalSeparator = format === 'eu' ? ',' : '.';
  const sign = value < 0 ? '-' : '';

  if (decimals === 0) {
    return `${sign}${formattedInt}`;
  }

  return `${sign}${formattedInt}${decimalSeparator}${decPart}`;
}

/**
 * Formats a currency amount with the currency symbol prefix.
 */
export function formatCurrency(
  value: number,
  currency: string,
  format: NumberFormatType,
  decimals: number = 2,
): string {
  return `${currency}${formatNumber(value, format, decimals)}`;
}
