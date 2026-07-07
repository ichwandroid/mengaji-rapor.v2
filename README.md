# Panduan Menjalankan Aplikasi Rapor Mengaji SD Anak Saleh

Aplikasi ini menggunakan **Node.js (Express)** sebagai Web Server/Frontend dan **PocketBase** sebagai Database & Backend.

---

## 1. Persiapan Sistem (Prasyarat)

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:
1. **Node.js** (Versi LTS 18 atau 20 direkomendasikan): [https://nodejs.org/](https://nodejs.org/)
2. File database **PocketBase** untuk Windows (`pocketbase.exe`) sudah berada di dalam folder `database/`. Jika belum ada:
   - Download PocketBase versi Windows (AMD64) dari [PocketBase Releases](https://github.com/pocketbase/pocketbase/releases).
   - Ekstrak dan pindahkan `pocketbase.exe` ke folder `database/`.

---

## 2. Instalasi Dependensi

Buka terminal (Command Prompt, PowerShell, atau Git Bash) di folder proyek ini, lalu jalankan perintah berikut untuk menginstal seluruh dependensi:

```bash
npm install
```

---

## 3. Cara Menjalankan Aplikasi Secara Lokal (Development)

Untuk menjalankan aplikasi secara lokal di komputer Anda, Anda perlu membuka **dua jendela terminal** (satu untuk Database, satu untuk Web Server):

### Langkah 1: Jalankan Database (PocketBase)
Buka terminal pertama di folder proyek, lalu jalankan:
```bash
npm run pocketbase
```
*Database akan berjalan di `http://127.0.0.1:8090`. Anda dapat mengakses Dashboard Admin PocketBase di `http://127.0.0.1:8090/_/`.*

### Langkah 2: Jalankan Web Server
Buka terminal kedua di folder proyek, lalu jalankan:
```bash
npm run dev
```
*Server web akan berjalan di `http://localhost:3000` (atau port terdekat seperti `3001` jika port 3000 sedang digunakan).*

### Langkah 3: Mengompilasi CSS (Opsional / Development)
Jika Anda melakukan perubahan pada file styling Tailwind CSS di folder `src/`, jalankan perintah berikut di terminal ketiga untuk memantau perubahan secara real-time:
```bash
npm run watch:css
```

---

## 4. Panduan Menjalankan di Server Windows 10 (Produksi - Background Service)

Jika Anda ingin menjalankan aplikasi ini di komputer server sekolah secara terus-menerus di background (tidak akan mati meskipun terminal ditutup, dan otomatis menyala saat PC di-restart), gunakan **PM2**.

### Langkah 1: Install PM2 secara Global
Buka terminal sebagai Administrator (*Run as Administrator*), lalu jalankan:
```cmd
npm install -g pm2 pm2-windows-startup
pm2-startup install
```

### Langkah 2: Daftarkan Layanan ke PM2
Pastikan terminal berada di folder proyek, lalu jalankan kedua perintah berikut:
1. **Nyalakan Database (PocketBase):**
   ```cmd
   pm2 start database\pocketbase.exe --name rapor-database -- serve --dir database\pb_data --http=0.0.0.0:8090
   ```
2. **Nyalakan Web Server (Rapor):**
   ```cmd
   pm2 start server.js --name rapor-web
   ```
3. **Simpan Konfigurasi PM2:**
   ```cmd
   pm2 save
   ```

*Untuk melihat status layanan, jalankan perintah: `pm2 status`*

### Langkah 3: Buka Port di Windows Firewall (Penting)
Agar laptop/perangkat lain dalam satu jaringan WiFi sekolah dapat mengakses aplikasi:
1. Buka Start Menu, cari **Windows Defender Firewall with Advanced Security**.
2. Klik **Inbound Rules** di panel sebelah kiri -> **New Rule...** di panel kanan.
3. Pilih **Port** -> Next.
4. Pilih **TCP**, isi *Specific local ports* dengan `3000`, lalu Next.
5. Pilih **Allow the connection** -> Next.
6. Centang Domain, Private, Public -> Next.
7. Beri nama (misal: `Rapor Mengaji Web`), klik **Finish**.

---

## 5. Cara Mengakses Aplikasi

- **Dari Komputer Server/Lokal:**
  - Aplikasi Web: [http://localhost:3000](http://localhost:3000)
  - Admin Database: [http://localhost:8090/_/](http://localhost:8090/_/)
- **Dari Laptop/HP Guru (Jaringan WiFi/LAN yang sama):**
  - Akses menggunakan IP komputer server, contoh: `http://192.168.1.10:3000`
  *(Cek IP server dengan mengetik `ipconfig` di terminal server, cari bagian `IPv4 Address`).*

---

## 6. Daftar Perintah Script (package.json)

| Perintah | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan web server utama (`node server.js`) |
| `npm run pocketbase` | Menjalankan database PocketBase lokal |
| `npm run build:css` | Build / minify file CSS Tailwind ke folder public |
| `npm run watch:css` | Watcher Tailwind CSS untuk memantau perubahan style |
| `npm run setup:user-access` | Inisialisasi konfigurasi hak akses user di PocketBase |
| `npm run setup:user-role` | Menambahkan field role pada user PocketBase |
| `npm run setup:materi` | Inisialisasi koleksi materi di PocketBase |
| `npm run setup:siswa` | Inisialisasi koleksi siswa di PocketBase |
| `npm run setup:bilqolam` | Inisialisasi koleksi penilaian bilqolam |
| `npm run setup:nilai-doa` | Inisialisasi koleksi penilaian doa harian |
| `npm run setup:nilai-tathbiq` | Inisialisasi koleksi penilaian tathbiq ibadah |
| `npm run setup:nilai-tahfizh` | Inisialisasi koleksi penilaian tahfizh quran |
