// app/lib/data.ts
import postgres from 'postgres';

// Inisialisasi koneksi ke database Neon dengan SSL wajib
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Fungsi pembantu untuk menahan loading skeleton (1000ms = 1 detik)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. FETCH DATA RINGKASAN UTAMA DASHBOARD
 * Mengambil data statistik untuk 4 Kotak Status atas (Total Cargo, Total Flights, dll).
 * Digunakan pada: app/dashboard/page.tsx
 */
export async function fetchDashboardData() {
  try {
    // Tahan loading skeleton utama selama 3 detik
    await delay(3000);

    // Menjalankan query hitung secara paralel demi efisiensi
    const totalCargoPromise = sql`SELECT COUNT(*) FROM cargo`;
    const totalPenerbanganPromise = sql`SELECT COUNT(*) FROM penerbangan`;
    const statusGroupPromise = sql`
      SELECT 
        SUM(CASE WHEN status = 'Departed' THEN 1 ELSE 0 END) AS departed,
        SUM(CASE WHEN status = 'Sortation' THEN 1 ELSE 0 END) AS sortation,
        SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) AS received
      FROM manifest`;

    const [totalCargo, totalPenerbangan, statusCounts] = await Promise.all([
      totalCargoPromise,
      totalPenerbanganPromise,
      statusGroupPromise,
    ]);

    return {
      cargoCount: Number(totalCargo[0].count ?? '0'),
      flightCount: Number(totalPenerbangan[0].count ?? '0'),
      departedCount: Number(statusCounts[0].departed ?? '0'),
      sortationCount: Number(statusCounts[0].sortation ?? '0'),
      receivedCount: Number(statusCounts[0].received ?? '0'),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard overview data.');
  }
}

/**
 * 2. FETCH DATA MANIFEST HARIAN
 * Mengambil seluruh daftar log manifest harian untuk tabel utama.
 * Digunakan pada: app/dashboard/manifest/page.tsx
 */
export async function fetchManifestData() {
  try {
    // Tahan loading skeleton tabel manifest selama 2.5 detik
    await delay(2500);

    const data = await sql`
      SELECT awb, pengirim, tujuan, koli, berat, penerbangan, status, waktu_update
      FROM manifest
      ORDER BY waktu_update DESC;
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch manifest data.');
  }
}

/**
 * 3. FETCH JADWAL STATUS PENERBANGAN
 * Mengambil rute penerbangan dengan join data master bandara (Asal & Tujuan).
 * Digunakan pada: app/dashboard/penerbangan/page.tsx
 */
export async function fetchFlightData() {
  try {
    // Tahan loading skeleton tabel penerbangan selama 2.5 detik
    await delay(2500);

    const data = await sql`
      SELECT 
        p.id, 
        p.nomor, 
        b_asal.kode AS asal_kode, 
        b_asal.nama AS asal_bandara,
        b_tujuan.kode AS tujuan_kode, 
        b_tujuan.nama AS tujuan_bandara,
        p.waktu
      FROM penerbangan p
      JOIN bandara b_asal ON p.asal_id = b_asal.id
      JOIN bandara b_tujuan ON p.tujuan_id = b_tujuan.id
      ORDER BY p.waktu ASC;
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch flight schedules data.');
  }
}

/**
 * 4. FETCH TRACKING LOG (BY AWB)
 * Melacak log kargo spesifik berdasarkan nomor resi AWB yang diinput user.
 * Digunakan pada: app/dashboard/tracking/page.tsx
 */
export async function fetchTrackingByAwb(awbQuery: string) {
  try {
    if (!awbQuery) return null;

    // Tahan efek pencarian tracking kargo selama 1.5 detik agar realistis
    await delay(1500);

    const data = await sql`
      SELECT 
        c.awb, 
        cust.name AS nama_customer, 
        b.nama AS bandara_tujuan, 
        b.kota AS kota_tujuan, 
        c.berat, 
        c.status
      FROM cargo c
      JOIN customers cust ON c.customer_email = cust.email
      JOIN bandara b ON c.tujuan_id = b.id
      WHERE c.awb ILIKE ${`%${awbQuery}%`};
    `;
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tracking details.');
  }
}