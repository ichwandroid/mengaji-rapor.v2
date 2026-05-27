const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".html"));

files.forEach((file) => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  const regex = /<aside[\s\n\r]+class="([^"]*)"\s*>/g;
  
  content = content.replace(regex, (match, classNames) => {
    if (classNames.includes('w-72') && classNames.includes('lg:block')) {
        let newClasses = classNames;
        // add required classes for sticky sidebar in a flex layout
        const classesToAdd = ['sticky', 'top-0', 'h-screen', 'overflow-y-auto', 'self-start'];
        
        classesToAdd.forEach(cls => {
            if (!newClasses.includes(cls)) {
                newClasses += ` ${cls}`;
            }
        });
        
        return `<aside class="${newClasses}">`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Updated aside in ${file}`);
});
