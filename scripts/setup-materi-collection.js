const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const adminOnlyRule = "@request.auth.role = 'Admin'";
const collectionId = "pbcmateri001";
const collectionName = "materi";

function textField(id, name, max = 255) {
  return {
    autogeneratePattern: "",
    hidden: false,
    id,
    max,
    min: 0,
    name,
    pattern: "",
    presentable: false,
    primaryKey: false,
    required: false,
    system: false,
    type: "text"
  };
}

const fields = [
  {
    autogeneratePattern: "[a-z0-9]{15}",
    hidden: false,
    id: "text_materi_id",
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
    id: "select_materi_category",
    maxSelect: 1,
    name: "category",
    presentable: false,
    required: true,
    system: false,
    type: "select",
    values: ["tahfizh-quran", "doa-harian", "tathbiq-ibadah"]
  },
  {
    autogeneratePattern: "",
    hidden: false,
    id: "text_materi_kelas",
    max: 50,
    min: 1,
    name: "kelas",
    pattern: "",
    presentable: false,
    primaryKey: false,
    required: true,
    system: false,
    type: "text"
  },
  {
    autogeneratePattern: "",
    hidden: false,
    id: "text_materi_materi",
    max: 500,
    min: 1,
    name: "materi",
    pattern: "",
    presentable: true,
    primaryKey: false,
    required: true,
    system: false,
    type: "text"
  },
  {
    hidden: false,
    id: "select_materi_semester",
    maxSelect: 1,
    name: "semester",
    presentable: false,
    required: true,
    system: false,
    type: "select",
    values: ["Ganjil", "Genap"]
  },
  textField("text_materi_jumlah_ayat", "jumlah_ayat", 20),
  textField("text_materi_hafal_1", "hafal_1", 20),
  textField("text_materi_kategori_1", "kategori_1", 20),
  textField("text_materi_nilai_1", "nilai_1", 30),
  textField("text_materi_hafal_2", "hafal_2", 20),
  textField("text_materi_kategori_2", "kategori_2", 20),
  textField("text_materi_nilai_2", "nilai_2", 30),
  textField("text_materi_hafal_3", "hafal_3", 20),
  textField("text_materi_kategori_3", "kategori_3", 20),
  textField("text_materi_nilai_3", "nilai_3", 30),
  {
    hidden: false,
    id: "autodate_materi_created",
    name: "created",
    onCreate: true,
    onUpdate: false,
    presentable: false,
    system: false,
    type: "autodate"
  },
  {
    hidden: false,
    id: "autodate_materi_updated",
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
    category TEXT not null default '',
    kelas TEXT not null default '',
    materi TEXT not null default '',
    semester TEXT not null default '',
    created TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ')),
    updated TEXT not null default (strftime('%Y-%m-%d %H:%M:%fZ'))
  );
`);

const columns = runSql(`pragma table_info(${collectionName});`);
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
].forEach((column) => {
  if (!columns.split("\n").some((line) => line.split("|")[1] === column)) {
    runSql(`alter table ${collectionName} add column ${column} TEXT not null default '';`);
  }
});

const exists = runSql(`select count(*) from _collections where name = ${sqlString(collectionName)};`) === "1";
const values = [
  sqlString(collectionId),
  "false",
  sqlString("base"),
  sqlString(collectionName),
  sqlString(JSON.stringify(fields)),
  sqlString("[]"),
  sqlString(adminOnlyRule),
  sqlString(adminOnlyRule),
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

console.log("Collection materi siap digunakan.");
