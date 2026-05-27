const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function checkData() {
  await pb.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
  
  const materi = await pb.collection('materi').getFullList({ filter: 'category="tahfizh-quran"' });
  const genapClasses = [...new Set(materi.filter(m => m.semester === 'Genap').map(m => m.kelas))];
  const ganjilClasses = [...new Set(materi.filter(m => m.semester === 'Ganjil').map(m => m.kelas))];
  
  console.log('Materi Genap classes:', genapClasses);
  console.log('Materi Ganjil classes:', ganjilClasses);
  
  const siswa = await pb.collection('siswa').getFullList();
  const siswaClasses = [...new Set(siswa.map(s => s.kelas))];
  console.log('Siswa classes:', siswaClasses);
}
checkData();
