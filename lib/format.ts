export function formatMoney(value: string | null) {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return `$${amount.toFixed(2)}`;
}

export function formatSnakeCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function toDatetimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
