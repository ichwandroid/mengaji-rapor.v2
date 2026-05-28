const bilqolamTable = document.querySelector("[data-bilqolam-table]");
const bilqolamStatus = document.querySelector("[data-bilqolam-status]");
const bilqolamModal = document.querySelector("[data-bilqolam-modal]");
const bilqolamModalTitle = document.querySelector("[data-bilqolam-modal-title]");
const closeBilqolamModalButtons = document.querySelectorAll("[data-close-bilqolam-modal]");
const bilqolamForm = document.querySelector("[data-bilqolam-form]");
const bilqolamFormStatus = document.querySelector("[data-bilqolam-form-status]");
const bilqolamFormSubmit = document.querySelector("[data-bilqolam-form-submit]");
const bilqolamIdInput = document.querySelector("[data-bilqolam-id]");
const bilqolamSiswaIdInput = document.querySelector("[data-bilqolam-siswa-id]");

const filterNama = document.querySelector("[data-bilqolam-filter-nama]");
const filterKelas = document.querySelector("[data-bilqolam-filter-kelas]");
const filterKelompok = document.querySelector("[data-bilqolam-filter-kelompok]");
const filterShift = document.querySelector("[data-bilqolam-filter-shift]");
const filterSort = document.querySelector("[data-bilqolam-filter-sort]");
const resetFilterBtn = document.querySelector("[data-reset-bilqolam-filter]");

let bilqolamCache = [];
let bilqolamSiswaCache = [];

