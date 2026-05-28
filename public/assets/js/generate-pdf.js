// Helpers for Grading & Description
function getPredicate(score) {
    const n = Number(score);
    if (isNaN(n)) return '';
    if (n >= 86) return 'B';
    if (n >= 71) return 'C';
    return 'K';
}

function getDescription(category, name, score) {
    const numScore = Number(score);
    if (isNaN(numScore)) return '';

    let quality = '';
    if (numScore >= 86) quality = 'mampu';
    else if (numScore >= 71) quality = 'cukup mampu';
    else quality = 'kurang mampu';

    if (category === 'Tajwid') return `Ananda ${quality} memahami tajwid dalam bacaan`;
    if (category === 'Fashahah') return `Ananda ${quality} melafalkan bacaan dengan jelas`;
    if (category === 'Lagu') return `Ananda ${quality} memahami nada bacaan`;
    if (category === 'Tadarus') return `Ananda ${quality} dalam membaca Al-Qur'an secara tartil`;
    if (category === 'Bahasa Arab') return `Ananda ${quality} dalam memahami bahasa Arab`;

    if (category === 'Doa' || category === 'Ibadah') {
        let lancar = '';
        if (numScore >= 86) lancar = 'lancar';
        else if (numScore >= 71) lancar = 'cukup lancar';
        else lancar = 'kurang lancar';
        return `Ananda ${lancar} dalam menghafalkan ${name}`;
    }

    if (category === 'Tahfizh') {
        let tQuality = '';
        if (numScore >= 86) tQuality = 'baik dan';
        else if (numScore >= 71) tQuality = 'cukup';
        else tQuality = 'kurang';
        
        let namaSurat = name;
        if (!name.toLowerCase().startsWith("surah") && !name.toLowerCase().startsWith("q.s")) {
            namaSurat = "Surah " + name;
        }
        return `Ananda ${tQuality} lancar dalam menghafalkan ${namaSurat}`;
    }

    return '';
}

window.viewRapor = async (siswaId, btnElement) => {
    const originalContent = [];
    while (btnElement.firstChild) {
        originalContent.push(btnElement.firstChild);
        btnElement.removeChild(btnElement.firstChild);
    }

    const icon = document.createElement("i");
    icon.className = "ph ph-spinner ph-spin text-lg";
    btnElement.appendChild(icon);
    btnElement.appendChild(document.createTextNode(" PDF..."));
    btnElement.disabled = true;

    try {
        await generatePDF(siswaId);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Gagal membuat PDF: ' + error.message);
    } finally {
        while (btnElement.firstChild) {
            btnElement.removeChild(btnElement.firstChild);
        }
        originalContent.forEach(node => btnElement.appendChild(node));
        btnElement.disabled = false;
    }
};

