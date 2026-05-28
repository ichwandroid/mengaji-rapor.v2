const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public", "assets", "js");

const replacements = [
    { file: "doa-harian.js", oldCode: "loadDoaHarianData();", newCode: "if (typeof reloadNilaiData === 'function') { await reloadNilaiData(); } else { window.location.reload(); }" },
    { file: "tathbiq-ibadah.js", oldCode: "loadTathbiqIbadahData();", newCode: "if (typeof reloadNilaiData === 'function') { await reloadNilaiData(); } else { window.location.reload(); }" },
    { file: "tahfizh-quran.js", oldCode: "loadTahfizhQuranData();", newCode: "if (typeof reloadNilaiData === 'function') { await reloadNilaiData(); } else { window.location.reload(); }" },
    { file: "bilqolam.js", oldCode: "loadBilqolamData();", newCode: "if (typeof reloadBilqolamData === 'function') { await reloadBilqolamData(); } else { window.location.reload(); }" }
];

replacements.forEach(({ file, oldCode, newCode }) => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, "utf-8");
    
    if (content.includes(oldCode)) {
        content = content.replace(newCode, oldCode); // in case already replaced by something else? no.
        content = content.replace(oldCode, newCode);
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Fixed reload function call in ${file}`);
    } else {
        console.log(`No fix needed or already fixed in ${file}`);
    }
});
