const tathbiqIbadahTable = document.querySelector("[data-tathbiq-ibadah-table]");
const tathbiqIbadahStatus = document.querySelector("[data-tathbiq-ibadah-status]");
const tathbiqIbadahModal = document.querySelector("[data-tathbiq-ibadah-modal]");
const tathbiqIbadahModalTitle = document.querySelector("[data-tathbiq-ibadah-modal-title]");
const closeTathbiqHarianModalButtons = document.querySelectorAll("[data-close-tathbiq-ibadah-modal]");
const tathbiqIbadahForm = document.querySelector("[data-tathbiq-ibadah-form]");
const tathbiqIbadahFormStatus = document.querySelector("[data-tathbiq-ibadah-form-status]");
const tathbiqIbadahFormSubmit = document.querySelector("[data-tathbiq-ibadah-form-submit]");
const tathbiqIbadahSiswaIdInput = document.querySelector("[data-tathbiq-ibadah-siswa-id]");
const tathbiqIbadahList = document.querySelector("[data-tathbiq-ibadah-list]");

const filterNama = document.querySelector("[data-tathbiq-ibadah-filter-nama]");
const filterKelas = document.querySelector("[data-tathbiq-ibadah-filter-kelas]");
const filterKelompok = document.querySelector("[data-tathbiq-ibadah-filter-kelompok]");
const filterShift = document.querySelector("[data-tathbiq-ibadah-filter-shift]");
const filterSort = document.querySelector("[data-tathbiq-ibadah-filter-sort]");
const resetFilterBtn = document.querySelector("[data-reset-tathbiq-ibadah-filter]");

let tathbiqIbadahCache = []; // records of nilai_tathbiq
let tathbiqIbadahSiswaCache = []; // records of siswa
let tathbiqIbadahMateriCache = []; // records of materi category tathbiq-ibadah

