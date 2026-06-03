const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");

function runSql(sql) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

try {
  let res = runSql(`select fields from _collections where name = 'siswa';`);
  let fields = JSON.parse(res);
  
  let updated = false;
  const newFields = ["materi_bilqolam_1", "materi_bilqolam_2", "materi_bilqolam_3"];
  for (const f of newFields) {
    if (!fields.some(x => x.name === f)) {
      fields.push({
        system: false,
        id: "text_" + f,
        name: f,
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      });
      updated = true;
    }
  }

  if (updated) {
    const newFieldsStr = JSON.stringify(fields).replace(/'/g, "''");
    runSql(`update _collections set fields = '${newFieldsStr}' where name = 'siswa';`);
    console.log("Successfully added fields to _collections.");
  } else {
    console.log("Fields already exist in _collections.");
  }

  const columns = runSql(`pragma table_info(siswa);`);
  for (const col of newFields) {
    if (!columns.split("\n").some((line) => line.split("|")[1] === col)) {
      runSql(`alter table siswa add column ${col} TEXT not null default '';`);
      console.log(`Added column ${col} to table siswa.`);
    }
  }

} catch(err) {
  console.error("Error:", err);
}
