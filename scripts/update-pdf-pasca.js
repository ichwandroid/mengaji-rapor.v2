const fs = require("fs");
const path = require("path");

const jsPath = path.join(__dirname, "..", "public", "assets", "js", "generate-pdf.js");
let content = fs.readFileSync(jsPath, "utf-8");

// 1. Update getDescription
const oldDesc = `    if (category === 'Lagu') return \`Ananda \${quality} memahami nada bacaan\`;`;
const newDesc = `    if (category === 'Lagu') return \`Ananda \${quality} memahami nada bacaan\`;
    if (category === 'Tadarus') return \`Ananda \${quality} dalam membaca Al-Qur'an secara tartil\`;
    if (category === 'Bahasa Arab') return \`Ananda \${quality} dalam memahami bahasa Arab\`;`;
content = content.replace(oldDesc, newDesc);

// 2. Update Bilqolam PDF table rendering
const oldTableBlock = `    if (bilqolamRecord) {
        const tajwidVal = bilqolamRecord.tajwid;
        const fashahahVal = bilqolamRecord.fashahah;
        const laguVal = bilqolamRecord.lagu;

        if (student.inklusif === "Ya") {
            tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, { content: student.deskripsi_bilqolam || "-", rowSpan: 3, styles: { valign: 'middle', halign: 'justify' } }]);
            tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
            tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
        } else {
            tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tajwid', null, tajwidVal)]);
            tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Fashahah', null, fashahahVal)]);
            tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Lagu', null, laguVal)]);
        }
    }`;

const newTableBlock = `    if (bilqolamRecord) {
        if (student.status === "Pasca") {
            const tadarusVal = bilqolamRecord.tadarus;
            const arabVal = bilqolamRecord.bahasa_arab;
            
            if (student.inklusif === "Ya") {
                tableBody.push(['1.', 'Tadarus Al-Qur\\'an', { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal), styles: { halign: 'center', fontStyle: 'bold' } }, { content: student.deskripsi_bilqolam || "-", rowSpan: 2, styles: { valign: 'middle', halign: 'justify' } }]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
            } else {
                tableBody.push(['1.', 'Tadarus Al-Qur\\'an', { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tadarus', null, tadarusVal)]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Bahasa Arab', null, arabVal)]);
            }
        } else {
            const tajwidVal = bilqolamRecord.tajwid;
            const fashahahVal = bilqolamRecord.fashahah;
            const laguVal = bilqolamRecord.lagu;

            if (student.inklusif === "Ya") {
                tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, { content: student.deskripsi_bilqolam || "-", rowSpan: 3, styles: { valign: 'middle', halign: 'justify' } }]);
                tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
                tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
            } else {
                tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tajwid', null, tajwidVal)]);
                tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Fashahah', null, fashahahVal)]);
                tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Lagu', null, laguVal)]);
            }
        }
    }`;
content = content.replace(oldTableBlock, newTableBlock);

fs.writeFileSync(jsPath, content, "utf-8");
console.log("Successfully updated generate-pdf.js with Pasca logic!");
