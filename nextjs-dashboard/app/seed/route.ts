import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, bandara, penerbangan, cargo, manifest } from '@/app/lib/placeholder-data'; 

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. SEED BANDARA (Master)
async function seedBandara(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS bandara (
      id VARCHAR(10) PRIMARY KEY,
      kode VARCHAR(5) NOT NULL UNIQUE,
      nama VARCHAR(100) NOT NULL,
      kota VARCHAR(50) NOT NULL
    );
  `;
  return Promise.all(
    bandara.map((b: any) => sql`
      INSERT INTO bandara (id, kode, nama, kota)
      VALUES (${b.id}, ${b.kode}, ${b.nama}, ${b.kota})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 2. SEED CUSTOMERS (Master) - Diubah ke VARCHAR agar sinkron dengan data dummy & mudah di-query manual
async function seedCustomers(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  return Promise.all(
    customers.map((c: any) => sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 3. SEED PENERBANGAN (Master)
async function seedPenerbangan(sql: any) {
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
    penerbangan.map((p: any) => sql`
      INSERT INTO penerbangan (id, nomor, asal_id, tujuan_id, waktu)
      VALUES (${p.id}, ${p.nomor}, ${p.asal_id}, ${p.tujuan_id}, ${p.waktu})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

// 4. SEED CARGO (Transaksi Utama)
async function seedCargo(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS cargo (
      awb VARCHAR(20) PRIMARY KEY,
      customer_email VARCHAR(255) REFERENCES customers(email),
      tujuan_id VARCHAR(10) REFERENCES bandara(id),
      berat INT NOT NULL,
      status VARCHAR(50) NOT NULL
    );
  `;
  return Promise.all(
    cargo.map((c: any) => sql`
      INSERT INTO cargo (awb, customer_email, tujuan_id, berat, status)
      VALUES (${c.awb}, ${c.customer_email}, ${c.tujuan_id}, ${c.berat}, ${c.status})
      ON CONFLICT (awb) DO NOTHING;
    `)
  );
}

// 5. SEED MANIFEST (Junction Table)
async function seedManifest(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS manifest (
      id VARCHAR(10) PRIMARY KEY,
      penerbangan_id VARCHAR(10) REFERENCES penerbangan(id),
      awb VARCHAR(20) REFERENCES cargo(awb),
      catatan VARCHAR(255)
    );
  `;
  return Promise.all(
    manifest.map((m: any) => sql`
      INSERT INTO manifest (id, penerbangan_id, awb, catatan)
      VALUES (${m.id}, ${m.penerbangan_id}, ${m.awb}, ${m.catatan})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
}

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      // PENTING: Hapus tabel lama terlebih dahulu agar perubahan struktur/relasi baru bisa diterapkan tanpa bentrok
      await sql`DROP TABLE IF EXISTS manifest, cargo, penerbangan, customers, bandara CASCADE;`;
      
      return [
        await seedBandara(sql),
        await seedCustomers(sql),
        await seedPenerbangan(sql),
        await seedCargo(sql),
        await seedManifest(sql),
      ];
    });
    
    return Response.json({ message: 'Database Ekspedisi Petir seeded successfully!' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    // Menampilkan pesan error spesifik jika terjadi kegagalan di browser
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}