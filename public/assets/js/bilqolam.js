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
      const avg = Math.round(((record.tajwid || 0) + (record.fashahah || 0) + (record.lagu || 0)) / 3);
      spanStatus.classList.add("bg-emeraldDeep", "text-white");
      spanStatus.textContent = `${record.jilid || "-"} (${avg}%)`;
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
  
  if (record) {
    bilqolamForm.elements.jilid.value = record.jilid || "";
    bilqolamForm.elements.tajwid.value = record.tajwid ?? "";
    bilqolamForm.elements.fashahah.value = record.fashahah ?? "";
    bilqolamForm.elements.lagu.value = record.lagu ?? "";
  }
  
  const deskripsiContainer = document.querySelector("[data-deskripsi-container]");
  const deskripsiInput = bilqolamForm.elements.deskripsi_bilqolam;
  
  if (siswa.inklusif === "Ya") {
    if (deskripsiContainer) deskripsiContainer.classList.remove("hidden");
    if (deskripsiInput) {
      deskripsiInput.value = siswa.deskripsi_bilqolam || "";
      deskripsiInput.required = true;
    }
  } else {
    if (deskripsiContainer) deskripsiContainer.classList.add("hidden");
    if (deskripsiInput) {
      deskripsiInput.value = "";
      deskripsiInput.required = false;
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
  const payload = {
    siswa: siswaId,
    jilid: bilqolamForm.elements.jilid.value,
    tajwid: Number(bilqolamForm.elements.tajwid.value),
    fashahah: Number(bilqolamForm.elements.fashahah.value),
    lagu: Number(bilqolamForm.elements.lagu.value),
  };

  setFormLoading(true);
  setBilqolamFormStatus(recordId ? "Menyimpan perubahan..." : "Menyimpan data...");

  try {
    const promises = [];
    if (recordId) {
      promises.push(pb.collection("bilqolam").update(recordId, payload));
    } else {
      promises.push(pb.collection("bilqolam").create(payload));
    }

    const siswa = bilqolamSiswaCache.find(s => s.id === siswaId);
    if (siswa && siswa.inklusif === "Ya") {
      const deskripsi = bilqolamForm.elements.deskripsi_bilqolam.value || "";
      promises.push(
        pb.collection("siswa").update(siswaId, { deskripsi_bilqolam: deskripsi }, { requestKey: null })
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
