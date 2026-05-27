const doaHarianTable = document.querySelector("[data-doa-harian-table]");
const doaHarianStatus = document.querySelector("[data-doa-harian-status]");
const doaHarianModal = document.querySelector("[data-doa-harian-modal]");
const doaHarianModalTitle = document.querySelector("[data-doa-harian-modal-title]");
const closeDoaHarianModalButtons = document.querySelectorAll("[data-close-doa-harian-modal]");
const doaHarianForm = document.querySelector("[data-doa-harian-form]");
const doaHarianFormStatus = document.querySelector("[data-doa-harian-form-status]");
const doaHarianFormSubmit = document.querySelector("[data-doa-harian-form-submit]");
const doaHarianSiswaIdInput = document.querySelector("[data-doa-harian-siswa-id]");
const doaHarianList = document.querySelector("[data-doa-harian-list]");

const filterNama = document.querySelector("[data-doa-harian-filter-nama]");
const filterKelas = document.querySelector("[data-doa-harian-filter-kelas]");
const filterKelompok = document.querySelector("[data-doa-harian-filter-kelompok]");
const filterShift = document.querySelector("[data-doa-harian-filter-shift]");
const filterSort = document.querySelector("[data-doa-harian-filter-sort]");
const resetFilterBtn = document.querySelector("[data-reset-doa-harian-filter]");

let doaHarianCache = []; // records of nilai_doa
let doaHarianSiswaCache = []; // records of siswa
let doaHarianMateriCache = []; // records of materi category doa-harian

