const pocketBaseUrl = `${window.location.protocol}//${window.location.hostname}:8090`;
const pb = window.PocketBase ? new PocketBase(pocketBaseUrl) : null;

function safeGet(obj, key) {
  if (!obj || typeof obj !== "object") return undefined;
  if (key === "__proto__" || key === "constructor" || key === "prototype") return undefined;
  return Reflect.get(obj, key);
}

function safeSet(obj, key, value) {
  if (!obj || typeof obj !== "object") return false;
  if (key === "__proto__" || key === "constructor" || key === "prototype") return false;
  return Reflect.set(obj, key, value);
}

const userName = document.querySelector("[data-user-name]");
const userEmail = document.querySelector("[data-user-email]");
const userAvatar = document.querySelector("[data-user-avatar]");
const welcomeName = document.querySelector("[data-welcome-name]");
const userInitial = document.querySelector("[data-user-initial]");
const logoutButton = document.querySelector("[data-logout]");
const usersTable = document.querySelector("[data-users-table]");
const usersStatus = document.querySelector("[data-users-status]");
const totalUsers = document.querySelector("[data-total-users]");
const raporTerbit = document.querySelector("[data-rapor-terbit]");
const ringkasanTilawah = document.querySelector("[data-ringkasan-tilawah]");
const ringkasanHafalan = document.querySelector("[data-ringkasan-hafalan]");
const ringkasanAdab = document.querySelector("[data-ringkasan-adab]");
const userModal = document.querySelector("[data-user-modal]");
const openUserModalButton = document.querySelector("[data-open-user-modal]");
const closeUserModalButtons = document.querySelectorAll("[data-close-user-modal]");
const userForm = document.querySelector("[data-user-form]");
const userFormTitle = document.querySelector("[data-user-modal-title]");
const userFormStatus = document.querySelector("[data-user-form-status]");
const userFormSubmit = document.querySelector("[data-user-form-submit]");
const userImportFile = document.querySelector("[data-user-import-file]");
const downloadUserTemplateButtons = document.querySelectorAll("[data-download-user-template]");
const userIdInput = document.querySelector("[data-user-id]");
const userNameInput = document.querySelector("[data-user-form-name]");
const userNamaLengkapInput = document.querySelector("[data-user-form-nama-lengkap]");
const userNiyInput = document.querySelector("[data-user-form-niy]");
const userEmailInput = document.querySelector("[data-user-form-email]");
const userRoleInput = document.querySelector("[data-user-form-role]");
const userGpqGroup = document.querySelector("[data-user-gpq-group]");
const userGpqShiftInputs = document.querySelectorAll("[data-user-form-gpq-shift]");
const userGpaiClasses = document.querySelector("[data-user-gpai-classes]");
const userGpaiClassList = document.querySelector("[data-user-gpai-class-list]");
const userPasswordInput = document.querySelector("[data-user-form-password]");
const userPasswordConfirmInput = document.querySelector("[data-user-form-password-confirm]");
const userVerifiedInput = document.querySelector("[data-user-form-verified]");
const adminOnlyElements = document.querySelectorAll("[data-admin-only]");
const gpqOnlyElements = document.querySelectorAll("[data-gpq-only]");
const gpaiOnlyElements = document.querySelectorAll("[data-gpai-only]");
const materiTabs = document.querySelectorAll("[data-materi-tab]");
const materiPanels = document.querySelectorAll("[data-materi-panel]");
const materiForm = document.querySelector("[data-materi-form]");
const materiTables = document.querySelectorAll("[data-materi-table]");
const materiStatuses = document.querySelectorAll("[data-materi-status]");
const materiModal = document.querySelector("[data-materi-modal]");
const materiModalTitle = document.querySelector("[data-materi-modal-title]");
const materiFormStatus = document.querySelector("[data-materi-form-status]");
const materiFormSubmit = document.querySelector("[data-materi-form-submit]");
const materiIdInput = document.querySelector("[data-materi-id]");
const quranFields = document.querySelector("[data-quran-fields]");
const quranImportFile = document.querySelector("[data-quran-import-file]");
const quranImportStatus = document.querySelector("[data-quran-import-status]");
const simpleMateriImportFiles = document.querySelectorAll("[data-simple-materi-import-file]");
const downloadQuranTemplateButtons = document.querySelectorAll("[data-download-quran-template]");
const openMateriModalButtons = document.querySelectorAll("[data-open-materi-modal]");
const closeMateriModalButtons = document.querySelectorAll("[data-close-materi-modal]");
const materiFilterInputs = document.querySelectorAll(
  "[data-materi-filter-search], [data-materi-filter-kelas], [data-materi-filter-semester]"
);
const resetMateriFilterButtons = document.querySelectorAll("[data-reset-materi-filter]");
const siswaTable = document.querySelector("[data-siswa-table]");
const siswaStatus = document.querySelector("[data-siswa-status]");
const siswaImportFile = document.querySelector("[data-siswa-import-file]");
const downloadSiswaTemplateButtons = document.querySelectorAll("[data-download-siswa-template]");
const siswaModal = document.querySelector("[data-siswa-modal]");
const siswaModalTitle = document.querySelector("[data-siswa-modal-title]");
const openSiswaModalButton = document.querySelector("[data-open-siswa-modal]");
const closeSiswaModalButtons = document.querySelectorAll("[data-close-siswa-modal]");
const siswaForm = document.querySelector("[data-siswa-form]");
const siswaFormStatus = document.querySelector("[data-siswa-form-status]");
const siswaFormSubmit = document.querySelector("[data-siswa-form-submit]");
const siswaGuruQuranInput = document.querySelector("[data-siswa-guru-quran]");
const siswaIdInput = document.querySelector("[data-siswa-id]");

const laporanTable = document.querySelector("[data-laporan-table]");
const laporanStatus = document.querySelector("[data-laporan-status]");
const saranModal = document.querySelector("[data-saran-modal]");
const saranModalTitle = document.querySelector("[data-saran-modal-title]");
const closeSaranModalButtons = document.querySelectorAll("[data-close-saran-modal]");
const saranForm = document.querySelector("[data-saran-form]");
const saranIdInput = document.querySelector("[data-saran-id]");
const saranFormStatus = document.querySelector("[data-saran-form-status]");
const saranFormSubmit = document.querySelector("[data-saran-form-submit]");

const siswaFilterNama = document.querySelector("[data-siswa-filter-nama]");
const siswaFilterKelas = document.querySelector("[data-siswa-filter-kelas]");
const siswaFilterKelompok = document.querySelector("[data-siswa-filter-kelompok]");
const siswaFilterShift = document.querySelector("[data-siswa-filter-shift]");
const siswaFilterSort = document.querySelector("[data-siswa-filter-sort]");
const resetSiswaFilterBtn = document.querySelector("[data-reset-siswa-filter]");

const laporanFilterNama = document.querySelector("[data-laporan-filter-nama]");
const laporanFilterKelas = document.querySelector("[data-laporan-filter-kelas]");
const laporanFilterKelompok = document.querySelector("[data-laporan-filter-kelompok]");
const laporanFilterShift = document.querySelector("[data-laporan-filter-shift]");
const laporanFilterSort = document.querySelector("[data-laporan-filter-sort]");
const resetLaporanFilterBtn = document.querySelector("[data-reset-laporan-filter]");

const materiLabels = {
  "tahfizh-quran": "TAHFIZH AL-QUR'AN",
  "doa-harian": "TAHFIZH DO'A SEHARI-HARI",
  "tathbiq-ibadah": "TATHBIQ IBADAH"
};

let usersCache = [];
let materiCache = {};
let guruQuranCache = [];
let siswaCache = [];
const gpaiClassOptions = Array.from({ length: 6 }, (_, index) => index + 1).flatMap((grade) =>
  ["A", "B", "C", "D"].map((letter) => `${grade}${letter}`)
);
const gpqGroupOptions = Array.from({ length: 14 }, (_, index) => `Kelompok ${index + 1}`);

function isAdmin(record = pb?.authStore.record) {
  return record?.role === "Admin";
}

function isGPQ(record = pb?.authStore.record) {
  return record?.role === "GPQ";
}

function isGPAI(record = pb?.authStore.record) {
  return record?.role === "GPAI";
}

function getInitial(record) {
  const source = record?.name || record?.email || "U";
  return source.trim().charAt(0).toUpperCase();
}

function fillUser(record) {
  const displayName = record.name || "Pengguna";
  const email = record.email || "Email belum tersedia";

  if (userName) userName.textContent = displayName;
  if (userEmail) userEmail.textContent = email;
  if (welcomeName) welcomeName.textContent = displayName;
  if (userInitial) userInitial.textContent = getInitial(record);

  if (userAvatar && record.avatar) {
    userAvatar.src = pb.files.getURL(record, record.avatar, { thumb: "100x100" });
    userAvatar.alt = `Foto profil ${displayName}`;
    userAvatar.classList.remove("hidden");
    userInitial?.classList.add("hidden");
  }
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function setUsersStatus(message, tone = "info") {
  if (!usersStatus) return;

  usersStatus.textContent = message;
  usersStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  usersStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setUserFormStatus(message, tone = "info") {
  if (!userFormStatus) return;

  userFormStatus.textContent = message;
  userFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  userFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setFormLoading(isLoading) {
  if (!userFormSubmit) return;

  userFormSubmit.disabled = isLoading;
  userFormSubmit.classList.toggle("cursor-wait", isLoading);
  userFormSubmit.classList.toggle("opacity-70", isLoading);
}

function setupGpaiClassOptions() {
  if (!userGpaiClassList || userGpaiClassList.children.length) return;

  userGpaiClassList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  gpaiClassOptions.forEach((kelas) => {
    const label = document.createElement("label");
    label.className = "flex h-9 items-center justify-center rounded-[8px] border border-emeraldDeep/10 bg-parchment/60 text-sm font-extrabold text-emeraldDeep";

    const input = document.createElement("input");
    input.className = "sr-only peer";
    input.setAttribute("data-user-gpai-class-value", kelas);
    input.type = "checkbox";
    input.value = kelas;

    const span = document.createElement("span");
    span.className = "grid h-full w-full place-items-center rounded-[8px] transition peer-checked:bg-emeraldDeep peer-checked:text-white";
    span.textContent = kelas;

    label.appendChild(input);
    label.appendChild(span);
    fragment.appendChild(label);
  });

  userGpaiClassList.appendChild(fragment);
}

function setupGpqShiftOptions() {
  userGpqShiftInputs.forEach((select) => {
    if (select.children.length > 1) return;

    select.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Kelompok";
    select.appendChild(defaultOpt);

    gpqGroupOptions.forEach((kelompok) => {
      const opt = document.createElement("option");
      opt.value = kelompok;
      opt.textContent = kelompok;
      select.appendChild(opt);
    });
  });
}

function setGpaiClassVisibility() {
  if (!userGpaiClasses || !userRoleInput) return;

  userGpaiClasses.classList.toggle("hidden", userRoleInput.value !== "GPAI");
}

function setGpqGroupVisibility() {
  if (!userGpqGroup || !userRoleInput) return;

  userGpqGroup.classList.toggle("hidden", userRoleInput.value !== "GPQ");
}

function getSelectedGpqShifts() {
  return {
    gpq_shift_1: document.querySelector('[data-user-form-gpq-shift="1"]')?.value || "",
    gpq_shift_2: document.querySelector('[data-user-form-gpq-shift="2"]')?.value || "",
    gpq_shift_3: document.querySelector('[data-user-form-gpq-shift="3"]')?.value || ""
  };
}

function fillSelectedGpqShifts(record = {}) {
  document.querySelector('[data-user-form-gpq-shift="1"]').value = record.gpq_shift_1 || record.gpq_kelompok || "";
  document.querySelector('[data-user-form-gpq-shift="2"]').value = record.gpq_shift_2 || "";
  document.querySelector('[data-user-form-gpq-shift="3"]').value = record.gpq_shift_3 || "";
}

function getSelectedGpaiClasses() {
  return Array.from(userGpaiClassList?.querySelectorAll("[data-user-gpai-class-value]:checked") || []).map(
    (input) => input.value
  );
}

function fillSelectedGpaiClasses(values = []) {
  const selectedValues = new Set(Array.isArray(values) ? values : []);

  userGpaiClassList?.querySelectorAll("[data-user-gpai-class-value]").forEach((input) => {
    input.checked = selectedValues.has(input.value);
  });
}

function openUserModal(record = null) {
  if (!userModal || !userForm) return;

  setupGpaiClassOptions();
  setupGpqShiftOptions();
  userForm.reset();
  userIdInput.value = record?.id || "";
  userNameInput.value = record?.name || "";
  if (userNamaLengkapInput) userNamaLengkapInput.value = record?.nama_lengkap || "";
  if (userNiyInput) userNiyInput.value = record?.niy || "";
  userEmailInput.value = record?.email || "";
  userRoleInput.value = record?.role || "-";
  fillSelectedGpqShifts(record || {});
  fillSelectedGpaiClasses(record?.gpai_kelas || []);
  setGpqGroupVisibility();
  setGpaiClassVisibility();
  userVerifiedInput.checked = Boolean(record?.verified);
  userPasswordInput.required = !record;
  userPasswordConfirmInput.required = !record;
  userFormTitle.textContent = record ? "Edit User" : "Tambah User";
  userFormStatus?.classList.add("hidden");
  userModal.classList.remove("hidden");
  userModal.classList.add("flex");
  userNameInput.focus();
}

function closeUserModal() {
  if (!userModal) return;

  userModal.classList.add("hidden");
  userModal.classList.remove("flex");
}

function activateMateriTab(tabName) {
  materiTabs.forEach((tab) => {
    const isActive = tab.dataset.materiTab === tabName;
    tab.setAttribute("aria-selected", String(isActive));
    tab.classList.toggle("bg-emeraldDeep", isActive);
    tab.classList.toggle("text-white", isActive);
    tab.classList.toggle("shadow-soft", isActive);
    tab.classList.toggle("text-emeraldDeep", !isActive);
    tab.classList.toggle("hover:bg-white", !isActive);
  });

  materiPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.materiPanel !== tabName);
  });
}

