const stadiumTimezone: Record<string, number> = {
  "1": -6,  "2": -6,  "3": -6,
  "4": -5,  "5": -5,  "6": -5,
  "7": -4,  "8": -4,  "9": -4,
  "10": -4, "11": -4, "12": -4,
  "13": -7, "14": -7, "15": -7, "16": -7,
};

export function localDateToUTC(localDate: string, stadiumId: string): string {
  const [month, day, year, hour, minute] = localDate.split(/[/ :]/);
  const offset = stadiumTimezone[stadiumId] ?? -5;
  return new Date(Date.UTC(+year, +month - 1, +day, +hour - offset, +minute)).toISOString();
}
