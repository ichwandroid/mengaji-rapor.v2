const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateListRules() {
  try {
    console.log("Authenticating as Admin...");
    await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
    
    const authOnlyRule = "@request.auth.id != ''";
    const collectionsToUpdate = ["materi", "nilai_tahfizh", "nilai_doa", "nilai_tathbiq", "bilqolam"];
    
    for (const name of collectionsToUpdate) {
      try {
        const collection = await pb.collections.getOne(name);
        await pb.collections.update(collection.id, {
          listRule: authOnlyRule,
          viewRule: authOnlyRule,
          createRule: authOnlyRule,
          updateRule: authOnlyRule,
          deleteRule: authOnlyRule
        });
        console.log(`Updated rules for: ${name}`);
      } catch (err) {
        console.log(`Could not update ${name} or it doesn't exist.`);
      }
    }
    
    console.log("All rules updated successfully.");
  } catch (err) {
    console.error("Authentication failed:", err.response || err);
  }
}

updateListRules();
