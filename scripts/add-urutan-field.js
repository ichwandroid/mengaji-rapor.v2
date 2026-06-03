const PocketBase = require("pocketbase/cjs");

async function run() {
  const pb = new PocketBase("http://127.0.0.1:8090");
  try {
    await pb.admins.authWithPassword("admin@sekolahanaksaleh.sch.id", "admin123456");
    console.log("Logged in");

    const collection = await pb.collections.getOne("pbcmateri001");
    
    // Check if urutan already exists
    if (!collection.schema.find(f => f.name === "urutan")) {
      collection.schema.push({
        system: false,
        id: "text_urutan",
        name: "urutan",
        type: "number",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: 0,
        }
      });
      await pb.collections.update("pbcmateri001", collection);
      console.log("Field urutan added!");
    } else {
      console.log("Field urutan already exists.");
    }
  } catch (err) {
    console.error("Error:", err.response || err);
  }
}
run();
