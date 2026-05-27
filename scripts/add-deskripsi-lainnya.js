const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function addDeskripsiLainnya() {
  try {
    console.log("Authenticating as Admin...");
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    
    console.log("Fetching siswa collection...");
    const collection = await pb.collections.getOne("siswa");
    
    let updated = false;
    
    const newFields = [
      { name: 'deskripsi_bilqolam', id: 'text_desk_bilqolam' },
      { name: 'deskripsi_doa', id: 'text_desk_doa' },
      { name: 'deskripsi_tathbiq', id: 'text_desk_tathbiq' }
    ];

    for (const field of newFields) {
      if (!collection.fields.some(f => f.name === field.name)) {
        collection.fields.push({
          system: false,
          id: field.id,
          name: field.name,
          type: "text",
          required: false,
          presentable: false,
          unique: false,
          options: { min: null, max: null, pattern: "" }
        });
        updated = true;
        console.log(`Added field config for ${field.name}`);
      } else {
        console.log(`Field ${field.name} already exists.`);
      }
    }
    
    if (updated) {
      console.log("Updating siswa collection in database...");
      await pb.collections.update(collection.id, { fields: collection.fields });
      console.log("Fields added successfully!");
    } else {
      console.log("No fields needed to be added.");
    }
  } catch (err) {
    console.error("Failed:", err.response || err);
  }
}

addDeskripsiLainnya();
