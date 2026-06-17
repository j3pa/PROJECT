import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getCargoDataForUser(userEmail: string) {
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
    JOIN bandara ON cargo.tujuan_id = bandara.id
    WHERE customers.email = ${userEmail};
  `;

  return data;
}

export async function GET() {
  try {
    const currentUserEmail = 'budi.santoso@gmail.com';

    const data = await getCargoDataForUser(currentUserEmail);
    const prettyJson = JSON.stringify(data, null, 2);

    return new Response(prettyJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Query Error:', error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}