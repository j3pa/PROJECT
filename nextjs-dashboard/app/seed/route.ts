import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await sql.begin(async (trx) => {
      await trx`DROP TRIGGER IF EXISTS transaksi_to_shipments_sync ON transaksi`;
      await trx`DROP FUNCTION IF EXISTS sync_shipments_from_transaksi()`;
      await trx`DROP TABLE IF EXISTS tracking_logs CASCADE`;
      await trx`DROP TABLE IF EXISTS shipments CASCADE`;
      await trx`DROP TABLE IF EXISTS transaksi CASCADE`;
      await trx`DROP TABLE IF EXISTS kendaraan CASCADE`;
      await trx`DROP TABLE IF EXISTS users CASCADE`;

      await trx`
        CREATE TABLE kendaraan (
          id VARCHAR(255) PRIMARY KEY,
          nama_kendaraan VARCHAR(255) NOT NULL,
          jenis_kendaraan VARCHAR(255) NOT NULL,
          kode_kendaraan VARCHAR(255) NOT NULL UNIQUE,
          kapasitas_muatan NUMERIC(10, 2) NOT NULL,
          status_kendaraan VARCHAR(255) NOT NULL DEFAULT 'Aktif',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await trx`
        CREATE TABLE transaksi (
          resi VARCHAR(255) PRIMARY KEY,
          tanggal_kirim DATE NOT NULL DEFAULT CURRENT_DATE,
          nama_pengirim VARCHAR(255) NOT NULL,
          nama_penerima VARCHAR(255) NOT NULL,
          no_telepon VARCHAR(20) NOT NULL,
          kota_asal VARCHAR(255) NOT NULL,
          kota_tujuan VARCHAR(255) NOT NULL,
          jenis_barang VARCHAR(255) NOT NULL,
          berat_barang NUMERIC(10, 2) NOT NULL,
          tarif NUMERIC(12, 2) NOT NULL,
          jenis_pengiriman VARCHAR(255) NOT NULL,
          kendaraan_id VARCHAR(255) REFERENCES kendaraan(id) ON DELETE SET NULL,
          status_pengiriman VARCHAR(255) NOT NULL DEFAULT 'Pending',
          catatan TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await trx`
        CREATE TABLE shipments (
          resi VARCHAR(255) PRIMARY KEY,
          tanggal_kirim DATE NOT NULL,
          nama_pengirim VARCHAR(255) NOT NULL,
          nama_penerima VARCHAR(255) NOT NULL,
          no_telepon VARCHAR(20) NOT NULL,
          kota_asal VARCHAR(255) NOT NULL,
          kota_tujuan VARCHAR(255) NOT NULL,
          jenis_barang VARCHAR(255) NOT NULL,
          berat_barang NUMERIC(10, 2) NOT NULL,
          tarif NUMERIC(12, 2) NOT NULL,
          jenis_pengiriman VARCHAR(255) NOT NULL,
          kendaraan_id VARCHAR(255),
          status_pengiriman VARCHAR(255) NOT NULL,
          catatan TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await trx`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL DEFAULT 'Operator',
          status_sesi VARCHAR(255) NOT NULL DEFAULT 'Nonaktif',
          last_login TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await trx`
        CREATE TABLE tracking_logs (
          id SERIAL PRIMARY KEY,
          resi VARCHAR(255) NOT NULL REFERENCES transaksi(resi) ON DELETE CASCADE,
          previous_status VARCHAR(255) NOT NULL,
          new_status VARCHAR(255) NOT NULL,
          operator_name VARCHAR(255) NOT NULL,
          keterangan TEXT NOT NULL,
          occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await trx`
        CREATE OR REPLACE FUNCTION sync_shipments_from_transaksi()
        RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'DELETE' THEN
            DELETE FROM shipments WHERE resi = OLD.resi;
            RETURN OLD;
          END IF;

          INSERT INTO shipments (
            resi,
            tanggal_kirim,
            nama_pengirim,
            nama_penerima,
            no_telepon,
            kota_asal,
            kota_tujuan,
            jenis_barang,
            berat_barang,
            tarif,
            jenis_pengiriman,
            kendaraan_id,
            status_pengiriman,
            catatan,
            created_at,
            updated_at
          )
          VALUES (
            NEW.resi,
            NEW.tanggal_kirim,
            NEW.nama_pengirim,
            NEW.nama_penerima,
            NEW.no_telepon,
            NEW.kota_asal,
            NEW.kota_tujuan,
            NEW.jenis_barang,
            NEW.berat_barang,
            NEW.tarif,
            NEW.jenis_pengiriman,
            NEW.kendaraan_id,
            NEW.status_pengiriman,
            NEW.catatan,
            NEW.created_at,
            NEW.updated_at
          )
          ON CONFLICT (resi) DO UPDATE SET
            tanggal_kirim = EXCLUDED.tanggal_kirim,
            nama_pengirim = EXCLUDED.nama_pengirim,
            nama_penerima = EXCLUDED.nama_penerima,
            no_telepon = EXCLUDED.no_telepon,
            kota_asal = EXCLUDED.kota_asal,
            kota_tujuan = EXCLUDED.kota_tujuan,
            jenis_barang = EXCLUDED.jenis_barang,
            berat_barang = EXCLUDED.berat_barang,
            tarif = EXCLUDED.tarif,
            jenis_pengiriman = EXCLUDED.jenis_pengiriman,
            kendaraan_id = EXCLUDED.kendaraan_id,
            status_pengiriman = EXCLUDED.status_pengiriman,
            catatan = EXCLUDED.catatan,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at;

          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `;

      await trx`
        CREATE TRIGGER transaksi_to_shipments_sync
        AFTER INSERT OR UPDATE OR DELETE ON transaksi
        FOR EACH ROW
        EXECUTE FUNCTION sync_shipments_from_transaksi()
      `;

      await trx`
        INSERT INTO kendaraan (
          id,
          nama_kendaraan,
          jenis_kendaraan,
          kode_kendaraan,
          kapasitas_muatan,
          status_kendaraan
        ) VALUES
          ('K-001', 'Boeing Cargo 737', 'Pesawat Kargo', 'JT-892', 6500, 'Aktif'),
          ('K-002', 'Air Freight 320', 'Pesawat Kargo', 'GA-136', 4200, 'Tersedia'),
          ('K-003', 'Sky Van Express', 'Van Cargo', 'PK-5BT01', 2000, 'Aktif')
      `;

      await trx`
        INSERT INTO transaksi (
          resi,
          tanggal_kirim,
          nama_pengirim,
          nama_penerima,
          no_telepon,
          kota_asal,
          kota_tujuan,
          jenis_barang,
          berat_barang,
          tarif,
          jenis_pengiriman,
          kendaraan_id,
          status_pengiriman,
          catatan
        ) VALUES
          ('AWB-20260526-6180', CURRENT_DATE - INTERVAL '5 days', 'PT Anugrah', 'PT Maju Lancar', '081234567890', 'Balikpapan', 'Jakarta', 'Dokumen Ekspor', 10.5, 1250000, 'Biasa', 'K-001', 'Selesai', 'Dokumen wajib diprioritaskan saat unloading.'),
          ('AWB-20260526-7900', CURRENT_DATE - INTERVAL '4 days', 'PT Solusi Maju', 'PT Nusantara', '081298765432', 'Balikpapan', 'Surabaya', 'Sparepart Mesin', 40.5, 3250000, 'Cepat', 'K-002', 'Dalam Pengiriman', 'Hubungi penerima sebelum barang tiba di gudang tujuan.'),
          ('AWB-20260525-1001', CURRENT_DATE - INTERVAL '3 days', 'PT Solusi Maju', 'PT Nusantara', '081267890123', 'Balikpapan', 'Surabaya', 'Elektronik', 50, 4100000, 'Cepat', 'K-002', 'Selesai', 'Barang elektronik selesai serah terima.'),
          ('AWB-20260525-2002', CURRENT_DATE - INTERVAL '2 days', 'PT Nusantara', 'Hotel Bali Raya', '081355552222', 'Balikpapan', 'Bali', 'Paket Event', 2.5, 780000, 'Biasa', 'K-003', 'Dalam Pengiriman', 'Harap diterima langsung oleh koordinator acara.'),
          ('AWB-20260526-4562', CURRENT_DATE - INTERVAL '1 day', 'PT Sejahtera', 'CV Andalan Medan', '081388881111', 'Balikpapan', 'Medan', 'Sampel Produk', 12.5, 1425000, 'Biasa', 'K-002', 'Diproses', 'Menunggu penjadwalan muat ke armada.')
      `;

      const hashedPassword = await bcrypt.hash('Admin123', 10);

      await trx`
        INSERT INTO users (
          username,
          email,
          password,
          role,
          status_sesi,
          last_login
        ) VALUES
          ('Andika', 'andika123@gmail.com', ${hashedPassword}, 'Supervisor', 'Aktif', CURRENT_TIMESTAMP),
          ('Admin', 'admin@ekspedisipetir.local', ${hashedPassword}, 'Admin', 'Nonaktif', CURRENT_TIMESTAMP - INTERVAL '1 day')
      `;

      await trx`
        INSERT INTO tracking_logs (
          resi,
          previous_status,
          new_status,
          operator_name,
          keterangan,
          occurred_at
        ) VALUES
          ('AWB-20260526-6180', 'Dalam Pengiriman', 'Selesai', 'Andika', 'Konfirmasi barang tiba dan diterima lengkap.', CURRENT_TIMESTAMP - INTERVAL '8 hours'),
          ('AWB-20260526-7900', 'Diproses', 'Dalam Pengiriman', 'Suharto', 'Kargo sudah diberangkatkan sesuai jadwal.', CURRENT_TIMESTAMP - INTERVAL '7 hours'),
          ('AWB-20260525-1001', 'Dalam Pengiriman', 'Selesai', 'Rini', 'Barang elektronik telah diterima tujuan.', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
          ('AWB-20260525-2002', 'Pending', 'Dalam Pengiriman', 'Budi', 'Barang event sudah masuk tahap pengiriman.', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
          ('AWB-20260526-4562', 'Pending', 'Diproses', 'Andika', 'Manifest baru dibuat dan masuk proses sortir.', CURRENT_TIMESTAMP - INTERVAL '4 hours')
      `;
    });

    return Response.json({
      message: 'Database berhasil disinkronkan!',
      users: [
        {
          identifier: 'Andika atau andika123@gmail.com',
          password: 'Admin123',
        },
        {
          identifier: 'Admin atau admin@ekspedisipetir.local',
          password: 'Admin123',
        },
      ],
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Seed database gagal dijalankan.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}