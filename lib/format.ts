export function formatPrice(pence: number) {
  return "£" + (pence / 100).toFixed(2);
}
