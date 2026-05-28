const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const jsPath = path.join(publicDir, "assets", "js", "doa-harian.js");
let content = fs.readFileSync(jsPath, "utf-8");

const uploadLogic = `
// ==========================================
// FITUR BULK UPLOAD & DOWNLOAD TEMPLATE CSV
// ==========================================

const btnDownloadTemplate = document.querySelector("[data-doa-harian-download]");
const inputUploadCSV = document.querySelector("[data-doa-harian-upload]");

if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
        if (!window.exportCSV) {
            alert("Sistem CSV belum dimuat!");
            return;
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";

        // Filter materi sesuai semester
        const applicableMateri = doaHarianMateriCache.filter((m) => {
            return String(m.semester).toLowerCase() === currentSemester.toLowerCase();
        });

        // Buat header
        const headers = ["NIS", "NAMA SISWA", "KELAS"];
        applicableMateri.forEach(m => {
            headers.push(m.materi);
        });

        const rows = [headers];

        // Buat data
        const displayedSiswa = doaHarianSiswaCache.filter(filterSiswaForCurrentRole).filter(siswa => {
            const matchNama = filterNama.value.toLowerCase() === "" || (siswa.nama_siswa || "").toLowerCase().includes(filterNama.value.toLowerCase());
            const matchKelas = filterKelas.value.toLowerCase() === "" || (siswa.kelas || "").toLowerCase().includes(filterKelas.value.toLowerCase());
            const matchKelompok = filterKelompok.value === "" || siswa.kelompok === filterKelompok.value;
            const matchShift = filterShift.value === "" || siswa.shift === filterShift.value;
            return matchNama && matchKelas && matchKelompok && matchShift;
        });

        displayedSiswa.forEach(siswa => {
            const row = [
                siswa.nis || siswa.nisn || "-",
                siswa.nama_siswa || "-",
                siswa.kelas || "-"
            ];

            applicableMateri.forEach(m => {
                const record = doaHarianCache.find(r => r.siswa === siswa.id && r.materi === m.id);
                row.push(record ? record.nilai : "");
            });

            rows.push(row);
        });

        window.exportCSV("Template_Doa_Harian.csv", rows);
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

        setDoaHarianStatus("Memproses file CSV...", "info");
        
        try {
            const data = await window.readCSVFile(file);
            if (data.length < 2) {
                alert("File CSV kosong atau tidak valid.");
                setDoaHarianStatus("Gagal membaca CSV.", "error");
                inputUploadCSV.value = "";
                return;
            }

            const headers = data[0];
            const updates = [];
            const creates = [];

            const currentMonth = new Date().getMonth() + 1;
            const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
            const applicableMateri = doaHarianMateriCache.filter((m) => {
                return String(m.semester).toLowerCase() === currentSemester.toLowerCase();
            });

            // Mulai dari baris 1 (lewati header)
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const nis = row[0];
                if (!nis) continue;

                // Cari siswa
                const siswa = doaHarianSiswaCache.find(s => s.nis === nis || s.nisn === nis);
                if (!siswa) continue;

                // Baca nilai per materi
                for (let j = 3; j < headers.length; j++) {
                    const materiName = headers[j];
                    const materi = applicableMateri.find(m => m.materi.trim().toLowerCase() === materiName.trim().toLowerCase());
                    if (!materi) continue;

                    let rawValue = row[j];
                    let value = null;
                    if (rawValue && rawValue.trim() !== "") {
                        value = parseInt(rawValue.trim(), 10);
                        if (isNaN(value)) continue;
                    }

                    const record = doaHarianCache.find(r => r.siswa === siswa.id && r.materi === materi.id);

                    if (record) {
                        if (record.nilai !== value && value !== null) {
                            updates.push({ id: record.id, payload: { nilai: value } });
                        }
                    } else if (value !== null) {
                        creates.push({ siswa: siswa.id, materi: materi.id, nilai: value });
                    }
                }
            }

            setDoaHarianStatus(\`Menyimpan \${updates.length + creates.length} data...\`, "info");

            for (const item of updates) {
                await pb.collection("nilai_doa").update(item.id, item.payload);
            }
            for (const item of creates) {
                await pb.collection("nilai_doa").create(item);
            }

            alert(\`Berhasil mengunggah \${updates.length + creates.length} nilai Do'a Sehari-hari.\`);
            
            // Reload data
            loadDoaHarianData();

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses file CSV.");
            setDoaHarianStatus("Gagal memproses CSV.", "error");
        } finally {
            inputUploadCSV.value = "";
        }
    });
}
`;

if (!content.includes('FITUR BULK UPLOAD')) {
    content += `\n${uploadLogic}`;
    fs.writeFileSync(jsPath, content, "utf-8");
    console.log("Appended Doa Harian upload logic");
} else {
    console.log("Doa Harian logic already present");
}