async function generatePDF(siswaId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Fetch Data
    const [
        student,
        materiList,
        tahfizhRecords,
        bilqolamRecords,
        doaRecords,
        tathbiqRecords,
        teachersList
    ] = await Promise.all([
        pb.collection("siswa").getOne(siswaId),
        pb.collection("materi").getFullList({ sort: "category,materi" }),
        pb.collection("nilai_tahfizh").getFullList({ filter: `siswa="${siswaId}"` }),
        pb.collection("bilqolam").getFullList({ filter: `siswa="${siswaId}"` }),
        pb.collection("nilai_doa").getFullList({ filter: `siswa="${siswaId}"` }),
        pb.collection("nilai_tathbiq").getFullList({ filter: `siswa="${siswaId}"` }),
        pb.collection("users").getFullList().catch(() => []) 
    ]);

    const materiMap = new Map();
    materiList.forEach((m) => materiMap.set(m.id, m));

    // Data prep
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
    const cleanClassKey = rawClass.replace(/kelas\s*/i, "").trim().toUpperCase();
    const studentClass = classNameMap[cleanClassKey] || rawClass;

    const studentNis = student.nis || student.nisn || '-';
    const kelasNum = studentClass.match(/\d+/)?.[0] || null;

    // --- PDF Generation ---

    // Header Logos
    const logoSDPath = '/assets/images/Logo SD Anak Saleh.png';
    const logoBilqolamPath = '/assets/images/Logo Bilqolam.png';

    try {
        doc.addImage(logoSDPath, 'PNG', 23, 7, 25, 25);
    } catch (e) {
        console.warn("Logo SD not found or error loading", e);
    }

    try {
        doc.addImage(logoBilqolamPath, 'PNG', 160, 8, 30, 20);
    } catch (e) {
        console.warn("Logo Bilqolam not found or error loading", e);
    }

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('KEMENKUMHAM RI AHU-0011983.AH.01.04.Tahun 2016', 105, 10, { align: 'center' });

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('SEKOLAH DASAR ANAK SALEH', 105, 16, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text('Childfriendly Based Creative Islamic School', 105, 19, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('NPSN: 20539410 | NSS: 102056104008', 105, 23, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('JL. Arumba No.31 Malang 65143 | Telp. (0341) 487088', 105, 27, { align: 'center' });
    doc.text('Email: official@sekolahanaksaleh.sch.id | www.sekolahanaksaleh.sch.id', 105, 31, { align: 'center' });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(14, 33, 196, 33);
    // doc.setLineWidth(0.1);
    // doc.line(14, 34, 196, 34);

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('RELIGIOUS REPORT', 105, 38, { align: 'center' });

    // Student Info
    let yPos = 43;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Nama`, 15, yPos);
    doc.text(`: ${studentName}`, 30, yPos);
    doc.text(`No. Induk`, 130, yPos);
    doc.text(`: ${studentNis}`, 160, yPos);

    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text(`Kelas`, 15, yPos);
    doc.text(`: ${studentClass}`, 30, yPos);
    doc.text(`Tahun Ajaran`, 130, yPos);
    doc.text(`: 2025/2026 (Genap)`, 160, yPos);

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('I. PENCAPAIAN KOMPETENSI', 14, yPos);

    yPos += 2;

    const tableBody = [];
    let sectionCode = 65; // 'A'

    // 1. BILQOLAM
    const bilqolamRecord = bilqolamRecords[0];
    const bilqLetter = String.fromCharCode(sectionCode++);
    let bilqTitle = 'BILQOLAM';
    if (bilqolamRecord?.jilid) {
        if (student.status === "Pasca") {
            bilqTitle = bilqolamRecord.jilid.toUpperCase();
        } else {
            bilqTitle = `BILQOLAM ${bilqolamRecord.jilid.toUpperCase()}`;
        }
    }
    tableBody.push([
        { content: bilqLetter, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: bilqTitle, colSpan: 4, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } }
    ]);

    if (bilqolamRecord) {
        if (student.status === "Pasca") {
            const tadarusVal = bilqolamRecord.tadarus;
            const arabVal = bilqolamRecord.bahasa_arab;
            
            if (student.inklusif === "Ya") {
                tableBody.push(['1.', "Tadarus Al-Qur'an", { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal), styles: { halign: 'center', fontStyle: 'bold' } }, { content: student.deskripsi_bilqolam || "-", rowSpan: 2, styles: { valign: 'middle', halign: 'justify' } }]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal), styles: { halign: 'center', fontStyle: 'bold' } }]);
            } else {
                tableBody.push(['1.', "Tadarus Al-Qur'an", { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tadarus', null, tadarusVal)]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Bahasa Arab', null, arabVal)]);
            }
        } else {
            const tajwidVal = bilqolamRecord.tajwid;
            const fashahahVal = bilqolamRecord.fashahah;
            const laguVal = bilqolamRecord.lagu;

            if (student.inklusif === "Ya") {
                tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_tajwid || "-"]);
                tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_fashahah || "-"]);
                tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_lagu || "-"]);
            } else {
                tableBody.push(['1.', 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tajwid', null, tajwidVal)]);
                tableBody.push(['2.', 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Fashahah', null, fashahahVal)]);
                tableBody.push(['3.', 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Lagu', null, laguVal)]);
            }
        }
    }

    // 2. DOA
    const doaLetter = String.fromCharCode(sectionCode++);
    tableBody.push([
        { content: doaLetter, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: "TAHFIZH DO'A SEHARI-HARI", colSpan: 4, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } }
    ]);

    doaRecords.forEach((record, index) => {
        const materiName = materiMap.get(record.materi)?.materi || "Materi";
        const score = record.nilai;
        let row = [
            (index + 1) + '.',
            materiName,
            { content: score ?? '-', styles: { halign: 'center' } },
            { content: getPredicate(score), styles: { halign: 'center', fontStyle: 'bold' } }
        ];
        if (student.inklusif === "Ya") {
            row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
        } else {
            row.push(getDescription('Doa', materiName, score));
        }
        tableBody.push(row);
    });

    // 3. TAHFIZH
    const tahfizhLetter = String.fromCharCode(sectionCode++);
    tableBody.push([
        { content: tahfizhLetter, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: "TAHFIZH AL-QUR'AN", colSpan: 1, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: 'CAPAIAN', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [229, 231, 235], halign: 'center' } },
        { content: 'DESKRIPSI CAPAIAN', colSpan: 1, styles: { fontStyle: 'bold', fillColor: [229, 231, 235], halign: 'center' } }
    ]);

    let tIdx = 1;
    let isInclusive = student.inklusif === "Ya";
    let customDeskripsi = student.deskripsi_tahfizh || "-";

    let totalTahfizhRows = 0;
    tahfizhRecords.forEach((record) => {
        const materiData = materiMap.get(record.materi);
        const materiName = materiData?.materi || "Materi";
        if (materiName.toLowerCase().includes("muroja")) totalTahfizhRows++;
        else if (record.hafal_1 !== undefined) {
            if (record.hafal_1 || record.nilai_1) totalTahfizhRows++;
            if (record.hafal_2 || record.nilai_2) totalTahfizhRows++;
            if (record.hafal_3 || record.nilai_3) totalTahfizhRows++;
        } else {
            totalTahfizhRows++;
        }
    });

    let currentRowCount = 0;

    tahfizhRecords.forEach((record) => {
        const materiData = materiMap.get(record.materi);
        const materiName = materiData?.materi || "Materi";
        const isMurojaah = materiName.toLowerCase().includes("muroja");

        if (isMurojaah) {
            let predikat = "-";
            const scoreNum = Number(record.nilai);
            if (scoreNum >= 96) predikat = "MUMTAZ";
            else if (scoreNum >= 86) predikat = "JAYYID JIDDAN";
            else if (scoreNum >= 71) predikat = "JAYYID";
            else if (scoreNum > 0) predikat = "MAQBUL";

            const properPredikat = predikat !== "-" ? predikat.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-";
            const desc = `Ananda mendapat predikat ${properPredikat} dalam ${materiName}`;
            let row = [
                (tIdx++) + '.',
                materiName,
                { content: predikat, colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }
            ];
            if (isInclusive) {
                row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
            } else {
                row.push(desc);
            }
            tableBody.push(row);
            currentRowCount++;
            return;
        }

        if (record.hafal_1 !== undefined) {
            const criterias = [];
            if (record.hafal_1 || record.nilai_1) criterias.push({ hafal: record.hafal_1, nilai: record.nilai_1 });
            if (record.hafal_2 || record.nilai_2) criterias.push({ hafal: record.hafal_2, nilai: record.nilai_2 });
            if (record.hafal_3 || record.nilai_3) criterias.push({ hafal: record.hafal_3, nilai: record.nilai_3 });

            criterias.forEach((c) => {
                const numText = c.hafal || "-";
                const desc = getDescription('Tahfizh', materiName, c.nilai);
                let row = [
                    (tIdx++) + '.',
                    `Q.S ${materiName}`,
                    { content: numText, colSpan: 2, styles: { halign: 'center' } }
                ];
                if (isInclusive) {
                    row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
                } else {
                    row.push(desc);
                }
                tableBody.push(row);
                currentRowCount++;
            });
        } else {
            const totalAyat = Number(materiData?.jumlah_ayat) || 0;
            const hafalAyat = Number(record.nilai) || 0;
            const numText = record.nilai ? `${record.nilai} ayat dari ${materiData?.jumlah_ayat || "?"}` : "-";
            
            let percentScore = 0;
            if (totalAyat > 0) {
                percentScore = Math.round((hafalAyat / totalAyat) * 100);
            }
            
            const desc = getDescription('Tahfizh', materiName, percentScore);
            let row = [
                (tIdx++) + '.',
                `Q.S ${materiName}`,
                { content: numText, colSpan: 2, styles: { halign: 'center' } }
            ];
            if (isInclusive) {
                row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
            } else {
                row.push(desc);
            }
            tableBody.push(row);
            currentRowCount++;
        }
    });

    // 4. TATHBIQ IBADAH
    const ibadahLetter = String.fromCharCode(sectionCode++);
    tableBody.push([
        { content: ibadahLetter, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: 'TATHBIQ IBADAH', colSpan: 1, styles: { fontStyle: 'bold', fillColor: [229, 231, 235] } },
        { content: 'CAPAIAN', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [229, 231, 235], halign: 'center' } },
        { content: 'DESKRIPSI CAPAIAN', colSpan: 1, styles: { fontStyle: 'bold', fillColor: [229, 231, 235], halign: 'center' } }
    ]);

    tathbiqRecords.forEach((record, index) => {
        const materiName = materiMap.get(record.materi)?.materi || "Materi";
        const score = record.nilai;
        let row = [
            (index + 1) + '.',
            materiName,
            { content: score ?? '-', styles: { halign: 'center' } },
            { content: getPredicate(score), styles: { halign: 'center', fontStyle: 'bold' } }
        ];
        if (student.inklusif === "Ya") {
            row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
        } else {
            row.push(getDescription('Ibadah', materiName, score));
        }
        tableBody.push(row);
    });

    doc.autoTable({
        startY: yPos,
        head: [
            [
                { content: 'NO', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontSize: 9 } },
                { content: 'ASPEK PENILAIAN', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontSize: 9 } },
                { content: 'CAPAIAN', colSpan: 2, styles: { halign: 'center', fontSize: 9 } },
                { content: 'DESKRIPSI CAPAIAN', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontSize: 9 } }
            ],
            [
                { content: 'NUMERIK', styles: { halign: 'center', fontSize: 9 } },
                { content: 'PREDIKAT', styles: { halign: 'center', fontSize: 9 } }
            ]
        ],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [229, 231, 235], textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0] },
        styles: { fontSize: 9, cellPadding: 1, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle', font: 'helvetica' },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 45 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14, bottom: 20, top: 20 },
        didDrawPage: function (data) {
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`${studentName} | ${cleanClassKey} | 2025/2026`, 14, pageHeight - 10);
            doc.text(`Semester Genap | Halaman ${data.pageNumber}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
        }
    });

    // --- II. CATATAN ---
    yPos = doc.lastAutoTable.finalY + 4;
    
    // Check if we need to move Catatan to next page
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('II. CATATAN', 14, yPos);
    yPos += 1;

    const catatanGuruPAI = student.saran_guru_pai || student.saran_gpai || "-";
    const catatanGuruQuran = student.saran_guru_gpq || student.saran_gpq || "-";

    doc.autoTable({
        startY: yPos,
        body: [
            [
                { content: 'Guru Pendidikan Agama Islam dan Budi Pekerti', styles: { fontStyle: 'bold', cellWidth: 50 } },
                { content: catatanGuruPAI, styles: { cellWidth: 'auto', halign: 'justify' } }
            ],
            [
                { content: "Guru Pengajar Al-Qur'an", styles: { fontStyle: 'bold' } },
                { content: catatanGuruQuran, styles: { cellWidth: 'auto', halign: 'justify' } }
            ]
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1.8, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle' },
        margin: { left: 14, right: 14, bottom: 20, top: 20 },
        didDrawPage: function (data) {
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`${studentName} | ${cleanClassKey} | 2025/2026`, 14, pageHeight - 10);
            doc.text(`Semester Genap | Halaman ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
        }
    });

    // --- III. KONVERSI NILAI ---
    yPos = doc.lastAutoTable.finalY + 4;

    // Check if there is enough space for Konversi table (needs ~40mm)
    if (yPos > 230) {
        doc.addPage();
        yPos = 20; 
    }

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('III. KONVERSI NILAI', 14, yPos);
    yPos += 1;

    doc.autoTable({
        startY: yPos,
        head: [
            ['NILAI', 'KONVERSI', 'KETERANGAN']
        ],
        body: [
            ['86 - 100', 'B', 'Apabila ananda baca benar dan lancar, tidak ada salah sama sekali'],
            ['71 - 85', 'C', 'Apabila ananda baca dan ada kesalahan 3 kali'],
            ['< 70', 'K', 'Apabila ananda baca dan ada kesalahan lebih dari 3 kali']
        ],
        theme: 'grid',
        headStyles: { fillColor: [229, 231, 235], textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0], halign: 'center' },
        styles: { fontSize: 9, cellPadding: 1, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
            1: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14, bottom: 20, top: 20 },
        didDrawPage: function (data) {
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`${studentName} | ${cleanClassKey} | 2025/2026`, 14, pageHeight - 10);
            doc.text(`Semester Genap | Halaman ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
        }
    });

    // --- Signatures ---
    yPos = doc.lastAutoTable.finalY + 4;

    // Safety check for page break (signatures need ~45mm)
    if (yPos > 235) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Diberikan di', 14, yPos);
    doc.text(': Malang', 40, yPos);
    yPos += 5;
    doc.text('Tanggal', 14, yPos);
    let tanggalRapor = '19 Juni 2026';
    if (kelasNum === '6') {
        tanggalRapor = '2 Juni 2026';
    }
    doc.text(`: ${tanggalRapor}`, 40, yPos);

    yPos += 5;

    const leftX = 37;
    const centerX = 100;
    const rightX = 167;

    doc.text('Guru PAIBP', leftX, yPos, { align: 'center' });
    doc.text('Kepala SD Anak Saleh', centerX, yPos, { align: 'center' });
    doc.text("Guru Al-Qur'an", rightX, yPos, { align: 'center' });

    yPos += 25;

    const normalizedStudentClass = rawClass.replace(/kelas\s*/i, "").trim().toUpperCase();

    const guruPai = teachersList.find(t => {
        if (t.role !== 'GPAI' || !Array.isArray(t.gpai_kelas)) return false;
        return t.gpai_kelas.some(k => k.replace(/kelas\s*/i, "").trim().toUpperCase() === normalizedStudentClass);
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
    doc.text(gpqDisplayName, rightX, yPos, { align: 'center' });

    yPos += 4;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('NIY. ' + niyPai, leftX, yPos, { align: 'center' });
    doc.text('NIY. 0796071420', centerX, yPos, { align: 'center' });
    doc.text('NIY. ' + niyGpq, rightX, yPos, { align: 'center' });

    // Open PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
}
