const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));

files.forEach((file) => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Revert aside and add inline styles
  const regexAside = /<aside[\s\n\r]+class="([^"]*)"\s*>/g;
  content = content.replace(regexAside, (match, classNames) => {
    if (classNames.includes('w-72')) {
        let newClasses = classNames
          .replace('sticky', '')
          .replace('top-0', '')
          .replace('h-screen', '')
          .replace('overflow-y-auto', '')
          .replace('self-start', '')
          .replace('fixed', '')
          .replace('inset-y-0', '')
          .replace('left-0', '')
          .replace('z-30', '')
          .replace(/\s+/g, ' ')
          .trim();
          
        return `<aside class="${newClasses}" style="position: sticky; top: 0; height: 100vh; overflow-y: auto; align-self: flex-start;">`;
    }
    return match;
  });

  // Revert section
  const regexSection = /<section\s+class="flex min-w-0 flex-1 flex-col\s*[^"]*">/g;
  content = content.replace(regexSection, '<section class="flex min-w-0 flex-1 flex-col">');

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated layout in ${file}`);
});
