const tahfizhQuranTable = document.querySelector("[data-tahfizh-quran-table]");
const tahfizhQuranStatus = document.querySelector("[data-tahfizh-quran-status]");
const tahfizhQuranModal = document.querySelector("[data-tahfizh-quran-modal]");
const tahfizhQuranModalTitle = document.querySelector("[data-tahfizh-quran-modal-title]");
const closeTahfizhQuranModalButtons = document.querySelectorAll("[data-close-tahfizh-quran-modal]");
const tahfizhQuranForm = document.querySelector("[data-tahfizh-quran-form]");
const tahfizhQuranFormStatus = document.querySelector("[data-tahfizh-quran-form-status]");
const tahfizhQuranFormSubmit = document.querySelector("[data-tahfizh-quran-form-submit]");
const tahfizhQuranSiswaIdInput = document.querySelector("[data-tahfizh-quran-siswa-id]");
const tahfizhQuranList = document.querySelector("[data-tahfizh-quran-list]");

const filterNama = document.querySelector("[data-tahfizh-quran-filter-nama]");
const filterKelas = document.querySelector("[data-tahfizh-quran-filter-kelas]");
const filterKelompok = document.querySelector("[data-tahfizh-quran-filter-kelompok]");
const filterShift = document.querySelector("[data-tahfizh-quran-filter-shift]");
const filterSort = document.querySelector("[data-tahfizh-quran-filter-sort]");
const resetFilterBtn = document.querySelector("[data-reset-tahfizh-quran-filter]");

let tahfizhQuranCache = []; // records of nilai_tahfizh
let tahfizhQuranSiswaCache = []; // records of siswa
let tahfizhQuranMateriCache = []; // records of materi category tahfizh-quran

