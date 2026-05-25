// src/lib/dates/dateKeys.ts

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());

  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(dateKey: string): Date | null {
  const parts = dateKey.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const [yearPart, monthPart, dayPart] = parts;
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);

  if (getLocalDateKey(parsedDate) !== dateKey) {
    return null;
  }

  return parsedDate;
}

export function getIsoWeekKey(date: Date = new Date()): string {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const dayNumber = utcDate.getUTCDay() || 7;

  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);

  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));

  const weekNumber = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / millisecondsPerDay + 1) / 7
  );

  return `${isoYear}-W${padTwoDigits(weekNumber)}`;
}

export function getStartOfIsoWeek(date: Date = new Date()): Date {
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const dayNumber = startDate.getDay() || 7;

  startDate.setDate(startDate.getDate() - dayNumber + 1);
  startDate.setHours(0, 0, 0, 0);

  return startDate;
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

export function parseIsoWeekKey(weekKey: string): Date | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekKey);

  if (!match) {
    return null;
  }

  const [, yearPart, weekPart] = match;
  const year = Number(yearPart);
  const week = Number(weekPart);

  if (!Number.isInteger(year) || !Number.isInteger(week)) {
    return null;
  }

  if (week < 1 || week > 53) {
    return null;
  }

  const januaryFourth = new Date(year, 0, 4);
  const firstIsoWeekStart = getStartOfIsoWeek(januaryFourth);
  const requestedWeekStart = addDays(firstIsoWeekStart, (week - 1) * 7);

  if (getIsoWeekKey(requestedWeekStart) !== weekKey) {
    return null;
  }

  return requestedWeekStart;
}

export function getPreviousIsoWeekKey(weekKey: string): string | null {
  const weekStart = parseIsoWeekKey(weekKey);

  if (!weekStart) {
    return null;
  }

  return getIsoWeekKey(addDays(weekStart, -7));
}

export function sortIsoWeekKeysAscending(weekKeys: string[]): string[] {
  return [...weekKeys].sort((firstWeekKey, secondWeekKey) => {
    const firstDate = parseIsoWeekKey(firstWeekKey);
    const secondDate = parseIsoWeekKey(secondWeekKey);

    if (!firstDate || !secondDate) {
      return firstWeekKey.localeCompare(secondWeekKey);
    }

    return firstDate.getTime() - secondDate.getTime();
  });
}

export function sortDateKeysAscending(dateKeys: string[]): string[] {
  return [...dateKeys].sort((firstDateKey, secondDateKey) =>
    firstDateKey.localeCompare(secondDateKey)
  );
}

export function sortDateKeysDescending(dateKeys: string[]): string[] {
  return [...dateKeys].sort((firstDateKey, secondDateKey) =>
    secondDateKey.localeCompare(firstDateKey)
  );
}