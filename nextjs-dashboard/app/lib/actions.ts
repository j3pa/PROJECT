'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getServerSession } from '@/app/lib/auth';
import { INDONESIA_TIME_ZONE } from '@/app/lib/time';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const statusOptions = ['Pending', 'Diproses', 'Dalam Pengiriman', 'Sampai Tujuan', 'Selesai'] as const;
const jenisPengirimanOptions = ['Biasa', 'Cepat', 'Vvip'] as const;

export type ActionState = {
  error?: string;
};

const transaksiSchema = z.object({
  tanggal_kirim: z.string().min(1, 'Tanggal kirim wajib diisi.'),
  nama_pengirim: z.string().trim().min(2, 'Nama pengirim wajib diisi.'),
  nama_penerima: z.string().trim().min(2, 'Nama penerima wajib diisi.'),
  no_telepon: z.string().trim().length(12, 'Nomor telepon wajib tepat 12 angka.').regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka.'),
  kota_asal: z.string().trim().min(2, 'Kota asal wajib diisi.'),
  kota_tujuan: z.string().trim().min(2, 'Kota tujuan wajib diisi.'),
  jenis_barang: z.string().trim().min(2, 'Jenis barang wajib diisi.'),
  kendaraan_id: z.string().trim().min(1, 'Kendaraan wajib dipilih.'),
  berat_barang: z.coerce.number().positive('Berat barang harus lebih dari 0.'),
  tarif: z.coerce.number().nonnegative('Tarif pengiriman harus angka valid.'),
  jenis_pengiriman: z.enum(jenisPengirimanOptions),
  status_pengiriman: z.enum(statusOptions),
  catatan: z.string().trim().min(5, 'Deskripsi barang wajib diisi minimal 5 karakter.').max(500, 'Catatan maksimal 500 karakter.'),
});

const kendaraanSchema = z.object({
  nama_kendaraan: z.string().trim().min(2, 'Nama kendaraan wajib diisi.'),
  jenis_kendaraan: z.string().trim().min(2, 'Jenis kendaraan wajib diisi.'),
  kode_kendaraan: z.string().trim().min(3, 'Kode kendaraan wajib diisi.'),
  kapasitas_muatan: z.coerce.number().positive('Kapasitas muatan harus lebih dari 0.'),
  status_kendaraan: z.enum(['Aktif', 'Tersedia', 'Maintenance', 'Tidak Tersedia']),
});

function getValidationMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(' ');
}

async function getOperatorName() {
  const session = await getServerSession();
  return session?.username || 'Andika';
}

async function insertTrackingLog(
  sqlClient: typeof sql,
  {
    resi,
    previousStatus,
    newStatus,
    operatorName,
    keterangan,
  }: {
    resi: string;
    previousStatus: string;
    newStatus: string;
    operatorName: string;
    keterangan: string;
  },
) {
  await sqlClient`
    INSERT INTO tracking_logs (
      resi,
      previous_status,
      new_status,
      operator_name,
      keterangan,
      occurred_at,
      created_at,
      updated_at
    ) VALUES (
      ${resi},
      ${previousStatus},
      ${newStatus},
      ${operatorName},
      ${keterangan},
      NOW(),
      NOW(),
      NOW()
    )
  `;
}

async function generateKendaraanId() {
  const lastKendaraan = await sql`
    SELECT id
    FROM kendaraan
    ORDER BY id DESC
    LIMIT 1
  `;

  const currentNumber = Number(String(lastKendaraan[0]?.id || 'K-000').split('-')[1] || '0');
  return `K-${String(currentNumber + 1).padStart(3, '0')}`;
}

