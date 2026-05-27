const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function addDeskripsiField() {
  try {
    console.log("Authenticating as Admin...");
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    
    console.log("Fetching siswa collection...");
    const collection = await pb.collections.getOne("siswa");
    
    // Check if field already exists
    if (!collection.fields.some(f => f.name === 'deskripsi_tahfizh')) {
      collection.fields.push({
        system: false,
        id: "text_deskripsi_tahfizh",
        name: "deskripsi_tahfizh",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      });
      
      console.log("Updating siswa collection...");
      await pb.collections.update(collection.id, {
        fields: collection.fields
      });
      console.log("Field deskripsi_tahfizh added successfully!");
    } else {
      console.log("Field deskripsi_tahfizh already exists.");
    }
  } catch (err) {
    console.error("Failed:", err.response || err);
  }
}

addDeskripsiField();
