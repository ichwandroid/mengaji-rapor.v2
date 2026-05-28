const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));

files.forEach((file) => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Regex to match the th elements that contain NAMA LENGKAP or NAMA SISWA
  const regex = /<th([^>]*)>(NAMA LENGKAP|NAMA SISWA)<\/th>/g;

  content = content.replace(regex, (match, attrs, text) => {
    // If it already has a style attribute, we might skip or append, but let's just forcefully inject style="width: 35%;"
    if (attrs.includes('style=')) {
      return match; // Skip if already styled to avoid messing it up
    } else {
      return `<th${attrs} style="width: 35%;">${text}</th>`;
    }
  });

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated table header in ${file}`);
});
