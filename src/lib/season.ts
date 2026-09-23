/** A season is named by its start year. The end date is exclusive. */
export function seasonDates(year: number, start: string, end: string) {
  const endYear = year + (end <= start ? 1 : 0);
  return { dateStart: `${year}-${start}`, dateEnd: `${endYear}-${end}` };
}
