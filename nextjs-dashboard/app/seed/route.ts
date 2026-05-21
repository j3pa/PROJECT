import postgres from 'postgres';
import { bandara, penerbangan, cargo, manifest, customers } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. SEED CUSTOMERS
async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  return Promise.all(
    customers.map((c) => sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 2. SEED MASTER BANDARA
async function seedBandara() {
  await sql`
    CREATE TABLE IF NOT EXISTS bandara (
      id VARCHAR(10) PRIMARY KEY,
      kode VARCHAR(10) NOT NULL UNIQUE,
      nama VARCHAR(255) NOT NULL,
      kota VARCHAR(255) NOT NULL
    );
  `;

  return Promise.all(
    bandara.map((b) => sql`
      INSERT INTO bandara (id, kode, nama, kota)
      VALUES (${b.id}, ${b.kode}, ${b.nama}, ${b.kota})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 3. SEED MASTER PENERBANGAN
async function seedPenerbangan() {
  await sql`
    CREATE TABLE IF NOT EXISTS penerbangan (
      id VARCHAR(10) PRIMARY KEY,
      nomor VARCHAR(20) NOT NULL,
      asal_id VARCHAR(10) REFERENCES bandara(id),
      tujuan_id VARCHAR(10) REFERENCES bandara(id),
      waktu VARCHAR(20) NOT NULL
    );
  `;

  return Promise.all(
    penerbangan.map((p) => sql`
      INSERT INTO penerbangan (id, nomor, asal_id, tujuan_id, waktu)
      VALUES (${p.id}, ${p.nomor}, ${p.asal_id}, ${p.tujuan_id}, ${p.waktu})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 4. SEED CARGO (LOG TRACKING)
async function seedCargo() {
  await sql`
    CREATE TABLE IF NOT EXISTS cargo (
      awb VARCHAR(50) PRIMARY KEY,
      customer_email VARCHAR(255) REFERENCES customers(email),
      tujuan_id VARCHAR(10) REFERENCES bandara(id),
      berat INT NOT NULL,
      status VARCHAR(50) NOT NULL
    );
  `;

  return Promise.all(
    cargo.map((c) => sql`
      INSERT INTO cargo (awb, customer_email, tujuan_id, berat, status)
      VALUES (${c.awb}, ${c.customer_email}, ${c.tujuan_id}, ${c.berat}, ${c.status})
      ON CONFLICT (awb) DO NOTHING;
    `)
  );
}

// 5. SEED MANIFEST HARIAN (Tabel Tampilan Utama Dashboard)
async function seedManifest() {
  await sql`
    CREATE TABLE IF NOT EXISTS manifest (
      awb VARCHAR(50) PRIMARY KEY,
      pengirim VARCHAR(255) NOT NULL,
      tujuan VARCHAR(50) NOT NULL,
      koli INT NOT NULL,
      berat VARCHAR(50) NOT NULL,
      penerbangan VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      waktu_update VARCHAR(20) NOT NULL
    );
  `;

  return Promise.all(
    manifest.map((m) => sql`
      INSERT INTO manifest (awb, pengirim, tujuan, koli, berat, penerbangan, status, waktu_update)
      VALUES (${m.awb}, ${m.pengirim}, ${m.tujuan}, ${m.koli}, ${m.berat}, ${m.penerbangan}, ${m.status}, ${m.waktuUpdate})
      ON CONFLICT (awb) DO NOTHING;
    `)
  );
}

// ROUTE UTAMA YANG DIJALANKAN DI BROWSER (/seed)
export async function GET() {
  try {
    // Jalankan transaksi pendaftaran berurutan sesuai prioritas relasi (FK)
    await seedCustomers();
    await seedBandara();
    await seedPenerbangan();
    await seedCargo();
    await seedManifest();

    return Response.json({ message: 'Database Ekspedisi Petir seeded successfully' });
  } catch (error) {
    console.error('Seeding Error:', error);
    return Response.json({ error: 'Gagal melakukan seeding database', details: error }, { status: 500 });
  }
}