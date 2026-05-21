import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getCargoData() {
  // Query baru untuk mencocokkan data Cargo, Customer (berdasarkan Email), dan Bandara Tujuan
  const data = await sql`
    SELECT 
      cargo.awb,
      customers.name AS nama_customer,
      bandara.nama AS bandara_tujuan,
      bandara.kota AS kota_tujuan,
      cargo.berat,
      cargo.status
    FROM cargo
    JOIN customers ON cargo.customer_email = customers.email
    JOIN bandara ON cargo.tujuan_id = bandara.id;
  `;

  return data;
}

export async function GET() {
  try {
    const data = await getCargoData();
    
    // Mengubah JSON menjadi string yang rapi dengan lekukan 2 spasi
    const prettyJson = JSON.stringify(data, null, 2);
    
    // Mengembalikan response berupa teks biasa (atau JSON) yang sudah rapi
    return new Response(prettyJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Query Error:', error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}