function setTahfizhQuranStatus(message, tone = "info") {
  if (!tahfizhQuranStatus) return;
  tahfizhQuranStatus.textContent = message;
  tahfizhQuranStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  tahfizhQuranStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setTahfizhQuranFormStatus(message, tone = "info") {
  if (!tahfizhQuranFormStatus) return;
  tahfizhQuranFormStatus.textContent = message;
  tahfizhQuranFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  tahfizhQuranFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function renderTahfizhQuranRows(filteredSiswa) {
  if (!tahfizhQuranTable) return;
  const colspan = (isAdmin() || isGPQ()) ? 4 : 3;

  tahfizhQuranTable.innerHTML = "";

  if (!filteredSiswa.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55 text-center font-semibold";
    td.colSpan = colspan;
    td.textContent = "Tidak ada data siswa ditemukan.";
    tr.appendChild(td);
    tahfizhQuranTable.appendChild(tr);
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

    // Column 3: Status / Graded Quran
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-4 py-4";

    const divStatus = document.createElement("div");
    divStatus.className = "flex flex-col items-start gap-1";

    const spanStatus = document.createElement("span");
    spanStatus.className = "inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-bold";

    const spanSub = document.createElement("span");
    spanSub.className = "text-[11px] font-semibold text-ink/45 px-1";

    const applicableMateri = tahfizhQuranMateriCache.filter((m) => {
      return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
             String(m.semester).toLowerCase() === currentSemester.toLowerCase();
    });

    const studentNilai = tahfizhQuranCache.filter((n) => n.siswa === siswa.id && applicableMateri.some((m) => m.id === n.materi));

    const totalSurat = applicableMateri.length;
    let totalAyat = 0;
    let memorizedAyat = 0;
    let completedSurat = 0;

    applicableMateri.forEach((m) => {
      const isMurojaah = m.materi.toLowerCase().includes("muroja");
      const tAyat = isMurojaah ? 1 : (Number(m.jumlah_ayat) || 0);
      totalAyat += tAyat;
      const sn = studentNilai.find((n) => n.materi === m.id);
      
      let mAyat = 0;
      if (sn) {
          if (isMurojaah && Number(sn.nilai) > 0) {
              mAyat = 1;
          } else {
              mAyat = Number(sn.nilai) || 0;
          }
      }
      
      memorizedAyat += mAyat;

      if (mAyat >= tAyat && tAyat > 0) {
        completedSurat++;
      }
    });

    let ayatPercentage = 0;
    if (totalAyat > 0) {
      ayatPercentage = Math.round((memorizedAyat / totalAyat) * 100);
    }

    const scoreBadgeColor = completedSurat === totalSurat && totalSurat > 0
      ? ["bg-emeraldDeep", "text-white"]
      : memorizedAyat > 0
        ? ["bg-dateGold", "text-white"]
        : ["bg-ink/10", "text-ink/50"];

    spanStatus.classList.add(...scoreBadgeColor);
    spanStatus.textContent = `${completedSurat}/${totalSurat} Surat (${ayatPercentage}%)`;

    spanSub.textContent = `${memorizedAyat} / ${totalAyat} Ayat`;

    divStatus.appendChild(spanStatus);
    divStatus.appendChild(spanSub);
    tdStatus.appendChild(divStatus);
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

  tahfizhQuranTable.appendChild(fragment);
}

function applyTahfizhQuranFilter() {
  const fNama = String(filterNama?.value || "").trim().toLowerCase();
  const fKelas = String(filterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(filterKelompok?.value || "").trim();
  const fShift = String(filterShift?.value || "").trim();
  const fSort = filterSort?.value || "az";

  let filtered = tahfizhQuranSiswaCache.filter((siswa) => {
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

  renderTahfizhQuranRows(filtered);
  const total = tahfizhQuranSiswaCache.length;
  if (filtered.length === total) {
    setTahfizhQuranStatus(`Menampilkan seluruh ${total} siswa`, "success");
  } else {
    setTahfizhQuranStatus(`Menampilkan ${filtered.length} dari ${total} siswa`, "success");
  }
}

async function loadInitialData() {
  if (!tahfizhQuranTable) return;
  setTahfizhQuranStatus("Memuat data...");
  try {
    const [siswaRecords, materiRecords, nilaiRecords] = await Promise.all([
      fetchSiswaRecords(),
      pb.collection("materi").getFullList({ filter: 'category="tahfizh-quran"', sort: "materi" }),
      pb.collection("nilai_tahfizh").getFullList({ sort: "-created" })
    ]);
    
    tahfizhQuranSiswaCache = siswaRecords;
    tahfizhQuranMateriCache = materiRecords;
    tahfizhQuranCache = nilaiRecords;
    
    applyTahfizhQuranFilter();
  } catch (error) {
    console.error("Gagal memuat data:", error);
    setTahfizhQuranStatus(error?.response?.message || error?.message || "Data belum bisa dimuat.", "error");
  }
}

async function reloadNilaiData() {
  try {
    const nilaiRecords = await pb.collection("nilai_tahfizh").getFullList({ sort: "-created" });
    tahfizhQuranCache = nilaiRecords;
    applyTahfizhQuranFilter();
  } catch (error) {
    console.error("Gagal memuat ulang data nilai:", error);
  }
}

function openTahfizhQuranModal(siswaId) {
  if (!tahfizhQuranModal || !tahfizhQuranForm || !tahfizhQuranList) return;

  const siswa = tahfizhQuranSiswaCache.find(s => s.id === siswaId);
  if (!siswa) return;

  tahfizhQuranForm.reset();
  tahfizhQuranSiswaIdInput.value = siswa.id;
  tahfizhQuranModalTitle.textContent = `Penilaian Tahfizh: ${siswa.nama_siswa} (Kelas ${siswa.kelas || '-'})`;
  
  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
  
  const applicableMateri = tahfizhQuranMateriCache.filter(m => {
    return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
           String(m.semester).toLowerCase() === currentSemester.toLowerCase();
  });

  if (applicableMateri.length === 0) {
    tahfizhQuranList.innerHTML = "";
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "rounded-[8px] bg-red-50 p-4 text-sm font-semibold text-red-700";
    emptyDiv.textContent = `Tidak ada materi Tahfizh Al-Qur'an untuk kelas ${siswa.kelas || "-"} di semester ini.`;
    tahfizhQuranList.appendChild(emptyDiv);
    tahfizhQuranFormSubmit.disabled = true;
  } else {
    tahfizhQuranList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    applicableMateri.forEach((m) => {
      const isMurojaah = m.materi.toLowerCase().includes("muroja");
      const existingNilai = tahfizhQuranCache.find(n => n.siswa === siswa.id && n.materi === m.id);
      const isGraded = !!existingNilai;
      const score = isGraded ? existingNilai.nilai : "";
      const tAyat = Number(m.jumlah_ayat) || 0;

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
          if (!input.value) input.value = String(tAyat);
          input.focus();
        } else {
          input.value = '';
        }
      };
      label.appendChild(checkbox);

      // Materi name & details
      const divInfo = document.createElement("div");
      divInfo.className = "flex flex-1 flex-col";

      const spanMateri = document.createElement("span");
      spanMateri.className = "text-sm font-bold text-ink/75";
      spanMateri.textContent = m.materi;
      divInfo.appendChild(spanMateri);

      const spanTotal = document.createElement("span");
      spanTotal.className = "text-xs font-semibold text-ink/40";
      spanTotal.textContent = isMurojaah ? `Total: MUMTAZ` : `Total: ${tAyat} Ayat`;
      divInfo.appendChild(spanTotal);

      label.appendChild(divInfo);

      // Score input div wrapper
      const divInput = document.createElement("div");
      divInput.className = "flex items-center gap-2";
      divInput.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };

      let scoreInput;

      if (isMurojaah) {
          scoreInput = document.createElement("select");
          scoreInput.name = `materi_nilai_${m.id}`;
          scoreInput.className = "h-9 w-32 rounded-[6px] border border-emeraldDeep/10 bg-white/80 px-2 text-sm font-bold outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/15";
          
          const options = [
              { label: "Pilih", value: "" },
              { label: "JAYYID JIDDAN", value: "86" },
              { label: "JAYYID", value: "75" },
              { label: "MAQBUL", value: "60" }
          ];
          
          options.forEach(opt => {
              const optionEl = document.createElement("option");
              optionEl.value = opt.value;
              optionEl.textContent = opt.label;
              if (String(score) === opt.value) optionEl.selected = true;
              scoreInput.appendChild(optionEl);
          });
      } else {
          scoreInput = document.createElement("input");
          scoreInput.type = "number";
          scoreInput.name = `materi_nilai_${m.id}`;
          scoreInput.value = score;
          scoreInput.className = "h-9 w-16 rounded-[6px] border border-emeraldDeep/10 bg-white/80 px-2 text-center text-sm font-bold outline-none transition focus:border-jade focus:ring-2 focus:ring-jade/15";
          scoreInput.min = "0";
          scoreInput.max = String(tAyat);
          scoreInput.placeholder = "0";
      }

      scoreInput.addEventListener('input', function() {
        const cb = label.querySelector('input[type=checkbox]');
        cb.checked = !!this.value;
        label.classList.toggle('ring-2', cb.checked);
        label.classList.toggle('ring-emeraldDeep/20', cb.checked);
      });
      scoreInput.addEventListener('change', function() {
        const cb = label.querySelector('input[type=checkbox]');
        cb.checked = !!this.value;
        label.classList.toggle('ring-2', cb.checked);
        label.classList.toggle('ring-emeraldDeep/20', cb.checked);
      });

      divInput.appendChild(scoreInput);

      if (!isMurojaah) {
          const spanSlash = document.createElement("span");
          spanSlash.className = "text-xs font-bold text-ink/40";
          spanSlash.textContent = `/ ${tAyat}`;
          divInput.appendChild(spanSlash);
      } else {
          const spanSlash = document.createElement("span");
          spanSlash.className = "text-xs font-bold text-ink/40";
          spanSlash.textContent = `/ MUMTAZ`;
          divInput.appendChild(spanSlash);
      }

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

    tahfizhQuranList.appendChild(fragment);
    tahfizhQuranFormSubmit.disabled = false;
  }
  
  tahfizhQuranFormStatus?.classList.add("hidden");
  tahfizhQuranModal.classList.remove("hidden");
  tahfizhQuranModal.classList.add("flex");
}

function closeTahfizhQuranModal() {
  if (!tahfizhQuranModal) return;
  tahfizhQuranModal.classList.add("hidden");
  tahfizhQuranModal.classList.remove("flex");
}

async function submitTahfizhQuranForm(event) {
  event.preventDefault();

  const siswaId = tahfizhQuranSiswaIdInput.value;
  const formData = new FormData(tahfizhQuranForm);
  const promises = [];

  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
  const siswa = tahfizhQuranSiswaCache.find(s => s.id === siswaId);
  const applicableMateri = tahfizhQuranMateriCache.filter(m => getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) && String(m.semester).toLowerCase() === currentSemester.toLowerCase());

  setFormLoading(true);
  setTahfizhQuranFormStatus("Menyimpan penilaian...", "info");

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
          promises.push(pb.collection("nilai_tahfizh").update(recordId, payload, { requestKey: null }));
        } else {
          promises.push(pb.collection("nilai_tahfizh").create(payload, { requestKey: null }));
        }
      } else if (recordId) {
        // Unchecked or score emptied -> delete the record
        promises.push(pb.collection("nilai_tahfizh").delete(recordId, { requestKey: null }));
      }
    }

    await Promise.all(promises);
    setTahfizhQuranFormStatus("Penilaian berhasil disimpan.", "success");
    await reloadNilaiData();
    setTimeout(closeTahfizhQuranModal, 450);
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    setTahfizhQuranFormStatus(error?.response?.message || "Data belum bisa disimpan.", "error");
  } finally {
    setFormLoading(false);
  }
}

