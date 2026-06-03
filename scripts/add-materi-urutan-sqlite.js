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
  runSql(`alter table materi add column urutan NUMERIC not null default 0;`);
  console.log("Column 'urutan' added to SQLite.");
} catch (err) {
  console.log("Column 'urutan' might already exist.", err.message);
}

// Get current fields
const collections = execFileSync("sqlite3", [dbPath, `select fields from _collections where name = 'materi';`], { encoding: "utf8" });
if (collections) {
    let fields = JSON.parse(collections.trim());
    if (!fields.find(f => f.name === "urutan")) {
        fields.push({
            "autogeneratePattern": "",
            "help": "",
            "hidden": false,
            "id": "text_urutan",
            "max": 0,
            "min": 0,
            "name": "urutan",
            "pattern": "",
            "presentable": false,
            "primaryKey": false,
            "required": false,
            "system": false,
            "type": "number"
        });
        
        const newFieldsStr = JSON.stringify(fields).replace(/'/g, "''");
        runSql(`update _collections set fields = '${newFieldsStr}' where name = 'materi';`);
        console.log("Schema updated in _collections");
    } else {
        console.log("Field 'urutan' already in schema");
    }
}
