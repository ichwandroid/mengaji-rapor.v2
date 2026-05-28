const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const jsPath = path.join(publicDir, "assets", "js", "bilqolam.js");
let content = fs.readFileSync(jsPath, "utf-8");

const uploadLogic = `
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

        const headers = ["NIS", "NAMA SISWA", "KELAS", "JILID", "HALAMAN", "KETERANGAN"];
        const rows = [headers];

        const displayedSiswa = bilqolamSiswaCache.filter(filterSiswaForCurrentRole).filter(siswa => {
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
                record ? record.halaman : "",
                record ? record.keterangan : ""
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

                const jilid = row[3] || "";
                const halaman = row[4] || "";
                const keterangan = row[5] || "";

                if (jilid === "" && halaman === "" && keterangan === "") continue;

                const record = bilqolamCache.find(r => r.siswa === siswa.id);

                if (record) {
                    if (record.jilid !== jilid || record.halaman !== halaman || record.keterangan !== keterangan) {
                        updates.push({ id: record.id, payload: { jilid, halaman, keterangan } });
                    }
                } else {
                    creates.push({ siswa: siswa.id, jilid, halaman, keterangan });
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

if (!content.includes('FITUR BULK UPLOAD')) {
    content += `\n${uploadLogic}`;
    fs.writeFileSync(jsPath, content, "utf-8");
    console.log("Appended Bilqolam upload logic");
} else {
    console.log("Bilqolam logic already present");
}
