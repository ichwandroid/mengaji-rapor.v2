const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const roleField = {
  hidden: false,
  id: "select_users_role",
  maxSelect: 1,
  name: "role",
  presentable: false,
  required: false,
  system: false,
  type: "select",
  values: ["-", "Admin", "GPQ", "GPAI"]
};
const gpaiClasses = Array.from({ length: 6 }, (_, index) => index + 1).flatMap((grade) =>
  ["A", "B", "C", "D"].map((letter) => `${grade}${letter}`)
);
const gpaiKelasField = {
  hidden: false,
  id: "select_users_gpai_kelas",
  maxSelect: gpaiClasses.length,
  name: "gpai_kelas",
  presentable: false,
  required: false,
  system: false,
  type: "select",
  values: gpaiClasses
};
const gpqGroups = Array.from({ length: 12 }, (_, index) => `Kelompok ${index + 1}`);
function gpqShiftField(id, name) {
  return {
    hidden: false,
    id,
    maxSelect: 1,
    name,
    presentable: false,
    required: false,
    system: false,
    type: "select",
    values: gpqGroups
  };
}

const gpqKelompokField = {
  hidden: false,
  id: "select_users_gpq_kelompok",
  maxSelect: 1,
  name: "gpq_kelompok",
  presentable: false,
  required: false,
  system: false,
  type: "select",
  values: gpqGroups
};
const gpqShiftFields = [
  gpqShiftField("select_users_gpq_shift_1", "gpq_shift_1"),
  gpqShiftField("select_users_gpq_shift_2", "gpq_shift_2"),
  gpqShiftField("select_users_gpq_shift_3", "gpq_shift_3")
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

const columns = runSql("pragma table_info(users);");

if (!columns.split("\n").some((line) => line.split("|")[1] === "role")) {
  runSql("alter table users add column role TEXT not null default '-';");
}

if (!columns.split("\n").some((line) => line.split("|")[1] === "gpai_kelas")) {
  runSql("alter table users add column gpai_kelas JSON not null default '[]';");
}

if (!columns.split("\n").some((line) => line.split("|")[1] === "gpq_kelompok")) {
  runSql("alter table users add column gpq_kelompok TEXT not null default '';");
}

["gpq_shift_1", "gpq_shift_2", "gpq_shift_3"].forEach((column) => {
  if (!columns.split("\n").some((line) => line.split("|")[1] === column)) {
    runSql(`alter table users add column ${column} TEXT not null default '';`);
  }
});

const fields = JSON.parse(runSql("select fields from _collections where name = 'users';"));
let nextFields = fields.some((field) => field.name === "role")
  ? fields.map((field) => (field.name === "role" ? { ...field, ...roleField } : field))
  : [
      ...fields.filter((field) => !["created", "updated"].includes(field.name)),
      roleField,
      ...fields.filter((field) => ["created", "updated"].includes(field.name))
    ];

nextFields = nextFields.some((field) => field.name === "gpai_kelas")
  ? nextFields.map((field) => (field.name === "gpai_kelas" ? { ...field, ...gpaiKelasField } : field))
  : [
      ...nextFields.filter((field) => !["created", "updated"].includes(field.name)),
      gpaiKelasField,
      ...nextFields.filter((field) => ["created", "updated"].includes(field.name))
    ];

nextFields = nextFields.some((field) => field.name === "gpq_kelompok")
  ? nextFields.map((field) => (field.name === "gpq_kelompok" ? { ...field, ...gpqKelompokField } : field))
  : [
      ...nextFields.filter((field) => !["created", "updated"].includes(field.name)),
      gpqKelompokField,
      ...nextFields.filter((field) => ["created", "updated"].includes(field.name))
    ];

gpqShiftFields.forEach((gpqShift) => {
  nextFields = nextFields.some((field) => field.name === gpqShift.name)
    ? nextFields.map((field) => (field.name === gpqShift.name ? { ...field, ...gpqShift } : field))
    : [
        ...nextFields.filter((field) => !["created", "updated"].includes(field.name)),
        gpqShift,
        ...nextFields.filter((field) => ["created", "updated"].includes(field.name))
      ];
});

runSql(
  [
    "update _collections",
    `set fields = ${sqlString(JSON.stringify(nextFields))},`,
    "updated = strftime('%Y-%m-%d %H:%M:%fZ')",
    "where name = 'users';"
  ].join(" ")
);

runSql("update users set role = '-' where role is null or role = '';");

console.log("Field role, kelompok GPQ, shift GPQ, dan kelas GPAI berhasil ditambahkan ke collection users.");
