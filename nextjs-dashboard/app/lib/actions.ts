'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// FUNGSI UNTUK MELACAK NOMOR AWB DARI DATABASE REAL-TIME
export async function getTrackingData(resi: string) {
  try {
    // Cari data kargo utama gabungan dengan manifest penjadwalan penerbangannya
    const rows = await sql`
      SELECT 
        t.resi as awb,
        t.nama_pengirim as pengirim,
        t.nama_penerima as penerima,
        CONCAT(t.berat, ' kg') as berat,
        t.kota_tujuan as tujuan,
        COALEDCE(m.penerbangan_id, '-') as penerbangan,
        t.status_pengiriman as status,
        t.tanggal_kirim
      FROM transaksi t
      LEFT JOIN manifest m ON t.resi = m.transaksi_resi
      WHERE t.resi = ${resi.trim()}
    `;

    if (rows.length === 0) return null;

    const cargo = rows[0];

    // Generate riwayat step otomatis berdasarkan status dinamis database
    const stepLabels = ['Received', 'Sortation', 'Loaded to Aircraft', 'Departed', 'Arrived'];
    const currentStatus = cargo.status; // Mengambil data string status dari kolom database
    const statusIndex = stepLabels.indexOf(currentStatus);

    // Pembuatan array checkpoint linimasa manifest kargo
    const steps = stepLabels.map((label, index) => {
      let time = '-';
      let desc = '';

      if (label === 'Received') {
        time = new Date(cargo.tanggal_kirim).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        desc = 'Barang diterima di gudang Bandara Sudirman';
      } else if (label === 'Sortation') {
        desc = 'Barang selesai melalui proses sortasi wilayah';
      } else if (label === 'Loaded to Aircraft') {
        desc = `Barang dimuat ke armada penerbangan ${cargo.penerbangan}`;
      } else if (label === 'Departed') {
        desc = 'Pesawat lepas landas meninggalkan bandara asal';
      } else if (label === 'Arrived') {
        desc = `Barang sukses mendarat di bandara tujuan ${cargo.tujuan}`;
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