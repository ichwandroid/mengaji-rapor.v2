const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateRules() {
  try {
    console.log("Authenticating as Admin...");
    await pb.admins.authWithPassword('admin@anaksaleh.edu', '4n4k54l3H.');
    
    const authOnlyRule = "@request.auth.id != ''";
    
    console.log("Updating nilai_tahfizh...");
    const tahfizh = await pb.collections.getOne("nilai_tahfizh");
    await pb.collections.update(tahfizh.id, {
      createRule: authOnlyRule,
      updateRule: authOnlyRule,
      deleteRule: authOnlyRule
    });
    
    console.log("Updating nilai_doa...");
    const doa = await pb.collections.getOne("nilai_doa");
    await pb.collections.update(doa.id, {
      createRule: authOnlyRule,
      updateRule: authOnlyRule,
      deleteRule: authOnlyRule
    });
    
    console.log("Updating materi (optional)...");
    const materi = await pb.collections.getOne("materi");
    await pb.collections.update(materi.id, {
      createRule: authOnlyRule,
      updateRule: authOnlyRule,
      deleteRule: authOnlyRule
    });
    
    console.log("Success! Backend rules updated.");
  } catch (err) {
    console.error("Failed:", err.response || err);
  }
}

updateRules();
