const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const dbPath = path.join(rootDir, "database/pb_data/data.db");
const clientPath = path.join(rootDir, "database/client.json");

function runSql(sql) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

if (!fs.existsSync(dbPath)) {
  throw new Error(`PocketBase database tidak ditemukan: ${dbPath}`);
}

if (!fs.existsSync(clientPath)) {
  throw new Error(`Google OAuth client config tidak ditemukan: ${clientPath}`);
}

const googleClient = JSON.parse(fs.readFileSync(clientPath, "utf8")).web;

if (!googleClient?.client_id || !googleClient?.client_secret) {
  throw new Error("client.json harus berisi web.client_id dan web.client_secret.");
}

const rawOptions = runSql("select options from _collections where name = 'users';");

if (!rawOptions) {
  throw new Error("Collection auth 'users' tidak ditemukan di PocketBase.");
}

const options = JSON.parse(rawOptions);
const providers = Array.isArray(options.oauth2?.providers)
  ? options.oauth2.providers.filter((provider) => provider.name !== "google")
  : [];

providers.push({
  name: "google",
  clientId: googleClient.client_id,
  clientSecret: googleClient.client_secret,
  authURL: googleClient.auth_uri || "https://accounts.google.com/o/oauth2/v2/auth",
  tokenURL: googleClient.token_uri || "https://oauth2.googleapis.com/token",
  userInfoURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  displayName: "Google",
  extra: {}
});

options.oauth2 = {
  ...(options.oauth2 || {}),
  enabled: true,
  providers,
  mappedFields: {
    id: "",
    name: "name",
    username: "",
    avatarURL: "avatar",
    ...(options.oauth2?.mappedFields || {})
  }
};

runSql(
  [
    "update _collections",
    `set options = ${sqlString(JSON.stringify(options))},`,
    "updated = strftime('%Y-%m-%d %H:%M:%fZ')",
    "where name = 'users';"
  ].join(" ")
);

console.log("Google OAuth untuk collection users sudah aktif.");
