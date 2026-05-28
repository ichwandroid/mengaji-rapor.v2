const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const filesToFix = [
    { js: "tathbiq-ibadah.js", cache: "tathbiqIbadahSiswaCache" },
    { js: "doa-harian.js", cache: "doaHarianSiswaCache" },
    { js: "bilqolam.js", cache: "bilqolamSiswaCache" },
    { js: "tahfizh-quran.js", cache: "tahfizhQuranSiswaCache" }
];

filesToFix.forEach(({ js, cache }) => {
    const filePath = path.join(publicDir, "assets", "js", js);
    let content = fs.readFileSync(filePath, "utf-8");

    // Replace the incorrect filter usage
    const searchString = `const displayedSiswa = ${cache}.filter(filterSiswaForCurrentRole).filter(siswa => {`;
    const replaceString = `const roleFilteredSiswa = filterSiswaForCurrentRole(${cache});
        const displayedSiswa = roleFilteredSiswa.filter(siswa => {`;

    if (content.includes(searchString)) {
        content = content.replace(searchString, replaceString);
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Fixed filter logic in ${js}`);
    } else {
        console.log(`Filter logic already fixed or not found in ${js}`);
    }
});
