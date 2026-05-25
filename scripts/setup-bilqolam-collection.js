const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const collectionId = "pbcbilqolam01";
const collectionName = "bilqolam";
const authOnlyRule = "@request.auth.id != ''";
const adminOnlyRule = "@request.auth.role = 'Admin'";

const fields = [
  {
    autogeneratePattern: "[a-z0-9]{15}",
    hidden: false,
    id: "text_bilqolam_id",
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
    autogeneratePattern: "",
    hidden: false,
    id: "text_jilid",
    max: 255,
    min: 0,
    name: "jilid",
    pattern: "",
    presentable: true,
    primaryKey: false,
    required: true,
    system: false,
    type: "text"
  },
  {
    hidden: false,
    id: "num_tajwid",
    name: "tajwid",
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
    id: "num_fashahah",
    name: "fashahah",
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
    id: "num_lagu",
    name: "lagu",
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
    id: "autodate_bilqolam_created",
    name: "created",
    onCreate: true,
    onUpdate: false,
    presentable: false,
    system: false,
    type: "autodate"
  },
  {
    hidden: false,
    id: "autodate_bilqolam_updated",
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
    jilid TEXT not null default '',
    tajwid REAL not null default 0,
    fashahah REAL not null default 0,
    lagu REAL not null default 0,
    created TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ')),
    updated TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ'))
  );
`);

const columns = runSql(`pragma table_info(${collectionName});`);
const schemaCols = [
  { name: "siswa", type: "TEXT", def: "''" },
  { name: "jilid", type: "TEXT", def: "''" },
  { name: "tajwid", type: "REAL", def: "0" },
  { name: "fashahah", type: "REAL", def: "0" },
  { name: "lagu", type: "REAL", def: "0" }
];

schemaCols.forEach((col) => {
  if (!columns.split("\n").some((line) => line.split("|")[1] === col.name)) {
    runSql(`alter table ${collectionName} add column ${col.name} ${col.type} not null default ${col.def};`);
  }
});

runSql(`create unique index if not exists idx_bilqolam_siswa on ${collectionName}(siswa);`);

const exists = runSql(`select count(*) from _collections where name = ${sqlString(collectionName)};`) === "1";
const values = [
  sqlString(collectionId),
  "false",
  sqlString("base"),
  sqlString(collectionName),
  sqlString(JSON.stringify(fields)),
  sqlString(JSON.stringify(["create unique index idx_bilqolam_siswa on bilqolam (siswa)"])),
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

console.log("Collection bilqolam siap digunakan.");
