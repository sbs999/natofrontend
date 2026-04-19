/** JS-style month index 0–11 → Georgian month name in dative (-ს) for "დღეს" phrasing */
const MONTHS_DATIVE = [
  "იანვარს",
  "თებერვალს",
  "მარტს",
  "აპრილს",
  "მაისს",
  "ივნისს",
  "ივლისს",
  "აგვისტოს",
  "სექტემბერს",
  "ოქტომბერს",
  "ნოემბერს",
  "დეკემბერს",
];

export type YmdParts = {
  year: number;
  month: number;
  day: number;
};

/** e.g. "2026 წლის 2 დეკემბერს" (year + წლის + day + month dative) */
export function formatGeorgianLongDate(parts: YmdParts): string {
  const m = MONTHS_DATIVE[parts.month] ?? "";
  return `${parts.year} წლის ${parts.day} ${m}`;
}

/** Parse `d/m/y` from API `borrowDateLabel` / `repayDateLabel` when raw parts missing */
export function parseSlashDateLabel(label: string): YmdParts | null {
  const m = label.trim().match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month1 = Number(m[2]);
  const year = Number(m[3]);
  if (!day || !month1 || !year) return null;
  return { year, month: month1 - 1, day };
}

export function formatEpisodeDate(
  parts: YmdParts | null | undefined,
  labelFallback: string
): string {
  if (parts && typeof parts.year === "number") {
    return formatGeorgianLongDate(parts);
  }
  const parsed = parseSlashDateLabel(labelFallback);
  return parsed ? formatGeorgianLongDate(parsed) : labelFallback;
}