function getMateriStatus(category) {
  return Array.from(materiStatuses).find((status) => status.dataset.materiStatus === category);
}

function getMateriTable(category) {
  return Array.from(materiTables).find((table) => table.dataset.materiTable === category);
}

function getMateriFilter(category) {
  const search = document.querySelector(`[data-materi-filter-search="${category}"]`);
  const kelas = document.querySelector(`[data-materi-filter-kelas="${category}"]`);
  const semester = document.querySelector(`[data-materi-filter-semester="${category}"]`);

  return {
    search: String(search?.value || "").trim().toLowerCase(),
    kelas: String(kelas?.value || "").trim().toLowerCase(),
    semester: String(semester?.value || "").trim()
  };
}

function filterMateriRecords(category, records) {
  const filter = getMateriFilter(category);

  return records.filter((record) => {
    const searchable = [record.kelas, record.materi, record.semester].join(" ").toLowerCase();
    const kelas = String(record.kelas || "").toLowerCase();
    const semester = String(record.semester || "");

    return (
      (!filter.search || searchable.includes(filter.search)) &&
      (!filter.kelas || kelas.includes(filter.kelas)) &&
      (!filter.semester || semester === filter.semester)
    );
  });
}

function applyMateriFilter(category) {
  const records = safeGet(materiCache, category) || [];
  const filteredRecords = filterMateriRecords(category, records);
  const hasActiveFilter = Object.values(getMateriFilter(category)).some(Boolean);

  renderMateriRows(
    category,
    filteredRecords,
    records.length && hasActiveFilter ? "Tidak ada data materi yang cocok dengan filter." : "Belum ada data materi."
  );
  setMateriStatus(
    category,
    filteredRecords.length === records.length
      ? `${records.length} materi tersimpan`
      : `${filteredRecords.length} dari ${records.length} materi ditampilkan`,
    "success"
  );
}

function clearMateriFilter(category) {
  const search = document.querySelector(`[data-materi-filter-search="${category}"]`);
  const kelas = document.querySelector(`[data-materi-filter-kelas="${category}"]`);
  const semester = document.querySelector(`[data-materi-filter-semester="${category}"]`);

  if (search) search.value = "";
  if (kelas) kelas.value = "";
  if (semester) semester.value = "";
}

function resetMateriFilter(category) {
  clearMateriFilter(category);
  applyMateriFilter(category);
}

function sortMateriRecords(records) {
  return [...records].sort((first, second) =>
    [first.kelas, first.semester, first.materi, first.created]
      .join(" ")
      .localeCompare([second.kelas, second.semester, second.materi, second.created].join(" "), "id", {
        numeric: true,
        sensitivity: "base"
      })
  );
}

