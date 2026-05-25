const { execFileSync } = require("child_process");
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/pb_data/data.db");
const authOnlyRule = "@request.auth.id != ''";
const adminOnlyRule = "@request.auth.role = 'Admin'";

function runSql(sql, options = {}) {
  const output = execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"]
  });

  return typeof output === "string" ? output.trim() : "";
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

const options = JSON.parse(runSql("select options from _collections where name = 'users';"));
options.manageRule = adminOnlyRule;

runSql(
  [
    "update _collections",
    `set listRule = ${sqlString(adminOnlyRule)},`,
    `viewRule = ${sqlString(authOnlyRule)},`,
      "createRule = '',",
    `updateRule = ${sqlString(adminOnlyRule)},`,
    `deleteRule = ${sqlString(adminOnlyRule)},`,
    `options = ${sqlString(JSON.stringify(options))},`,
    "updated = strftime('%Y-%m-%d %H:%M:%fZ')",
    "where name = 'users';"
  ].join(" "),
);

console.log("Collection users sekarang hanya dapat dikelola oleh role Admin.");
