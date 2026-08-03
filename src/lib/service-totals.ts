import type { Service } from "./use-catalog";

export function parsePrice(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatPrice(total: number): string {
  return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseDuration(value: string): number {
  if (!value) return 0;
  let minutes = 0;
  const h = value.match(/(\d+)\s*h/i);
  const m = value.match(/(\d+)\s*min/i);
  if (h) minutes += Number(h[1]) * 60;
  if (m) minutes += Number(m[1]);
  if (!h && !m) {
    const n = Number.parseInt(value, 10);
    if (Number.isFinite(n)) minutes += n;
  }
  return minutes;
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}

export function serviceTotals(s: Service) {
  const extras = s.customExtras ?? [];
  const minutes =
    parseDuration(s.duration) + extras.reduce((acc, e) => acc + parseDuration(e.duration), 0);
  const price = parsePrice(s.price) + extras.reduce((acc, e) => acc + parsePrice(e.price), 0);
  return { minutes, price, duration: formatDuration(minutes), priceLabel: formatPrice(price) };
}