function setDoaHarianStatus(message, tone = "info") {
  if (!doaHarianStatus) return;
  doaHarianStatus.textContent = message;
  doaHarianStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  doaHarianStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setDoaHarianFormStatus(message, tone = "info") {
  if (!doaHarianFormStatus) return;
  doaHarianFormStatus.textContent = message;
  doaHarianFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  doaHarianFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function renderDoaHarianRows(filteredSiswa) {
  if (!doaHarianTable) return;
  const colspan = (isAdmin() || isGPAI()) ? 4 : 3;

  doaHarianTable.innerHTML = "";

  if (!filteredSiswa.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55 text-center font-semibold";
    td.colSpan = colspan;
    td.textContent = "Tidak ada data siswa ditemukan.";
    tr.appendChild(td);
    doaHarianTable.appendChild(tr);
    return;
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";

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

    // Column 3: Status / Graded Doa
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-4 py-4";

    const spanStatus = document.createElement("span");
    spanStatus.className = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold";

    const applicableMateri = doaHarianMateriCache.filter((m) => {
      return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
             String(m.semester).toLowerCase() === currentSemester.toLowerCase();
    });

    const studentNilai = doaHarianCache.filter((n) => n.siswa === siswa.id && applicableMateri.some((m) => m.id === n.materi));

    const totalDoa = applicableMateri.length;
    const gradedDoa = studentNilai.length;
    let avgScore = 0;
    if (gradedDoa > 0) {
      avgScore = Math.round(studentNilai.reduce((sum, n) => sum + (n.nilai || 0), 0) / gradedDoa);
    }

    const scoreBadgeColor = gradedDoa === totalDoa && totalDoa > 0
      ? ["bg-emeraldDeep", "text-white"]
      : gradedDoa > 0
        ? ["bg-dateGold", "text-white"]
        : ["bg-ink/10", "text-ink/50"];

    spanStatus.classList.add(...scoreBadgeColor);
    spanStatus.textContent = `${gradedDoa}/${totalDoa} Do'a (${avgScore}%)`;

    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    // Column 4: Nilai button (Admin or GPAI only)
    if (isAdmin() || isGPAI()) {
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

  doaHarianTable.appendChild(fragment);
}

function applyDoaHarianFilter() {
  const fNama = String(filterNama?.value || "").trim().toLowerCase();
  const fKelas = String(filterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(filterKelompok?.value || "").trim();
  const fShift = String(filterShift?.value || "").trim();
  const fSort = filterSort?.value || "az";

  let filtered = doaHarianSiswaCache.filter((siswa) => {
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

  renderDoaHarianRows(filtered);
  const total = doaHarianSiswaCache.length;
  if (filtered.length === total) {
    setDoaHarianStatus(`Menampilkan seluruh ${total} siswa`, "success");
  } else {
    setDoaHarianStatus(`Menampilkan ${filtered.length} dari ${total} siswa`, "success");
  }
}

async function loadInitialData() {
  if (!doaHarianTable) return;
  setDoaHarianStatus("Memuat data...");
  try {
    const [siswaRecords, materiRecords, nilaiRecords] = await Promise.all([
      fetchSiswaRecords().then(filterSiswaForCurrentRole),
      pb.collection("materi").getFullList({ filter: 'category="doa-harian"', sort: "materi" }),
      pb.collection("nilai_doa").getFullList({ sort: "-created" })
    ]);
    
    doaHarianSiswaCache = siswaRecords;
    doaHarianMateriCache = materiRecords;
    doaHarianCache = nilaiRecords;
    
    applyDoaHarianFilter();
  } catch (error) {
    console.error("Gagal memuat data:", error);
    setDoaHarianStatus(error?.response?.message || error?.message || "Data belum bisa dimuat.", "error");
  }
}

async function reloadNilaiData() {
  try {
    const nilaiRecords = await pb.collection("nilai_doa").getFullList({ sort: "-created" });
    doaHarianCache = nilaiRecords;
    applyDoaHarianFilter();
  } catch (error) {
    console.error("Gagal memuat ulang data nilai:", error);
  }
}

function openDoaHarianModal(siswaId) {
  if (!doaHarianModal || !doaHarianForm || !doaHarianList) return;

  const siswa = doaHarianSiswaCache.find(s => s.id === siswaId);
  if (!siswa) return;

  doaHarianForm.reset();
  doaHarianSiswaIdInput.value = siswa.id;
  doaHarianModalTitle.textContent = `Penilaian Do'a: ${siswa.nama_siswa} (Kelas ${siswa.kelas || '-'})`;
  
  const deskripsiContainer = document.querySelector("[data-deskripsi-container]");
  const deskripsiInput = doaHarianForm.elements.deskripsi_doa;
  
  if (siswa.inklusif === "Ya") {
    if (deskripsiContainer) deskripsiContainer.classList.remove("hidden");
    if (deskripsiInput) {
      deskripsiInput.value = siswa.deskripsi_doa || "";
      deskripsiInput.required = true;
    }
  } else {
    if (deskripsiContainer) deskripsiContainer.classList.add("hidden");
    if (deskripsiInput) {
      deskripsiInput.value = "";
      deskripsiInput.required = false;
    }
  }
  
  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
  
  const applicableMateri = doaHarianMateriCache.filter(m => {
    return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
           String(m.semester).toLowerCase() === currentSemester.toLowerCase();
  });

  if (applicableMateri.length === 0) {
    doaHarianList.innerHTML = "";
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "rounded-[8px] bg-red-50 p-4 text-sm font-semibold text-red-700";
    emptyDiv.textContent = `Tidak ada materi Do'a Sehari-hari untuk kelas ${siswa.kelas || "-"} di semester ini.`;
    doaHarianList.appendChild(emptyDiv);
    doaHarianFormSubmit.disabled = true;
  } else {
    doaHarianList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    applicableMateri.forEach((m) => {
      const existingNilai = doaHarianCache.find(n => n.siswa === siswa.id && n.materi === m.id);
      const isGraded = !!existingNilai;
      const score = isGraded ? existingNilai.nilai : "";

      const label = document.createElement("label");
      label.className = `flex items-center gap-4 rounded-[8px] border border-emeraldDeep/10 bg-white p-4 transition hover:border-jade/50 cursor-pointer ${isGraded ? 'ring-2 ring-emeraldDeep/20' : ''}`;

      // Checkbox input
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = `materi_check_${m.id}`;
      checkbox.value = m.id;
      checkbox.className = "h-5 w-5 rounded border-emeraldDeep/20 text-emeraldDeep focus:ring-emeraldDeep";
      checkbox.checked = isGraded;
      checkbox.onchange = function() {
        label.classList.toggle('ring-2', this.checked);
        label.classList.toggle('ring-emeraldDeep/20', this.checked);
        const input = label.querySelector('input[type=number]');
        if (this.checked) {
          input.focus();
        } else {
          input.value = '';
        }
      };
      label.appendChild(checkbox);

      // Materi name
      const spanMateri = document.createElement("span");
      spanMateri.className = "flex-1 text-sm font-bold text-ink/75";
      spanMateri.textContent = m.materi;
      label.appendChild(spanMateri);

      // Score input div wrapper
      const divInput = document.createElement("div");
      divInput.className = "flex items-center gap-2";
      divInput.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };

      const scoreInput = document.createElement("input");
      scoreInput.type = "number";
      scoreInput.name = `materi_nilai_${m.id}`;
      scoreInput.value = score;
      scoreInput.className = "h-9 w-16 rounded-[6px] border border-emeraldDeep/10 bg-white/80 px-2 text-center text-sm font-bold outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/15";
      scoreInput.min = "0";
      scoreInput.max = "100";
      scoreInput.placeholder = "0";
      scoreInput.oninput = function() {
        const cb = label.querySelector('input[type=checkbox]');
        cb.checked = !!this.value;
        label.classList.toggle('ring-2', cb.checked);
        label.classList.toggle('ring-emeraldDeep/20', cb.checked);
      };
      divInput.appendChild(scoreInput);

      const spanSlash = document.createElement("span");
      spanSlash.className = "text-xs font-bold text-ink/40";
      spanSlash.textContent = "/ 100";
      divInput.appendChild(spanSlash);

      label.appendChild(divInput);

      // Hidden record ID if graded
      if (isGraded) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = `materi_record_${m.id}`;
        hiddenInput.value = existingNilai.id;
        label.appendChild(hiddenInput);
      }

      fragment.appendChild(label);
    });

    doaHarianList.appendChild(fragment);
    doaHarianFormSubmit.disabled = false;
  }
  
  doaHarianFormStatus?.classList.add("hidden");
  doaHarianModal.classList.remove("hidden");
  doaHarianModal.classList.add("flex");
}

function closeDoaHarianModal() {
  if (!doaHarianModal) return;
  doaHarianModal.classList.add("hidden");
  doaHarianModal.classList.remove("flex");
}

async function submitDoaHarianForm(event) {
  event.preventDefault();

  const siswaId = doaHarianSiswaIdInput.value;
  const formData = new FormData(doaHarianForm);
  const promises = [];

  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
  const siswa = doaHarianSiswaCache.find(s => s.id === siswaId);
  const applicableMateri = doaHarianMateriCache.filter(m => getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) && String(m.semester).toLowerCase() === currentSemester.toLowerCase());

  setFormLoading(true);
  setDoaHarianFormStatus("Menyimpan penilaian...", "info");

  try {
    for (const m of applicableMateri) {
      const isChecked = formData.get(`materi_check_${m.id}`);
      const score = formData.get(`materi_nilai_${m.id}`);
      const recordId = formData.get(`materi_record_${m.id}`);

      if (isChecked && score !== "") {
        const payload = {
          siswa: siswaId,
          materi: m.id,
          nilai: Number(score)
        };
        if (recordId) {
          promises.push(pb.collection("nilai_doa").update(recordId, payload, { requestKey: null }));
        } else {
          promises.push(pb.collection("nilai_doa").create(payload, { requestKey: null }));
        }
      } else if (recordId) {
        // Unchecked or score emptied -> delete the record
        promises.push(pb.collection("nilai_doa").delete(recordId, { requestKey: null }));
      }
    }

    if (siswa.inklusif === "Ya") {
      const deskripsi = formData.get("deskripsi_doa") || "";
      promises.push(
        pb.collection("siswa").update(siswaId, { deskripsi_doa: deskripsi }, { requestKey: null })
          .then(updatedSiswa => {
             const idx = doaHarianSiswaCache.findIndex(s => s.id === siswaId);
             if (idx !== -1) doaHarianSiswaCache[idx] = updatedSiswa;
          })
      );
    }

    await Promise.all(promises);
    setDoaHarianFormStatus("Penilaian berhasil disimpan.", "success");
    await reloadNilaiData();
    setTimeout(closeDoaHarianModal, 450);
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    setDoaHarianFormStatus(error?.response?.message || "Data belum bisa disimpan.", "error");
  } finally {
    setFormLoading(false);
  }
}

// Event Listeners
[filterNama, filterKelas, filterKelompok, filterShift, filterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applyDoaHarianFilter);
    el.addEventListener("change", applyDoaHarianFilter);
  }
});

resetFilterBtn?.addEventListener("click", () => {
  if (filterNama) filterNama.value = "";
  if (filterKelas) filterKelas.value = "";
  if (filterKelompok) filterKelompok.value = "";
  if (filterShift) filterShift.value = "";
  if (filterSort) filterSort.value = "az";
  applyDoaHarianFilter();
});

closeDoaHarianModalButtons.forEach((btn) => btn.addEventListener("click", closeDoaHarianModal));
doaHarianModal?.addEventListener("click", (event) => {
  if (event.target === doaHarianModal) closeDoaHarianModal();
});
doaHarianForm?.addEventListener("submit", submitDoaHarianForm);

doaHarianTable?.addEventListener("click", (event) => {
  const gradeButton = event.target.closest("[data-grade-siswa]");

  if (gradeButton) {
    openDoaHarianModal(gradeButton.dataset.gradeSiswa);
  }
});

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  if (doaHarianTable) {
    setTimeout(async () => {
      if (pb?.authStore?.isValid) {
        await loadInitialData();
      }
    }, 500); 
  }
});
