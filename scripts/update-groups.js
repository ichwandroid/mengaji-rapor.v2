const fs = require('fs');
const path = require('path');
const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('Kelompok 12')) {
    content = content.replace(/([ \t]*)<option value="Kelompok 12">Kelompok 12<\/option>/g, (match, p1) => {
      return match + '\n' + p1 + '<option value="Kelompok 13">Kelompok 13</option>\n' + p1 + '<option value="Kelompok 14">Kelompok 14</option>';
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${f}`);
  }
});
console.log('Done.');
