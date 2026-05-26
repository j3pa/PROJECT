'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// membuat transaksi baru
export async function createTransaksi(formData: FormData) {
  // Generate otomatis Nomor AWB / Resi
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const resi = `AWB-${dateStr}-${randomNum}`;

  // Ambil data esensial dari form input
  const tanggal_kirim = formData.get('tanggal_kirim') as string;
  const nama_pengirim = formData.get('nama_pengirim') as string;
  const nama_penerima = formData.get('nama_penerima') as string;
  const no_telepon = formData.get('no_telepon') as string;
  const kota_asal = formData.get('kota_asal') as string;
  const kota_tujuan = formData.get('kota_tujuan') as string;
  const jenis_barang = formData.get('jenis_barang') as string;
  
  // Sesuai kecocokan nama field database Neon (menggunakan 'berat' atau 'tarif' angka)
  const berat = Number(formData.get('berat_barang') || formData.get('berat'));
  const tarif = Number(formData.get('tarif'));
  
  const jenis_pengiriman = formData.get('jenis_pengiriman') as string;
  const status_pengiriman = formData.get('status_pengiriman') as string;
  const catatan = formData.get('catatan') as string;

  // Id jadwal penerbangan pilihan dari form
  const penerbangan_id = formData.get('penerbangan_id') as string;

  try {
    // Jalankan transaksi database (Transaction Block) agar kedua insert wajib sukses bersamaan
    await sql.begin(async (sql) => {
      
      // 1. Masukkan data murni kargo ke tabel transaksi (Tanpa kendaraan_id karena tidak ada di tabel ini)
      const [newTx] = await sql`
        INSERT INTO transaksi (
          resi, tanggal_kirim, nama_pengirim, nama_penerima, no_telepon, 
          kota_asal, kota_tujuan, jenis_barang, berat, tarif, 
          jenis_pengiriman, status_pengiriman, catatan
        ) VALUES (
          ${resi}, ${tanggal_kirim}, ${nama_pengirim}, ${nama_penerima}, ${no_telepon}, 
          ${kota_asal}, ${kota_tujuan}, ${jenis_barang}, ${berat}, ${tarif}, 
          ${jenis_pengiriman}, ${status_pengiriman}, ${catatan}
        )
        RETURNING id
      `;

      // 2. Jika form memilih jadwal penerbangan, ikat hubungan mereka di tabel jembatan 'manifest'
      if (penerbangan_id) {
        await sql`
          INSERT INTO manifest (
            transaksi_id, 
            transaksi_resi, 
            penerbangan_id, 
            status_manifest
          ) VALUES (
            ${newTx.id}, 
            ${resi}, 
            ${penerbangan_id}, 
            ${status_pengiriman}
          )
        `;
      }
    });

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menambah data transaksi kargo ke database Neon.');
  }

  // Bersihkan cache agar data baru langsung muncul di tabel dashboard operator
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/manifest');
  
  // Alihkan halaman kembali ke list manifest
  redirect('/dashboard/manifest');
}

// menghapus data
export async function deleteTransaction(resi: string) {
  try {
    // Menggunakan Safe-Cascade manual agar tidak bentrok dengan Foreign Key Constraint database
    await sql.begin(async (sql) => {
      // 1. Singkirkan relasi penjadwalan penerbangan di tabel manifest terlebih dahulu
      await sql`
        DELETE FROM manifest WHERE transaksi_resi = ${resi}
      `;

      // 2. Hapus baris data utamanya di tabel transaksi
      await sql`
        DELETE FROM transaksi WHERE resi = ${resi}
      `;
    });

    // Perbarui cache tampilan client-side Next.js secara live
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/manifest');
    
    return { success: true };
  } catch (error) {
    console.error('Gagal menghapus kargo:', error);
    throw new Error('Gagal mengeksekusi penghapusan data dari database.');
  }
}