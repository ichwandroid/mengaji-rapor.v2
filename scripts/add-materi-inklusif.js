const PocketBase = require("pocketbase/cjs");

async function run() {
  const pb = new PocketBase("http://127.0.0.1:8090");
  try {
    const admin = await pb.admins.authWithPassword("admin@sekolahanaksaleh.sch.id", "admin123456").catch(() => null);
    if (!admin) {
      console.log("Gagal login admin. Pastikan server pocketbase berjalan.");
      return;
    }
    
    const collection = await pb.collections.getOne("siswa");
    
    const fieldsToAdd = ["materi_bilqolam_1", "materi_bilqolam_2", "materi_bilqolam_3"];
    let updated = false;
    
    for (const field of fieldsToAdd) {
      if (!collection.schema.some(f => f.name === field)) {
        collection.schema.push({
          system: false,
          id: "materi_" + Math.random().toString(36).substring(2, 8),
          name: field,
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
        updated = true;
      }
    }
    
    if (updated) {
      await pb.collections.update("siswa", collection);
      console.log("Berhasil menambahkan field materi_bilqolam_1, 2, 3 ke koleksi siswa.");
    } else {
      console.log("Field sudah ada.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
