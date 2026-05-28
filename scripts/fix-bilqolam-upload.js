const fs = require("fs");
const path = require("path");

const jsPath = path.join(__dirname, "..", "public", "assets", "js", "bilqolam.js");
let content = fs.readFileSync(jsPath, "utf-8");

// Hapus bagian bulk upload yang lama jika ada
const uploadMarker = "// ==========================================\n// FITUR BULK UPLOAD & DOWNLOAD TEMPLATE CSV";
const uploadIndex = content.indexOf(uploadMarker);

if (uploadIndex !== -1) {
    content = content.substring(0, uploadIndex).trim();
}

const correctLogic = `
// ==========================================
// FITUR BULK UPLOAD & DOWNLOAD TEMPLATE CSV
// ==========================================

const btnDownloadTemplate = document.querySelector("[data-bilqolam-download]");
const inputUploadCSV = document.querySelector("[data-bilqolam-upload]");

if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
        if (!window.exportCSV) {
            alert("Sistem CSV belum dimuat!");
            return;
        }

        const headers = ["NIS", "NAMA SISWA", "KELAS", "JILID", "TAJWID", "FASHAHAH", "LAGU"];
        const rows = [headers];

        const roleFilteredSiswa = filterSiswaForCurrentRole(bilqolamSiswaCache);
        const displayedSiswa = roleFilteredSiswa.filter(siswa => {
            const matchNama = filterNama.value.toLowerCase() === "" || (siswa.nama_siswa || "").toLowerCase().includes(filterNama.value.toLowerCase());
            const matchKelas = filterKelas.value.toLowerCase() === "" || (siswa.kelas || "").toLowerCase().includes(filterKelas.value.toLowerCase());
            const matchKelompok = filterKelompok.value === "" || siswa.kelompok === filterKelompok.value;
            const matchShift = filterShift.value === "" || siswa.shift === filterShift.value;
            return matchNama && matchKelas && matchKelompok && matchShift;
        });

        displayedSiswa.forEach(siswa => {
            const record = bilqolamCache.find(r => r.siswa === siswa.id);
            const row = [
                siswa.nis || siswa.nisn || "-",
                siswa.nama_siswa || "-",
                siswa.kelas || "-",
                record ? record.jilid : "",
                record && record.tajwid !== null ? record.tajwid : "",
                record && record.fashahah !== null ? record.fashahah : "",
                record && record.lagu !== null ? record.lagu : ""
            ];
            rows.push(row);
        });

        window.exportCSV("Template_Bilqolam.csv", rows);
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

        setBilqolamStatus("Memproses file CSV...", "info");
        
        try {
            const data = await window.readCSVFile(file);
            if (data.length < 2) {
                alert("File CSV kosong atau tidak valid.");
                setBilqolamStatus("Gagal membaca CSV.", "error");
                inputUploadCSV.value = "";
                return;
            }

            const updates = [];
            const creates = [];

            // Mulai dari baris 1 (lewati header)
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const nis = row[0];
                if (!nis) continue;

                // Cari siswa
                const siswa = bilqolamSiswaCache.find(s => s.nis === nis || s.nisn === nis);
                if (!siswa) continue;

                const jilid = (row[3] || "").trim();
                let tajwid = row[4] ? parseInt(row[4], 10) : null;
                let fashahah = row[5] ? parseInt(row[5], 10) : null;
                let lagu = row[6] ? parseInt(row[6], 10) : null;

                if (isNaN(tajwid)) tajwid = null;
                if (isNaN(fashahah)) fashahah = null;
                if (isNaN(lagu)) lagu = null;

                if (jilid === "" && tajwid === null && fashahah === null && lagu === null) continue;

                const record = bilqolamCache.find(r => r.siswa === siswa.id);

                if (record) {
                    if (record.jilid !== jilid || record.tajwid !== tajwid || record.fashahah !== fashahah || record.lagu !== lagu) {
                        updates.push({ id: record.id, payload: { jilid, tajwid, fashahah, lagu } });
                    }
                } else {
                    creates.push({ siswa: siswa.id, jilid, tajwid, fashahah, lagu });
                }
            }

            setBilqolamStatus(\`Menyimpan \${updates.length + creates.length} data...\`, "info");

            for (const item of updates) {
                await pb.collection("bilqolam").update(item.id, item.payload);
            }
            for (const item of creates) {
                await pb.collection("bilqolam").create(item);
            }

            alert(\`Berhasil mengunggah \${updates.length + creates.length} data Bilqolam.\`);
            
            // Reload data
            loadBilqolamData();

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses file CSV.");
            setBilqolamStatus("Gagal memproses CSV.", "error");
        } finally {
            inputUploadCSV.value = "";
        }
    });
}
`;

content += "\n\n" + correctLogic;

fs.writeFileSync(jsPath, content, "utf-8");
console.log("Fixed bilqolam bulk upload logic");
