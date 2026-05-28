'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// MEMBUAT TRANSAKSI BARU
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
      
      // 1. Masukkan data murni kargo ke tabel transaksi (Dihapus RETURNING id karena kolom id tidak ada)
      await sql`
        INSERT INTO transaksi (
          resi, tanggal_kirim, nama_pengirim, nama_penerima, no_telepon, 
          kota_asal, kota_tujuan, jenis_barang, berat, tarif, 
          jenis_pengiriman, status_pengiriman, catatan
        ) VALUES (
          ${resi}, ${tanggal_kirim}, ${nama_pengirim}, ${nama_penerima}, ${no_telepon}, 
          ${kota_asal}, ${kota_tujuan}, ${jenis_barang}, ${berat}, ${tarif}, 
          ${jenis_pengiriman}, ${status_pengiriman}, ${catatan}
        )
      `;

      // 2. Jika form memilih jadwal penerbangan, ikat hubungan mereka di tabel jembatan 'manifest'
      // Hanya menyertakan kolom transaksi_resi (kolom transaksi_id dihapus agar tidak error)
      if (penerbangan_id) {
        await sql`
          INSERT INTO manifest (
            transaksi_resi, 
            penerbangan_id, 
            status_manifest
          ) VALUES (
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

// MENGHAPUS DATA 
// MENGHAPUS DATA TRANSAKSI KARGO SECARA AMAN & BERURUTAN
// MENGHAPUS DATA TRANSAKSI KARGO DENGAN TRANSPARENT ERROR LOGGING
export async function deleteTransaction(resi: string) {
  try {
    console.log(`[DEBUG] Mencoba menghapus kargo dengan resi: ${resi}`);

    // 1. Hapus terlebih dahulu dari tabel manifest berdasarkan transaksi_resi
    await sql`
      DELETE FROM manifest WHERE transaksi_resi = ${resi}
    `;

    // 2. Hapus dari tabel transaksi utama
    const result = await sql`
      DELETE FROM transaksi WHERE resi = ${resi}
    `;
    
    console.log(`[DEBUG] Berhasil dihapus. Jumlah baris terpengaruh: ${result.count}`);

    // Amankan pembaruan cache Next.js
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/manifest');
    
    return { success: true };
  } catch (error: any) {
    // MENAMPILKAN ERROR ASLI DI TERMINAL
    console.error('=== ERROR ASLI DARI DATABASE NEON ===');
    console.error(error);
    console.error('======================================');
    
    // MELEMPAR ERROR ASLI KE BROWSER AGAR TIDAK MUNCUL "Gagal menghapus data kargo" SAJA
    throw new Error(`Detail Error: ${error.message || error}`);
  }
}