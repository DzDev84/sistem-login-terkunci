# Sistem Login — 3× Salah Langsung Terkunci

**Adesta Eka Saputra**
NIM 25533955 · Kelas E3 — Informatika

Tugas mata kuliah: bikin program HTML + CSS + JS murni yang di dalamnya ada
**percabangan** dan **perulangan**, terus dua-duanya harus **berkesinambungan**.
Saya angkat kasus yang paling gampang dibayangin: form login. Salah password
3 kali → akunnya dikunci 10 detik, abis itu kebuka sendiri.

Nggak ada library, nggak ada framework. Buka `index.html` aja udah jalan.

## Tampilan Program

Ini screenshot asli dari programnya, bukan mockup.

| Form login | Salah — sisa 2 | Salah — sisa 1 |
|:--:|:--:|:--:|
| ![Form login](screenshot/01-form-login.png) | ![Salah, sisa 2 kesempatan](screenshot/02-salah-sisa-2.png) | ![Salah, sisa 1 kesempatan](screenshot/03-salah-sisa-1.png) |

| Akun terkunci (countdown) | Login berhasil |
|:--:|:--:|
| ![Akun terkunci](screenshot/04-terkunci.png) | ![Login berhasil](screenshot/05-sukses.png) |

Terakhir, panel **Jejak Logika** — ini yang bikin kesinambungan loop dan
cabangnya keliatan langsung pas programnya jalan:

![Panel Jejak Logika](screenshot/06-jejak-logika.png)

## Cara Menjalankan

Paling gampang: double-click `index.html`.

Kalau mau lewat server (biar sama kayak pas demo):

```bash
python3 -m http.server 8765
# buka http://localhost:8765
```

Biar bisa dibuka dari HP atau laptop lain di WiFi yang sama:

```bash
python3 -m http.server 8765 --bind 0.0.0.0
# dari HP buka http://<IP-laptop>:8765
```

Akun buat demo: username `admin`, password `rahasia123`.

Font (Clash Display, Satoshi, Fragment Mono) sudah saya taruh di folder
`fonts/`, jadi tampilannya tetap sama walau lagi nggak ada internet.

## Logikanya

Inti programnya pola kayak gini:

```
while (percobaanKe < 3 && !sudahBerhasil && !terkunci) {
    if (input kosong)          → kasih peringatan, jatah belum hangus
    else if (password benar)   → sudahBerhasil = true → while-nya berhenti
    else {
        percobaanKe++          ← di sini percabangan "nyentuh" perulangan
        if (sisa == 0) → terkunci = true → while-nya berhenti (TERKUNCI)
        else           → kasih tahu sisa kesempatan
    }
}
```

Jadi tiap kali user menekan tombol Masuk, itu dihitung **satu iterasi** dari
`while`-nya (program ini event-driven, jadi `while`-nya "berjalan" lewat event
submit). Yang bikin nyambung: hasil tiap `if/else` itu mengubah nilai variabel
— entah `percobaanKe` nambah, entah `sudahBerhasil` jadi `true` — dan
variabel-variabel itulah yang dicek sama kondisi `while`. **Percabangannya
yang menentukan kapan perulangannya berhenti.**

Selain `while` utama, ada dua perulangan lain:

1. Countdown 10 detik pas akun terkunci — pakai `setInterval`
   (prinsipnya sama kayak `while (detik > 0)`).
2. Nggambar titik jatah percobaan — pakai `for`.

## Skenario Demo

1. Isi username/password sembarang → salah, sisa jatah 2
2. Salah lagi → "sisa 1 kesempatan", kartunya bergetar
3. Salah yang ketiga → **TERKUNCI**, muncul countdown 10 detik,
   abis itu kebuka sendiri
4. Login `admin` / `rahasia123` → berhasil, muncul stempel "Akses Diberikan"
5. Klik tombol **Jejak Logika** di bawah → keliatan rekaman langkah-langkah
   programnya. Dari sini ketauan kenapa loop-nya bisa berhenti.

## Keterangan Teks

Di panel Jejak Logika ada tiga tag warna. Artinya:

| Tag | Arti |
|-----|------|
| `[LOOP]` | perulangan (`while` / `for`) sedang jalan |
| `[CABANG]` | percabangan (`if/else`) lagi ambil keputusan |
| `[HASIL]` | dampak keputusan cabang ke kondisi loop — ini bukti kesinambungannya |

Inti yang mau ditunjukin: **jatah salah 3× — habis jatah, akun TERKUNCI.
Hasil setiap `if/else` mengubah variabel yang dibaca kondisi `while`/`for`,
itulah kesinambungannya.**

## Catatan

- Semua cetakan/ikon di UI pakai teks, bukan emoji, biar konsisten.
- Panel Jejak Logika itu papan terpisah yang muncul pas tombolnya diklik,
  dan bisa ditutup lagi lewat tombol "Kembali ke Form".
- Lengkapnya di `script.js` — saya kasih komentar di hampir tiap blok
  biar gampang dijelasin pas presentasi.

## Struktur File

| File | Isi |
|------|-----|
| `index.html` | Struktur halaman (login / sukses / terkunci + panel log) |
| `style.css` | Styling-nya semua |
| `script.js` | Logika percabangan + perulangannya |
| `fonts/` | File font (offline) |
| `screenshot/` | Foto UI buat README |
