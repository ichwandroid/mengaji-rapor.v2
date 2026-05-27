const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateSchema() {
  try {
    console.log("Authenticating as Admin...");
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    
    console.log("Fetching users collection...");
    const usersCollection = await pb.collections.getOne("users");
    
    const gpqGroups = Array.from({ length: 14 }, (_, index) => `Kelompok ${index + 1}`);
    
    let updated = false;
    const newFields = usersCollection.fields.map(field => {
      if (["gpq_kelompok", "gpq_shift_1", "gpq_shift_2", "gpq_shift_3"].includes(field.name)) {
        field.values = gpqGroups;
        updated = true;
      }
      return field;
    });
    
    if (updated) {
      console.log("Updating users collection...");
      await pb.collections.update(usersCollection.id, {
        fields: newFields
      });
      console.log("Successfully updated the database fields to allow up to Kelompok 14.");
    } else {
      console.log("No matching fields found or already updated.");
    }
  } catch (err) {
    console.error("Failed:", err.response || err);
  }
}

updateSchema();