function setBilqolamStatus(message, tone = "info") {
  if (!bilqolamStatus) return;
  bilqolamStatus.textContent = message;
  bilqolamStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  bilqolamStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setBilqolamFormStatus(message, tone = "info") {
  if (!bilqolamFormStatus) return;
  bilqolamFormStatus.textContent = message;
  bilqolamFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  bilqolamFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function renderBilqolamRows(filteredSiswa) {
  if (!bilqolamTable) return;
  const colspan = (isAdmin() || isGPQ()) ? 4 : 3;

  bilqolamTable.innerHTML = "";

  if (!filteredSiswa.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55 text-center font-semibold";
    td.colSpan = colspan;
    td.textContent = "Tidak ada data siswa ditemukan.";
    tr.appendChild(td);
    bilqolamTable.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();

  filteredSiswa.forEach((siswa) => {
    const tr = document.createElement("tr");
    tr.className = "transition hover:bg-parchment/60";

    // Column 1: Nama Siswa
    const tdNama = document.createElement("td");
    tdNama.className = "px-4 py-4 font-bold text-emeraldDeep";
    tdNama.textContent = siswa.nama_siswa;
    tr.appendChild(tdNama);

    // Column 2: Kelas
    const tdKelas = document.createElement("td");
    tdKelas.className = "px-4 py-4 font-semibold text-ink/65";
    tdKelas.textContent = siswa.kelas || "-";
    tr.appendChild(tdKelas);

    // Column 3: Status / Jilid
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-4 py-4";

    const spanStatus = document.createElement("span");
    spanStatus.className = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold";

    const record = bilqolamCache.find((r) => r.siswa === siswa.id);

    if (record) {
      if (siswa.status === "Pasca") {
        spanStatus.classList.add("bg-emeraldDeep", "text-white");
        spanStatus.textContent = `Tadarus: ${record.tadarus ?? "-"}, B.Arab: ${record.bahasa_arab ?? "-"}`;
      } else {
        const avg = Math.round(((record.tajwid || 0) + (record.fashahah || 0) + (record.lagu || 0)) / 3);
        spanStatus.classList.add("bg-emeraldDeep", "text-white");
        spanStatus.textContent = `${record.jilid || "-"} (${avg}%)`;
      }
    } else {
      spanStatus.classList.add("bg-ink/10", "text-ink/50");
      spanStatus.textContent = "Belum Dinilai";
    }

    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    // Column 4: Nilai button (Admin or GPQ only)
    if (isAdmin() || isGPQ()) {
      const tdAction = document.createElement("td");
      tdAction.className = "px-4 py-4";

      const divAction = document.createElement("div");
      divAction.className = "flex items-center gap-2";

      const button = document.createElement("button");
      button.setAttribute("data-grade-siswa", siswa.id);
      button.className = "rounded-[8px] border border-emeraldDeep/10 bg-white px-3 py-2 text-xs font-extrabold text-emeraldDeep transition hover:border-dateGold/50";
      button.type = "button";
      button.textContent = "Nilai";

      divAction.appendChild(button);
      tdAction.appendChild(divAction);
      tr.appendChild(tdAction);
    }

    fragment.appendChild(tr);
  });

  bilqolamTable.appendChild(fragment);
}

function applyBilqolamFilter() {
  const fNama = String(filterNama?.value || "").trim().toLowerCase();
  const fKelas = String(filterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(filterKelompok?.value || "").trim();
  const fShift = String(filterShift?.value || "").trim();
  const fSort = filterSort?.value || "az";

  let filtered = bilqolamSiswaCache.filter((siswa) => {
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

  filtered.sort((a, b) => {
    const nameA = (a.nama_siswa || "").toLowerCase();
    const nameB = (b.nama_siswa || "").toLowerCase();
    
    if (fSort === "az") {
      return nameA.localeCompare(nameB, "id");
    } else {
      return nameB.localeCompare(nameA, "id");
    }
  });

  renderBilqolamRows(filtered);
  const total = bilqolamSiswaCache.length;
  if (filtered.length === total) {
    setBilqolamStatus(`Menampilkan seluruh ${total} siswa`, "success");
  } else {
    setBilqolamStatus(`Menampilkan ${filtered.length} dari ${total} siswa`, "success");
  }
}

async function loadInitialData() {
  if (!bilqolamTable) return;
  setBilqolamStatus("Memuat data...");
  try {
    const [siswaRecords, bilqolamRecords] = await Promise.all([
      fetchSiswaRecords().then(filterSiswaForCurrentRole),
      pb.collection("bilqolam").getFullList({ sort: "-created" })
    ]);
    
    bilqolamSiswaCache = siswaRecords;
    bilqolamCache = bilqolamRecords;
    
    applyBilqolamFilter();
  } catch (error) {
    console.error("Gagal memuat data:", error);
    setBilqolamStatus(error?.response?.message || error?.message || "Data belum bisa dimuat.", "error");
  }
}

async function reloadBilqolamData() {
  try {
    const records = await pb.collection("bilqolam").getFullList({ sort: "-created" });
    bilqolamCache = records;
    applyBilqolamFilter();
  } catch (error) {
    console.error("Gagal memuat ulang data bilqolam:", error);
  }
}

function openBilqolamModal(siswaId) {
  if (!bilqolamModal || !bilqolamForm) return;

  const siswa = bilqolamSiswaCache.find(s => s.id === siswaId);
  if (!siswa) return;

  const record = bilqolamCache.find(r => r.siswa === siswa.id);

  bilqolamForm.reset();
  bilqolamIdInput.value = record?.id || "";
  bilqolamSiswaIdInput.value = siswa.id;
  bilqolamModalTitle.textContent = `Penilaian Bilqolam: ${siswa.nama_siswa} (Kelas ${siswa.kelas || '-'})`;
  
  const standarContainer = document.querySelector("[data-standar-fields]");
  const pascaContainer = document.querySelector("[data-pasca-fields]");

  if (siswa.status === "Pasca") {
    if (standarContainer) standarContainer.classList.add("hidden");
    if (pascaContainer) pascaContainer.classList.remove("hidden");
  } else {
    if (standarContainer) standarContainer.classList.remove("hidden");
    if (pascaContainer) pascaContainer.classList.add("hidden");
  }

  if (record) {
    bilqolamForm.elements.jilid.value = record.jilid || "";
    bilqolamForm.elements.tajwid.value = record.tajwid ?? "";
    bilqolamForm.elements.fashahah.value = record.fashahah ?? "";
    bilqolamForm.elements.lagu.value = record.lagu ?? "";
    bilqolamForm.elements.tadarus.value = record.tadarus ?? "";
    bilqolamForm.elements.bahasa_arab.value = record.bahasa_arab ?? "";
  }
  
  const deskripsiContainer = document.querySelector("[data-deskripsi-container]");
  
  if (siswa.inklusif === "Ya") {
    if (deskripsiContainer) deskripsiContainer.classList.remove("hidden");
    if (bilqolamForm.elements.deskripsi_bilqolam_tajwid) {
      bilqolamForm.elements.deskripsi_bilqolam_tajwid.value = siswa.deskripsi_bilqolam_tajwid || "";
      bilqolamForm.elements.deskripsi_bilqolam_tajwid.required = true;
    }
    if (bilqolamForm.elements.deskripsi_bilqolam_fashahah) {
      bilqolamForm.elements.deskripsi_bilqolam_fashahah.value = siswa.deskripsi_bilqolam_fashahah || "";
      bilqolamForm.elements.deskripsi_bilqolam_fashahah.required = true;
    }
    if (bilqolamForm.elements.deskripsi_bilqolam_lagu) {
      bilqolamForm.elements.deskripsi_bilqolam_lagu.value = siswa.deskripsi_bilqolam_lagu || "";
      bilqolamForm.elements.deskripsi_bilqolam_lagu.required = true;
    }
  } else {
    if (deskripsiContainer) deskripsiContainer.classList.add("hidden");
    if (bilqolamForm.elements.deskripsi_bilqolam_tajwid) {
      bilqolamForm.elements.deskripsi_bilqolam_tajwid.value = "";
      bilqolamForm.elements.deskripsi_bilqolam_tajwid.required = false;
    }
    if (bilqolamForm.elements.deskripsi_bilqolam_fashahah) {
      bilqolamForm.elements.deskripsi_bilqolam_fashahah.value = "";
      bilqolamForm.elements.deskripsi_bilqolam_fashahah.required = false;
    }
    if (bilqolamForm.elements.deskripsi_bilqolam_lagu) {
      bilqolamForm.elements.deskripsi_bilqolam_lagu.value = "";
      bilqolamForm.elements.deskripsi_bilqolam_lagu.required = false;
    }
  }
  
  bilqolamFormStatus?.classList.add("hidden");
  bilqolamModal.classList.remove("hidden");
  bilqolamModal.classList.add("flex");
}

function closeBilqolamModal() {
  if (!bilqolamModal) return;
  bilqolamModal.classList.add("hidden");
  bilqolamModal.classList.remove("flex");
}

async function submitBilqolamForm(event) {
  event.preventDefault();

  const recordId = bilqolamIdInput.value;
  const siswaId = bilqolamSiswaIdInput.value;
  const siswa = bilqolamSiswaCache.find(s => s.id === siswaId);
  const payload = {
    siswa: siswaId,
    jilid: bilqolamForm.elements.jilid.value,
  };
  
  if (siswa && siswa.status === "Pasca") {
    payload.tadarus = bilqolamForm.elements.tadarus.value ? Number(bilqolamForm.elements.tadarus.value) : null;
    payload.bahasa_arab = bilqolamForm.elements.bahasa_arab.value ? Number(bilqolamForm.elements.bahasa_arab.value) : null;
    payload.tajwid = null;
    payload.fashahah = null;
    payload.lagu = null;
  } else {
    payload.tajwid = bilqolamForm.elements.tajwid.value ? Number(bilqolamForm.elements.tajwid.value) : null;
    payload.fashahah = bilqolamForm.elements.fashahah.value ? Number(bilqolamForm.elements.fashahah.value) : null;
    payload.lagu = bilqolamForm.elements.lagu.value ? Number(bilqolamForm.elements.lagu.value) : null;
    payload.tadarus = null;
    payload.bahasa_arab = null;
  }

  setFormLoading(true);
  setBilqolamFormStatus(recordId ? "Menyimpan perubahan..." : "Menyimpan data...");

  try {
    const promises = [];
    if (recordId) {
      promises.push(pb.collection("bilqolam").update(recordId, payload));
    } else {
      promises.push(pb.collection("bilqolam").create(payload));
    }

    const siswaRecord = bilqolamSiswaCache.find(s => s.id === siswaId);
    if (siswaRecord && siswaRecord.inklusif === "Ya") {
      const deskripsiTajwid = bilqolamForm.elements.deskripsi_bilqolam_tajwid?.value || "";
      const deskripsiFashahah = bilqolamForm.elements.deskripsi_bilqolam_fashahah?.value || "";
      const deskripsiLagu = bilqolamForm.elements.deskripsi_bilqolam_lagu?.value || "";
      promises.push(
        pb.collection("siswa").update(siswaId, { 
          deskripsi_bilqolam_tajwid: deskripsiTajwid,
          deskripsi_bilqolam_fashahah: deskripsiFashahah,
          deskripsi_bilqolam_lagu: deskripsiLagu 
        }, { requestKey: null })
          .then(updatedSiswa => {
             const idx = bilqolamSiswaCache.findIndex(s => s.id === siswaId);
             if (idx !== -1) bilqolamSiswaCache[idx] = updatedSiswa;
          })
      );
    }
    
    await Promise.all(promises);
    setBilqolamFormStatus("Data berhasil disimpan.", "success");
    await reloadBilqolamData();
    setTimeout(closeBilqolamModal, 450);
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    setBilqolamFormStatus(error?.response?.message || "Data belum bisa disimpan.", "error");
  } finally {
    setFormLoading(false);
  }
}

// Event Listeners
[filterNama, filterKelas, filterKelompok, filterShift, filterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applyBilqolamFilter);
    el.addEventListener("change", applyBilqolamFilter);
  }
});

resetFilterBtn?.addEventListener("click", () => {
  if (filterNama) filterNama.value = "";
  if (filterKelas) filterKelas.value = "";
  if (filterKelompok) filterKelompok.value = "";
  if (filterShift) filterShift.value = "";
  if (filterSort) filterSort.value = "az";
  applyBilqolamFilter();
});

closeBilqolamModalButtons.forEach((btn) => btn.addEventListener("click", closeBilqolamModal));
bilqolamModal?.addEventListener("click", (event) => {
  if (event.target === bilqolamModal) closeBilqolamModal();
});
bilqolamForm?.addEventListener("submit", submitBilqolamForm);

bilqolamTable?.addEventListener("click", (event) => {
  const gradeButton = event.target.closest("[data-grade-siswa]");

  if (gradeButton) {
    openBilqolamModal(gradeButton.dataset.gradeSiswa);
  }
});

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  if (bilqolamTable) {
    setTimeout(async () => {
      if (pb?.authStore?.isValid) {
        await loadInitialData();
      }
    }, 500); 
  }
});


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

        const headers = ["NIS", "NAMA SISWA", "KELAS", "JILID", "TAJWID", "FASHAHAH", "LAGU", "TADARUS", "BAHASA ARAB"];
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
                record && record.lagu !== null ? record.lagu : "",
                record && record.tadarus !== null ? record.tadarus : "",
                record && record.bahasa_arab !== null ? record.bahasa_arab : ""
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

                let jilid = (row[3] || "").trim();
                let tajwid = row[4] ? parseInt(row[4], 10) : null;
                let fashahah = row[5] ? parseInt(row[5], 10) : null;
                let lagu = row[6] ? parseInt(row[6], 10) : null;
                let tadarus = row[7] ? parseInt(row[7], 10) : null;
                let bahasa_arab = row[8] ? parseInt(row[8], 10) : null;

                if (isNaN(tajwid)) tajwid = null;
                if (isNaN(fashahah)) fashahah = null;
                if (isNaN(lagu)) lagu = null;
                if (isNaN(tadarus)) tadarus = null;
                if (isNaN(bahasa_arab)) bahasa_arab = null;

                const record = bilqolamCache.find(r => r.siswa === siswa.id);

                if (jilid === "" && record && record.jilid) {
                    jilid = record.jilid;
                }

                if (jilid === "" && tajwid === null && fashahah === null && lagu === null && tadarus === null && bahasa_arab === null) continue;

                if (record) {
                    if (record.jilid !== jilid || record.tajwid !== tajwid || record.fashahah !== fashahah || record.lagu !== lagu || record.tadarus !== tadarus || record.bahasa_arab !== bahasa_arab) {
                        updates.push({ id: record.id, payload: { jilid, tajwid, fashahah, lagu, tadarus, bahasa_arab } });
                    }
                } else {
                    creates.push({ siswa: siswa.id, jilid, tajwid, fashahah, lagu, tadarus, bahasa_arab });
                }
            }

            setBilqolamStatus(`Menyimpan ${updates.length + creates.length} data...`, "info");

            for (const item of updates) {
                await pb.collection("bilqolam").update(item.id, item.payload);
            }
            for (const item of creates) {
                await pb.collection("bilqolam").create(item);
            }

            alert(`Berhasil mengunggah ${updates.length + creates.length} data Bilqolam.`);
            
            // Reload data
            if (typeof reloadBilqolamData === 'function') { await reloadBilqolamData(); } else { window.location.reload(); }

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses file CSV.");
            setBilqolamStatus("Gagal memproses CSV.", "error");
        } finally {
            inputUploadCSV.value = "";
        }
    });
}
