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
  // Get current fields
  const collections = execFileSync("sqlite3", [dbPath, `select fields from _collections where name = 'materi';`], { encoding: "utf8" });
  if (collections) {
      let fields = JSON.parse(collections.trim());
      
      let updated = false;
      fields = fields.map(f => {
          if (f.name === "urutan") {
              if (f.max === 0) {
                  delete f.max; // Remove max limit
                  updated = true;
              }
              if (f.min === 0) {
                  delete f.min;
                  updated = true;
              }
          }
          return f;
      });

      if (updated) {
          const newFieldsStr = JSON.stringify(fields).replace(/'/g, "''");
          runSql(`update _collections set fields = '${newFieldsStr}' where name = 'materi';`);
          console.log("Schema updated in _collections. Removed max/min limit from urutan.");
      } else {
          console.log("Field 'urutan' max limit already removed.");
      }
  }
} catch (err) {
  console.log("Error:", err.message);
}
