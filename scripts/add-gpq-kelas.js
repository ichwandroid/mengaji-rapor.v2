const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
  try {
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    console.log('Admin authenticated.');

    const collection = await pb.collections.getOne('users');
    console.log('Collection retrieved.');

    const hasField = collection.fields.some(f => f.name === 'gpq_kelas');
    
    if (!hasField) {
      collection.fields.push({
        name: 'gpq_kelas',
        type: 'json',
        required: false,
        options: {
            maxSize: 2000000
        }
      });
      await pb.collections.update('users', { fields: collection.fields });
      console.log('Successfully added gpq_kelas field to users collection.');
    } else {
      console.log('gpq_kelas field already exists.');
    }
  } catch (error) {
    console.error('Error updating schema:', error?.response || error);
  }
}

main();
