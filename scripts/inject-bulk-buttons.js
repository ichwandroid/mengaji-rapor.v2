const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const sections = [
    { html: "tathbiq-ibadah.html", prefix: "tathbiq-ibadah" },
    { html: "doa-harian.html", prefix: "doa-harian" },
    { html: "bilqolam.html", prefix: "bilqolam" },
    { html: "tahfizh-quran.html", prefix: "tahfizh-quran" }
];

sections.forEach(({ html, prefix }) => {
    const filePath = path.join(publicDir, html);
    let content = fs.readFileSync(filePath, "utf-8");

    const target = `<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-dateGold">Daftar Siswa</p>
                <h3 class="mt-3 font-display text-2xl font-extrabold text-emeraldDeep">Tabel Penilaian</h3>
              </div>`;

    const buttons = `              <div class="flex items-center gap-3">
                <button data-${prefix}-download class="h-10 rounded-[8px] border border-emeraldDeep/10 bg-white px-4 text-sm font-bold text-emeraldDeep transition hover:bg-parchment flex items-center gap-2" type="button">
                  <i class="ph ph-download-simple text-lg"></i> Unduh Templat
                </button>
                <label class="h-10 rounded-[8px] bg-emeraldDeep px-4 text-sm font-bold text-white shadow-soft transition hover:bg-jade flex items-center gap-2 cursor-pointer">
                  <i class="ph ph-upload-simple text-lg"></i> Unggah Nilai
                  <input type="file" data-${prefix}-upload accept=".csv" class="hidden" />
                </label>
              </div>`;

    if (!content.includes(`data-${prefix}-download`)) {
        content = content.replace(target, `${target}\n${buttons}`);
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Added UI buttons to ${html}`);
    }
});
