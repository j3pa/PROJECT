
import postgres from 'postgres';
import { formatWibClock } from '@/app/lib/time';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface ActivityLogRow {
  waktu: string;
  waktuSort: string;
  awb: string;
  perubahanStatus: string;
  operator: string;
  keterangan: string;
  status: string;
}

export function buildFallbackLogs(): ActivityLogRow[] {
  return [
    {
      waktu: '07:55:03',
      waktuSort: '2026-06-01 07:55:03',
      awb: 'AWB-20260526-6180',
      perubahanStatus: 'Sampai Tujuan -> Selesai',
      operator: 'Andika',
      keterangan: 'Konfirmasi diterima lengkap oleh pelanggan',
      status: 'Selesai',
    },
    {
      waktu: '07:22:11',
      waktuSort: '2026-06-01 07:22:11',
      awb: 'AWB-20260526-7900',
      perubahanStatus: 'Diproses -> Dalam Pengiriman',
      operator: 'Suharto',
      keterangan: 'JT-892 wheels up dan cargo dinyatakan berangkat',
      status: 'Dalam Pengiriman',
    },
    {
      waktu: '07:10:44',
      waktuSort: '2026-06-01 07:10:44',
      awb: 'AWB-20260525-1001',
      perubahanStatus: 'Pending -> Diproses',
      operator: 'Rini',
      keterangan: 'Loaded ke GA-136 dan manifest diverifikasi',
      status: 'Diproses',
    },
  ];
}

export async function fetchActivityLogs() {
  try {
    const trackingLogs = await sql`
      SELECT *
      FROM tracking_logs
      ORDER BY occurred_at DESC, id DESC
    `;

    const logs: ActivityLogRow[] = trackingLogs.map((row) => {
      const occuredAt = new Date(row.occurred_at);
      const waktu = formatWibClock(occuredAt);

      return {
        waktu,
        waktuSort: row.occurred_at?.toISOString?.() || String(row.occurred_at),
        awb: row.resi,
        perubahanStatus: `${row.previous_status} -> ${row.new_status}`,
        operator: row.operator_name,
        keterangan: row.keterangan,
        status: row.new_status,
      };
    });

    return {
      logs,
      databaseError: '',
      isFallback: false,
    };
  } catch (error) {
    console.error('Gagal memuat tracking log:', error);
    return {
      logs: buildFallbackLogs(),
      databaseError: 'Tracking log sedang memakai data contoh karena database belum merespons.',
      isFallback: true,
    };
  }
}
