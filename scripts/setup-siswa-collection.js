const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const collectionId = "pbcsiswa001";
const collectionName = "siswa";
const authOnlyRule = "@request.auth.id != ''";
const adminOnlyRule = "@request.auth.role = 'Admin'";
const saranUpdateRule = "@request.auth.role = 'Admin' || @request.auth.role = 'GPQ' || @request.auth.role = 'GPAI'";

function textField(id, name, max = 255, required = false, presentable = false) {
  return {
    autogeneratePattern: "",
    hidden: false,
    id,
    max,
    min: required ? 1 : 0,
    name,
    pattern: "",
    presentable,
    primaryKey: false,
    required,
    system: false,
    type: "text"
  };
}

const fields = [
  {
    autogeneratePattern: "[a-z0-9]{15}",
    hidden: false,
    id: "text_siswa_id",
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
  textField("text_siswa_nis", "nis", 50, true),
  textField("text_siswa_nisn", "nisn", 50),
  textField("text_siswa_nama", "nama_siswa", 255, true, true),
  textField("text_siswa_kelas", "kelas", 50, true),
  textField("text_siswa_kelompok", "kelompok", 100),
  textField("text_siswa_shift", "shift", 50),
  textField("text_siswa_status", "status", 100),
  textField("text_siswa_inklusif", "inklusif", 20),
  textField("text_siswa_guru", "nama_guru_quran", 255),
  textField("text_siswa_saran_gpq", "saran_gpq", 1000),
  textField("text_siswa_saran_gpai", "saran_gpai", 1000),
  {
    hidden: false,
    id: "autodate_siswa_created",
    name: "created",
    onCreate: true,
    onUpdate: false,
    presentable: false,
    system: false,
    type: "autodate"
  },
  {
    hidden: false,
    id: "autodate_siswa_updated",
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
    nis TEXT not null default '',
    nisn TEXT not null default '',
    nama_siswa TEXT not null default '',
    kelas TEXT not null default '',
    kelompok TEXT not null default '',
    shift TEXT not null default '',
    status TEXT not null default '',
    inklusif TEXT not null default '',
    nama_guru_quran TEXT not null default '',
    saran_gpq TEXT not null default '',
    saran_gpai TEXT not null default '',
    created TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ')),
    updated TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ'))
  );
`);

const columns = runSql(`pragma table_info(${collectionName});`);
["nis", "nisn", "nama_siswa", "kelas", "kelompok", "shift", "status", "inklusif", "nama_guru_quran", "saran_gpq", "saran_gpai"].forEach((column) => {
  if (!columns.split("\n").some((line) => line.split("|")[1] === column)) {
    runSql(`alter table ${collectionName} add column ${column} TEXT not null default '';`);
  }
});

runSql(`create unique index if not exists idx_siswa_nis on ${collectionName}(nis);`);

const exists = runSql(`select count(*) from _collections where name = ${sqlString(collectionName)};`) === "1";
const values = [
  sqlString(collectionId),
  "false",
  sqlString("base"),
  sqlString(collectionName),
  sqlString(JSON.stringify(fields)),
  sqlString(JSON.stringify(["create unique index idx_siswa_nis on siswa (nis)"])),
  sqlString(authOnlyRule),
  sqlString(authOnlyRule),
  sqlString(adminOnlyRule),
  sqlString(saranUpdateRule),
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

console.log("Collection siswa siap digunakan.");