function setMateriStatus(category, message, tone = "info") {
  const status = getMateriStatus(category);
  if (!status) return;

  status.textContent = message;
  status.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  status.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setMateriFormStatus(message, tone = "info") {
  if (!materiFormStatus) return;

  materiFormStatus.textContent = message;
  materiFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  materiFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setQuranImportStatus(message, tone = "info") {
  if (!quranImportStatus) return;

  quranImportStatus.textContent = message;
  quranImportStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  quranImportStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setSiswaStatus(message, tone = "info") {
  if (!siswaStatus) return;

  siswaStatus.textContent = message;
  siswaStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
  siswaStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setSiswaFormStatus(message, tone = "info") {
  if (!siswaFormStatus) return;

  siswaFormStatus.textContent = message;
  siswaFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  siswaFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

async function openSiswaModal(record = null) {
  if (!siswaModal || !siswaForm) return;

  siswaForm.reset();
  siswaIdInput.value = record?.id || "";
  siswaModalTitle.textContent = record ? "Edit Siswa" : "Tambah Siswa";
  siswaForm.elements.nis.value = record?.nis || "";
  siswaForm.elements.nisn.value = record?.nisn || "";
  siswaForm.elements.nama_siswa.value = record?.nama_siswa || "";
  siswaForm.elements.kelas.value = record?.kelas || "";
  siswaForm.elements.kelompok.value = record?.kelompok || "";
  siswaForm.elements.shift.value = record?.shift || "";
  siswaForm.elements.status.value = record?.status === "Pasca" ? "Pasca" : "Reguler";
  siswaForm.elements.inklusif.value = record?.inklusif === "Ya" ? "Ya" : "Tidak";
  siswaFormStatus?.classList.add("hidden");
  siswaModal.classList.remove("hidden");
  siswaModal.classList.add("flex");
  await loadGuruQuranOptions();
  siswaForm.elements.nama_guru_quran.value = record?.nama_guru_quran || "";

  const isNotAdmin = !isAdmin();
  siswaForm.elements.nis.readOnly = isNotAdmin;
  siswaForm.elements.nisn.readOnly = isNotAdmin;
  siswaForm.elements.nama_siswa.readOnly = isNotAdmin;
  siswaForm.elements.kelas.disabled = isNotAdmin;
  siswaForm.elements.kelompok.disabled = isNotAdmin;
  siswaForm.elements.shift.disabled = isNotAdmin;
  siswaForm.elements.nama_guru_quran.disabled = isNotAdmin;

  const inputFields = [siswaForm.elements.nis, siswaForm.elements.nisn, siswaForm.elements.nama_siswa];
  if (isNotAdmin) {
    inputFields.forEach(el => el.classList.add("opacity-60", "bg-black/5"));
  } else {
    inputFields.forEach(el => el.classList.remove("opacity-60", "bg-black/5"));
  }

  siswaForm.elements.nis.focus();
}

function closeSiswaModal() {
  if (!siswaModal) return;

  siswaModal.classList.add("hidden");
  siswaModal.classList.remove("flex");
}

function renderGuruQuranOptions(records) {
  if (!siswaGuruQuranInput) return;

  siswaGuruQuranInput.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Pilih Guru Qur'an";
  siswaGuruQuranInput.appendChild(defaultOpt);

  records.forEach((record) => {
    const label = record.name || record.email || "Guru Qur'an";
    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    siswaGuruQuranInput.appendChild(opt);
  });
}

async function loadGuruQuranOptions() {
  if (!siswaGuruQuranInput || !isAdmin()) return;

  if (guruQuranCache.length) {
    renderGuruQuranOptions(guruQuranCache);
    return;
  }

  siswaGuruQuranInput.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = "Memuat Guru Qur'an...";
  siswaGuruQuranInput.appendChild(opt);

  try {
    guruQuranCache = await pb.collection("users").getFullList({
      filter: 'role = "GPQ"',
      sort: "name,email",
      requestKey: null
    });
    renderGuruQuranOptions(guruQuranCache);
  } catch (error) {
    console.error("Gagal memuat guru Quran:", error);
    siswaGuruQuranInput.innerHTML = "";
    const optErr = document.createElement("option");
    optErr.value = "";
    optErr.textContent = "Guru Qur'an belum bisa dimuat";
    siswaGuruQuranInput.appendChild(optErr);
    setSiswaFormStatus("Daftar Guru Qur'an belum bisa dimuat.", "error");
  }
}

function openMateriModal(category, record = null) {
  if (!materiModal || !materiForm) return;
  if (category === "__proto__" || category === "constructor" || category === "prototype") return;

  materiForm.reset();
  materiIdInput.value = record?.id || "";
  materiForm.elements.category.value = category;
  materiForm.elements.kelas.value = record?.kelas || "";
  materiForm.elements.materi.value = record?.materi || "";
  materiForm.elements.semester.value = record?.semester || "Ganjil";
  materiModalTitle.textContent = `${record ? "Edit" : "Tambah"} ${safeGet(materiLabels, category) || "Materi"}`;
  quranFields?.classList.toggle("hidden", category !== "tahfizh-quran");

  if (category === "tahfizh-quran") {
    [
      "jumlah_ayat",
      "hafal_1",
      "kategori_1",
      "nilai_1",
      "hafal_2",
      "kategori_2",
      "nilai_2",
      "hafal_3",
      "kategori_3",
      "nilai_3"
    ].forEach((field) => {
      if (field !== "__proto__" && field !== "constructor" && field !== "prototype") {
        const formEl = safeGet(materiForm.elements, field);
        if (formEl) {
          formEl.value = safeGet(record, field) || "";
        }
      }
    });
  }

  materiFormStatus?.classList.add("hidden");
  materiModal.classList.remove("hidden");
  materiModal.classList.add("flex");
  materiForm.elements.kelas.focus();
}

function closeMateriModal() {
  if (!materiModal) return;

  materiModal.classList.add("hidden");
  materiModal.classList.remove("flex");
}

function renderMateriRows(category, records, emptyMessage = "Belum ada data materi.") {
  const table = getMateriTable(category);
  if (!table) return;
  const colspan = category === "tahfizh-quran" ? 14 : 4;

  table.innerHTML = "";

  if (!records.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55";
    td.colSpan = colspan;
    td.textContent = emptyMessage;
    tr.appendChild(td);
    table.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();

  if (category === "tahfizh-quran") {
    records.forEach((record) => {
      const tr = document.createElement("tr");
      tr.className = "transition hover:bg-parchment/60";

      // 1. Kelas
      const tdKelas = document.createElement("td");
      tdKelas.className = "px-4 py-4 font-bold text-emeraldDeep";
      tdKelas.textContent = record.kelas;
      tr.appendChild(tdKelas);

      // 2. Materi
      const tdMateri = document.createElement("td");
      tdMateri.className = "px-4 py-4 font-semibold text-ink/65";
      tdMateri.textContent = record.materi;
      tr.appendChild(tdMateri);

      // 3. Semester
      const tdSemester = document.createElement("td");
      tdSemester.className = "px-4 py-4 font-semibold text-ink/55";
      tdSemester.textContent = record.semester;
      tr.appendChild(tdSemester);

      // 4. Jumlah Ayat
      const tdJumlahAyat = document.createElement("td");
      tdJumlahAyat.className = "px-4 py-4 font-semibold text-ink/65";
      tdJumlahAyat.textContent = record.jumlah_ayat || "-";
      tr.appendChild(tdJumlahAyat);

      // 5. Hafal 1
      const tdHafal1 = document.createElement("td");
      tdHafal1.className = "border-l border-emeraldDeep/10 px-4 py-4 font-semibold text-ink/65";
      tdHafal1.textContent = record.hafal_1 || "-";
      tr.appendChild(tdHafal1);

      // 6. Kategori 1
      const tdKategori1 = document.createElement("td");
      tdKategori1.className = "px-4 py-4 font-semibold text-ink/65";
      tdKategori1.textContent = record.kategori_1 || "-";
      tr.appendChild(tdKategori1);

      // 7. Nilai 1
      const tdNilai1 = document.createElement("td");
      tdNilai1.className = "px-4 py-4 font-semibold text-ink/65";
      tdNilai1.textContent = record.nilai_1 || "-";
      tr.appendChild(tdNilai1);

      // 8. Hafal 2
      const tdHafal2 = document.createElement("td");
      tdHafal2.className = "border-l border-emeraldDeep/10 px-4 py-4 font-semibold text-ink/65";
      tdHafal2.textContent = record.hafal_2 || "-";
      tr.appendChild(tdHafal2);

      // 9. Kategori 2
      const tdKategori2 = document.createElement("td");
      tdKategori2.className = "px-4 py-4 font-semibold text-ink/65";
      tdKategori2.textContent = record.kategori_2 || "-";
      tr.appendChild(tdKategori2);

      // 10. Nilai 2
      const tdNilai2 = document.createElement("td");
      tdNilai2.className = "px-4 py-4 font-semibold text-ink/65";
      tdNilai2.textContent = record.nilai_2 || "-";
      tr.appendChild(tdNilai2);

      // 11. Hafal 3
      const tdHafal3 = document.createElement("td");
      tdHafal3.className = "border-l border-emeraldDeep/10 px-4 py-4 font-semibold text-ink/65";
      tdHafal3.textContent = record.hafal_3 || "-";
      tr.appendChild(tdHafal3);

      // 12. Kategori 3
      const tdKategori3 = document.createElement("td");
      tdKategori3.className = "px-4 py-4 font-semibold text-ink/65";
      tdKategori3.textContent = record.kategori_3 || "-";
      tr.appendChild(tdKategori3);

      // 13. Nilai 3
      const tdNilai3 = document.createElement("td");
      tdNilai3.className = "px-4 py-4 font-semibold text-ink/65";
      tdNilai3.textContent = record.nilai_3 || "-";
      tr.appendChild(tdNilai3);

      // 14. Action cell
      const tdAction = document.createElement("td");
      tdAction.className = "px-4 py-4";

      const divAction = document.createElement("div");
      divAction.className = "flex items-center gap-2";

      const editBtn = document.createElement("button");
      editBtn.setAttribute("data-edit-materi", record.id);
      editBtn.setAttribute("data-edit-materi-category", category);
      editBtn.className = "rounded-[8px] border border-emeraldDeep/10 bg-white px-3 py-2 text-xs font-extrabold text-emeraldDeep transition hover:border-dateGold/50";
      editBtn.type = "button";
      editBtn.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("data-delete-materi", record.id);
      deleteBtn.setAttribute("data-delete-materi-category", category);
      deleteBtn.className = "rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100";
      deleteBtn.type = "button";
      deleteBtn.textContent = "Hapus";

      divAction.appendChild(editBtn);
      divAction.appendChild(deleteBtn);
      tdAction.appendChild(divAction);
      tr.appendChild(tdAction);

      fragment.appendChild(tr);
    });
  } else {
    records.forEach((record) => {
      const tr = document.createElement("tr");
      tr.className = "transition hover:bg-parchment/60";

      // 1. Kelas
      const tdKelas = document.createElement("td");
      tdKelas.className = "px-4 py-4 font-bold text-emeraldDeep";
      tdKelas.textContent = record.kelas;
      tr.appendChild(tdKelas);

      // 2. Materi
      const tdMateri = document.createElement("td");
      tdMateri.className = "px-4 py-4 font-semibold text-ink/65";
      tdMateri.textContent = record.materi;
      tr.appendChild(tdMateri);

      // 3. Semester
      const tdSemester = document.createElement("td");
      tdSemester.className = "px-4 py-4 font-semibold text-ink/55";
      tdSemester.textContent = record.semester;
      tr.appendChild(tdSemester);

      // 4. Action cell
      const tdAction = document.createElement("td");
      tdAction.className = "px-4 py-4";

      const divAction = document.createElement("div");
      divAction.className = "flex items-center gap-2";

      const editBtn = document.createElement("button");
      editBtn.setAttribute("data-edit-materi", record.id);
      editBtn.setAttribute("data-edit-materi-category", category);
      editBtn.className = "rounded-[8px] border border-emeraldDeep/10 bg-white px-3 py-2 text-xs font-extrabold text-emeraldDeep transition hover:border-dateGold/50";
      editBtn.type = "button";
      editBtn.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("data-delete-materi", record.id);
      deleteBtn.setAttribute("data-delete-materi-category", category);
      deleteBtn.className = "rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100";
      deleteBtn.type = "button";
      deleteBtn.textContent = "Hapus";

      divAction.appendChild(editBtn);
      divAction.appendChild(deleteBtn);
      tdAction.appendChild(divAction);
      tr.appendChild(tdAction);

      fragment.appendChild(tr);
    });
  }

  table.appendChild(fragment);
}

async function loadMateri(category) {
  if (!isAdmin()) return;
  if (category === "__proto__" || category === "constructor" || category === "prototype") return;

  setMateriStatus(category, "Memuat data...");

  try {
    const records = await fetchMateriRecords();

    safeSet(materiCache, category, sortMateriRecords(records.filter((record) => record.category === category)));
    applyMateriFilter(category);
  } catch (error) {
    console.error("Gagal memuat materi:", error);
    const message = error?.response?.message || error?.message || "Data materi belum bisa dimuat.";
    safeSet(materiCache, category, []);
    renderMateriRows(category, []);
    setMateriStatus(category, message, "error");
  }
}

async function fetchMateriRecords() {
  try {
    return await pb.collection("materi").getFullList({
      sort: "kelas,semester,materi",
      requestKey: null
    });
  } catch (_error) {
    return pb.collection("materi").getFullList({ requestKey: null });
  }
}

async function loadAllMateri() {
  if (!isAdmin()) return;

  const categories = Array.from(materiTables).map((table) => table.dataset.materiTable);
  categories.forEach((category) => {
    if (category !== "__proto__" && category !== "constructor" && category !== "prototype") {
      clearMateriFilter(category);
      setMateriStatus(category, "Memuat data...");
    }
  });

  try {
    const records = await fetchMateriRecords();

    categories.forEach((category) => {
      if (category !== "__proto__" && category !== "constructor" && category !== "prototype") {
        safeSet(materiCache, category, sortMateriRecords(records.filter((record) => record.category === category)));
        applyMateriFilter(category);
      }
    });
  } catch (error) {
    console.error("Gagal memuat materi:", error);
    const message = error?.response?.message || error?.message || "Data materi belum bisa dimuat.";

    categories.forEach((category) => {
      if (category !== "__proto__" && category !== "constructor" && category !== "prototype") {
        safeSet(materiCache, category, []);
        renderMateriRows(category, []);
        setMateriStatus(category, message, "error");
      }
    });
  }
}

function renderSiswaRows(records) {
  if (!siswaTable) return;
  const colspan = 10;

  siswaTable.innerHTML = "";

  if (!records.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55";
    td.colSpan = colspan;
    td.textContent = "Belum ada data siswa.";
    tr.appendChild(td);
    siswaTable.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();

  records.forEach((record) => {
    const tr = document.createElement("tr");
    tr.className = "transition hover:bg-parchment/60";

    // 1. NIS
    const tdNis = document.createElement("td");
    tdNis.className = "px-4 py-4 font-bold text-emeraldDeep";
    tdNis.textContent = record.nis || "-";
    tr.appendChild(tdNis);

    // 2. NISN
    const tdNisn = document.createElement("td");
    tdNisn.className = "px-4 py-4 font-semibold text-ink/65";
    tdNisn.textContent = record.nisn || "-";
    tr.appendChild(tdNisn);

    // 3. Nama Siswa
    const tdNama = document.createElement("td");
    tdNama.className = "px-4 py-4 font-semibold text-ink/65";
    tdNama.textContent = record.nama_siswa || "-";
    tr.appendChild(tdNama);

    // 4. Kelas
    const tdKelas = document.createElement("td");
    tdKelas.className = "px-4 py-4 font-semibold text-ink/65";
    tdKelas.textContent = record.kelas || "-";
    tr.appendChild(tdKelas);

    // 5. Kelompok
    const tdKelompok = document.createElement("td");
    tdKelompok.className = "px-4 py-4 font-semibold text-ink/65";
    tdKelompok.textContent = record.kelompok || "-";
    tr.appendChild(tdKelompok);

    // 6. Shift
    const tdShift = document.createElement("td");
    tdShift.className = "px-4 py-4 font-semibold text-ink/65";
    tdShift.textContent = record.shift || "-";
    tr.appendChild(tdShift);

    // 7. Status
    const tdStatus = document.createElement("td");
    tdStatus.className = "px-4 py-4";
    const spanStatus = document.createElement("span");
    spanStatus.className = "inline-flex rounded-full bg-emeraldDeep/10 px-3 py-1 text-xs font-extrabold text-emeraldDeep";
    spanStatus.textContent = record.status || "-";
    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    // 8. Inklusif
    const tdInklusif = document.createElement("td");
    tdInklusif.className = "px-4 py-4";
    const spanInklusif = document.createElement("span");
    spanInklusif.className = `inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
      record.inklusif === "Ya" ? "bg-dateGold/15 text-dateGold" : "bg-emeraldDeep/10 text-emeraldDeep"
    }`;
    spanInklusif.textContent = record.inklusif || "Tidak";
    tdInklusif.appendChild(spanInklusif);
    tr.appendChild(tdInklusif);

    // 9. Nama Guru Qur'an
    const tdGuru = document.createElement("td");
    tdGuru.className = "px-4 py-4 font-semibold text-ink/65";
    tdGuru.textContent = record.nama_guru_quran || "-";
    tr.appendChild(tdGuru);

    // 10. Action column (Admin, GPQ, GPAI)
    if (isAdmin() || isGPQ() || isGPAI()) {
      const tdAction = document.createElement("td");
      tdAction.className = "px-4 py-4";

      const divAction = document.createElement("div");
      divAction.className = "flex items-center gap-2";

      const editBtn = document.createElement("button");
      editBtn.setAttribute("data-edit-siswa", record.id);
      editBtn.className = "rounded-[8px] border border-emeraldDeep/10 bg-white px-3 py-2 text-xs font-extrabold text-emeraldDeep transition hover:border-dateGold/50";
      editBtn.type = "button";
      editBtn.textContent = "Edit";
      divAction.appendChild(editBtn);

      if (isAdmin()) {
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("data-delete-siswa", record.id);
        deleteBtn.className = "rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100";
        deleteBtn.type = "button";
        deleteBtn.textContent = "Hapus";
        divAction.appendChild(deleteBtn);
      }

      tdAction.appendChild(divAction);
      tr.appendChild(tdAction);
    }

    fragment.appendChild(tr);
  });

  siswaTable.appendChild(fragment);
}

async function fetchSiswaRecords() {
  try {
    return await pb.collection("siswa").getFullList({
      sort: "kelas,nama_siswa",
      requestKey: null
    });
  } catch (_error) {
    return pb.collection("siswa").getFullList({ requestKey: null });
  }
}

function normalizeTeacherName(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeClassName(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^KELAS\s+/, "")
    .replace(/\s+/g, "");
}

function getClassGrade(value) {
  const normalized = normalizeClassName(value);
  return normalized.match(/^\d+/)?.[0] || "";
}

function filterSiswaForCurrentRole(records) {
  const currentUser = pb?.authStore.record;

  if (currentUser?.role === "GPQ") {
    const allowedNames = [currentUser.name, currentUser.email].map(normalizeTeacherName).filter(Boolean);

    return records.filter((record) => allowedNames.includes(normalizeTeacherName(record.nama_guru_quran)));
  }

  if (currentUser?.role === "GPAI") {
    const allowedClasses = new Set((currentUser.gpai_kelas || []).map(normalizeClassName));

    return records.filter((record) => allowedClasses.has(normalizeClassName(record.kelas)));
  }

  return records;
}

async function loadSiswa() {
  if (!siswaTable) return;
  const colspan = 10;

  setSiswaStatus("Memuat data siswa...");
  siswaTable.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.className = "px-4 py-5 text-ink/55";
  td.colSpan = colspan;
  td.textContent = "Memuat data siswa...";
  tr.appendChild(td);
  siswaTable.appendChild(tr);

  try {
    const records = filterSiswaForCurrentRole(await fetchSiswaRecords());
    siswaCache = records;
    renderSiswaRows(records);
    const currentRole = pb?.authStore.record?.role;
    setSiswaStatus(
      currentRole === "GPQ"
        ? `${records.length} siswa binaan ditampilkan`
        : currentRole === "GPAI"
          ? `${records.length} siswa sesuai kelas GPAI ditampilkan`
        : `${records.length} siswa tersimpan`,
      "success"
    );
  } catch (error) {
    console.error("Gagal memuat siswa:", error);
    const message =
      error?.response?.message || error?.message || "Data siswa belum bisa dimuat. Jalankan npm run setup:siswa.";
    siswaCache = [];
    renderSiswaRows([]);
    setSiswaStatus(message, "error");
  }
}

function applySiswaFilter() {
  if (!siswaTable) return;
  const fNama = String(siswaFilterNama?.value || "").trim().toLowerCase();
  const fKelas = String(siswaFilterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(siswaFilterKelompok?.value || "").trim();
  const fShift = String(siswaFilterShift?.value || "").trim();
  const fSort = siswaFilterSort?.value || "az";

  let filtered = siswaCache.filter((siswa) => {
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

  renderSiswaRows(filtered);
  const total = siswaCache.length;
  setSiswaStatus(
    filtered.length === total
      ? `Menampilkan seluruh ${total} siswa`
      : `Menampilkan ${filtered.length} dari ${total} siswa`,
    "success"
  );
}

function renderLaporanRows(records) {
  if (!laporanTable) return;
  const currentRole = pb?.authStore.record?.role;
  const canEditSaran = ["Admin", "GPQ", "GPAI"].includes(currentRole);

  laporanTable.innerHTML = "";

  if (!records.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className = "px-4 py-5 text-ink/55";
    td.colSpan = 7;
    td.textContent = "Belum ada data siswa.";
    tr.appendChild(td);
    laporanTable.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();

  records.forEach((record) => {
    const tr = document.createElement("tr");
    tr.className = "transition hover:bg-parchment/60";

    // 1. Nama Siswa
    const tdNama = document.createElement("td");
    tdNama.className = "px-4 py-4 font-bold text-emeraldDeep";
    tdNama.textContent = record.nama_siswa || "-";
    tr.appendChild(tdNama);

    // 2. Kelas
    const tdKelas = document.createElement("td");
    tdKelas.className = "px-4 py-4 font-semibold text-ink/65";
    tdKelas.textContent = record.kelas || "-";
    tr.appendChild(tdKelas);

    // 3. Kelompok
    const tdKelompok = document.createElement("td");
    tdKelompok.className = "px-4 py-4 font-semibold text-ink/65";
    tdKelompok.textContent = record.kelompok || "-";
    tr.appendChild(tdKelompok);

    // 4. Shift
    const tdShift = document.createElement("td");
    tdShift.className = "px-4 py-4 font-semibold text-ink/65";
    tdShift.textContent = record.shift || "-";
    tr.appendChild(tdShift);

    // 5. Saran GPQ Icon
    const tdGpq = document.createElement("td");
    tdGpq.className = "px-4 py-4 text-center font-semibold text-ink/65";
    if (record.saran_gpq) {
      const icon = document.createElement("i");
      icon.className = "ph ph-check-circle text-2xl text-jade";
      tdGpq.appendChild(icon);
    } else {
      tdGpq.textContent = "-";
    }
    tr.appendChild(tdGpq);

    // 6. Saran GPAI Icon
    const tdGpai = document.createElement("td");
    tdGpai.className = "px-4 py-4 text-center font-semibold text-ink/65";
    if (record.saran_gpai) {
      const icon = document.createElement("i");
      icon.className = "ph ph-check-circle text-2xl text-jade";
      tdGpai.appendChild(icon);
    } else {
      tdGpai.textContent = "-";
    }
    tr.appendChild(tdGpai);

    // 7. Actions
    const tdAction = document.createElement("td");
    tdAction.className = "px-4 py-4";

    const divAction = document.createElement("div");
    divAction.className = "flex items-center gap-3";

    // Lihat Rapor Button
    const viewBtn = document.createElement("button");
    viewBtn.className = "flex items-center gap-1 text-sm font-bold text-emeraldDeep transition hover:text-jade";
    viewBtn.onclick = function() {
        if (window.viewRapor) {
            window.viewRapor(record.id, this);
        } else {
            console.error("viewRapor is not defined");
        }
    };

    const iconFile = document.createElement("i");
    iconFile.className = "ph ph-file-text text-lg";
    viewBtn.appendChild(iconFile);
    viewBtn.appendChild(document.createTextNode(" Lihat Rapor"));
    divAction.appendChild(viewBtn);

    // Edit Saran Button (if allowed)
    if (canEditSaran) {
      const editBtn = document.createElement("button");
      editBtn.setAttribute("data-edit-saran", record.id);
      editBtn.className = "flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-800";
      editBtn.type = "button";

      const iconPencil = document.createElement("i");
      iconPencil.className = "ph ph-pencil-simple text-lg";
      editBtn.appendChild(iconPencil);
      editBtn.appendChild(document.createTextNode(" Edit Saran"));
      divAction.appendChild(editBtn);
    }

    tdAction.appendChild(divAction);
    tr.appendChild(tdAction);

    fragment.appendChild(tr);
  });

  laporanTable.appendChild(fragment);
}

async function loadLaporan() {
  if (!laporanTable) return;
  
  if (laporanStatus) laporanStatus.textContent = "Memuat data laporan...";
  laporanTable.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.className = "px-4 py-5 text-ink/55";
  td.colSpan = 7;
  td.textContent = "Memuat data laporan...";
  tr.appendChild(td);
  laporanTable.appendChild(tr);

  try {
    const records = filterSiswaForCurrentRole(await fetchSiswaRecords());
    siswaCache = records;
    renderLaporanRows(records);
    if (laporanStatus) {
      const currentRole = pb?.authStore.record?.role;
      laporanStatus.textContent =
        currentRole === "GPQ"
          ? `${records.length} siswa binaan ditampilkan`
          : currentRole === "GPAI"
            ? `${records.length} siswa sesuai kelas GPAI ditampilkan`
            : `${records.length} siswa ditampilkan`;
      laporanStatus.classList.remove("text-red-700", "text-emeraldDeep", "text-ink/55");
      laporanStatus.classList.add("text-emeraldDeep");
    }
  } catch (error) {
    console.error("Gagal memuat laporan:", error);
    const message = error?.response?.message || error?.message || "Data laporan belum bisa dimuat.";
    siswaCache = [];
    renderLaporanRows([]);
    if (laporanStatus) {
      laporanStatus.textContent = message;
      laporanStatus.classList.remove("text-emeraldDeep", "text-ink/55");
      laporanStatus.classList.add("text-red-700");
    }
  }
}

function applyLaporanFilter() {
  if (!laporanTable) return;
  const fNama = String(laporanFilterNama?.value || "").trim().toLowerCase();
  const fKelas = String(laporanFilterKelas?.value || "").trim().toLowerCase();
  const fKelompok = String(laporanFilterKelompok?.value || "").trim();
  const fShift = String(laporanFilterShift?.value || "").trim();
  const fSort = laporanFilterSort?.value || "az";

  let filtered = siswaCache.filter((siswa) => {
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

  renderLaporanRows(filtered);
  const total = siswaCache.length;
  if (laporanStatus) {
      laporanStatus.textContent = filtered.length === total
        ? `Menampilkan seluruh ${total} siswa`
        : `Menampilkan ${filtered.length} dari ${total} siswa`;
  }
}

function openSaranModal(recordId) {
  if (!saranModal || !saranForm) return;

  const record = siswaCache.find((item) => item.id === recordId);
  if (!record) return;

  saranForm.reset();
  saranIdInput.value = record.id;
  saranModalTitle.textContent = `Edit Saran ${record.nama_siswa || "Siswa"}`;
  saranForm.elements.saran_gpq.value = record.saran_gpq || "";
  saranForm.elements.saran_gpai.value = record.saran_gpai || "";
  ["saran_gpq", "saran_gpai"].forEach((field) => {
    safeGet(saranForm.elements, field).readOnly = false;
    safeGet(saranForm.elements, field).classList.remove("opacity-60", "cursor-not-allowed");
  });

  const currentUser = pb?.authStore.record;
  if (currentUser?.role === "GPQ") {
    saranForm.elements.saran_gpai.readOnly = true;
    saranForm.elements.saran_gpai.classList.add("opacity-60", "cursor-not-allowed");
  } else if (currentUser?.role === "GPAI") {
    saranForm.elements.saran_gpq.readOnly = true;
    saranForm.elements.saran_gpq.classList.add("opacity-60", "cursor-not-allowed");
  }

  saranFormStatus?.classList.add("hidden");
  saranModal.classList.remove("hidden");
  saranModal.classList.add("flex");
}

function closeSaranModal() {
  if (!saranModal) return;
  saranModal.classList.add("hidden");
  saranModal.classList.remove("flex");
}

function setSaranFormStatus(message, tone = "info") {
  if (!saranFormStatus) return;

  saranFormStatus.textContent = message;
  saranFormStatus.classList.remove("hidden", "text-red-700", "text-emeraldDeep", "text-ink/55");
  saranFormStatus.classList.add(
    tone === "error" ? "text-red-700" : tone === "success" ? "text-emeraldDeep" : "text-ink/55"
  );
}

function setSaranFormLoading(isLoading) {
  if (!saranFormSubmit) return;
  saranFormSubmit.disabled = isLoading;
  saranFormSubmit.classList.toggle("cursor-wait", isLoading);
  saranFormSubmit.classList.toggle("opacity-70", isLoading);
}

async function submitSaranForm(event) {
  event.preventDefault();
  
  const recordId = saranIdInput.value;
  if (!recordId) return;

  const payload = {
    saran_gpq: saranForm.elements.saran_gpq.value.trim(),
    saran_gpai: saranForm.elements.saran_gpai.value.trim()
  };

  const currentUser = pb?.authStore.record;
  if (currentUser?.role === "GPQ") delete payload.saran_gpai;
  if (currentUser?.role === "GPAI") delete payload.saran_gpq;

  setSaranFormLoading(true);
  setSaranFormStatus("Menyimpan saran...");

  try {
    await pb.collection("siswa").update(recordId, payload);
    setSaranFormStatus("Saran berhasil disimpan.", "success");
    await loadLaporan();
    window.setTimeout(closeSaranModal, 450);
  } catch (error) {
    const message = error?.response?.message || "Saran belum bisa disimpan.";
    setSaranFormStatus(message, "error");
  } finally {
    setSaranFormLoading(false);
  }
}

function normalizeImportHeader(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getImportValue(row, aliases) {
  const entries = Object.entries(row);

  for (const alias of aliases) {
    const normalizedAlias = normalizeImportHeader(alias);
    const found = entries.find(([key]) => normalizeImportHeader(key) === normalizedAlias);
    if (found && String(found[1] ?? "").trim()) return String(found[1]).trim();
  }

  return "";
}

function getCriteriaImportValue(row, field, index) {
  const entries = Object.entries(row);
  const duplicateStyleKeys = [field, `${field}_1`, `${field}_2`];
  const usesDuplicateStyle = entries.some(([key]) => normalizeImportHeader(key) === normalizeImportHeader(field));

  if (usesDuplicateStyle) {
    const duplicateKey = safeGet(duplicateStyleKeys, index - 1);
    const found = entries.find(([key]) => normalizeImportHeader(key) === normalizeImportHeader(duplicateKey));
    if (found && String(found[1] ?? "").trim()) return String(found[1]).trim();
  }

  for (const candidate of [`${field} ${index}`, `${field}-${index}`, `${field}_${index}`]) {
    const normalizedCandidate = normalizeImportHeader(candidate);
    const found = entries.find(([key]) => normalizeImportHeader(key) === normalizedCandidate);
    if (found && String(found[1] ?? "").trim()) return String(found[1]).trim();
  }

  return "";
}

function normalizeSemester(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "genap" || text === "2" || text === "semester 2") return "Genap";
  return "Ganjil";
}

function buildTahfizhImportPayload(row) {
  return {
    category: "tahfizh-quran",
    kelas: getImportValue(row, ["Kelas", "Class"]) || "-",
    materi: getImportValue(row, ["Materi", "Surah", "Surat", "Nama Materi"]) || "Tahfizh Al-Qur'an",
    semester: normalizeSemester(getImportValue(row, ["Semester", "Smt"])),
    jumlah_ayat: getImportValue(row, ["Jumlah Ayat", "Jumlah_Ayat", "JumlahAyat", "Ayat"]),
    hafal_1: getCriteriaImportValue(row, "Hafal", 1),
    kategori_1: getCriteriaImportValue(row, "Kategori", 1),
    nilai_1: getCriteriaImportValue(row, "Nilai", 1),
    hafal_2: getCriteriaImportValue(row, "Hafal", 2),
    kategori_2: getCriteriaImportValue(row, "Kategori", 2),
    nilai_2: getCriteriaImportValue(row, "Nilai", 2),
    hafal_3: getCriteriaImportValue(row, "Hafal", 3),
    kategori_3: getCriteriaImportValue(row, "Kategori", 3),
    nilai_3: getCriteriaImportValue(row, "Nilai", 3)
  };
}

function buildSimpleMateriImportPayload(row, category) {
  return {
    category,
    kelas: getImportValue(row, ["Kelas", "Class"]) || "-",
    materi: getImportValue(row, ["Materi", "Nama Materi", "Doa", "Ibadah"]) || safeGet(materiLabels, category),
    semester: normalizeSemester(getImportValue(row, ["Semester", "Smt"]))
  };
}

function getMateriImportKey(record) {
  return [record.kelas, record.materi, record.semester]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

function getTahfizhTemplateRows() {
  return [
    {
      Kelas: "1",
      Materi: "QS. Al-Fatihah",
      Semester: "Ganjil",
      "Jumlah Ayat": "7",
      "Hafal 1": "3",
      "Kategori 1": "K",
      "Nilai 1": "<=70",
      "Hafal 2": "5",
      "Kategori 2": "C",
      "Nilai 2": "71-85",
      "Hafal 3": "7",
      "Kategori 3": "B",
      "Nilai 3": "86-100"
    },
    {
      Kelas: "2",
      Materi: "QS. An-Nas",
      Semester: "Genap",
      "Jumlah Ayat": "6",
      "Hafal 1": "2",
      "Kategori 1": "K",
      "Nilai 1": "<=70",
      "Hafal 2": "4",
      "Kategori 2": "C",
      "Nilai 2": "71-85",
      "Hafal 3": "6",
      "Kategori 3": "B",
      "Nilai 3": "86-100"
    }
  ];
}

function getSiswaTemplateRows() {
  return [
    {
      NIS: "2401001",
      NISN: "0123456789",
      "NAMA SISWA": "Ahmad Fikri",
      KELAS: "1A",
      KELOMPOK: "Kelompok 1",
      SHIFT: "Shift 1",
      STATUS: "Reguler",
      INKLUSIF: "Tidak",
      "NAMA GURU QUR'AN": "Ustadz Ali"
    },
    {
      NIS: "2401002",
      NISN: "0123456790",
      "NAMA SISWA": "Aisyah Zahra",
      KELAS: "1A",
      KELOMPOK: "Kelompok 2",
      SHIFT: "Shift 2",
      STATUS: "Pasca",
      INKLUSIF: "Ya",
      "NAMA GURU QUR'AN": "Ustadzah Fatimah"
    }
  ];
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadTahfizhTemplate(format) {
  if (!window.XLSX) {
    setQuranImportStatus("Library pembuat template belum termuat. Jalankan ulang server Node.js.", "error");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(getTahfizhTemplateRows());
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tahfizh Quran");

  if (format === "csv") {
    const csv = XLSX.write(workbook, { bookType: "csv", type: "string" });
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "template-tahfizh-quran.csv");
    setQuranImportStatus("Template CSV berhasil diunduh.", "success");
    return;
  }

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    "template-tahfizh-quran.xlsx"
  );
  setQuranImportStatus("Template Excel berhasil diunduh.", "success");
}

function downloadSiswaTemplate(format) {
  if (!window.XLSX) {
    setSiswaStatus("Library pembuat template belum termuat. Jalankan ulang server Node.js.", "error");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(getSiswaTemplateRows());
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");

  if (format === "csv") {
    const csv = XLSX.write(workbook, { bookType: "csv", type: "string" });
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "template-siswa.csv");
    setSiswaStatus("Template CSV berhasil diunduh.", "success");
    return;
  }

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    "template-siswa.xlsx"
  );
  setSiswaStatus("Template Excel berhasil diunduh.", "success");
}

function parseTahfizhWorkbook(workbook) {
  const sheetName = safeGet(workbook.SheetNames, 0);
  const firstSheet = safeGet(workbook.Sheets, sheetName);
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });

  return rows
    .map(buildTahfizhImportPayload)
    .filter((payload) =>
      [
        payload.kelas,
        payload.materi,
        payload.jumlah_ayat,
        payload.hafal_1,
        payload.kategori_1,
        payload.nilai_1,
        payload.hafal_2,
        payload.kategori_2,
        payload.nilai_2,
        payload.hafal_3,
        payload.kategori_3,
        payload.nilai_3
      ].some((value) => String(value || "").trim() && value !== "-")
    );
}

function parseSimpleMateriWorkbook(workbook, category) {
  const sheetName = safeGet(workbook.SheetNames, 0);
  const firstSheet = safeGet(workbook.Sheets, sheetName);
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });

  return rows
    .map((row) => buildSimpleMateriImportPayload(row, category))
    .filter((payload) => [payload.kelas, payload.materi].some((value) => String(value || "").trim() && value !== "-"));
}

function buildSiswaImportPayload(row) {
  return {
    nis: getImportValue(row, ["NIS"]),
    nisn: getImportValue(row, ["NISN"]),
    nama_siswa: getImportValue(row, ["NAMA SISWA", "Nama Siswa", "Nama", "Siswa"]),
    kelas: getImportValue(row, ["KELAS", "Kelas", "Class"]),
    kelompok: getImportValue(row, ["KELOMPOK", "Kelompok", "Group"]),
    shift: getImportValue(row, ["SHIFT", "Shift"]),
    status: getImportValue(row, ["STATUS", "Status"]) === "Pasca" ? "Pasca" : "Reguler",
    inklusif: ["ya", "y", "yes", "inklusif"].includes(
      getImportValue(row, ["INKLUSIF", "Inklusif"]).toLowerCase()
    )
      ? "Ya"
      : "Tidak",
    nama_guru_quran: getImportValue(row, ["NAMA GURU QUR'AN", "Nama Guru Quran", "Guru Quran", "Guru Qur'an"])
  };
}

function parseSiswaWorkbook(workbook) {
  const sheetName = safeGet(workbook.SheetNames, 0);
  const firstSheet = safeGet(workbook.Sheets, sheetName);
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });

  return rows
    .map(buildSiswaImportPayload)
    .filter((payload) => payload.nis && payload.nama_siswa && payload.kelas);
}

async function upsertMateriPayloads(category, payloads) {
  const existingRecords = (await fetchMateriRecords()).filter((record) => record.category === category);
  const existingByKey = new Map(existingRecords.map((record) => [getMateriImportKey(record), record]));
  let created = 0;
  let updated = 0;

  for (const payload of payloads) {
    const existing = existingByKey.get(getMateriImportKey(payload));

    if (existing) {
      await pb.collection("materi").update(existing.id, payload);
      updated += 1;
    } else {
      const createdRecord = await pb.collection("materi").create(payload);
      existingByKey.set(getMateriImportKey(createdRecord), createdRecord);
      created += 1;
    }
  }

  return { created, updated };
}

async function upsertSiswaPayloads(payloads) {
  const existingRecords = await fetchSiswaRecords();
  const existingByNis = new Map(existingRecords.map((record) => [String(record.nis || "").trim(), record]));
  let created = 0;
  let updated = 0;

  for (const payload of payloads) {
    const existing = existingByNis.get(payload.nis);

    if (existing) {
      await pb.collection("siswa").update(existing.id, payload);
      updated += 1;
    } else {
      const createdRecord = await pb.collection("siswa").create(payload);
      existingByNis.set(createdRecord.nis, createdRecord);
      created += 1;
    }
  }

  return { created, updated };
}

async function importTahfizhFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!["Admin", "GPQ", "GPAI"].includes(currentUser?.role)) {
    setQuranImportStatus("Anda tidak memiliki akses untuk import materi.", "error");
    event.target.value = "";
    return;
  }

  if (!window.XLSX) {
    setQuranImportStatus("Library pembaca Excel belum termuat. Jalankan ulang server Node.js.", "error");
    event.target.value = "";
    return;
  }

  setQuranImportStatus(`Membaca ${file.name}...`);

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const payloads = parseTahfizhWorkbook(workbook);

    if (!payloads.length) {
      setQuranImportStatus("Tidak ada baris materi yang bisa diimport.", "error");
      return;
    }

    const { created, updated } = await upsertMateriPayloads("tahfizh-quran", payloads);

    await loadMateri("tahfizh-quran");
    setQuranImportStatus(`Import selesai: ${created} data baru, ${updated} data diperbarui.`, "success");
  } catch (error) {
    const message = error?.response?.message || "File belum bisa diimport. Pastikan format header sudah sesuai.";
    setQuranImportStatus(message, "error");
  } finally {
    event.target.value = "";
  }
}

async function importSimpleMateriFile(event) {
  const file = event.target.files?.[0];
  const category = event.target.dataset.simpleMateriImportFile;
  if (!file || !category) return;

  if (!["Admin", "GPQ", "GPAI"].includes(currentUser?.role)) {
    setMateriStatus(category, "Anda tidak memiliki akses untuk import materi.", "error");
    event.target.value = "";
    return;
  }

  if (!window.XLSX) {
    setMateriStatus(category, "Library pembaca Excel belum termuat. Jalankan ulang server Node.js.", "error");
    event.target.value = "";
    return;
  }

  setMateriStatus(category, `Membaca ${file.name}...`);

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const payloads = parseSimpleMateriWorkbook(workbook, category);

    if (!payloads.length) {
      setMateriStatus(category, "Tidak ada baris materi yang bisa diimport.", "error");
      return;
    }

    const { created, updated } = await upsertMateriPayloads(category, payloads);

    await loadMateri(category);
    setMateriStatus(category, `Import selesai: ${created} data baru, ${updated} data diperbarui.`, "success");
  } catch (error) {
    const message = error?.response?.message || "File belum bisa diimport. Gunakan header Kelas, Materi, Semester.";
    setMateriStatus(category, message, "error");
  } finally {
    event.target.value = "";
  }
}

async function importSiswaFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!isAdmin()) {
    setSiswaStatus("Hanya Admin yang dapat import siswa.", "error");
    event.target.value = "";
    return;
  }

  if (!window.XLSX) {
    setSiswaStatus("Library pembaca Excel belum termuat. Jalankan ulang server Node.js.", "error");
    event.target.value = "";
    return;
  }

  setSiswaStatus(`Membaca ${file.name}...`);

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const payloads = parseSiswaWorkbook(workbook);

    if (!payloads.length) {
      setSiswaStatus("Tidak ada baris siswa yang bisa diimport. Pastikan NIS, NAMA SISWA, dan KELAS terisi.", "error");
      return;
    }

    const { created, updated } = await upsertSiswaPayloads(payloads);

    await loadSiswa();
    setSiswaStatus(`Import selesai: ${created} siswa baru, ${updated} siswa diperbarui.`, "success");
  } catch (error) {
    const message = error?.response?.message || "File belum bisa diimport. Gunakan template siswa yang disediakan.";
    setSiswaStatus(message, "error");
  } finally {
    event.target.value = "";
  }
}

