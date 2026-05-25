# Panduan Instalasi Rapor Mengaji SD Anak Saleh di Server (Windows 10)

Dokumen ini berisi panduan lengkap langkah demi langkah untuk menginstal dan menjalankan aplikasi **Rapor Mengaji SD Anak Saleh** di sebuah komputer/server yang menggunakan sistem operasi **Windows 10**.

---

## 1. Persiapan Sistem (Prasyarat)

Sebelum memindahkan aplikasi ke Windows, pastikan Anda telah menginstal prasyarat berikut:

1. **Node.js**:
   - Download versi LTS (18 atau 20) untuk Windows dari [https://nodejs.org/](https://nodejs.org/).
   - Lakukan instalasi seperti biasa (tinggal klik *Next* sampai selesai).
2. **PM2** (Untuk menjalankan aplikasi di *background* agar tidak perlu membuka jendela terminal/CMD terus-menerus):
   - Buka **Command Prompt (CMD)** atau **PowerShell** sebagai Administrator (*Run as Administrator*).
   - Ketik perintah berikut dan tekan Enter:
     ```cmd
     npm install -g pm2 pm2-windows-startup
     ```
   - Setelah selesai, buat agar PM2 otomatis menyala setiap Windows dihidupkan dengan perintah:
     ```cmd
     pm2-startup install
     ```

---

## 2. Pindahkan dan Konfigurasi Aplikasi

1. *Copy* seluruh folder proyek aplikasi ini (`mengaji-rapor.v2`) ke dalam komputer Windows Anda (misal diletakkan di `C:\RaporMengaji`).
2. Buka **Command Prompt**, lalu masuk ke folder tersebut:
   ```cmd
   cd C:\RaporMengaji
   ```
3. Install seluruh dependensi yang dibutuhkan:
   ```cmd
   npm install
   ```

---

## 3. Konfigurasi Database (PocketBase untuk Windows)

Aplikasi ini menggunakan PocketBase sebagai databasenya. Karena Anda men-develop aplikasi ini di Mac, file `pocketbase` bawaannya tidak bisa dieksekusi di Windows. Anda harus menggantinya dengan versi `.exe` khusus Windows.

1. Buka folder `database` yang ada di dalam `C:\RaporMengaji`.
2. Hapus file bernama `pocketbase` (file versi Mac).
3. Download PocketBase untuk Windows (versi AMD64) dari link resmi berikut:
   [pocketbase_0.22.9_windows_amd64.zip](https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_windows_amd64.zip) (Pilih versi rilis terbaru di web pocketbase.io jika diperlukan).
4. Ekstrak file zip yang baru saja di-download. Anda akan mendapatkan file bernama `pocketbase.exe`.
5. Pindahkan/copy file `pocketbase.exe` tersebut ke dalam folder `database` di komputer Windows Anda (sehingga lokasinya menjadi `C:\RaporMengaji\database\pocketbase.exe`).

> **Catatan:** Data aplikasi Anda tersimpan aman di dalam folder `database\pb_data`. Jangan pernah menghapus folder `pb_data` ini.

---

## 4. Menjalankan Aplikasi

Sekarang kita akan menyalakan Database dan Web Server agar berjalan otomatis di *background* menggunakan PM2.

Pastikan posisi Command Prompt Anda masih berada di `C:\RaporMengaji`, kemudian jalankan dua perintah berikut satu per satu:

1. **Nyalakan Database (PocketBase):**
   ```cmd
   pm2 start database\pocketbase.exe --name rapor-database -- serve --dir database\pb_data --http=127.0.0.1:8090
   ```
2. **Nyalakan Web Server (Rapor):**
   ```cmd
   pm2 start server.js --name rapor-web
   ```
3. **Simpan agar otomatis menyala saat PC di-restart:**
   ```cmd
   pm2 save
   ```

*(Anda bisa mengecek statusnya berjalan dengan baik atau tidak dengan mengetik: `pm2 status`)*

---

## 5. Konfigurasi Jaringan & Firewall (Sangat Penting)

Aplikasi web sekarang berjalan di komputer server Windows Anda pada port `3000`. Jika Anda ingin guru-guru atau perangkat lain di dalam satu jaringan WiFi/LAN sekolah bisa mengaksesnya, Anda wajib membuka gerbang port `3000` di pengaturan Firewall Windows:

1. Buka Start Menu, cari dan buka **Windows Defender Firewall with Advanced Security**.
2. Klik **Inbound Rules** di panel sebelah kiri.
3. Di panel sebelah kanan, klik **New Rule...**
4. Pilih **Port**, lalu klik Next.
5. Pilih **TCP**, dan isi *Specific local ports* dengan angka: `3000`, klik Next.
6. Pilih **Allow the connection**, klik Next.
7. Centang ketiganya (Domain, Private, Public), klik Next.
8. Beri nama aturan ini, misal `Rapor Mengaji Web`, lalu klik **Finish**.

*(Ulangi langkah yang sama untuk membuka port `8090` jika Anda ingin membuka akses admin database ke jaringan luar, namun disarankan **TIDAK PERLU** dibuka agar database hanya bisa diatur langsung dari dalam server demi keamanan).*

---

## 6. Selesai! Mengakses Aplikasi

- Jika Anda membuka dari **komputer server (Windows 10) itu sendiri**, Anda bisa mengakses:
  - Aplikasi Rapor: `http://localhost:3000`
  - Admin Database: `http://localhost:8090/_/`
- Jika guru membuka dari **laptop/komputer lain** (yang terhubung ke WiFi/jaringan yang sama dengan server), mereka harus mengetikkan IP Address komputer server Anda, contoh: `http://192.168.1.10:3000`.

*(Cara mengecek IP Address server: Buka Command Prompt di server, ketik `ipconfig`, lalu lihat bagian IPv4 Address).*
