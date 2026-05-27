const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));

files.forEach((file) => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Update aside to be fixed
  const regexAside = /<aside[\s\n\r]+class="([^"]*)"\s*>/g;
  content = content.replace(regexAside, (match, classNames) => {
    if (classNames.includes('w-72')) {
        let newClasses = classNames
          .replace('sticky', '')
          .replace('top-0', '')
          .replace('self-start', '')
          .replace('h-screen', '')
          .replace('  ', ' ')
          .trim();
          
        const fixedClasses = ['fixed', 'inset-y-0', 'left-0', 'z-30', 'overflow-y-auto'];
        fixedClasses.forEach(cls => {
            if (!newClasses.includes(cls)) newClasses += ` ${cls}`;
        });
        
        return `<aside class="${newClasses}">`;
    }
    return match;
  });

  // 2. Update section to have lg:ml-72 so it is pushed to the right
  const regexSection = /<section\s+class="flex min-w-0 flex-1 flex-col">/g;
  content = content.replace(regexSection, '<section class="flex min-w-0 flex-1 flex-col lg:ml-72">');

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated layout in ${file}`);
});
