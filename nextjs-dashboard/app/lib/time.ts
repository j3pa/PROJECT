export const INDONESIA_TIME_ZONE = 'Asia/Jakarta';

export function parseDateValue(value?: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatWibClock(value: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: INDONESIA_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(value).replaceAll(':', '.');
}

export function formatWibDate(value?: string | Date | null, fallback = 'Data waktu belum tersedia') {
  const date = parseDateValue(value);
  if (!date) return fallback;

  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: INDONESIA_TIME_ZONE,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  const time = [getPart('hour'), getPart('minute'), getPart('second')].join('.');

  return `${getPart('day')} ${getPart('month')} ${getPart('year')} pukul ${time}`;
}

export function toSafeIsoString(value?: string | Date | null) {
  return parseDateValue(value)?.toISOString() || null;
}
