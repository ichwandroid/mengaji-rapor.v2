const fs = require("fs");
const path = require("path");

const pdfPath = path.join(__dirname, "..", "public", "assets", "js", "generate-pdf.js");
let content = fs.readFileSync(pdfPath, "utf-8");

// We only want to replace the string `${rawClass}` with `${cleanClassKey}` in doc.text calls that form the footer.
content = content.replace(/doc\.text\(\`\$\{studentName\} \| \$\{rawClass\} \| 2025\/2026\`/g, 'doc.text(`${studentName} | ${cleanClassKey} | 2025/2026`');

fs.writeFileSync(pdfPath, content, "utf-8");
console.log("Updated footer to use cleanClassKey");
