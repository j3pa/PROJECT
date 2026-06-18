const postgres = require('postgres');
(async () => {
  try {
    const sql = postgres('postgresql://neondb_owner:npg_tCxgB7fTML8e@ep-curly-night-a4l7ipa2-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require', { ssl: 'require' });
    const tables = await sql`SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
    console.log('TABLES', tables);
    const shipments = await sql`SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shipments'`;
    console.log('SHIPMENTS', shipments);
    await sql.end();
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