async function submitSiswaForm(event) {
  event.preventDefault();

  if (!isAdmin() && !isGPQ() && !isGPAI()) {
    setSiswaFormStatus("Anda tidak memiliki akses untuk mengelola siswa.", "error");
    return;
  }

  const formData = new FormData(event.currentTarget);
  const recordId = siswaIdInput?.value || "";
  let payload = {};

  if (isAdmin()) {
    payload = {
      nis: String(formData.get("nis") || "").trim(),
      nisn: String(formData.get("nisn") || "").trim(),
      nama_siswa: String(formData.get("nama_siswa") || "").trim(),
      kelas: String(formData.get("kelas") || "").trim(),
      kelompok: String(formData.get("kelompok") || "").trim(),
      shift: String(formData.get("shift") || "").trim(),
      status: String(formData.get("status") || "Reguler").trim(),
      inklusif: String(formData.get("inklusif") || "Tidak").trim(),
      nama_guru_quran: String(formData.get("nama_guru_quran") || "").trim()
    };
  } else {
    if (!recordId) {
      setSiswaFormStatus("Hanya Admin yang dapat menambah siswa baru.", "error");
      return;
    }
    payload = {
      status: String(formData.get("status") || "Reguler").trim(),
      inklusif: String(formData.get("inklusif") || "Tidak").trim()
    };
  }

  siswaFormSubmit.disabled = true;
  siswaFormSubmit.classList.add("cursor-wait", "opacity-70");
  setSiswaFormStatus(recordId ? "Menyimpan perubahan..." : "Menyimpan siswa...");

  try {
    if (recordId) {
      await pb.collection("siswa").update(recordId, payload);
    } else {
      await pb.collection("siswa").create(payload);
    }

    siswaForm.reset();
    await loadSiswa();
    setSiswaFormStatus(recordId ? "Siswa berhasil diperbarui." : "Siswa berhasil disimpan.", "success");
    setSiswaStatus(recordId ? "Siswa berhasil diperbarui." : "Siswa berhasil ditambahkan.", "success");
    window.setTimeout(closeSiswaModal, 450);
  } catch (error) {
    const message = error?.response?.message || "Siswa belum bisa disimpan.";
    setSiswaFormStatus(message, "error");
  } finally {
    siswaFormSubmit.disabled = false;
    siswaFormSubmit.classList.remove("cursor-wait", "opacity-70");
  }
}

