
import { fetchActivityLogs } from '@/app/lib/activity-logs';

export const dynamic = 'force-dynamic';

function escapeCsv(value: string) {
  const normalized = value.replace(/"/g, '""');
  return `"${normalized}"`;
}

export async function GET() {
  const { logs } = await fetchActivityLogs();

  const header = ['WAKTU', 'NO AWB', 'PERUBAHAN STATUS', 'OPERATOR', 'KETERANGAN'];
  const rows = logs.map((log) => [
    log.waktu,
    log.awb,
    log.perubahanStatus,
    log.operator,
    log.keterangan,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell))).join(','))
    .join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tracking-log-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}