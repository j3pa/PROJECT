import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function fetchDashboardData() {
  try {
    await delay(3000);
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
export async function fetchManifestData() {
  try {
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
export async function fetchFlightData() {
  try {
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
export async function fetchTrackingByAwb(awbQuery: string) {
  try {
    if (!awbQuery) return null;
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