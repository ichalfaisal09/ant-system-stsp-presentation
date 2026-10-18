# V4.3 — Slide 09 Layout Refinement

Slide 09 desktop 16:9 viewport refinement: reduced vertical spacing in thesis, pillar cards, evidence cards and conclusion. Academic content, research CSV, earlier slides and simulation are unchanged.

# Ant System Interactive Research Presentation — Foundation V2.0

## Status
Fondasi website Vanilla JavaScript. Sepuluh slide dan Simulation Lab masih **placeholder**. **Belum ada** implementasi mesin Ant System ataupun grafik hasil eksperimen.

## Teknologi
HTML5, CSS3, Vanilla JavaScript ES Modules, SVG; tanpa React, TypeScript, Vite, Tailwind atau CDN.

## Menjalankan (Windows)
Buka PowerShell di folder `ANT_SYSTEM_PRESENTATION` lalu jalankan:

```powershell
py -m http.server 5173
```

Jika `py` tidak tersedia, gunakan `python -m http.server 5173`.
Buka http://localhost:5173/#/slide/1

**Jangan membuka `index.html` langsung via `file://`.** ES Modules memerlukan HTTP lokal.

## Shortcut
- `←` / `→`: slide sebelumnya/berikutnya
- `P`: catatan presenter
- `L`: ke/kembali dari Lab
- `F`: fullscreen
- `Esc`: tutup catatan; keluar fullscreen ditangani oleh browser

## Sumber penelitian (untuk tahap berikutnya)
https://github.com/ichalfaisal09/ant-system-stsp-analysis

Gunakan laporan final PDF 19 halaman sebagai sumber konten akademik setelah tersedia. Jangan mencampurkan Live Simulation dengan hasil eksperimen CSV.

## Batas Foundation
Routing, UI, catatan presenter, dan Lab shell dibangun; kompatibilitas browser dan fullscreen harus diuji di komputer tujuan. Konten akademik, simulasi, dan grafik belum dikerjakan.

## Status Slide 01 — Opening
Slide 01 telah memiliki judul penelitian, identitas akademik, pertanyaan utama, ilustrasi graf lima kota SVG, dan catatan presenter ±60 detik. Ilustrasi graf bersifat konseptual dan **bukan** hasil penelitian atau simulasi Ant System. Slide 02–10 dan Lab masih placeholder.

### Update dari Foundation V2.0
Jika sebelumnya sudah menjalankan paket Foundation V2.0, hentikan server (`Ctrl+C`), ekstrak paket pembaruan ini ke folder yang sama dengan opsi menimpa file lama, lalu jalankan kembali server dan lakukan hard refresh browser (`Ctrl+Shift+R`).

## Revisi Slide 01 — ACO dan animasi rute
- Judul menggunakan **Ant Colony Optimization (ACO)** sebagai keluarga metode dan **Ant System–Ant-Cycle** sebagai algoritma spesifik penelitian.
- SVG menggambar lima sisi berurutan A→B→C→D→E→A dalam kira-kira 4,4 detik, kemudian menyala tetap. Animasi dimulai ulang setelah Slide 01 dibuka kembali.
- Apabila sistem mengaktifkan `prefers-reduced-motion`, seluruh rute langsung terlihat tanpa animasi.
- Setelah menimpa file, lakukan hard refresh `Ctrl+Shift+R`.

## Koreksi animasi v2.2
Animasi kini menggunakan `requestAnimationFrame`, bukan CSS `stroke-dashoffset` berbasis `pathLength=1`. Masing-masing sisi dirender berurutan A→B→C→D→E→A dan berulang otomatis, dengan tombol **Putar ulang rute** dan indikator sisi yang sedang digambar. Pengaturan reduced-motion menampilkan seluruh garis tanpa gerakan.

## Pembaruan animasi Slide 01 v2.3
- Garis rute digambar progresif menggunakan JavaScript; penanda cahaya bergerak mengikuti tiap sisi.
- Label status menampilkan sisi aktif dan persentase gerak. Gunakan **Mulai animasi** jika preferensi sistem *reduced motion* menonaktifkan autoplay.
- Tombol **Putar ulang rute** memulai animasi dari kota A.
- Jika tetap statis: pastikan berkas `js/presentation/route-animation.js` yang terbaru telah tertimpa, lakukan hard refresh, lalu amati teks status di bawah graf. Error `/favicon.ico` 404 tidak berkaitan dengan animasi.

## Slide 01 autoplay correction (V2.4)
Animasi rute langsung berjalan saat Slide 01 dibuka atau dikunjungi kembali, tanpa klik Mulai animasi. Tombol Jeda/Mulai dan Putar ulang tetap tersedia.

