const stadiumTimezone: Record<string, number> = {
  "1": -6,  "2": -6,  "3": -6,
  "4": -5,  "5": -5,  "6": -5,
  "7": -4,  "8": -4,  "9": -4,
  "10": -4, "11": -4, "12": -4,
  "13": -7, "14": -7, "15": -7, "16": -7,
};

export function localDateToUTC(localDate: string, stadiumId: string): string {
  const match = localDate.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?$/i,
  );

  if (!match) {
    throw new Error(`Invalid local date format: ${localDate}`);
  }

  const [, month, day, year, rawHour, minute, meridiem] = match;
  const offset = stadiumTimezone[stadiumId] ?? -5;
  let hour = Number(rawHour);

  if (meridiem) {
    const upperMeridiem = meridiem.toUpperCase();
    if (upperMeridiem === "PM" && hour !== 12) hour += 12;
    if (upperMeridiem === "AM" && hour === 12) hour = 0;
  }

  return new Date(Date.UTC(+year, +month - 1, +day, hour - offset, +minute)).toISOString();
}