async function deleteSiswa(recordId) {
  if (!isAdmin()) {
    setSiswaStatus("Hanya Admin yang dapat menghapus siswa.", "error");
    return;
  }

  const record = siswaCache.find((item) => item.id === recordId);
  const label = record?.nama_siswa || record?.nis || recordId;

  if (!window.confirm(`Hapus siswa ${label}?`)) return;

  setSiswaStatus("Menghapus siswa...");

  try {
    await pb.collection("siswa").delete(recordId);
    await loadSiswa();
    setSiswaStatus("Siswa berhasil dihapus.", "success");
  } catch (error) {
    const message = error?.response?.message || "Siswa belum bisa dihapus.";
    setSiswaStatus(message, "error");
  }
}

async function submitMateriForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const category = form.elements.category.value;
  const recordId = materiIdInput?.value || "";
  const formData = new FormData(form);
  const submitButton = materiFormSubmit || form.querySelector("button[type='submit']");

  if (!["Admin", "GPQ", "GPAI"].includes(currentUser?.role)) {
    setMateriFormStatus("Anda tidak memiliki akses untuk menyimpan materi.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.classList.add("cursor-wait", "opacity-70");
  setMateriFormStatus(recordId ? "Menyimpan perubahan..." : "Menyimpan materi...");

  try {
    const payload = {
      category,
      kelas: String(formData.get("kelas")).trim(),
      materi: String(formData.get("materi")).trim(),
      semester: formData.get("semester")
    };

    if (category === "tahfizh-quran") {
      [
        "jumlah_ayat",
        "hafal_1",
        "kategori_1",
        "nilai_1",
        "hafal_2",
        "kategori_2",
        "nilai_2",
        "hafal_3",
        "kategori_3",
        "nilai_3"
      ].forEach((field) => {
        safeSet(payload, field, String(formData.get(field) || "").trim());
      });
    }

    if (recordId) {
      await pb.collection("materi").update(recordId, payload);
    } else {
      await pb.collection("materi").create(payload);
    }

    form.reset();
    await loadMateri(category);
    setMateriStatus(category, recordId ? "Materi berhasil diperbarui." : "Materi berhasil disimpan.", "success");
    setMateriFormStatus(recordId ? "Materi berhasil diperbarui." : "Materi berhasil disimpan.", "success");
    window.setTimeout(closeMateriModal, 450);
  } catch (error) {
    const message = error?.response?.message || "Materi belum bisa disimpan.";
    setMateriFormStatus(message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("cursor-wait", "opacity-70");
  }
}

async function deleteMateri(recordId, category) {
  if (!["Admin", "GPQ", "GPAI"].includes(currentUser?.role)) {
    setMateriStatus(category, "Anda tidak memiliki akses untuk menghapus materi.", "error");
    return;
  }

  const record = (safeGet(materiCache, category) || []).find((item) => item.id === recordId);
  const label = record?.materi || recordId;

  if (!window.confirm(`Hapus materi ${label}?`)) return;

  setMateriStatus(category, "Menghapus materi...");

  try {
    await pb.collection("materi").delete(recordId);
    await loadMateri(category);
    setMateriStatus(category, "Materi berhasil dihapus.", "success");
  } catch (error) {
    const message = error?.response?.message || "Materi belum bisa dihapus.";
    setMateriStatus(category, message, "error");
  }
}

function renderEmptyUsers(message) {
  if (!usersTable) return;

  usersTable.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.className = "px-4 py-5 text-ink/55";
  td.colSpan = 9;
  td.textContent = message;
  tr.appendChild(td);
  usersTable.appendChild(tr);
}

function renderRoleDetail(record) {
  if (record.role === "GPQ") {
    const shifts = [
      ["S1", record.gpq_shift_1 || record.gpq_kelompok || "-"],
      ["S2", record.gpq_shift_2 || "-"],
      ["S3", record.gpq_shift_3 || "-"]
    ];

    const wrapper = document.createElement("div");
    wrapper.className = "mt-2 flex max-w-64 flex-wrap gap-1.5";

    shifts.forEach(([label, value]) => {
      const span = document.createElement("span");
      span.className = "inline-flex items-center gap-1 rounded-[8px] border border-emeraldDeep/10 bg-white/80 px-2.5 py-1 text-[11px] font-extrabold text-ink/55";

      const spanLabel = document.createElement("span");
      spanLabel.className = "text-dateGold";
      spanLabel.textContent = label;

      const spanVal = document.createElement("span");
      spanVal.textContent = value;

      span.appendChild(spanLabel);
      span.appendChild(document.createTextNode(" "));
      span.appendChild(spanVal);
      wrapper.appendChild(span);
    });

    return wrapper;
  }

  if (record.role === "GPAI" && Array.isArray(record.gpai_kelas) && record.gpai_kelas.length) {
    const wrapper = document.createElement("div");
    wrapper.className = "mt-2 flex max-w-64 flex-wrap gap-1.5";

    record.gpai_kelas.forEach((kelas) => {
      const span = document.createElement("span");
      span.className = "inline-flex rounded-[8px] border border-emeraldDeep/10 bg-white/80 px-2.5 py-1 text-[11px] font-extrabold text-ink/55";
      span.textContent = kelas;
      wrapper.appendChild(span);
    });

    return wrapper;
  }

  return null;
}

function renderUsers(records) {
  if (!usersTable) return;

  usersTable.innerHTML = "";

  if (!records.length) {
    renderEmptyUsers("Belum ada data user.");
    return;
  }

  const fragment = document.createDocumentFragment();

  records.forEach((record) => {
    const displayName = record.name || "Tanpa nama";
    const avatarUrl = record.avatar ? pb.files.getURL(record, record.avatar, { thumb: "100x100" }) : "";
    const initial = getInitial(record);
    const isCurrentUser = pb.authStore.record?.id === record.id;

    const tr = document.createElement("tr");
    tr.className = "transition hover:bg-parchment/60";

    // 1. User Name & Avatar
    const tdUser = document.createElement("td");
    tdUser.className = "px-4 py-4";

    const divUser = document.createElement("div");
    divUser.className = "flex items-center gap-3";

    const divAvatar = document.createElement("div");
    divAvatar.className = "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-emeraldDeep text-sm font-extrabold text-white";

    if (avatarUrl) {
      const img = document.createElement("img");
      img.className = "h-full w-full object-cover";
      img.src = avatarUrl;
      img.alt = `Foto profil ${displayName}`;
      divAvatar.appendChild(img);
    } else {
      const spanInitial = document.createElement("span");
      spanInitial.textContent = initial;
      divAvatar.appendChild(spanInitial);
    }

    const divNameWrapper = document.createElement("div");
    const spanName = document.createElement("span");
    spanName.className = "block font-bold text-emeraldDeep";
    spanName.textContent = displayName;
    divNameWrapper.appendChild(spanName);

    divUser.appendChild(divAvatar);
    divUser.appendChild(divNameWrapper);
    tdUser.appendChild(divUser);
    tr.appendChild(tdUser);

    // 2. Nama Lengkap
    const tdNamaLengkap = document.createElement("td");
    tdNamaLengkap.className = "px-4 py-4 font-semibold text-ink/65";
    tdNamaLengkap.textContent = record.nama_lengkap || "-";
    tr.appendChild(tdNamaLengkap);

    // 3. NIY
    const tdNiy = document.createElement("td");
    tdNiy.className = "px-4 py-4 font-semibold text-ink/65";
    tdNiy.textContent = record.niy || "-";
    tr.appendChild(tdNiy);

    // 4. Email
    const tdEmail = document.createElement("td");
    tdEmail.className = "px-4 py-4 font-semibold text-ink/65";
    tdEmail.textContent = record.email || "-";
    tr.appendChild(tdEmail);

    // 3. Role
    const tdRole = document.createElement("td");
    tdRole.className = "px-4 py-4";
    const spanRole = document.createElement("span");
    spanRole.className = "inline-flex rounded-full bg-emeraldDeep/10 px-3 py-1 text-xs font-extrabold text-emeraldDeep";
    spanRole.textContent = record.role || "-";
    tdRole.appendChild(spanRole);
    tr.appendChild(tdRole);

    // 4. Role Detail
    const tdDetail = document.createElement("td");
    tdDetail.className = "px-4 py-4";
    const detailEl = renderRoleDetail(record);
    if (detailEl) {
      tdDetail.appendChild(detailEl);
    } else {
      const spanDash = document.createElement("span");
      spanDash.className = "text-sm font-semibold text-ink/40";
      spanDash.textContent = "-";
      tdDetail.appendChild(spanDash);
    }
    tr.appendChild(tdDetail);

    // 5. Verification Status
    const tdVerified = document.createElement("td");
    tdVerified.className = "px-4 py-4";
    const spanVerified = document.createElement("span");
    spanVerified.className = `inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
      record.verified ? "bg-jade/10 text-jade" : "bg-dateGold/15 text-dateGold"
    }`;
    spanVerified.textContent = record.verified ? "Terverifikasi" : "Belum";
    tdVerified.appendChild(spanVerified);
    tr.appendChild(tdVerified);

    // 6. Created Date
    const tdCreated = document.createElement("td");
    tdCreated.className = "px-4 py-4 font-semibold text-ink/55";
    tdCreated.textContent = formatDate(record.created);
    tr.appendChild(tdCreated);

    // 7. Actions
    const tdAction = document.createElement("td");
    tdAction.className = "px-4 py-4";

    const divAction = document.createElement("div");
    divAction.className = "flex items-center gap-2";

    const editBtn = document.createElement("button");
    editBtn.setAttribute("data-edit-user", record.id);
    editBtn.className = "rounded-[8px] border border-emeraldDeep/10 bg-white px-3 py-2 text-xs font-extrabold text-emeraldDeep transition hover:border-dateGold/50";
    editBtn.type = "button";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("data-delete-user", record.id);
    deleteBtn.className = "rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100";
    deleteBtn.type = "button";
    deleteBtn.textContent = isCurrentUser ? "Hapus Saya" : "Hapus";

    divAction.appendChild(editBtn);
    divAction.appendChild(deleteBtn);
    tdAction.appendChild(divAction);
    tr.appendChild(tdAction);

    fragment.appendChild(tr);
  });

  usersTable.appendChild(fragment);
}

async function loadUsers() {
  if (!isAdmin()) {
    if (totalUsers) totalUsers.textContent = "0";
    renderEmptyUsers("Menu User hanya dapat diakses oleh Admin.");
    setUsersStatus("Akses khusus Admin", "error");
    return;
  }

  renderEmptyUsers("Memuat data...");
  setUsersStatus("Memuat data user...");

  try {
    const result = await pb.collection("users").getList(1, 50, {
      sort: "-created"
    });

    usersCache = result.items;
    renderUsers(result.items);
    if (totalUsers) totalUsers.textContent = result.totalItems;
    setUsersStatus(`${result.totalItems} user ditemukan`, "success");
  } catch (error) {
    const message = error?.response?.message || "Data user belum bisa dimuat.";
    renderEmptyUsers(message);
    setUsersStatus(message, "error");
  }
}

async function submitUserForm(event) {
  event.preventDefault();

  if (!isAdmin()) {
    setUserFormStatus("Hanya Admin yang dapat mengelola user.", "error");
    return;
  }

  const recordId = userIdInput.value;
  const password = userPasswordInput.value.trim();
  const passwordConfirm = userPasswordConfirmInput.value.trim();
  const gpqShifts = getSelectedGpqShifts();
  const payload = {
    name: userNameInput.value.trim(),
    nama_lengkap: userNamaLengkapInput ? userNamaLengkapInput.value.trim() : "",
    niy: userNiyInput ? userNiyInput.value.trim() : "",
    email: userEmailInput.value.trim(),
    role: userRoleInput.value,
    gpq_kelompok: userRoleInput.value === "GPQ" ? gpqShifts.gpq_shift_1 : "",
    gpq_shift_1: userRoleInput.value === "GPQ" ? gpqShifts.gpq_shift_1 : "",
    gpq_shift_2: userRoleInput.value === "GPQ" ? gpqShifts.gpq_shift_2 : "",
    gpq_shift_3: userRoleInput.value === "GPQ" ? gpqShifts.gpq_shift_3 : "",
    gpai_kelas: userRoleInput.value === "GPAI" ? getSelectedGpaiClasses() : [],
    verified: userVerifiedInput.checked
  };

  if (payload.role === "GPQ" && (!payload.gpq_shift_1 || !payload.gpq_shift_2 || !payload.gpq_shift_3)) {
    setUserFormStatus("User GPQ harus memilih kelompok untuk Shift 1, Shift 2, dan Shift 3.", "error");
    return;
  }

  if (payload.role === "GPAI" && !payload.gpai_kelas.length) {
    setUserFormStatus("User GPAI harus memiliki minimal satu kelas.", "error");
    return;
  }

  if (!recordId || password || passwordConfirm) {
    payload.password = password;
    payload.passwordConfirm = passwordConfirm;
  }

  if (payload.password !== payload.passwordConfirm) {
    setUserFormStatus("Password dan konfirmasi belum sama.", "error");
    return;
  }

  setFormLoading(true);
  setUserFormStatus(recordId ? "Menyimpan perubahan..." : "Membuat user...");

  try {
    if (recordId) {
      await pb.collection("users").update(recordId, payload);
    } else {
      await pb.collection("users").create(payload);
    }

    setUserFormStatus("Data user berhasil disimpan.", "success");
    await loadUsers();
    window.setTimeout(closeUserModal, 450);
  } catch (error) {
    const message = error?.response?.message || "Data user belum bisa disimpan.";
    setUserFormStatus(message, "error");
  } finally {
    setFormLoading(false);
  }
}

async function deleteUser(recordId) {
  if (!isAdmin()) {
    setUsersStatus("Hanya Admin yang dapat menghapus user.", "error");
    return;
  }

  const record = usersCache.find((item) => item.id === recordId);
  const label = record?.name || record?.email || recordId;

  if (!window.confirm(`Hapus user ${label}?`)) return;

  setUsersStatus("Menghapus user...");

  try {
    await pb.collection("users").delete(recordId);
    if (pb.authStore.record?.id === recordId) {
      pb.authStore.clear();
      window.location.href = "/login";
      return;
    }

    await loadUsers();
    setUsersStatus("User berhasil dihapus.", "success");
  } catch (error) {
    const message = error?.response?.message || "User belum bisa dihapus.";
    setUsersStatus(message, "error");
  }
}

async function loadDashboardStats() {
  if (raporTerbit) {
    try {
      const siswaList = await pb.collection("siswa").getList(1, 1, { requestKey: null });
      raporTerbit.textContent = siswaList.totalItems;
    } catch (err) {
      console.error(err);
    }
  }

  if (ringkasanTilawah) {
    try {
      const tilawah = await pb.collection("materi").getList(1, 1, { filter: "category='bilqolam'", requestKey: null });
      ringkasanTilawah.textContent = tilawah.totalItems;
    } catch (err) { console.error(err); }
  }

  if (ringkasanHafalan) {
    try {
      const hafalan = await pb.collection("materi").getList(1, 1, { filter: "category='tahfizh-quran'", requestKey: null });
      ringkasanHafalan.textContent = hafalan.totalItems;
    } catch (err) { console.error(err); }
  }

  if (ringkasanAdab) {
    try {
      const adab = await pb.collection("materi").getList(1, 1, { filter: "category='tathbiq-ibadah'", requestKey: null });
      ringkasanAdab.textContent = adab.totalItems;
    } catch (err) { console.error(err); }
  }
}

async function bootDashboard() {
  if (!pb || !pb.authStore.isValid) {
    window.location.href = "/login";
    return;
  }

  fillUser(pb.authStore.record);

  try {
    const authData = await pb.collection("users").authRefresh();
    fillUser(authData.record);

    const userRole = authData.record?.role;
    if (userRole === "GPQ") {
      adminOnlyElements.forEach((element) => element.remove());
      gpaiOnlyElements.forEach((element) => element.remove());
      const allowedPaths = ["/dashboard", "/", "/siswa", "/tahfizh-quran", "/bilqolam", "/laporan"];
      if (!allowedPaths.includes(window.location.pathname)) {
        window.location.href = "/dashboard";
        return;
      }
    } else if (userRole === "GPAI") {
      adminOnlyElements.forEach((element) => element.remove());
      gpqOnlyElements.forEach((element) => {
        if (element.getAttribute("href") === "/bilqolam") {
          element.remove();
        }
      });
      const allowedPaths = ["/dashboard", "/", "/siswa", "/tathbiq-ibadah", "/tahfizh-quran", "/doa-harian", "/laporan"];
      if (!allowedPaths.includes(window.location.pathname)) {
        window.location.href = "/dashboard";
        return;
      }
    } else if (userRole === "Admin") {
      // Admin has access to all pages, no elements removed
    } else {
      // Unspecified/other role: remove all specialized menus, only allow dashboard & laporan
      adminOnlyElements.forEach((element) => element.remove());
      gpqOnlyElements.forEach((element) => element.remove());
      gpaiOnlyElements.forEach((element) => element.remove());
      const allowedPaths = ["/dashboard", "/", "/laporan"];
      if (!allowedPaths.includes(window.location.pathname)) {
        window.location.href = "/dashboard";
        return;
      }
    }

    if (usersTable || totalUsers) {
      await loadUsers();
    }

    if (materiTables.length) {
      await loadAllMateri();
    }

    if (siswaTable) {
      await loadSiswa();
    }

    if (laporanTable) {
      await loadLaporan();
    }

    if (window.location.pathname === "/dashboard" || window.location.pathname === "/") {
      await loadDashboardStats();
    }

  } catch (_error) {
    pb.authStore.clear();
    window.location.href = "/login";
  }
}

logoutButton?.addEventListener("click", () => {
  pb?.authStore.clear();
  window.location.href = "/login";
});

openUserModalButton?.addEventListener("click", () => openUserModal());
closeUserModalButtons.forEach((button) => button.addEventListener("click", closeUserModal));
userModal?.addEventListener("click", (event) => {
  if (event.target === userModal) closeUserModal();
});
userForm?.addEventListener("submit", submitUserForm);
userRoleInput?.addEventListener("change", () => {
  setGpqGroupVisibility();
  setGpaiClassVisibility();
});

closeSaranModalButtons.forEach((button) => button.addEventListener("click", closeSaranModal));
saranModal?.addEventListener("click", (event) => {
  if (event.target === saranModal) closeSaranModal();
});
saranForm?.addEventListener("submit", submitSaranForm);

[siswaFilterNama, siswaFilterKelas, siswaFilterKelompok, siswaFilterShift, siswaFilterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applySiswaFilter);
    el.addEventListener("change", applySiswaFilter);
  }
});

