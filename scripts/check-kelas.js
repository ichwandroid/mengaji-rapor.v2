const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
  await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
  const siswa = await pb.collection('siswa').getList(1, 1);
  console.log('Siswa kelas:', siswa.items[0]?.kelas);
  
  const gpai = await pb.collection('users').getList(1, 1, { filter: 'role="GPAI"' });
  console.log('GPAI kelas:', gpai.items[0]?.gpai_kelas);
}
main();
