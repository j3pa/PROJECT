const postgres = require('postgres');
(async () => {
  const sql = postgres('postgresql://neondb_owner:npg_tCxgB7fTML8e@ep-curly-night-a4l7ipa2-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require', { ssl: 'require' });
  try {
    const current = await sql`SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shipments'`;
    console.log('BEFORE', current);
    await sql`DROP VIEW IF EXISTS shipments CASCADE`;
    await sql`DROP TABLE IF EXISTS shipments CASCADE`;
    const after = await sql`SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shipments'`;
    console.log('AFTER', after);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await sql.end();
  }
})();