resetSiswaFilterBtn?.addEventListener("click", () => {
  if (siswaFilterNama) siswaFilterNama.value = "";
  if (siswaFilterKelas) siswaFilterKelas.value = "";
  if (siswaFilterKelompok) siswaFilterKelompok.value = "";
  if (siswaFilterShift) siswaFilterShift.value = "";
  if (siswaFilterSort) siswaFilterSort.value = "az";
  applySiswaFilter();
});

[laporanFilterNama, laporanFilterKelas, laporanFilterKelompok, laporanFilterShift, laporanFilterSort].forEach((el) => {
  if (el) {
    el.addEventListener("input", applyLaporanFilter);
    el.addEventListener("change", applyLaporanFilter);
  }
});

resetLaporanFilterBtn?.addEventListener("click", () => {
  if (laporanFilterNama) laporanFilterNama.value = "";
  if (laporanFilterKelas) laporanFilterKelas.value = "";
  if (laporanFilterKelompok) laporanFilterKelompok.value = "";
  if (laporanFilterShift) laporanFilterShift.value = "";
  if (laporanFilterSort) laporanFilterSort.value = "az";
  applyLaporanFilter();
});


materiTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateMateriTab(tab.dataset.materiTab));
});
openMateriModalButtons.forEach((button) => {
  button.addEventListener("click", () => openMateriModal(button.dataset.openMateriModal));
});
materiFilterInputs.forEach((input) => {
  const handleFilterChange = () => {
    const category =
      input.dataset.materiFilterSearch || input.dataset.materiFilterKelas || input.dataset.materiFilterSemester;
    applyMateriFilter(category);
  };

  input.addEventListener("input", handleFilterChange);
  input.addEventListener("change", handleFilterChange);
});
resetMateriFilterButtons.forEach((button) => {
  button.addEventListener("click", () => resetMateriFilter(button.dataset.resetMateriFilter));
});
closeMateriModalButtons.forEach((button) => button.addEventListener("click", closeMateriModal));
materiModal?.addEventListener("click", (event) => {
  if (event.target === materiModal) closeMateriModal();
});
materiForm?.addEventListener("submit", submitMateriForm);
quranImportFile?.addEventListener("change", importTahfizhFile);
simpleMateriImportFiles.forEach((input) => {
  input.addEventListener("change", importSimpleMateriFile);
});
downloadQuranTemplateButtons.forEach((button) => {
  button.addEventListener("click", () => downloadTahfizhTemplate(button.dataset.downloadQuranTemplate));
});
siswaImportFile?.addEventListener("change", importSiswaFile);
downloadSiswaTemplateButtons.forEach((button) => {
  button.addEventListener("click", () => downloadSiswaTemplate(button.dataset.downloadSiswaTemplate));
});
openSiswaModalButton?.addEventListener("click", openSiswaModal);
closeSiswaModalButtons.forEach((button) => button.addEventListener("click", closeSiswaModal));
siswaModal?.addEventListener("click", (event) => {
  if (event.target === siswaModal) closeSiswaModal();
});
siswaForm?.addEventListener("submit", submitSiswaForm);
siswaTable?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-siswa]");
  const deleteButton = event.target.closest("[data-delete-siswa]");

  if (editButton) {
    const record = siswaCache.find((item) => item.id === editButton.dataset.editSiswa);
    if (record) openSiswaModal(record);
  }

  if (deleteButton) {
    deleteSiswa(deleteButton.dataset.deleteSiswa);
  }
});
materiTables.forEach((table) => {
  table.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-materi]");
    const deleteButton = event.target.closest("[data-delete-materi]");

    if (editButton) {
      const category = editButton.dataset.editMateriCategory;
      const record = (materiCache[category] || []).find((item) => item.id === editButton.dataset.editMateri);
      if (record) openMateriModal(category, record);
    }

    if (deleteButton) {
      deleteMateri(deleteButton.dataset.deleteMateri, deleteButton.dataset.deleteMateriCategory);
    }
  });
});
usersTable?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-user]");
  const deleteButton = event.target.closest("[data-delete-user]");

  if (editButton) {
    const record = usersCache.find((item) => item.id === editButton.dataset.editUser);
    if (record) openUserModal(record);
  }

  if (deleteButton) {
    deleteUser(deleteButton.dataset.deleteUser);
  }
});

