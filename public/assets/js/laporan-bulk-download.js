// ==========================================
// FITUR BULK DOWNLOAD RAPOR SISWA (ZIP)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const btnDownloadAllRapor = document.querySelector("[data-download-all-rapor]");

    if (btnDownloadAllRapor) {
        btnDownloadAllRapor.addEventListener("click", async () => {
            if (typeof siswaCache === "undefined" || siswaCache.length === 0) {
                alert("Data siswa belum dimuat atau kosong!");
                return;
            }

            // 1. Ambil nilai filter yang sedang aktif
            const laporanFilterNama = document.querySelector("[data-laporan-filter-nama]");
            const laporanFilterKelas = document.querySelector("[data-laporan-filter-kelas]");
            const laporanFilterKelompok = document.querySelector("[data-laporan-filter-kelompok]");
            const laporanFilterShift = document.querySelector("[data-laporan-filter-shift]");
            const laporanFilterSort = document.querySelector("[data-laporan-filter-sort]");

            const fNama = String(laporanFilterNama?.value || "").trim().toLowerCase();
            const fKelas = String(laporanFilterKelas?.value || "").trim().toLowerCase();
            const fKelompok = String(laporanFilterKelompok?.value || "").trim();
            const fShift = String(laporanFilterShift?.value || "").trim();
            const fSort = laporanFilterSort?.value || "az";

            // 2. Filter siswa sesuai tampilan
            let filteredSiswa = siswaCache.filter((siswa) => {
                const namaSiswa = (siswa.nama_siswa || "").toLowerCase();
                const kelasSiswa = (siswa.kelas || "").toLowerCase();
                const kelompokSiswa = siswa.kelompok || "";
                const shiftSiswa = siswa.shift || "";

                if (fNama && !namaSiswa.includes(fNama)) return false;
                if (fKelas && !kelasSiswa.includes(fKelas)) return false;
                if (fKelompok && kelompokSiswa !== fKelompok) return false;
                if (fShift && shiftSiswa !== fShift) return false;

                return true;
            });

            // Urutkan siswa
            filteredSiswa.sort((a, b) => {
                const nameA = (a.nama_siswa || "").toLowerCase();
                const nameB = (b.nama_siswa || "").toLowerCase();
                if (fSort === "az") {
                    return nameA.localeCompare(nameB, "id");
                } else {
                    return nameB.localeCompare(nameA, "id");
                }
            });

            const total = filteredSiswa.length;
            if (total === 0) {
                alert("Tidak ada siswa yang terpilih untuk diunduh!");
                return;
            }

            if (!confirm(`Apakah Anda yakin ingin mengunduh ${total} rapor siswa dalam bentuk ZIP?`)) {
                return;
            }

            // Simpan status tombol asli
            const originalContent = btnDownloadAllRapor.innerHTML;
            btnDownloadAllRapor.disabled = true;
            btnDownloadAllRapor.innerHTML = `<i class="ph ph-spinner ph-spin text-lg"></i> Mengambil data...`;

            try {
                // 3. Preload data pendukung secara bulk untuk optimasi performa (menghindari N+1 query)
                const [
                    materiList,
                    teachersList,
                    tahfizhRecordsAll,
                    bilqolamRecordsAll,
                    doaRecordsAll,
                    tathbiqRecordsAll
                ] = await Promise.all([
                    pb.collection("materi").getFullList({ sort: "category,materi" }),
                    pb.collection("users").getFullList().catch(() => []),
                    pb.collection("nilai_tahfizh").getFullList(),
                    pb.collection("bilqolam").getFullList(),
                    pb.collection("nilai_doa").getFullList(),
                    pb.collection("nilai_tathbiq").getFullList()
                ]);

                // Helper untuk mengelompokkan record berdasarkan siswa
                const groupRecordsBySiswa = (records) => {
                    const map = {};
                    records.forEach(r => {
                        if (!map[r.siswa]) map[r.siswa] = [];
                        map[r.siswa].push(r);
                    });
                    return map;
                };

                const tahfizhMap = groupRecordsBySiswa(tahfizhRecordsAll);
                const bilqolamMap = groupRecordsBySiswa(bilqolamRecordsAll);
                const doaMap = groupRecordsBySiswa(doaRecordsAll);
                const tathbiqMap = groupRecordsBySiswa(tathbiqRecordsAll);

                // 4. Inisialisasi JSZip
                const zip = new JSZip();

                // 5. Generate PDF untuk setiap siswa
                for (let i = 0; i < total; i++) {
                    const student = filteredSiswa[i];
                    btnDownloadAllRapor.innerHTML = `<i class="ph ph-spinner ph-spin text-lg"></i> Rapor ${i + 1}/${total} (${Math.round(((i + 1) / total) * 100)}%)`;

                    const preloadedData = {
                        student: student,
                        materiList: materiList,
                        tahfizhRecords: tahfizhMap[student.id] || [],
                        bilqolamRecords: bilqolamMap[student.id] || [],
                        doaRecords: doaMap[student.id] || [],
                        tathbiqRecords: tathbiqMap[student.id] || [],
                        teachersList: teachersList
                    };

                    try {
                        const doc = await window.generatePDFDocument(student.id, preloadedData);
                        const pdfBlob = doc.output('blob');
                        
                        // Buat nama file yang aman dari karakter aneh
                        const safeName = (student.nama_siswa || "Siswa").replace(/[/\\?%*:|"<>\s]+/g, "_");
                        const safeClass = (student.kelas || "Kelas").replace(/[/\\?%*:|"<>\s]+/g, "_");
                        const filename = `Rapor_${safeClass}_${safeName}.pdf`;

                        zip.file(filename, pdfBlob);
                    } catch (pdfErr) {
                        console.error(`Gagal membuat PDF untuk siswa ${student.nama_siswa}:`, pdfErr);
                    }

                    // Berikan jeda 10ms agar main thread browser merender UI dan GC dapat membersihkan memori
                    await new Promise(resolve => setTimeout(resolve, 10));
                }

                // 6. Generate ZIP file dan download
                btnDownloadAllRapor.innerHTML = `<i class="ph ph-spinner ph-spin text-lg"></i> Membuat ZIP...`;
                const zipBlob = await zip.generateAsync({ 
                    type: 'blob',
                    compression: 'STORE' // PDF sudah dikompres, simpan langsung untuk menghemat RAM & CPU
                });
                
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                
                // Judul ZIP menggunakan filter kelas/kelompok jika ada agar informatif
                let zipName = "Rapor_Mengaji";
                if (fKelas) {
                    zipName += `_Kelas_${fKelas.replace(/[/\\?%*:|"<>\s]+/g, "_")}`;
                }
                if (fKelompok) {
                    zipName += `_${fKelompok.replace(/[/\\?%*:|"<>\s]+/g, "_")}`;
                }
                zipName += `_${new Date().getFullYear()}.zip`;

                a.download = zipName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (err) {
                console.error("Gagal mendownload semua rapor:", err);
                alert("Terjadi kesalahan saat mengunduh semua rapor: " + err.message);
            } finally {
                // Kembalikan tombol ke keadaan semula
                btnDownloadAllRapor.disabled = false;
                btnDownloadAllRapor.innerHTML = originalContent;
            }
        });
    }
});