async function findDuplicateKendaraan(namaKendaraan: string, kodeKendaraan: string, currentId?: string) {
  const rows = currentId
    ? await sql`
        SELECT nama_kendaraan, kode_kendaraan
        FROM kendaraan
        WHERE id <> ${currentId}
          AND (
            LOWER(TRIM(nama_kendaraan)) = LOWER(TRIM(${namaKendaraan}))
            OR LOWER(TRIM(kode_kendaraan)) = LOWER(TRIM(${kodeKendaraan}))
          )
        LIMIT 1
      `
    : await sql`
        SELECT nama_kendaraan, kode_kendaraan
        FROM kendaraan
        WHERE LOWER(TRIM(nama_kendaraan)) = LOWER(TRIM(${namaKendaraan}))
          OR LOWER(TRIM(kode_kendaraan)) = LOWER(TRIM(${kodeKendaraan}))
        LIMIT 1
      `;

  return rows[0];
}

async function findDuplicateTransaksi(jenisBarang: string, resi: string) {
  const rows = await sql`
    SELECT resi, jenis_barang
    FROM transaksi
    WHERE LOWER(TRIM(jenis_barang)) = LOWER(TRIM(${jenisBarang}))
      OR resi = ${resi}
    LIMIT 1
  `;

  return rows[0];
}
export async function getTrackingData(resi: string) {
  try {
    const rows = await sql`
      SELECT
        t.resi as awb,
        t.nama_pengirim as pengirim,
        t.nama_penerima as penerima,
        CONCAT(t.berat_barang, ' kg') as berat,
        t.kota_tujuan as tujuan,
        COALESCE(k.kode_kendaraan, '-') as penerbangan,
        t.status_pengiriman as status,
        t.tanggal_kirim
      FROM transaksi t
      LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
      WHERE t.resi = ${resi.trim()}
    `;

    if (rows.length === 0) return null;

    const cargo = rows[0];
    const stepLabels = ['Pending', 'Diproses', 'Dalam Pengiriman', 'Sampai Tujuan', 'Selesai'];
    const currentStatus = cargo.status;
    const statusIndex = stepLabels.indexOf(currentStatus);
    const steps = stepLabels.map((label, index) => {
      let time = '-';
      let desc = '';

      if (label === 'Pending') {
        time = new Date(cargo.tanggal_kirim).toLocaleDateString('id-ID', { timeZone: INDONESIA_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric' });
        desc = 'Barang diterima di gudang Bandara Sudirman';
      } else if (label === 'Diproses') {
        desc = 'Barang selesai melalui proses sortasi wilayah';
      } else if (label === 'Dalam Pengiriman') {
        desc = `Barang dimuat ke armada penerbangan ${cargo.penerbangan}`;
      } else if (label === 'Sampai Tujuan') {
        desc = `Barang telah tiba di kota tujuan ${cargo.tujuan}`;
      } else if (label === 'Selesai') {
        desc = `Barang selesai diterima oleh penerima di ${cargo.tujuan}`;
      }

      return {
        label,
        time,
        desc,
        done: index <= statusIndex,
        current: index === statusIndex
      };
    });

    return {
      awb: cargo.awb,
      pengirim: cargo.pengirim,
      penerima: cargo.penerima,
      berat: cargo.berat,
      tujuan: cargo.tujuan,
      penerbangan: cargo.penerbangan,
      status: cargo.status,
      steps: steps
    };
  } catch (error) {
    console.error('Gagal mengambil data tracking:', error);
    return null;
  }
}
export async function createTransaksi(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const resi = `AWB-${dateStr}-${randomNum}`;

  const parsed = transaksiSchema.safeParse({
    tanggal_kirim: formData.get('tanggal_kirim'),
    nama_pengirim: formData.get('nama_pengirim'),
    nama_penerima: formData.get('nama_penerima'),
    no_telepon: formData.get('no_telepon'),
    kota_asal: formData.get('kota_asal'),
    kota_tujuan: formData.get('kota_tujuan'),
    jenis_barang: formData.get('jenis_barang'),
    kendaraan_id: formData.get('kendaraan_id'),
    berat_barang: formData.get('berat_barang') || formData.get('berat'),
    tarif: formData.get('tarif'),
    jenis_pengiriman: formData.get('jenis_pengiriman'),
    status_pengiriman: formData.get('status_pengiriman'),
    catatan: formData.get('catatan') || '',
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const {
    tanggal_kirim,
    nama_pengirim,
    nama_penerima,
    no_telepon,
    kota_asal,
    kota_tujuan,
    jenis_barang,
    kendaraan_id,
    berat_barang,
    tarif,
    jenis_pengiriman,
    status_pengiriman,
    catatan,
  } = parsed.data;
  const operatorName = await getOperatorName();

  try {
    const duplicateTransaksi = await findDuplicateTransaksi(jenis_barang, resi);

    if (duplicateTransaksi) {
      return { error: 'Data kargo dengan nama barang atau kode AWB yang sama sudah ada.' };
    }

    await sql.begin(async (trx) => {
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
          catatan,
          created_at,
          updated_at
        ) VALUES (
          ${resi},
          ${tanggal_kirim},
          ${nama_pengirim},
          ${nama_penerima},
          ${no_telepon},
          ${kota_asal},
          ${kota_tujuan},
          ${jenis_barang},
          ${berat_barang},
          ${tarif},
          ${jenis_pengiriman},
          ${kendaraan_id},
          ${status_pengiriman},
          ${catatan},
          NOW(),
          NOW()
        )
      `;

      await insertTrackingLog(trx, {
        resi,
        previousStatus: '---',
        newStatus: status_pengiriman,
        operatorName,
        keterangan: `Data cargo baru dibuat untuk tujuan ${kota_tujuan}.`,
      });
    });
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal menambah data transaksi kargo ke database Neon.' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/manifest');
  revalidatePath('/dashboard/tracking');
  revalidatePath('/dashboard/logs');
  redirect('/dashboard/manifest');
}

export async function updateTransaksi(resi: string, formData: FormData) {
  const parsed = z.object({
    kendaraan_id: z.string().trim().min(1, 'Kendaraan wajib dipilih.'),
    status_pengiriman: z.enum(statusOptions),
    tarif: z.coerce.number().nonnegative('Tarif pengiriman harus angka valid.'),
  }).safeParse({
    kendaraan_id: formData.get('kendaraan_id'),
    status_pengiriman: formData.get('status_pengiriman'),
    tarif: formData.get('tarif'),
  });

  if (!parsed.success) {
    throw new Error(getValidationMessage(parsed.error));
  }

  const { kendaraan_id, status_pengiriman, tarif } = parsed.data;
  const operatorName = await getOperatorName();

  try {
    await sql.begin(async (trx) => {
      const previousRows = await trx`
        SELECT t.status_pengiriman, t.kota_tujuan, k.kode_kendaraan
        FROM transaksi t
        LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
        WHERE t.resi = ${resi}
        LIMIT 1
      `;

      const previous = previousRows[0];
      if (!previous) {
        throw new Error('Data transaksi tidak ditemukan.');
      }

      await trx`
        UPDATE transaksi
        SET
          kendaraan_id = ${kendaraan_id},
          status_pengiriman = ${status_pengiriman},
          tarif = ${tarif},
          updated_at = NOW()
        WHERE resi = ${resi}
      `;

      await insertTrackingLog(trx, {
        resi,
        previousStatus: previous.status_pengiriman,
        newStatus: status_pengiriman,
        operatorName,
        keterangan: `Status cargo diperbarui menuju ${status_pengiriman} untuk tujuan ${previous.kota_tujuan}.`,
      });
    });
  } catch (error) {
    console.error('Update Error:', error);
    throw new Error('Gagal memperbarui data transaksi cargo.');
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/manifest');
  revalidatePath('/dashboard/tracking');
  revalidatePath('/dashboard/logs');
  redirect('/dashboard/manifest');
}

export async function deleteTransaction(resi: string) {
  try {
    console.log(`[DEBUG] Mencoba menghapus kargo dengan resi: ${resi}`);
    const result = await sql`
      DELETE FROM transaksi WHERE resi = ${resi}
    `;

    console.log(`[DEBUG] Berhasil dihapus. Jumlah baris terpengaruh: ${result.count}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/manifest');
    revalidatePath('/dashboard/tracking');
    revalidatePath('/dashboard/logs');

    return { success: true };
  } catch (error: any) {
    console.error('=== ERROR ASLI DARI DATABASE NEON ===');
    console.error(error);
    console.error('======================================');
    throw new Error(`Detail Error: ${error.message || error}`);
  }
}

export async function createKendaraan(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = kendaraanSchema.safeParse({
    nama_kendaraan: formData.get('nama_kendaraan'),
    jenis_kendaraan: formData.get('jenis_kendaraan'),
    kode_kendaraan: formData.get('kode_kendaraan'),
    kapasitas_muatan: formData.get('kapasitas_muatan'),
    status_kendaraan: formData.get('status_kendaraan'),
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const kendaraanId = await generateKendaraanId();
  const { nama_kendaraan, jenis_kendaraan, kode_kendaraan, kapasitas_muatan, status_kendaraan } = parsed.data;

  try {
    const duplicateKendaraan = await findDuplicateKendaraan(nama_kendaraan, kode_kendaraan);

    if (duplicateKendaraan) {
      return { error: 'Data kendaraan dengan nama atau kode yang sama sudah ada.' };
    }

    await sql`
      INSERT INTO kendaraan (
        id,
        nama_kendaraan,
        jenis_kendaraan,
        kode_kendaraan,
        kapasitas_muatan,
        status_kendaraan,
        created_at,
        updated_at
      ) VALUES (
        ${kendaraanId},
        ${nama_kendaraan},
        ${jenis_kendaraan},
        ${kode_kendaraan},
        ${kapasitas_muatan},
        ${status_kendaraan},
        NOW(),
        NOW()
      )
    `;
  } catch (error) {
    console.error('Create Kendaraan Error:', error);
    return { error: 'Gagal menambah data kendaraan ke database.' };
  }

  revalidatePath('/dashboard/kendaraan');
  revalidatePath('/dashboard/manifest/create');
  redirect('/dashboard/kendaraan');
}

export async function updateKendaraan(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = kendaraanSchema.safeParse({
    nama_kendaraan: formData.get('nama_kendaraan'),
    jenis_kendaraan: formData.get('jenis_kendaraan'),
    kode_kendaraan: formData.get('kode_kendaraan'),
    kapasitas_muatan: formData.get('kapasitas_muatan'),
    status_kendaraan: formData.get('status_kendaraan'),
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const { nama_kendaraan, jenis_kendaraan, kode_kendaraan, kapasitas_muatan, status_kendaraan } = parsed.data;

  try {
    const duplicateKendaraan = await findDuplicateKendaraan(nama_kendaraan, kode_kendaraan, id);

    if (duplicateKendaraan) {
      return { error: 'Data kendaraan dengan nama atau kode yang sama sudah ada.' };
    }

    await sql`
      UPDATE kendaraan
      SET
        nama_kendaraan = ${nama_kendaraan},
        jenis_kendaraan = ${jenis_kendaraan},
        kode_kendaraan = ${kode_kendaraan},
        kapasitas_muatan = ${kapasitas_muatan},
        status_kendaraan = ${status_kendaraan},
        updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Update Kendaraan Error:', error);
    return { error: 'Gagal memperbarui data kendaraan.' };
  }

  revalidatePath('/dashboard/kendaraan');
  revalidatePath('/dashboard/manifest/create');
  revalidatePath('/dashboard/manifest');
  redirect('/dashboard/kendaraan');
}

export async function deleteKendaraan(id: string) {
  try {
    await sql`
      DELETE FROM kendaraan
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Delete Kendaraan Error:', error);
    throw new Error('Gagal menghapus kendaraan dari database.');
  }

  revalidatePath('/dashboard/kendaraan');
  revalidatePath('/dashboard/manifest/create');
}