laporanTable?.addEventListener("click", (event) => {
  const editSaranBtn = event.target.closest("[data-edit-saran]");
  if (editSaranBtn) {
    openSaranModal(editSaranBtn.dataset.editSaran);
  }
});

function downloadUserTemplate() {
  if (!window.XLSX) {
    setUsersStatus("Library pembuat template belum termuat. Jalankan ulang server Node.js.", "error");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet([
    {
      "Nama": "Ahmad Guru",
      "Nama Lengkap": "Ahmad Guru, S.Pd.I",
      "NIY": "123456789",
      "Email": "ahmad@sdanaksaleh.sch.id",
      "Role": "GPAI"
    },
    {
      "Nama": "Siti Quran",
      "Nama Lengkap": "Siti Quran, S.Pd",
      "NIY": "987654321",
      "Email": "siti@sdanaksaleh.sch.id",
      "Role": "GPQ"
    }
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "User");

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    "template-user.xlsx"
  );
  setUsersStatus("Template Excel berhasil diunduh.", "success");
}

function buildUserImportPayload(row) {
  return {
    name: getImportValue(row, ["NAMA", "Nama", "Name"]),
    nama_lengkap: getImportValue(row, ["NAMA LENGKAP", "Nama Lengkap"]),
    niy: String(getImportValue(row, ["NIY", "niy", "Niy"]) || ""),
    email: getImportValue(row, ["EMAIL", "Email", "email"]),
    role: getImportValue(row, ["ROLE", "Role", "role"]),
    verified: true
  };
}

function parseUserWorkbook(workbook) {
  const sheetName = safeGet(workbook.SheetNames, 0);
  const firstSheet = safeGet(workbook.Sheets, sheetName);
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });

  return rows
    .map(buildUserImportPayload)
    .filter((payload) => payload.name && payload.email && payload.role);
}

