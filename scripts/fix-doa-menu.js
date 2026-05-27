const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

fs.readdirSync(publicDir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace incorrectly assigned gpq-only with gpai-only for doa-harian
    let updatedContent = content.replace(/data-gpq-only href="\/doa-harian"/g, 'data-gpai-only href="/doa-harian"');
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Fixed in ${file}`);
    }
  }
});

console.log("All files processed!");
