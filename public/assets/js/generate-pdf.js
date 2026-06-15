// Helpers for Grading & Description
function getPredicate(score, isPasca = false) {
    const n = Number(score);
    if (isNaN(n)) return '';
    if (n >= 86) return 'B';
    const cThreshold = isPasca ? 70 : 71;
    if (n >= cThreshold) return 'C';
    return 'K';
}

function getDescription(category, name, score, isPasca = false) {
    const numScore = Number(score);
    if (isNaN(numScore)) return '';

    const cThreshold = isPasca ? 70 : 71;

    let quality = '';
    if (numScore >= 86) quality = 'mampu';
    else if (numScore >= cThreshold) quality = 'cukup mampu';
    else quality = 'kurang mampu';

    if (category === 'Tajwid') return `Ananda ${quality} memahami tajwid dalam bacaan`;
    if (category === 'Fashahah') return `Ananda ${quality} melafalkan bacaan dengan jelas`;
    if (category === 'Lagu') return `Ananda ${quality} memahami nada bacaan`;
    if (category === 'Tadarus') return `Ananda ${quality} dalam membaca Al-Qur'an secara tartil`;
    if (category === 'Bahasa Arab') return `Ananda ${quality} dalam memahami bahasa Arab`;

    if (category === 'Doa' || category === 'Ibadah') {
        let lancar = '';
        if (numScore >= 86) lancar = 'lancar';
        else if (numScore >= cThreshold) lancar = 'cukup lancar';
        else lancar = 'kurang lancar';
        return `Ananda ${lancar} dalam menghafalkan ${name}`;
    }

    if (category === 'Tahfizh') {
        let tQuality = '';
        if (numScore >= 86) tQuality = 'baik dan';
        else if (numScore >= cThreshold) tQuality = 'cukup';
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
        "1A": "IA - Trembesi", "1B": "IB - Kulim", "1C": "IC - Kenanga", "1D": "1D - Pingku",
        "2A": "IIA - Sungkai", "2B": "IIB - Randu", "2C": "IIC - Sengon", "2D": "IID - Mahoni",
        "3A": "IIIA - Saga", "3B": "IIIB - Bungur", "3C": "IIIC - Eboni", "3D": "IIID - Cantigi",
        "4A": "IVA - Meranti", "4B": "IVB - Damar", "4C": "IVC - Cendana", "4D": "IVD - Ulin",
        "5A": "VA - Mersawa", "5B": "VB - Pinus", "5C": "VC - Beringin", "5D": "VD - Cemara",
        "6A": "VIA - Jati", "6B": "VIB - Palapi", "6C": "VIC - Bintangur", "6D": "VID - Mindi"
    };
    
    const rawClass = student.kelas || '-';
    const cleanClassKey = rawClass.replace(/kelas\s*/i, "").trim().toUpperCase();
    const studentClass = classNameMap[cleanClassKey] || rawClass;

    const studentNis = student.nis || student.nisn || '-';
    const studentNisn = student.nisn || student.nis || '-';
    const kelasNum = getClassGrade(rawClass) || cleanClassKey.match(/\d+/)?.[0] || null;

    // Filter records by current class and semester
    const currentMonth = new Date().getMonth() + 1;
    const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";

    const isApplicableMateri = (materiId) => {
        const m = materiMap.get(materiId);
        if (!m) return false;
        // Gunakan fungsi getClassGrade dari dashboard.js yang sudah diload
        return getClassGrade(m.kelas) === kelasNum && 
               String(m.semester).toLowerCase() === currentSemester.toLowerCase();
    };

    let filteredTahfizh = tahfizhRecords.filter(r => isApplicableMateri(r.materi));
    let filteredDoa = doaRecords.filter(r => isApplicableMateri(r.materi));
    let filteredTathbiq = tathbiqRecords.filter(r => isApplicableMateri(r.materi));

    // Sort helper based on materi urutan
    const sortByMateriUrutan = (records) => {
        records.sort((a, b) => {
            const materiA = materiMap.get(a.materi);
            const materiB = materiMap.get(b.materi);
            const urutanA = materiA?.urutan ? Number(materiA.urutan) : 999;
            const urutanB = materiB?.urutan ? Number(materiB.urutan) : 999;
            
            if (urutanA !== urutanB) return urutanA - urutanB;
            
            const nameA = materiA?.materi || "";
            const nameB = materiB?.materi || "";
            return nameA.localeCompare(nameB, "id", { numeric: true, sensitivity: "base" });
        });
    };

    sortByMateriUrutan(filteredTahfizh);
    sortByMateriUrutan(filteredDoa);
    sortByMateriUrutan(filteredTathbiq);

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
    doc.text(` : ${studentName}`, 30, yPos);
    doc.text(`NISN`, 130, yPos);
    doc.text(` : ${studentNisn}`, 160, yPos);

    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text(`Kelas`, 15, yPos);
    doc.text(` : ${studentClass}`, 30, yPos);
    doc.text(`Tahun Pelajaran`, 130, yPos);
    doc.text(` : 2025/2026 (Genap)`, 160, yPos);

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
    if (student.inklusif === "Ya") {
        bilqTitle = 'PENILAIAN KHUSUS PDBK';
    } else if (bilqolamRecord?.jilid) {
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
                tableBody.push(['1.', "Tadarus Al-Qur'an", { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal, true), styles: { halign: 'center', fontStyle: 'bold' } }, { content: student.deskripsi_bilqolam || "-", rowSpan: 2, styles: { valign: 'middle', halign: 'left' } }]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal, true), styles: { halign: 'center', fontStyle: 'bold' } }]);
            } else {
                tableBody.push(['1.', "Tadarus Al-Qur'an", { content: tadarusVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tadarusVal, true), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Tadarus', null, tadarusVal, true)]);
                tableBody.push(['2.', 'Bahasa Arab', { content: arabVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(arabVal, true), styles: { halign: 'center', fontStyle: 'bold' } }, getDescription('Bahasa Arab', null, arabVal, true)]);
            }
        } else {
            const tajwidVal = bilqolamRecord.tajwid;
            const fashahahVal = bilqolamRecord.fashahah;
            const laguVal = bilqolamRecord.lagu;

            if (student.inklusif === "Ya") {
                tableBody.push(['1.', student.materi_bilqolam_1 || 'Tajwid', { content: tajwidVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(tajwidVal, student.status === "Pasca"), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_tajwid || "-"]);
                tableBody.push(['2.', student.materi_bilqolam_2 || 'Fashahah', { content: fashahahVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(fashahahVal, student.status === "Pasca"), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_fashahah || "-"]);
                tableBody.push(['3.', student.materi_bilqolam_3 || 'Lagu', { content: laguVal ?? '-', styles: { halign: 'center' } }, { content: getPredicate(laguVal, student.status === "Pasca"), styles: { halign: 'center', fontStyle: 'bold' } }, student.deskripsi_bilqolam_lagu || "-"]);
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

    filteredDoa.forEach((record, index) => {
        const materiName = materiMap.get(record.materi)?.materi || "Materi";
        const score = record.nilai;
        let row = [
            (index + 1) + '.',
            materiName,
            { content: score ?? '-', styles: { halign: 'center' } },
            { content: getPredicate(score, student.status === "Pasca"), styles: { halign: 'center', fontStyle: 'bold' } }
        ];
        if (student.inklusif === "Ya") {
            row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'left' } });
        } else {
            row.push(getDescription('Doa', materiName, score, student.status === "Pasca"));
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
    filteredTahfizh.forEach((record) => {
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

    filteredTahfizh.forEach((record) => {
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
                const desc = getDescription('Tahfizh', materiName, c.nilai, student.status === "Pasca");
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
            
            const desc = getDescription('Tahfizh', materiName, percentScore, student.status === "Pasca");
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

    filteredTathbiq.forEach((record, index) => {
        const materiName = materiMap.get(record.materi)?.materi || "Materi";
        const score = record.nilai;
        let row = [
            (index + 1) + '.',
            materiName,
            { content: score ?? '-', styles: { halign: 'center' } },
            { content: getPredicate(score, student.status === "Pasca"), styles: { halign: 'center', fontStyle: 'bold' } }
        ];
        if (student.inklusif === "Ya") {
            row.push({ content: record.deskripsi_inklusi || "-", styles: { valign: 'middle', halign: 'justify' } });
        } else {
            row.push(getDescription('Ibadah', materiName, score, student.status === "Pasca"));
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
        styles: { fontSize: 9, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle', font: 'helvetica' },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 45 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 'auto',
                cellPadding: {top: 0.5, bottom: 0.5, left: 1, right: 1}
             }
        },
        margin: { left: 14, right: 14, bottom: 20, top: 20 }
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
                { content: catatanGuruPAI, styles: { 
                    cellWidth: 'auto', halign: 'left', 
                    cellPadding: {top: 0.5, bottom: 0.5, left: 1, right: 1}
                } }
            ],
            [
                { content: "Guru Pengajar Al-Qur'an", styles: { fontStyle: 'bold' } },
                { content: catatanGuruQuran, styles: { 
                    cellWidth: 'auto', halign: 'left', 
                    cellPadding: {top: 0.5, bottom: 0.5, left: 1, right: 1}
                } }
            ]
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPaddingRight: 1.9, cellPaddingLeft: 1, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle' },
        margin: { left: 14, right: 14, bottom: 20, top: 20 }
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
            [student.status === "Pasca" ? '70 - 85' : '71 - 85', 'C', 'Apabila ananda baca dan ada kesalahan 3 kali'],
            [student.status === "Pasca" ? '< 70' : '< 71', 'K', 'Apabila ananda baca dan ada kesalahan lebih dari 3 kali']
        ],
        theme: 'grid',
        headStyles: { fillColor: [229, 231, 235], textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: [0, 0, 0], halign: 'center' },
        styles: { fontSize: 9, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: 0, valign: 'middle' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
            1: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14, bottom: 20, top: 20 }
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
    
    // Guru PAI
    doc.text(paiDisplayName, leftX, yPos, { align: 'center' });
    const paiWidth = doc.getTextWidth(paiDisplayName);
    doc.setLineWidth(0.3);
    doc.line(leftX - paiWidth / 2, yPos + 0.8, leftX + paiWidth / 2, yPos + 0.8);

    // Kepala Sekolah
    const kepsekName = 'Andreas Setiyono, S.Pd.Gr., M.Kom';
    doc.text(kepsekName, centerX, yPos, { align: 'center' });
    const kepsekWidth = doc.getTextWidth(kepsekName);
    doc.line(centerX - kepsekWidth / 2, yPos + 0.8, centerX + kepsekWidth / 2, yPos + 0.8);

    // Guru Al-Qur'an
    doc.text(gpqDisplayName, rightX, yPos, { align: 'center' });
    const gpqWidth = doc.getTextWidth(gpqDisplayName);
    doc.line(rightX - gpqWidth / 2, yPos + 0.8, rightX + gpqWidth / 2, yPos + 0.8);

    yPos += 4;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`NIY. ${niyPai}`, leftX, yPos, { align: 'center' });
    doc.text('NIY. 0796071420', centerX, yPos, { align: 'center' });
    doc.text(`NIY. ${niyGpq}`, rightX, yPos, { align: 'center' });

    // --- Global Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`${studentClass} | ${studentName} | ${studentNisn}`, 14, pageHeight - 10);
        doc.text(`Halaman ${i}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    // Open PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
}