async function upsertUserPayloads(payloads) {
  const existingRecords = usersCache || [];
  const existingByEmail = new Map(existingRecords.map((record) => [record.email.toLowerCase(), record]));
  let created = 0;
  let updated = 0;

  for (const payload of payloads) {
    const existing = existingByEmail.get(payload.email.toLowerCase());

    const isRoleAdmin = payload.role === "Admin";
    const defaultPassword = isRoleAdmin ? "4n4k54l3H" : "ansal123";

    if (existing) {
      // Update
      await pb.collection("users").update(existing.id, {
        name: payload.name,
        nama_lengkap: payload.nama_lengkap,
        niy: payload.niy,
        role: payload.role
      });
      updated++;
    } else {
      // Create
      payload.password = defaultPassword;
      payload.passwordConfirm = defaultPassword;
      
      await pb.collection("users").create(payload);
      created++;
    }
  }

  return { created, updated };
}

async function importUserFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!isAdmin()) {
    setUsersStatus("Hanya Admin yang dapat import user.", "error");
    event.target.value = "";
    return;
  }

  if (!window.XLSX) {
    setUsersStatus("Library pembaca Excel belum termuat. Jalankan ulang server Node.js.", "error");
    event.target.value = "";
    return;
  }

  setUsersStatus(`Membaca ${file.name}...`);

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const payloads = parseUserWorkbook(workbook);

    if (!payloads.length) {
      setUsersStatus("Tidak ada baris user yang bisa diimport. Pastikan Nama, Email, dan Role terisi.", "error");
      return;
    }

    const { created, updated } = await upsertUserPayloads(payloads);

    await loadUsers();
    setUsersStatus(`Import selesai: ${created} user baru, ${updated} user diperbarui.`, "success");
  } catch (error) {
    console.error("Import error", error);
    const message = error?.response?.message || "File belum bisa diimport. Pastikan format sesuai template.";
    setUsersStatus(message, "error");
  } finally {
    event.target.value = "";
  }
}

userImportFile?.addEventListener("change", importUserFile);
downloadUserTemplateButtons.forEach((button) => {
  button.addEventListener("click", () => downloadUserTemplate());
});

bootDashboard();