## Slide 02 — Permasalahan STSP (V2.5)
- Demonstrasi graf lengkap empat kota V-04, bobot dari matriks simetris.
- Pilihan mode: **Optimal** (A→B→C→D→A, panjang 13), **Valid nonoptimal** (A→D→B→C→A, panjang 18), dan **Tidak valid** (A→B→C→B→A, kota D terlewat).
- Perhitungan panjang tur dilakukan oleh `js/presentation/stsp-example.js`; validitas diperiksa sebelum menghitung jarak, dan optimum V-04 diverifikasi lewat enumerasi semua tur.
- Tombol **Lihat matriks jarak** menampilkan matriks sumber bobot. Koordinat SVG hanya ilustratif.
- Materi Slide 03–10 dan Simulation Lab tetap placeholder. Slide 01 beserta autoplay dipertahankan.
- Unit test: `node --test tests/*.test.mjs` (Node.js diperlukan untuk test, bukan menjalankan website).

## Slide 02 V2.6 — perbaikan keterbacaan
- Setiap sisi graf memiliki tepat satu label bobot yang diposisikan terpisah; nomor langkah rute dihapus untuk menghindari kesan dua bobot.
- Tombol **Lihat matriks jarak** membuka modal asli `<dialog>` di tengah layar, tidak menutupi persamaan sebagai panel kecil. Tutup dengan ×, Escape, atau klik area gelap.
- Saat dialog terbuka, shortcut navigasi presentasi tidak bekerja sehingga tombol panah tidak mengganti slide.
- Slide 01 beserta animasi autoplay dipertahankan.

## Slide 03 — Mekanisme Ant System–Ant-Cycle (V2.7)
- Enam tahap interaktif: inisialisasi → konstruksi → evaluasi → evaporasi → deposisi seluruh semut → iterasi berikutnya.
- Contoh **deterministik untuk pembelajaran**, bukan simulasi stokastik maupun hasil eksperimen: matriks V-04, dua tur lengkap panjang 13 dan 18, parameter ilustrasi τ₀=1, ρ=0,5, Q=12.
- Feromon global diperbarui **sesudah kedua semut menyelesaikan tur**; tidak ada local update ataupun penguatan hanya dari semut terbaik. Contoh feromon diperiksa dengan unit test.
- Navigasi tahap lewat keenam tombol proses, Sebelumnya/Berikutnya dan Ulangi. Presenter notes khusus Slide 03 telah tersedia.
- Slide 01, Slide 02, navigasi global, dan kerangka Lab dipertahankan. Simulation Lab yang sesungguhnya masih dijadwalkan pada tahap berikutnya.


### V2.8 — Slide 03 pheromone visualization
Tahap 06 kini menggambarkan feromon τ(t+1) dari perhitungan demonstrasi V-04 sebagai ketebalan/terang sisi dan label numerik, bukan garis rute dua semut. A–D dan B–C paling kuat. Tahap 01–05, Slide 01–02, serta navigasi tetap dipertahankan.


## Slide 04 — Model Matematis (V3.0)

Slide 04 memiliki dua tab: probabilitas transisi dan pembaruan feromon global. Penggeser α dan β menghitung ulang peluang V-04 dari kota A (τ seragam), sementara tab kedua menunjukkan hasil Ant-Cycle dua semut dengan ρ=0,5; Q=12; τ₀=1. Semua angka contoh pembelajaran, bukan data eksperimen. Jalankan `npm test` untuk pengujian (16 tes).

## Slide 05 — Analisis Algoritma (V3.2)
- Tiga tab: **Pseudocode**, **Kebenaran & terminasi**, **Kompleksitas**.
- Pseudocode menampilkan 13 baris dengan empat kelompok sorotan: validasi/inisialisasi, konstruksi, evaluasi best-so-far, dan pembaruan feromon global. Pseudocode ringkas konseptual, bukan reproduksi baris-demi-baris Python.
- Tab kebenaran menampilkan invariant pemilihan kota belum dikunjungi, kemajuan langkah, sifat non-meningkat best-so-far, dan terminasi untuk parameter valid. Demonstrasi panjang rute 13 dan 18 bersifat deterministik.
- Tab kompleksitas menampilkan waktu Θ(Tmn²) dan ruang inti Θ(n²+mn); biaya penyimpanan trace UI tidak termasuk.
- Navigasi global, Slide 01–04 dan Lab placeholder dipertahankan.
- Uji otomatis: `npm test` atau `node --test tests/*.test.mjs`.


## Slide 06 / Simulation Lab (V3.4)

Mesin AS–Ant-Cycle dijalankan lokal di browser (`js/engine/ant-system.js`).
Pada Slide 06, pilih parameter lalu gunakan Run, Pause, Step dan Reset. Tombol Buka Full Lab menuju `/#/lab` dan tombol footer Presentasi mengembalikan ke slide sebelumnya.
Seed menggunakan RNG JavaScript yang terdokumentasi dan **tidak** identik dengan `random.Random` Python.
Dataset 4 kota V-04 dipakai sebagai contoh pemeriksaan manual; opsi 5 kota adalah contoh sintetis khusus antarmuka, **bukan dataset/hasil penelitian**. Grafik konvergensi hanya menunjukkan hasil simulasi browser, tidak menggantikan CSV penelitian.
Perhitungan dilakukan sebelum trace diputar; Pause menghentikan playback, bukan komputasi yang sudah selesai. Untuk menjaga responsivitas, kombinasi parameter besar dibatasi.

