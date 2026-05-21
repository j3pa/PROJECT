// lib/placeholder-data.ts

export const bandara = [
  { id: 'B01', kode: 'CGK', nama: 'Soekarno-Hatta', kota: 'Jakarta' },
  { id: 'B02', kode: 'SUB', nama: 'Juanda', kota: 'Surabaya' },
  { id: 'B03', kode: 'DPS', nama: 'Ngurah Rai', kota: 'Bali' },
  { id: 'B04', kode: 'KNO', nama: 'Kualanamu', kota: 'Medan' },
  { id: 'B05', kode: 'UPG', nama: 'Sultan Hasanuddin', kota: 'Makassar' },
  { id: 'B06', kode: 'YIA', nama: 'Yogyakarta Intl', kota: 'Yogyakarta' },
  { id: 'B07', kode: 'BPN', nama: 'Sepinggan', kota: 'Balikpapan' },
  { id: 'B08', kode: 'SRG', nama: 'Ahmad Yani', kota: 'Semarang' },
  { id: 'B09', kode: 'PLM', nama: 'Sultan Mahmud Badaruddin II', kota: 'Palembang' },
  { id: 'B10', kode: 'LOP', nama: 'Zainuddin Abdul Madjid', kota: 'Lombok' },
];

export const penerbangan = [
  { id: 'F01', nomor: 'GA-136', asal_id: 'B01', tujuan_id: 'B02', waktu: '08:00' },
  { id: 'F02', nomor: 'IU-602', asal_id: 'B01', tujuan_id: 'B03', waktu: '09:30' },
  { id: 'F03', nomor: 'JT-892', asal_id: 'B02', tujuan_id: 'B04', waktu: '10:15' },
  { id: 'F04', nomor: 'ID-753', asal_id: 'B01', tujuan_id: 'B05', waktu: '11:00' },
  { id: 'F05', nomor: 'SJ-200', asal_id: 'B02', tujuan_id: 'B07', waktu: '12:45' },
  { id: 'F06', nomor: 'QG-778', asal_id: 'B01', tujuan_id: 'B06', waktu: '14:20' },
  { id: 'F07', nomor: 'GA-803', asal_id: 'B01', tujuan_id: 'B09', waktu: '15:10' },
  { id: 'F08', nomor: 'JT-111', asal_id: 'B03', tujuan_id: 'B01', waktu: '16:00' },
  { id: 'F09', nomor: 'ID-222', asal_id: 'B06', tujuan_id: 'B01', waktu: '17:30' },
  { id: 'F10', nomor: 'QG-333', asal_id: 'B07', tujuan_id: 'B02', waktu: '18:45' },
];

export const cargo = [
  { awb: 'AWB-001', customer_email: 'budi@gmail.com', tujuan_id: 'B02', berat: 50, status: 'Received' },
  { awb: 'AWB-002', customer_email: 'siti@gmail.com', tujuan_id: 'B03', berat: 12, status: 'Loaded' },
  { awb: 'AWB-003', customer_email: 'andi@gmail.com', tujuan_id: 'B04', berat: 33, status: 'Sortation' },
  { awb: 'AWB-004', customer_email: 'joko@gmail.com', tujuan_id: 'B05', berat: 45, status: 'Received' },
  { awb: 'AWB-005', customer_email: 'rini@gmail.com', tujuan_id: 'B07', berat: 8, status: 'Loaded' },
  { awb: 'AWB-006', customer_email: 'doni@gmail.com', tujuan_id: 'B06', berat: 21, status: 'Departed' },
  { awb: 'AWB-007', customer_email: 'eka@gmail.com', tujuan_id: 'B09', berat: 15, status: 'Sortation' },
  { awb: 'AWB-008', customer_email: 'fajar@gmail.com', tujuan_id: 'B01', berat: 60, status: 'Arrived' },
  { awb: 'AWB-009', customer_email: 'gina@gmail.com', tujuan_id: 'B01', berat: 7, status: 'Received' },
  { awb: 'AWB-010', customer_email: 'hendra@gmail.com', tujuan_id: 'B02', berat: 19, status: 'Loaded' },
];

// Tabel Junction (Many-to-Many antara Penerbangan dan Cargo)
export const manifest = [
  { id: 'M01', penerbangan_id: 'F01', awb: 'AWB-001', catatan: 'Aman' },
  { id: 'M02', penerbangan_id: 'F02', awb: 'AWB-002', catatan: 'Fragile' },
  { id: 'M03', penerbangan_id: 'F03', awb: 'AWB-003', catatan: 'Aman' },
  { id: 'M04', penerbangan_id: 'F04', awb: 'AWB-004', catatan: 'Aman' },
  { id: 'M05', penerbangan_id: 'F05', awb: 'AWB-005', catatan: 'Aman' },
  { id: 'M06', penerbangan_id: 'F06', awb: 'AWB-006', catatan: 'Aman' },
  { id: 'M07', penerbangan_id: 'F07', awb: 'AWB-007', catatan: 'Aman' },
  { id: 'M08', penerbangan_id: 'F08', awb: 'AWB-008', catatan: 'Heavy' },
  { id: 'M09', penerbangan_id: 'F09', awb: 'AWB-009', catatan: 'Aman' },
  { id: 'M10', penerbangan_id: 'F10', awb: 'AWB-010', catatan: 'Aman' },
];

// Tambahkan / Ganti bagian customers di app/lib/placeholder-data.ts
export const customers = [
  { id: 'C01', name: 'Budi Santoso', email: 'budi@gmail.com', image_url: '/customers/budi.png' },
  { id: 'C02', name: 'Siti Aminah', email: 'siti@gmail.com', image_url: '/customers/siti.png' },
  { id: 'C03', name: 'Andi Wijaya', email: 'andi@gmail.com', image_url: '/customers/andi.png' },
  { id: 'C04', name: 'Joko Susilo', email: 'joko@gmail.com', image_url: '/customers/joko.png' },
  { id: 'C05', name: 'Rini Astuti', email: 'rini@gmail.com', image_url: '/customers/rini.png' },
  { id: 'C06', name: 'Doni Setiawan', email: 'doni@gmail.com', image_url: '/customers/doni.png' },
  { id: 'C07', name: 'Eka Putri', email: 'eka@gmail.com', image_url: '/customers/eka.png' },
  { id: 'C08', name: 'Fajar Ramadhan', email: 'fajar@gmail.com', image_url: '/customers/fajar.png' },
  { id: 'C09', name: 'Gina Lestari', email: 'gina@gmail.com', image_url: '/customers/gina.png' },
  { id: 'C10', name: 'Hendra Kurniawan', email: 'hendra@gmail.com', image_url: '/customers/hendra.png' },
];
// Pastikan array customers sudah Anda isi minimal 10 data yang email-nya cocok dengan data cargo di atas.