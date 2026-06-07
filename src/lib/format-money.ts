export function formatMoney(amount: number, symbol: string): string {
  const prefix = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const [intPart, decPart] = abs.toFixed(2).split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${prefix}${symbol}${withThousands}.${decPart}`;
}

export function lineItemAmount(quantity: number, rate: number): number {
  return quantity * rate;
}