## V3.5 — Simulation Integrity & UI Regression Fix

- State replay dihitung dari event yang sudah tercapai, bukan hasil akhir algoritma.
- Rute aktif, feromon, dan nilai best-so-far ditampilkan berdasarkan posisi replay.
- Grafik konvergensi baru menambah titik setelah event `iteration-complete`.
- Setiap perubahan dataset, m, T, α, β, ρ, Q, τ₀, atau seed menghentikan playback dan menghapus hasil lama sebelum simulasi selanjutnya.
- Kontrol Run/Pause/Step/Reset dan routing Lab dipertahankan.
- Pengujian: `npm test` (Node.js diperlukan hanya untuk tes).
- Catatan: pengujian interaksi visual secara otomatis dengan Chromium tidak dapat diselesaikan pada lingkungan pembuat paket (akses localhost diblokir). Mohon verifikasi tampilan dan kontrol langsung di browser Windows.

## V3.6 — Grafik Konvergensi

- Grafik SVG konvergensi menampilkan sumbu X (Iterasi), sumbu Y (Panjang tur), grid horizontal, titik data dan best-so-far.
- Iterasi yang digambar hanya iterasi yang sudah menghasilkan event `iteration-complete` dalam replay; tidak memaparkan hasil iterasi mendatang.
- Jika best-so-far tetap sama, garis horizontal merupakan hasil sah dan dijelaskan sebagai "Tidak ada perbaikan".
- Keadaan sebelum iterasi pertama selesai memiliki keterangan eksplisit, bukan grafik kosong yang membingungkan.
- Pengujian: `node --test tests/*.test.mjs` atau `npm test` (Node.js dipakai untuk testing, bukan runtime browser).

## Slide 07 — data penelitian Python (V3.7)

Slide 07 membaca dua CSV asli yang disalin dari repositori penelitian (branch main):

- `data/results/quality_summary.csv` — https://github.com/ichalfaisal09/ant-system-stsp-analysis/blob/main/results/quality_summary.csv
- `data/results/optimality_gap_summary.csv` — https://github.com/ichalfaisal09/ant-system-stsp-analysis/blob/main/results/optimality_gap_summary.csv

Uji otomatis Python `28 passed` berasal dari README repositori, bukan 40 unit test JavaScript pada aplikasi ini. Lima dataset K adalah instance yang berbeda, bukan seri optimalitas lintas ukuran. Gap 0% dibuktikan hanya untuk tiga instance kecil V-03/V-04/V-05 (lima seed masing-masing). Grafik Slide 07 tidak mengambil angka dari Live Simulation. Dua CSV dimuat melalui fetch pada localhost; bila file hilang, aplikasi menampilkan kesalahan alih-alih membuat angka pengganti.

## V3.8 — Slide 07 layout refinement

- CSS-only: vertical spacing of Slide 07 on desktop/projector viewport up to 1000px tall has been compacted to keep the **Kualitas Solusi** tab, source note and footer visible together.
- Bar chart data, CSV files, table values and explanatory claims are unchanged.
- No changes to Slide 01–06, Simulation Lab or tab **Gap Optimalitas** content.
- Verify locally at 1663×920 or 1920×1080 and use `Ctrl+Shift+R` to invalidate the cached stylesheet.


## Slide 08 — Kinerja, sensitivitas, perbandingan NN (V3.9)
Menggunakan salinan asli `results/runtime_summary.csv`, `results/sensitivity_summary.csv`, dan `results/comparison_summary.csv` dari arsip penelitian Python. Tiga tab interaktif membaca CSV melalui localhost; tidak perlu akses internet. Perbandingan Ant System–NN tidak menggunakan anggaran komputasi setara, sehingga tidak menunjukkan dominasi universal.

## V4.0 — Perbaikan tab Slide 08

Memperbaiki parser CSV: kolom `config` pada sensitivitas parameter adalah pengenal alfanumerik (`A-00`, `BASE`, dan seterusnya), bukan nilai numerik. Parser mengizinkan `dataset` dan `config` sebagai teks serta tetap memvalidasi kolom angka. Tiga tab sekarang dapat dimuat dari CSV lokal. Termasuk dua regression test tambahan.


## V4.2 — Slide 09 Pembahasan dan Sintesis
Slide 09 menyatukan bukti teoretis (validitas tur, terminasi, kompleksitas waktu Θ(Tmn²) dan ruang inti Θ(n²+mn)) dengan temuan empiris terbatas dari CSV penelitian. Ringkasan runtime K-80 dan pengurangan panjang tur dibanding NN dibaca dari CSV ketika slide dibuka; nilai 28/28 dan 15/15 berasal dari pengujian Python dan gap optimalitas yang telah diverifikasi pada repositori. Tidak ada klaim optimalitas global umum. Slide 01–08 tetap dipertahankan.
