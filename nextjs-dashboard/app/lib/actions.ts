'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createTransaksi(formData: FormData) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const resi = `AWB-${dateStr}-${randomNum}`;

  // ambil data
  const tanggal_kirim = formData.get('tanggal_kirim') as string;
  const nama_pengirim = formData.get('nama_pengirim') as string;
  const nama_penerima = formData.get('nama_penerima') as string;
  const no_telepon = formData.get('no_telepon') as string;
  const kota_asal = formData.get('kota_asal') as string;
  const kota_tujuan = formData.get('kota_tujuan') as string;
  const jenis_barang = formData.get('jenis_barang') as string;
  const berat_barang = Number(formData.get('berat_barang'));
  const tarif = Number(formData.get('tarif'));
  const jenis_pengiriman = formData.get('jenis_pengiriman') as string;
  const kendaraan_id = formData.get('kendaraan_id') as string;
  const status_pengiriman = formData.get('status_pengiriman') as string;
  const catatan = formData.get('catatan') as string;

  // 3. masuk ke database
  try {
    await sql`
      INSERT INTO transaksi (
        resi, tanggal_kirim, nama_pengirim, nama_penerima, no_telepon, 
        kota_asal, kota_tujuan, jenis_barang, berat_barang, tarif, 
        jenis_pengiriman, kendaraan_id, status_pengiriman, catatan
      ) VALUES (
        ${resi}, ${tanggal_kirim}, ${nama_pengirim}, ${nama_penerima}, ${no_telepon}, 
        ${kota_asal}, ${kota_tujuan}, ${jenis_barang}, ${berat_barang}, ${tarif}, 
        ${jenis_pengiriman}, ${kendaraan_id}, ${status_pengiriman}, ${catatan}
      )
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menambah data transaksi kargo.');
  }

  // bersihkan cache
  revalidatePath('/dashboard/manifest');
  redirect('/dashboard/manifest');
}