function setTathbiqHarianStatus(message, tone = "info") {
  if (!tathbiqIbadahStatus) return;
  tathbiqIbadahStatus.textContent = message;
  tathbiqIbadahStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  tathbiqIbadahStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setTathbiqHarianFormStatus(message, tone = "info") {
  if (!tathbiqIbadahFormStatus) return;
  tathbiqIbadahFormStatus.textContent = message;
  tathbiqIbadahFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  tathbiqIbadahFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function renderTathbiqHarianRows(filteredSiswa) {
  if (!tathbiqIbadahTable) return;
  const colspan = (isAdmin() || isGPAI()) ? 4 : 3;

  tathbiqIbadahTable.innerHTML = "";

  if (!filteredSiswa.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55 text-center font-semibold";
    td.colSpan = colspan;
    td.textContent = "Tidak ada data siswa ditemukan.";
    tr.appendChild(td);
    tathbiqIbadahTable.appendChild(tr);
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

    // Column 3: Status / Graded Tathbiq
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-4 py-4";

    const spanStatus = document.createElement("span");
    spanStatus.className = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold";

    const applicableMateri = tathbiqIbadahMateriCache.filter((m) => {
      return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
             String(m.semester).toLowerCase() === currentSemester.toLowerCase();
    });

    const studentNilai = tathbiqIbadahCache.filter((n) => n.siswa === siswa.id && applicableMateri.some((m) => m.id === n.materi));

    const totalTathbiq = applicableMateri.length;
    const gradedTathbiq = studentNilai.length;
    let avgScore = 0;
    if (gradedTathbiq > 0) {
      avgScore = Math.round(studentNilai.reduce((sum, n) => sum + (n.nilai || 0), 0) / gradedTathbiq);
    }

    const scoreBadgeColor = gradedTathbiq === totalTathbiq && totalTathbiq > 0
      ? ["bg-emeraldDeep", "text-white"]
      : gradedTathbiq > 0
        ? ["bg-dateGold", "text-white"]
        : ["bg-ink/10", "text-ink/50"];

    spanStatus.classList.add(...scoreBadgeColor);
    spanStatus.textContent = `${gradedTathbiq}/${totalTathbiq} Tathbiq (${avgScore}%)`;

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

  tathbiqIbadahTable.appendChild(fragment);
}

function applyTathbiqHarianFilter() {
  const fNama = String(filterNama?.value || "").trim().toLowerCase();
  const fKelas = String(filterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(filterKelompok?.value || "").trim();
  const fShift = String(filterShift?.value || "").trim();
  const fSort = filterSort?.value || "az";

  let filtered = tathbiqIbadahSiswaCache.filter((siswa) => {
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

  renderTathbiqHarianRows(filtered);
  const total = tathbiqIbadahSiswaCache.length;
  if (filtered.length === total) {
    setTathbiqHarianStatus(`Menampilkan seluruh ${total} siswa`, "success");
  } else {
    setTathbiqHarianStatus(`Menampilkan ${filtered.length} dari ${total} siswa`, "success");
  }
}

async function loadInitialData() {
  if (!tathbiqIbadahTable) return;
  setTathbiqHarianStatus("Memuat data...");
  try {
    const [siswaRecords, materiRecords, nilaiRecords] = await Promise.all([
      fetchSiswaRecords().then(filterSiswaForCurrentRole),
      pb.collection("materi").getFullList({ filter: 'category="tathbiq-ibadah"', sort: "materi" }),
      pb.collection("nilai_tathbiq").getFullList({ sort: "-created" })
    ]);
    
    tathbiqIbadahSiswaCache = siswaRecords;
    tathbiqIbadahMateriCache = materiRecords;
    tathbiqIbadahCache = nilaiRecords;
    
    applyTathbiqHarianFilter();
  } catch (error) {
    console.error("Gagal memuat data:", error);
    setTathbiqHarianStatus(error?.response?.message || error?.message || "Data belum bisa dimuat.", "error");
  }
}

async function reloadNilaiData() {
  try {
    const nilaiRecords = await pb.collection("nilai_tathbiq").getFullList({ sort: "-created" });
    tathbiqIbadahCache = nilaiRecords;
    applyTathbiqHarianFilter();
  } catch (error) {
    console.error("Gagal memuat ulang data nilai:", error);
  }
}

function openTathbiqHarianModal(siswaId) {
  if (!tathbiqIbadahModal || !tathbiqIbadahForm || !tathbiqIbadahList) return;

  const siswa = tathbiqIbadahSiswaCache.find(s => s.id === siswaId);
  if (!siswa) return;

  tathbiqIbadahForm.reset();
  tathbiqIbadahSiswaIdInput.value = siswa.id;
  tathbiqIbadahModalTitle.textContent = `Penilaian Tathbiq: ${siswa.nama_siswa} (Kelas ${siswa.kelas || '-'})`;
  
  const deskripsiContainer = document.querySelector("[data-deskripsi-container]");
  const deskripsiInput = tathbiqIbadahForm.elements.deskripsi_tathbiq;
  
  if (siswa.inklusif === "Ya") {
    if (deskripsiContainer) deskripsiContainer.classList.remove("hidden");
    if (deskripsiInput) {
      deskripsiInput.value = siswa.deskripsi_tathbiq || "";
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
  
  const applicableMateri = tathbiqIbadahMateriCache.filter(m => {
    return getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) &&
           String(m.semester).toLowerCase() === currentSemester.toLowerCase();
  });

  if (applicableMateri.length === 0) {
    tathbiqIbadahList.innerHTML = "";
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "rounded-[8px] bg-red-50 p-4 text-sm font-semibold text-red-700";
    emptyDiv.textContent = `Tidak ada materi Tathbiq Ibadah untuk kelas ${siswa.kelas || "-"} di semester ini.`;
    tathbiqIbadahList.appendChild(emptyDiv);
    tathbiqIbadahFormSubmit.disabled = true;
  } else {
    tathbiqIbadahList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    applicableMateri.forEach((m) => {
      const existingNilai = tathbiqIbadahCache.find(n => n.siswa === siswa.id && n.materi === m.id);
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

    tathbiqIbadahList.appendChild(fragment);
    tathbiqIbadahFormSubmit.disabled = false;
  }
  
  tathbiqIbadahFormStatus?.classList.add("hidden");
  tathbiqIbadahModal.classList.remove("hidden");
  tathbiqIbadahModal.classList.add("flex");
}

function closeTathbiqHarianModal() {
  if (!tathbiqIbadahModal) return;
  tathbiqIbadahModal.classList.add("hidden");
  tathbiqIbadahModal.classList.remove("flex");
}

async function submitTathbiqHarianForm(event) {
  event.preventDefault();

  const siswaId = tathbiqIbadahSiswaIdInput.value;
  const formData = new FormData(tathbiqIbadahForm);
  const promises = [];

  const currentMonth = new Date().getMonth() + 1;
  const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
  const siswa = tathbiqIbadahSiswaCache.find(s => s.id === siswaId);
  const applicableMateri = tathbiqIbadahMateriCache.filter(m => getClassGrade(m.kelas) === getClassGrade(siswa?.kelas) && String(m.semester).toLowerCase() === currentSemester.toLowerCase());

  setFormLoading(true);
  setTathbiqHarianFormStatus("Menyimpan penilaian...", "info");

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
          promises.push(pb.collection("nilai_tathbiq").update(recordId, payload, { requestKey: null }));
        } else {
          promises.push(pb.collection("nilai_tathbiq").create(payload, { requestKey: null }));
        }
      } else if (recordId) {
        // Unchecked or score emptied -> delete the record
        promises.push(pb.collection("nilai_tathbiq").delete(recordId, { requestKey: null }));
      }
    }

    if (siswa.inklusif === "Ya") {
      const deskripsi = formData.get("deskripsi_tathbiq") || "";
      promises.push(
        pb.collection("siswa").update(siswaId, { deskripsi_tathbiq: deskripsi }, { requestKey: null })
          .then(updatedSiswa => {
             const idx = tathbiqIbadahSiswaCache.findIndex(s => s.id === siswaId);
             if (idx !== -1) tathbiqIbadahSiswaCache[idx] = updatedSiswa;
          })
      );
    }

    await Promise.all(promises);
    setTathbiqHarianFormStatus("Penilaian berhasil disimpan.", "success");
    await reloadNilaiData();
    setTimeout(closeTathbiqHarianModal, 450);
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    setTathbiqHarianFormStatus(error?.response?.message || "Data belum bisa disimpan.", "error");
  } finally {
    setFormLoading(false);
  }
}

// Event Listeners
[filterNama, filterKelas, filterKelompok, filterShift, filterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applyTathbiqHarianFilter);
    el.addEventListener("change", applyTathbiqHarianFilter);
  }
});

resetFilterBtn?.addEventListener("click", () => {
  if (filterNama) filterNama.value = "";
  if (filterKelas) filterKelas.value = "";
  if (filterKelompok) filterKelompok.value = "";
  if (filterShift) filterShift.value = "";
  if (filterSort) filterSort.value = "az";
  applyTathbiqHarianFilter();
});

closeTathbiqHarianModalButtons.forEach((btn) => btn.addEventListener("click", closeTathbiqHarianModal));
tathbiqIbadahModal?.addEventListener("click", (event) => {
  if (event.target === tathbiqIbadahModal) closeTathbiqHarianModal();
});
tathbiqIbadahForm?.addEventListener("submit", submitTathbiqHarianForm);

tathbiqIbadahTable?.addEventListener("click", (event) => {
  const gradeButton = event.target.closest("[data-grade-siswa]");

  if (gradeButton) {
    openTathbiqHarianModal(gradeButton.dataset.gradeSiswa);
  }
});

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  if (tathbiqIbadahTable) {
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

const btnDownloadTemplate = document.querySelector("[data-tathbiq-ibadah-download]");
const inputUploadCSV = document.querySelector("[data-tathbiq-ibadah-upload]");

if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", () => {
        if (!window.exportCSV) {
            alert("Sistem CSV belum dimuat!");
            return;
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";

        // Filter materi sesuai semester
        const applicableMateri = tathbiqIbadahMateriCache.filter((m) => {
            return String(m.semester).toLowerCase() === currentSemester.toLowerCase();
        });

        // Buat header
        const headers = ["NIS", "NAMA SISWA", "KELAS"];
        applicableMateri.forEach(m => {
            headers.push(m.materi);
        });

        const rows = [headers];

        // Buat data
        const roleFilteredSiswa = filterSiswaForCurrentRole(tathbiqIbadahSiswaCache);
        const displayedSiswa = roleFilteredSiswa.filter(siswa => {
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
                const record = tathbiqIbadahCache.find(r => r.siswa === siswa.id && r.materi === m.id);
                row.push(record ? record.nilai : "");
            });

            rows.push(row);
        });

        window.exportCSV("Template_Tathbiq_Ibadah.csv", rows);
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

        setTathbiqIbadahStatus("Memproses file CSV...", "info");
        
        try {
            const data = await window.readCSVFile(file);
            if (data.length < 2) {
                alert("File CSV kosong atau tidak valid.");
                setTathbiqIbadahStatus("Gagal membaca CSV.", "error");
                inputUploadCSV.value = "";
                return;
            }

            const headers = data[0];
            const updates = [];
            const creates = [];

            const currentMonth = new Date().getMonth() + 1;
            const currentSemester = currentMonth >= 7 ? "Ganjil" : "Genap";
            const applicableMateri = tathbiqIbadahMateriCache.filter((m) => {
                return String(m.semester).toLowerCase() === currentSemester.toLowerCase();
            });

            // Mulai dari baris 1 (lewati header)
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const nis = row[0];
                if (!nis) continue;

                // Cari siswa
                const siswa = tathbiqIbadahSiswaCache.find(s => s.nis === nis || s.nisn === nis);
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
                        if (isNaN(value)) continue; // Jika teks tidak valid, lewati
                    }

                    const record = tathbiqIbadahCache.find(r => r.siswa === siswa.id && r.materi === materi.id);

                    if (record) {
                        // Jika ada perubahan
                        if (record.nilai !== value && value !== null) {
                            updates.push({ id: record.id, payload: { nilai: value } });
                        }
                    } else if (value !== null) {
                        // Jika belum ada record dan ada nilai yg diisi
                        creates.push({ siswa: siswa.id, materi: materi.id, nilai: value });
                    }
                }
            }

            setTathbiqIbadahStatus(`Menyimpan ${updates.length + creates.length} data...`, "info");

            for (const item of updates) {
                await pb.collection("nilai_tathbiq").update(item.id, item.payload);
            }
            for (const item of creates) {
                await pb.collection("nilai_tathbiq").create(item);
            }

            alert(`Berhasil mengunggah ${updates.length + creates.length} nilai Tathbiq Ibadah.`);
            
            // Reload data
            loadTathbiqIbadahData();

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses file CSV.");
            setTathbiqIbadahStatus("Gagal memproses CSV.", "error");
        } finally {
            inputUploadCSV.value = "";
        }
    });
}
