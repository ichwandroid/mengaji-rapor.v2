const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

// 1. Create the upload logic script
const uploadLogic = `
// ==========================================
// FITUR BULK UPLOAD & DOWNLOAD TEMPLATE CSV SARAN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const btnDownloadTemplate = document.querySelector("[data-laporan-download]");
    const inputUploadCSV = document.querySelector("[data-laporan-upload]");

    if (btnDownloadTemplate) {
        btnDownloadTemplate.addEventListener("click", () => {
            if (!window.exportCSV || typeof siswaCache === "undefined") {
                alert("Sistem atau data siswa belum dimuat!");
                return;
            }

            const headers = ["NIS", "NAMA SISWA", "KELAS", "SARAN GPQ", "SARAN GPAI"];
            const rows = [headers];

            const roleFilteredSiswa = filterSiswaForCurrentRole(siswaCache);
            const displayedSiswa = roleFilteredSiswa.filter(siswa => {
                const matchNama = laporanFilterNama.value.toLowerCase() === "" || (siswa.nama_siswa || "").toLowerCase().includes(laporanFilterNama.value.toLowerCase());
                const matchKelas = laporanFilterKelas.value.toLowerCase() === "" || (siswa.kelas || "").toLowerCase().includes(laporanFilterKelas.value.toLowerCase());
                const matchKelompok = laporanFilterKelompok.value === "" || siswa.kelompok === laporanFilterKelompok.value;
                const matchShift = laporanFilterShift.value === "" || siswa.shift === laporanFilterShift.value;
                return matchNama && matchKelas && matchKelompok && matchShift;
            });

            if (displayedSiswa.length === 0) {
                alert("Tidak ada data siswa yang ditampilkan.");
                return;
            }

            displayedSiswa.forEach(siswa => {
                const row = [
                    siswa.nis || siswa.nisn || "-",
                    siswa.nama_siswa || "-",
                    siswa.kelas || "-",
                    siswa.saran_gpq || "",
                    siswa.saran_gpai || ""
                ];
                rows.push(row);
            });

            window.exportCSV("Template_Saran_Rapor.csv", rows);
        });
    }

    if (inputUploadCSV) {
        inputUploadCSV.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!window.readCSVFile || typeof siswaCache === "undefined") {
                alert("Sistem CSV belum dimuat!");
                return;
            }

            const LaporanStatusMsg = document.querySelector("[data-laporan-status]");
            if (LaporanStatusMsg) LaporanStatusMsg.textContent = "Memproses file CSV...";
            
            try {
                const data = await window.readCSVFile(file);
                if (data.length < 2) {
                    alert("File CSV kosong atau tidak valid.");
                    if (LaporanStatusMsg) LaporanStatusMsg.textContent = "Gagal membaca CSV.";
                    inputUploadCSV.value = "";
                    return;
                }

                const updates = [];
                const currentUser = pb?.authStore.record;
                const isAdminRole = currentUser?.role === "Admin";
                const isGPQRole = currentUser?.role === "GPQ";
                const isGPAIRole = currentUser?.role === "GPAI";

                // Mulai dari baris 1 (lewati header)
                for (let i = 1; i < data.length; i++) {
                    const row = data[i];
                    const nis = row[0];
                    if (!nis) continue;

                    // Cari siswa
                    const siswa = siswaCache.find(s => s.nis === nis || s.nisn === nis);
                    if (!siswa) continue;

                    const saranGpq = row[3] || "";
                    const saranGpai = row[4] || "";

                    const payload = {};
                    let isChanged = false;

                    // GPQ only allowed to update saran_gpq
                    if (isAdminRole || isGPQRole) {
                        if (siswa.saran_gpq !== saranGpq && row[3] !== undefined) {
                            payload.saran_gpq = saranGpq;
                            isChanged = true;
                        }
                    }

                    // GPAI only allowed to update saran_gpai
                    if (isAdminRole || isGPAIRole) {
                        if (siswa.saran_gpai !== saranGpai && row[4] !== undefined) {
                            payload.saran_gpai = saranGpai;
                            isChanged = true;
                        }
                    }

                    if (isChanged) {
                        updates.push({ id: siswa.id, payload: payload });
                    }
                }

                if (updates.length === 0) {
                    alert("Tidak ada saran baru yang perlu disimpan.");
                    if (LaporanStatusMsg) LaporanStatusMsg.textContent = "";
                    inputUploadCSV.value = "";
                    return;
                }

                if (LaporanStatusMsg) LaporanStatusMsg.textContent = \`Menyimpan \${updates.length} saran siswa...\`;

                for (const item of updates) {
                    await pb.collection("siswa").update(item.id, item.payload);
                }

                alert(\`Berhasil memperbarui saran untuk \${updates.length} siswa.\`);
                
                // Reload data using dashboard logic
                if (typeof loadSiswa === "function") await loadSiswa();
                if (typeof loadLaporan === "function") await loadLaporan();

            } catch (err) {
                console.error(err);
                alert("Terjadi kesalahan saat memproses file CSV.");
                if (LaporanStatusMsg) LaporanStatusMsg.textContent = "Gagal memproses CSV.";
            } finally {
                inputUploadCSV.value = "";
            }
        });
    }
});
`;

fs.writeFileSync(path.join(publicDir, "assets", "js", "saran-upload.js"), uploadLogic, "utf-8");
console.log("Created saran-upload.js");

// 2. Inject into laporan.html
const laporanHtml = path.join(publicDir, "laporan.html");
let content = fs.readFileSync(laporanHtml, "utf-8");

let modified = false;

// Inject csv-helper.js if missing
if (!content.includes('csv-helper.js')) {
    content = content.replace('<script src="/assets/js/dashboard.js"></script>', '<script src="/assets/js/csv-helper.js"></script>\n  <script src="/assets/js/dashboard.js"></script>');
    modified = true;
}

// Inject saran-upload.js if missing
if (!content.includes('saran-upload.js')) {
    content = content.replace('<script src="/assets/js/dashboard.js"></script>', '<script src="/assets/js/dashboard.js"></script>\n  <script src="/assets/js/saran-upload.js"></script>');
    modified = true;
}

if (modified) {
    fs.writeFileSync(laporanHtml, content, "utf-8");
    console.log("Injected scripts into laporan.html");
} else {
    console.log("Scripts already injected in laporan.html");
}