// Event Listeners
[filterNama, filterKelas, filterKelompok, filterShift, filterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applyTahfizhQuranFilter);
    el.addEventListener("change", applyTahfizhQuranFilter);
  }
});

resetFilterBtn?.addEventListener("click", () => {
  if (filterNama) filterNama.value = "";
  if (filterKelas) filterKelas.value = "";
  if (filterKelompok) filterKelompok.value = "";
  if (filterShift) filterShift.value = "";
  if (filterSort) filterSort.value = "az";
  applyTahfizhQuranFilter();
});

closeTahfizhQuranModalButtons.forEach((btn) => btn.addEventListener("click", closeTahfizhQuranModal));
tahfizhQuranModal?.addEventListener("click", (event) => {
  if (event.target === tahfizhQuranModal) closeTahfizhQuranModal();
});
tahfizhQuranForm?.addEventListener("submit", submitTahfizhQuranForm);

tahfizhQuranTable?.addEventListener("click", (event) => {
  const gradeButton = event.target.closest("[data-grade-siswa]");

  if (gradeButton) {
    openTahfizhQuranModal(gradeButton.dataset.gradeSiswa);
  }
});

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  if (tahfizhQuranTable) {
    setTimeout(async () => {
      if (pb?.authStore?.isValid) {
        await loadInitialData();
      }
    }, 500); 
  }
});
