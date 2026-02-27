export function formatDollar(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatDollarK(value: number): string {
  return `$${Math.round(value / 1000)}K`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatSignedDollar(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatDollar(value)}`;
}

export function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(0)}%`;
}
