const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const laporanHtml = path.join(publicDir, "laporan.html");

let content = fs.readFileSync(laporanHtml, "utf-8");

const buttons = `              <div class="flex items-center gap-3 mt-4 sm:mt-0">
                <button data-laporan-download class="h-10 rounded-[8px] border border-emeraldDeep/10 bg-white px-4 text-sm font-bold text-emeraldDeep transition hover:bg-parchment flex items-center gap-2" type="button">
                  <i class="ph ph-download-simple text-lg"></i> Unduh Templat Saran
                </button>
                <label class="h-10 rounded-[8px] bg-emeraldDeep px-4 text-sm font-bold text-white shadow-soft transition hover:bg-jade flex items-center gap-2 cursor-pointer">
                  <i class="ph ph-upload-simple text-lg"></i> Unggah Saran
                  <input type="file" data-laporan-upload accept=".csv" class="hidden" />
                </label>
              </div>`;

if (!content.includes(`data-laporan-download`)) {
    content = content.replace(/(<h3[^>]*>Tabel Saran Rapor<\/h3>\s*<\/div>)/, `$1\n${buttons}`);
    fs.writeFileSync(laporanHtml, content, "utf-8");
    console.log(`Added UI buttons to laporan.html`);
} else {
    console.log(`Buttons already exist in laporan.html`);
}
