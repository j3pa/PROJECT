export const dynamic = 'force-dynamic';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. SEED TABEL KENDARAAN (Sesuai Syarat UGD)
async function seedKendaraan() {
  await sql`DROP TABLE IF EXISTS transaksi CASCADE;`;
  await sql`DROP TABLE IF EXISTS kendaraan CASCADE;`;

  // Membuat tabel kendaraan dengan atribut lengkap
  await sql`
    CREATE TABLE kendaraan (
      id VARCHAR(20) PRIMARY KEY,
      nama_kendaraan VARCHAR(100) NOT NULL,
      jenis_kendaraan VARCHAR(50) NOT NULL,
      kode_kendaraan VARCHAR(50) NOT NULL,
      kapasitas_muatan INT NOT NULL,
      status_kendaraan VARCHAR(50) NOT NULL
    );
  `;

  // Insert data dummy Pesawat Ekspedisi Petir
  const dataKendaraan = [
    { id: 'K-001', nama: 'Boeing 737F', jenis: 'Pesawat Udara', kode: 'PK-SBT01', kapasitas: 20000, status: 'Aktif' },
    { id: 'K-002', nama: 'Airbus A330F', jenis: 'Pesawat Udara', kode: 'PK-SBT02', kapasitas: 65000, status: 'Maintenance' }
  ];

  return Promise.all(
    dataKendaraan.map((k) => sql`
      INSERT INTO kendaraan (id, nama_kendaraan, jenis_kendaraan, kode_kendaraan, kapasitas_muatan, status_kendaraan)
      VALUES (${k.id}, ${k.nama}, ${k.jenis}, ${k.kode}, ${k.kapasitas}, ${k.status})
    `)
  );
}

// 2. SEED TABEL TRANSAKSI / CARGO (Sesuai Syarat UGD)
async function seedTransaksi() {
  // Membuat tabel transaksi dengan seluruh field wajib dari dosen
  await sql`
    CREATE TABLE transaksi (
      resi VARCHAR(50) PRIMARY KEY,
      tanggal_kirim DATE NOT NULL,
      nama_pengirim VARCHAR(100) NOT NULL,
      nama_penerima VARCHAR(100) NOT NULL,
      no_telepon VARCHAR(20) NOT NULL,
      kota_asal VARCHAR(50) NOT NULL,
      kota_tujuan VARCHAR(50) NOT NULL,
      jenis_barang VARCHAR(50) NOT NULL,
      berat_barang DECIMAL NOT NULL,
      tarif INT NOT NULL,
      jenis_pengiriman VARCHAR(30) NOT NULL,
      kendaraan_id VARCHAR(20) REFERENCES kendaraan(id),
      status_pengiriman VARCHAR(50) NOT NULL,
      catatan TEXT
    );
  `;

  // Insert data dummy kargo
  const dataTransaksi = [
    {
      resi: 'AWB-20260525-001', tanggal: '2026-05-25', pengirim: 'PT Solusi Maju', penerima: 'Rizky Jerico',
      telp: '081234567890', asal: 'Jakarta', tujuan: 'Surabaya', barang: 'Elektronik', berat: 50,
      tarif: 1500000, jenis: 'Cepat', kendaraan_id: 'K-001', status: 'Diproses', catatan: 'Fragile, Jangan Dibanting'
    },
    {
      resi: 'AWB-20260525-002', tanggal: '2026-05-25', pengirim: 'PT Nusantara', penerima: 'Andi Pratama',
      telp: '089876543210', asal: 'Jakarta', tujuan: 'Bali', barang: 'Dokumen', berat: 2.5,
      tarif: 250000, jenis: 'Vvip', kendaraan_id: 'K-001', status: 'Dalam Pengiriman', catatan: 'Dokumen Rahasia'
    }
  ];

  return Promise.all(
    dataTransaksi.map((t) => sql`
      INSERT INTO transaksi (resi, tanggal_kirim, nama_pengirim, nama_penerima, no_telepon, kota_asal, kota_tujuan, jenis_barang, berat_barang, tarif, jenis_pengiriman, kendaraan_id, status_pengiriman, catatan)
      VALUES (${t.resi}, ${t.tanggal}, ${t.pengirim}, ${t.penerima}, ${t.telp}, ${t.asal}, ${t.tujuan}, ${t.barang}, ${t.berat}, ${t.tarif}, ${t.jenis}, ${t.kendaraan_id}, ${t.status}, ${t.catatan})
    `)
  );
}

export async function GET() {
  try {
    await seedKendaraan();
    await seedTransaksi();
    
    return Response.json({ message: 'Database berhasil disinkronkan!' });
  } catch (error: any) {
    console.error('Seeding Error:', error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}