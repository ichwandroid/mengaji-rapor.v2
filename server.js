const path = require("path");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/vendor/animejs",
  express.static(path.join(__dirname, "node_modules/animejs/lib"))
);
app.use(
  "/vendor/pocketbase",
  express.static(path.join(__dirname, "node_modules/pocketbase/dist"))
);
app.use(
  "/vendor/xlsx",
  express.static(path.join(__dirname, "node_modules/xlsx/dist"))
);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/login", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/dashboard", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/siswa", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/siswa.html"));
});

app.get("/users", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/users.html"));
});

app.get("/materi", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/materi.html"));
});

app.get("/laporan", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/laporan.html"));
});

app.get("/bilqolam", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "bilqolam.html"));
});

app.get("/doa-harian", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "doa-harian.html"));
});

app.get("/tathbiq-ibadah", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "tathbiq-ibadah.html"));
});

app.get("/tahfizh-quran", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "tahfizh-quran.html"));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Rapor Mengaji SD Anak Saleh berjalan di http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} sedang dipakai, mencoba http://localhost:${port + 1}`);
      startServer(port + 1);
      return;
    }

    throw error;
  });
}

startServer(PORT);
