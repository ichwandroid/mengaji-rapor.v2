const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");

const namaLengkapField = {
  hidden: false,
  id: "text_users_nama_lengkap",
  maxSelect: 1,
  name: "nama_lengkap",
  presentable: false,
  required: false,
  system: false,
  type: "text"
};

const niyField = {
  hidden: false,
  id: "text_users_niy",
  maxSelect: 1,
  name: "niy",
  presentable: false,
  required: false,
  system: false,
  type: "text"
};

function runSql(sql) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

const columns = runSql("pragma table_info(users);");

if (!columns.split("\n").some((line) => line.split("|")[1] === "nama_lengkap")) {
  runSql("alter table users add column nama_lengkap TEXT not null default '';");
}

if (!columns.split("\n").some((line) => line.split("|")[1] === "niy")) {
  runSql("alter table users add column niy TEXT not null default '';");
}

const fields = JSON.parse(runSql("select fields from _collections where name = 'users';"));

let nextFields = fields.some((field) => field.name === "nama_lengkap")
  ? fields.map((field) => (field.name === "nama_lengkap" ? { ...field, ...namaLengkapField } : field))
  : [
      ...fields.filter((field) => !["created", "updated"].includes(field.name)),
      namaLengkapField,
      ...fields.filter((field) => ["created", "updated"].includes(field.name))
    ];

nextFields = nextFields.some((field) => field.name === "niy")
  ? nextFields.map((field) => (field.name === "niy" ? { ...field, ...niyField } : field))
  : [
      ...nextFields.filter((field) => !["created", "updated"].includes(field.name)),
      niyField,
      ...nextFields.filter((field) => ["created", "updated"].includes(field.name))
    ];

runSql(
  [
    "update _collections",
    `set fields = ${sqlString(JSON.stringify(nextFields))},`,
    "updated = strftime('%Y-%m-%d %H:%M:%fZ')",
    "where name = 'users';"
  ].join(" ")
);

console.log("Field nama_lengkap dan niy berhasil ditambahkan ke collection users.");
