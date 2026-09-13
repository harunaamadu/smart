export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function discountPercent(
  price: number,
  compareAt?: number,
): number | null {
  if (!compareAt || compareAt <= price) return null;

  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}