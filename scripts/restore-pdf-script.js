const fs = require("fs");
const path = require("path");

const pdfPath = path.join(__dirname, "..", "public", "assets", "js", "generate-pdf.js");
let content = fs.readFileSync(pdfPath, "utf-8");

// 1. pb.collection("guru") -> pb.collection("users")
content = content.replace(/pb\.collection\("guru"\)/g, 'pb.collection("users")');

// 2. Class mapping
const rawClassMap = `    // Data prep
    const studentName = student.nama_siswa || student.nama_lengkap || '-';
    
    const classNameMap = {
        "1A": "1A - Pohon Trembesi", "1B": "1B - Pohon Kulim", "1C": "1C - Pohon Kenanga", "1D": "1D - Pohon Pingku",
        "2A": "2A - Pohon Sungkai", "2B": "2B - Pohon Randu", "2C": "2C - Pohon Sengon", "2D": "2D - Pohon Mahoni",
        "3A": "3A - Pohon Saga", "3B": "3B - Pohon Bungur", "3C": "3C - Pohon Eboni", "3D": "3D - Pohon Cantigi",
        "4A": "4A - Pohon Meranti", "4B": "4B - Pohon Damar", "4C": "4C - Pohon Cendana", "4D": "4D - Pohon Ulin",
        "5A": "5A - Pohon Mersawa", "5B": "5B - Pohon Pinus", "5C": "5C - Pohon Beringin", "5D": "5D - Pohon Cemara",
        "6A": "6A - Pohon Jati", "6B": "6B - Pohon Palapi", "6C": "6C - Pohon Bintangur", "6D": "6D - Pohon Mindi"
    };
    
    const rawClass = student.kelas || '-';
    const cleanClassKey = rawClass.replace(/kelas\\s*/i, "").trim().toUpperCase();
    const studentClass = classNameMap[cleanClassKey] || rawClass;

    const studentNis = student.nis || student.nisn || '-';
    const kelasNum = studentClass.match(/\\d+/)?.[0] || null;`;

content = content.replace(
    /    \/\/ Data prep[\s\S]*?const kelasNum = studentClass.match\(\/\\d\+\/\)\?\.\[0\] \|\| null;/m,
    rawClassMap
);

// 3. Footer fix - use rawClass instead of studentClass in footers
content = content.replace(/doc\.text\(\`\$\{studentName\} \| \$\{studentClass\} \|/g, 'doc.text(`${studentName} | ${rawClass} |');

// 4. Dynamic date
const dynamicDate = `    doc.text('Tanggal', 14, yPos);
    let tanggalRapor = '19 Juni 2026';
    if (kelasNum === '6') {
        tanggalRapor = '2 Juni 2026';
    }
    doc.text(\`: \${tanggalRapor}\`, 40, yPos);`;

content = content.replace(
    /    doc\.text\('Tanggal', 14, yPos\);\n    doc\.text\(': 19 Desember 2025', 40, yPos\);/m,
    dynamicDate
);

// 5. Signature area with normalized class and degrees/niy
const signatureArea = `    const normalizedStudentClass = rawClass.replace(/kelas\\s*/i, "").trim().toUpperCase();

    const guruPai = teachersList.find(t => {
        if (t.role !== 'GPAI' || !Array.isArray(t.gpai_kelas)) return false;
        return t.gpai_kelas.some(k => k.replace(/kelas\\s*/i, "").trim().toUpperCase() === normalizedStudentClass);
    });
    const guruGpqName = student.nama_guru_quran || '...........................';
    const guruGpq = teachersList.find(t => t.name === guruGpqName);

    const paiDisplayName = guruPai ? (guruPai.nama_lengkap || guruPai.name) : '...........................';
    const gpqDisplayName = guruGpq ? (guruGpq.nama_lengkap || guruGpq.name) : guruGpqName;

    const niyPai = guruPai && guruPai.niy ? guruPai.niy : '...........................';
    const niyGpq = guruGpq && guruGpq.niy ? guruGpq.niy : '...........................';

    doc.setFont(undefined, 'bold');
    doc.text(paiDisplayName, leftX, yPos, { align: 'center' });
    doc.text('Andreas Setiyono, S.Pd.Gr., M.Kom', centerX, yPos, { align: 'center' });
    doc.text(gpqDisplayName, rightX, yPos, { align: 'center' });`;

content = content.replace(
    /    const guruPaiName = student.guru_pai[\s\S]*?doc\.text\(guruGpqName, rightX, yPos, \{ align: 'center' \}\);/m,
    signatureArea
);

// 6. Bilqolam Title toUpperCase fix that I saw earlier in the file history (just to be safe)
content = content.replace(
    /const bilqTitle = bilqolamRecord\?\.jilid \? \`BILQOLAM \$\{bilqolamRecord\.jilid\}\` : 'BILQOLAM';/g,
    "const bilqTitle = bilqolamRecord?.jilid ? `BILQOLAM ${bilqolamRecord.jilid.toUpperCase()}` : 'BILQOLAM';"
);

fs.writeFileSync(pdfPath, content, "utf-8");
console.log("generate-pdf.js completely restored and fixed.");
