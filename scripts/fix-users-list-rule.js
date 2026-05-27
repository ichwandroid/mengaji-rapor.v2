const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
  try {
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    console.log('Admin authenticated.');

    const collection = await pb.collections.getOne('users');
    console.log('Collection retrieved. Current listRule:', collection.listRule);

    collection.listRule = "@request.auth.id != ''";
    await pb.collections.update('users', collection);
    
    console.log('Successfully updated users listRule to allow all authenticated users.');
  } catch (error) {
    console.error('Error updating schema:', error?.response || error);
  }
}

main();
