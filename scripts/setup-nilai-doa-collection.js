const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const collectionId = "pbcnilaidoa001";
const collectionName = "nilai_doa";
const authOnlyRule = "@request.auth.id != ''";
const adminOnlyRule = "@request.auth.role = 'Admin'";

const fields = [
  {
    autogeneratePattern: "[a-z0-9]{15}",
    hidden: false,
    id: "text_nilaidoa_id",
    max: 15,
    min: 15,
    name: "id",
    pattern: "^[a-z0-9]+$",
    presentable: false,
    primaryKey: true,
    required: true,
    system: true,
    type: "text"
  },
  {
    hidden: false,
    id: "rel_siswa_id",
    name: "siswa",
    presentable: false,
    required: true,
    system: false,
    type: "relation",
    cascadeDelete: false,
    collectionId: "pbcsiswa001",
    maxSelect: 1,
    minSelect: null
  },
  {
    hidden: false,
    id: "rel_materi_id",
    name: "materi",
    presentable: false,
    required: true,
    system: false,
    type: "relation",
    cascadeDelete: false,
    collectionId: "pbcmateri001",
    maxSelect: 1,
    minSelect: null
  },
  {
    hidden: false,
    id: "num_nilai",
    name: "nilai",
    presentable: false,
    required: true,
    system: false,
    type: "number",
    max: 100,
    min: 0,
    noDecimal: false
  },
  {
    hidden: false,
    id: "autodate_nilaidoa_created",
    name: "created",
    onCreate: true,
    onUpdate: false,
    presentable: false,
    system: false,
    type: "autodate"
  },
  {
    hidden: false,
    id: "autodate_nilaidoa_updated",
    name: "updated",
    onCreate: true,
    onUpdate: true,
    presentable: false,
    system: false,
    type: "autodate"
  }
];

function runSql(sql) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

runSql(`
  create table if not exists ${collectionName} (
    id TEXT primary key not null default ('r'||lower(hex(randomblob(7)))),
    siswa TEXT not null default '',
    materi TEXT not null default '',
    nilai REAL not null default 0,
    created TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ')),
    updated TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ'))
  );
`);

const columns = runSql(`pragma table_info(${collectionName});`);
const schemaCols = [
  { name: "siswa", type: "TEXT", def: "''" },
  { name: "materi", type: "TEXT", def: "''" },
  { name: "nilai", type: "REAL", def: "0" }
];

schemaCols.forEach((col) => {
  if (!columns.split("\n").some((line) => line.split("|")[1] === col.name)) {
    runSql(`alter table ${collectionName} add column ${col.name} ${col.type} not null default ${col.def};`);
  }
});

runSql(`create unique index if not exists idx_nilaidoa_siswa_materi on ${collectionName}(siswa, materi);`);

const exists = runSql(`select count(*) from _collections where name = ${sqlString(collectionName)};`) === "1";
const values = [
  sqlString(collectionId),
  "false",
  sqlString("base"),
  sqlString(collectionName),
  sqlString(JSON.stringify(fields)),
  sqlString(JSON.stringify(["create unique index idx_nilaidoa_siswa_materi on nilai_doa (siswa, materi)"])),
  sqlString(authOnlyRule),
  sqlString(authOnlyRule),
  sqlString(adminOnlyRule),
  sqlString(adminOnlyRule),
  sqlString(adminOnlyRule),
  sqlString("{}")
];

if (exists) {
  runSql(
    [
      "update _collections",
      `set fields = ${values[4]},`,
      `indexes = ${values[5]},`,
      `listRule = ${values[6]},`,
      `viewRule = ${values[7]},`,
      `createRule = ${values[8]},`,
      `updateRule = ${values[9]},`,
      `deleteRule = ${values[10]},`,
      `options = ${values[11]},`,
      "updated = strftime('%Y-%m-%d %H:%M:%fZ')",
      `where name = ${sqlString(collectionName)};`
    ].join(" ")
  );
} else {
  runSql(`
    insert into _collections (
      id, system, type, name, fields, indexes, listRule, viewRule, createRule, updateRule, deleteRule, options
    ) values (${values.join(", ")});
  `);
}

console.log("Collection nilai_doa siap digunakan.");
