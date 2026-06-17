
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
export const manifest = [
  { awb: '001-2847391', pengirim: 'PT Solusi Maju',  tujuan: 'SUB', koli: 3, berat: '50 kg',   penerbangan: 'GA – 136',  status: 'Received',  waktuUpdate: '05.12' },
  { awb: '001-2847392', pengirim: 'PT Nusantara',    tujuan: 'DPS', koli: 1, berat: '7.5 kg',  penerbangan: 'IU – 602',  status: 'Sortation', waktuUpdate: '05.41' },
  { awb: '001-2847393', pengirim: 'PT Cahaya Baru',  tujuan: 'MDN', koli: 8, berat: '33 kg',   penerbangan: 'JT – 892',  status: 'Loaded',    waktuUpdate: '06.05' },
  { awb: '001-2847394', pengirim: 'CV Berkah Jaya',  tujuan: 'UPG', koli: 1, berat: '45 kg',   penerbangan: 'ID – 7531', status: 'Received',  waktuUpdate: '06.03' },
  { awb: '001-2847395', pengirim: 'UD Makmur',       tujuan: 'BPN', koli: 4, berat: '12.5 kg', penerbangan: 'SJ – 200',  status: 'Departed',  waktuUpdate: '07.22' },
  { awb: '001-2847396', pengirim: 'PT Permata',      tujuan: 'PLM', koli: 2, berat: '41 kg',   penerbangan: 'GA – 803',  status: 'Sortation', waktuUpdate: '06.47' },
  { awb: '001-2847397', pengirim: 'CV Mitra Abadi',  tujuan: 'JOG', koli: 1, berat: '120 kg',  penerbangan: 'QG – 778',  status: 'Received',  waktuUpdate: '06.50' },
  { awb: '001-2847398', pengirim: 'PT Angkasa',      tujuan: 'BDJ', koli: 6, berat: '88 kg',   penerbangan: 'GA – 910',  status: 'Loaded',    waktuUpdate: '07.10' },
  { awb: '001-2847399', pengirim: 'UD Prima',        tujuan: 'TIM', koli: 2, berat: '27 kg',   penerbangan: 'ID – 820',  status: 'Received',  waktuUpdate: '07.18' },
  { awb: '001-2847400', pengirim: 'PT Sinar Jaya',   tujuan: 'BTH', koli: 3, berat: '41 kg',   penerbangan: 'SJ – 440',  status: 'Arrived',   waktuUpdate: '07.55' },
]
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