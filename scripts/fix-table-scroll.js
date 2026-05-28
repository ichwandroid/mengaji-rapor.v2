const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));

files.forEach((file) => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // We look for <div class="overflow-x-auto">
  // We'll replace it with <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 280px);">
  // Because the JIT tailwind compiler isn't running, we use an inline style to ensure it takes effect immediately.
  
  // First, we remove any existing inline max-height or overflow-y-auto to prevent duplication if script is run twice
  content = content.replace(/<div\s+class="overflow-x-auto[^"]*"\s*style="[^"]*max-height[^"]*"\s*>/g, '<div class="overflow-x-auto">');
  content = content.replace(/<div\s+class="overflow-x-auto overflow-y-auto"\s*>/g, '<div class="overflow-x-auto">');

  // Now apply the change
  content = content.replace(/<div\s+class="overflow-x-auto"\s*>/g, '<div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 280px);">');

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated table wrappers in ${file}`);
});
