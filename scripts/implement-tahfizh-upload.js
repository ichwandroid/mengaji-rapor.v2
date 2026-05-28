const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const jsPath = path.join(publicDir, "assets", "js", "tahfizh-quran.js");
let content = fs.readFileSync(jsPath, "utf-8");

const uploadLogic = `
// ==========================================
// FITUR BULK UPLOAD & DOWNLOAD TEMPLATE CSV
// ==========================================

const btnDownloadTemplate = document.querySelector("[data-tahfizh-quran-download]");
const inputUploadCSV = document.querySelector("[data-tahfizh-quran-upload]");

if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
        if (!window.exportCSV) {
            alert("Sistem CSV belum dimuat!");
            return;
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";

        const headers = ["NIS", "NAMA SISWA", "KELAS"];

        // The displayed students might belong to different classes, so we gather all applicable materials 
        // across the grades of the currently filtered students, or simply for the selected class filter.
        // For simplicity, we just gather all materials applicable to the first student's class, 
        // or all materials matching the semester. Usually users filter by class first.
        let classFilters = new Set();
        const displayedSiswa = tahfizhQuranSiswaCache.filter(filterSiswaForCurrentRole).filter(siswa => {
            const matchNama = filterNama.value.toLowerCase() === "" || (siswa.nama_siswa || "").toLowerCase().includes(filterNama.value.toLowerCase());
            const matchKelas = filterKelas.value.toLowerCase() === "" || (siswa.kelas || "").toLowerCase().includes(filterKelas.value.toLowerCase());
            const matchKelompok = filterKelompok.value === "" || siswa.kelompok === filterKelompok.value;
            const matchShift = filterShift.value === "" || siswa.shift === filterShift.value;
            
            if (matchNama && matchKelas && matchKelompok && matchShift) {
                classFilters.add(getClassGrade(siswa.kelas));
                return true;
            }
            return false;
        });

        if (displayedSiswa.length === 0) {
            alert("Tidak ada data siswa yang ditampilkan.");
            return;
        }

        // We only generate materials for the grades that are present in the filtered students
        const applicableMateri = tahfizhQuranMateriCache.filter((m) => {
            return classFilters.has(getClassGrade(m.kelas)) && String(m.semester).toLowerCase() === currentSemester.toLowerCase();
        });

        applicableMateri.forEach(m => {
            if (m.materi.toLowerCase().includes("muroja")) {
                headers.push(\`\${m.materi} (NILAI TOTAL)\`);
            } else {
                headers.push(\`\${m.materi} (HAFAL 1)\`);
                headers.push(\`\${m.materi} (NILAI 1)\`);
                headers.push(\`\${m.materi} (HAFAL 2)\`);
                headers.push(\`\${m.materi} (NILAI 2)\`);
                headers.push(\`\${m.materi} (HAFAL 3)\`);
                headers.push(\`\${m.materi} (NILAI 3)\`);
                headers.push(\`\${m.materi} (NILAI TOTAL)\`);
            }
        });

        const rows = [headers];

        displayedSiswa.forEach(siswa => {
            const row = [
                siswa.nis || siswa.nisn || "-",
                siswa.nama_siswa || "-",
                siswa.kelas || "-"
            ];

            applicableMateri.forEach(m => {
                // If this material does not belong to the student's class, we leave cells blank
                if (getClassGrade(m.kelas) !== getClassGrade(siswa.kelas)) {
                    if (m.materi.toLowerCase().includes("muroja")) {
                        row.push("");
                    } else {
                        row.push("", "", "", "", "", "", "");
                    }
                    return;
                }

                const record = tahfizhQuranCache.find(r => r.siswa === siswa.id && r.materi === m.id);
                
                if (m.materi.toLowerCase().includes("muroja")) {
                    row.push(record && record.nilai !== null ? record.nilai : "");
                } else {
                    row.push(record && record.hafal_1 ? record.hafal_1 : "");
                    row.push(record && record.nilai_1 !== null ? record.nilai_1 : "");
                    row.push(record && record.hafal_2 ? record.hafal_2 : "");
                    row.push(record && record.nilai_2 !== null ? record.nilai_2 : "");
                    row.push(record && record.hafal_3 ? record.hafal_3 : "");
                    row.push(record && record.nilai_3 !== null ? record.nilai_3 : "");
                    row.push(record && record.nilai !== null ? record.nilai : "");
                }
            });

            rows.push(row);
        });

        window.exportCSV("Template_Tahfizh_Quran.csv", rows);
    });
}

if (inputUploadCSV) {
    inputUploadCSV.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!window.readCSVFile) {
            alert("Sistem CSV belum dimuat!");
            return;
        }

        setTahfizhQuranStatus("Memproses file CSV...", "info");
        
        try {
            const data = await window.readCSVFile(file);
            if (data.length < 2) {
                alert("File CSV kosong atau tidak valid.");
                setTahfizhQuranStatus("Gagal membaca CSV.", "error");
                inputUploadCSV.value = "";
                return;
            }

            const headers = data[0];
            const updates = [];
            const creates = [];

            const currentMonth = new Date().getMonth() + 1;
            const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
            const applicableMateri = tahfizhQuranMateriCache.filter((m) => {
                return String(m.semester).toLowerCase() === currentSemester.toLowerCase();
            });

            // Parse headers to map column index to materi and field
            // Example: "Q.S Al-Fatihah (HAFAL 1)" -> materi: "Q.S Al-Fatihah", field: "hafal_1"
            const colMap = [];
            for (let j = 3; j < headers.length; j++) {
                const head = headers[j].trim();
                const match = head.match(/^(.*?)\\s*\\(([^)]+)\\)$/);
                if (match) {
                    const materiName = match[1].trim().toLowerCase();
                    const fieldRaw = match[2].trim().toLowerCase();
                    let field = null;
                    if (fieldRaw === "nilai total") field = "nilai";
                    else if (fieldRaw === "hafal 1") field = "hafal_1";
                    else if (fieldRaw === "nilai 1") field = "nilai_1";
                    else if (fieldRaw === "hafal 2") field = "hafal_2";
                    else if (fieldRaw === "nilai 2") field = "nilai_2";
                    else if (fieldRaw === "hafal 3") field = "hafal_3";
                    else if (fieldRaw === "nilai 3") field = "nilai_3";
                    
                    const materi = applicableMateri.find(m => m.materi.trim().toLowerCase() === materiName);
                    if (materi && field) {
                        colMap[j] = { materi: materi.id, field: field };
                    }
                }
            }

            // Mulai dari baris 1
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const nis = row[0];
                if (!nis) continue;

                const siswa = tahfizhQuranSiswaCache.find(s => s.nis === nis || s.nisn === nis);
                if (!siswa) continue;

                // Group values by materi ID for this student
                const studentUpdates = {}; // { [materiId]: { hafal_1: "...", nilai: 80, ... } }

                for (let j = 3; j < headers.length; j++) {
                    if (!colMap[j]) continue;
                    const { materi, field } = colMap[j];
                    let val = row[j] || "";
                    
                    if (field.startsWith("nilai")) {
                        if (val.trim() === "") val = null;
                        else {
                            val = parseInt(val.trim(), 10);
                            if (isNaN(val)) val = null;
                        }
                    } else {
                        val = val.trim();
                    }

                    if (!studentUpdates[materi]) {
                        studentUpdates[materi] = {};
                    }
                    studentUpdates[materi][field] = val;
                }

                // Apply changes
                for (const materiId of Object.keys(studentUpdates)) {
                    const changes = studentUpdates[materiId];
                    // Skip if all changes are empty/null
                    const isAllEmpty = Object.values(changes).every(v => v === "" || v === null);
                    if (isAllEmpty) continue;

                    const record = tahfizhQuranCache.find(r => r.siswa === siswa.id && r.materi === materiId);

                    if (record) {
                        // Check if actually changed
                        let hasChange = false;
                        for (const key of Object.keys(changes)) {
                            if (changes[key] !== null && changes[key] !== "" && changes[key] !== record[key]) {
                                hasChange = true;
                                break;
                            }
                        }
                        if (hasChange) {
                            updates.push({ id: record.id, payload: changes });
                        }
                    } else {
                        creates.push({ siswa: siswa.id, materi: materiId, ...changes });
                    }
                }
            }

            setTahfizhQuranStatus(\`Menyimpan \${updates.length + creates.length} data...\`, "info");

            for (const item of updates) {
                await pb.collection("nilai_tahfizh").update(item.id, item.payload);
            }
            for (const item of creates) {
                await pb.collection("nilai_tahfizh").create(item);
            }

            alert(\`Berhasil mengunggah \${updates.length + creates.length} nilai Tahfizh Al-Qur'an.\`);
            
            // Reload data
            loadTahfizhQuranData();

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses file CSV.");
            setTahfizhQuranStatus("Gagal memproses CSV.", "error");
        } finally {
            inputUploadCSV.value = "";
        }
    });
}
`;

if (!content.includes('FITUR BULK UPLOAD')) {
    content += `\n${uploadLogic}`;
    fs.writeFileSync(jsPath, content, "utf-8");
    console.log("Appended Tahfizh upload logic");
} else {
    console.log("Tahfizh logic already present");
}
