const fs = require("fs");
const path = require("path");

const jsPath = path.join(__dirname, "..", "public", "assets", "js", "bilqolam.js");
let content = fs.readFileSync(jsPath, "utf-8");

// 1. Update renderBilqolamRows
const oldRenderAvg = `      const avg = Math.round(((record.tajwid || 0) + (record.fashahah || 0) + (record.lagu || 0)) / 3);
      spanStatus.classList.add("bg-emeraldDeep", "text-white");
      spanStatus.textContent = \`\${record.jilid || "-"} (\${avg}%)\`;`;
const newRenderAvg = `      if (siswa.status === "Pasca") {
        spanStatus.classList.add("bg-emeraldDeep", "text-white");
        spanStatus.textContent = \`Tadarus: \${record.tadarus ?? "-"}, B.Arab: \${record.bahasa_arab ?? "-"}\`;
      } else {
        const avg = Math.round(((record.tajwid || 0) + (record.fashahah || 0) + (record.lagu || 0)) / 3);
        spanStatus.classList.add("bg-emeraldDeep", "text-white");
        spanStatus.textContent = \`\${record.jilid || "-"} (\${avg}%)\`;
      }`;
content = content.replace(oldRenderAvg, newRenderAvg);

// 2. Update openBilqolamModal
const oldModalInit = `  if (record) {
    bilqolamForm.elements.jilid.value = record.jilid || "";
    bilqolamForm.elements.tajwid.value = record.tajwid ?? "";
    bilqolamForm.elements.fashahah.value = record.fashahah ?? "";
    bilqolamForm.elements.lagu.value = record.lagu ?? "";
  }`;
const newModalInit = `  const standarContainer = document.querySelector("[data-standar-fields]");
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
  }`;
content = content.replace(oldModalInit, newModalInit);

// 3. Update submitBilqolamForm
const oldSubmitPayload = `  const payload = {
    siswa: siswaId,
    jilid: bilqolamForm.elements.jilid.value,
    tajwid: Number(bilqolamForm.elements.tajwid.value),
    fashahah: Number(bilqolamForm.elements.fashahah.value),
    lagu: Number(bilqolamForm.elements.lagu.value),
  };`;
const newSubmitPayload = `  const siswa = bilqolamSiswaCache.find(s => s.id === siswaId);
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
  }`;
content = content.replace(oldSubmitPayload, newSubmitPayload);

// 4. Update Bulk CSV Upload/Download logic
const oldHeaders = `const headers = ["NIS", "NAMA SISWA", "KELAS", "JILID", "TAJWID", "FASHAHAH", "LAGU"];`;
const newHeaders = `const headers = ["NIS", "NAMA SISWA", "KELAS", "JILID", "TAJWID", "FASHAHAH", "LAGU", "TADARUS", "BAHASA ARAB"];`;
content = content.replace(oldHeaders, newHeaders);

const oldRowPush = `            const row = [
                siswa.nis || siswa.nisn || "-",
                siswa.nama_siswa || "-",
                siswa.kelas || "-",
                record ? record.jilid : "",
                record && record.tajwid !== null ? record.tajwid : "",
                record && record.fashahah !== null ? record.fashahah : "",
                record && record.lagu !== null ? record.lagu : ""
            ];`;
const newRowPush = `            const row = [
                siswa.nis || siswa.nisn || "-",
                siswa.nama_siswa || "-",
                siswa.kelas || "-",
                record ? record.jilid : "",
                record && record.tajwid !== null ? record.tajwid : "",
                record && record.fashahah !== null ? record.fashahah : "",
                record && record.lagu !== null ? record.lagu : "",
                record && record.tadarus !== null ? record.tadarus : "",
                record && record.bahasa_arab !== null ? record.bahasa_arab : ""
            ];`;
content = content.replace(oldRowPush, newRowPush);

const oldUploadParse = `                const jilid = (row[3] || "").trim();
                let tajwid = row[4] ? parseInt(row[4], 10) : null;
                let fashahah = row[5] ? parseInt(row[5], 10) : null;
                let lagu = row[6] ? parseInt(row[6], 10) : null;

                if (isNaN(tajwid)) tajwid = null;
                if (isNaN(fashahah)) fashahah = null;
                if (isNaN(lagu)) lagu = null;

                if (jilid === "" && tajwid === null && fashahah === null && lagu === null) continue;

                const record = bilqolamCache.find(r => r.siswa === siswa.id);

                if (record) {
                    if (record.jilid !== jilid || record.tajwid !== tajwid || record.fashahah !== fashahah || record.lagu !== lagu) {
                        updates.push({ id: record.id, payload: { jilid, tajwid, fashahah, lagu } });
                    }
                } else {
                    creates.push({ siswa: siswa.id, jilid, tajwid, fashahah, lagu });
                }`;
const newUploadParse = `                const jilid = (row[3] || "").trim();
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

                if (jilid === "" && tajwid === null && fashahah === null && lagu === null && tadarus === null && bahasa_arab === null) continue;

                const record = bilqolamCache.find(r => r.siswa === siswa.id);

                if (record) {
                    if (record.jilid !== jilid || record.tajwid !== tajwid || record.fashahah !== fashahah || record.lagu !== lagu || record.tadarus !== tadarus || record.bahasa_arab !== bahasa_arab) {
                        updates.push({ id: record.id, payload: { jilid, tajwid, fashahah, lagu, tadarus, bahasa_arab } });
                    }
                } else {
                    creates.push({ siswa: siswa.id, jilid, tajwid, fashahah, lagu, tadarus, bahasa_arab });
                }`;
content = content.replace(oldUploadParse, newUploadParse);

fs.writeFileSync(jsPath, content, "utf-8");
console.log("Successfully updated bilqolam.js with Pasca logic!");
