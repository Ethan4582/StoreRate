const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  const res = await client.query('SELECT id, name FROM stores');
  const stores = res.rows;
  
  let count = 0;
  for (const store of stores) {
    let slug = generateSlug(store.name);
    if (!slug) slug = `store-${store.id}`;
    
    let isUnique = false;
    let counter = 1;
    let finalSlug = slug;
    
    while (!isUnique) {
      const existing = await client.query('SELECT id FROM stores WHERE slug = $1 AND id != $2', [finalSlug, store.id]);
      if (existing.rows.length > 0) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      } else {
        isUnique = true;
      }
    }
    
    await client.query('UPDATE stores SET slug = $1 WHERE id = $2', [finalSlug, store.id]);
    console.log(`Updated store ${store.id} with slug: ${finalSlug}`);
    count++;
  }
  
  console.log(`Finished backfilling slugs for ${count} stores.`);
  await client.end();
}

main().catch(console.error);
