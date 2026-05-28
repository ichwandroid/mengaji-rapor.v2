const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const filesToUpdate = [
    { html: "tathbiq-ibadah.html", js: "tathbiq-ibadah.js" },
    { html: "doa-harian.html", js: "doa-harian.js" },
    { html: "bilqolam.html", js: "bilqolam.js" },
    { html: "tahfizh-quran.html", js: "tahfizh-quran.js" }
];

filesToUpdate.forEach(({ html, js }) => {
    const filePath = path.join(publicDir, html);
    let content = fs.readFileSync(filePath, "utf-8");
    
    // insert csv-helper.js before the main page js if not exists
    if (!content.includes('csv-helper.js')) {
        const replacement = `<script src="/assets/js/csv-helper.js"></script>\n  <script src="/assets/js/${js}"></script>`;
        content = content.replace(`<script src="/assets/js/${js}"></script>`, replacement);
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Updated ${html}`);
    } else {
        console.log(`${html} already has csv-helper.js`);
    }
});
