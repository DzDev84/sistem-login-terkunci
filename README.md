# Sistem Login (3x Salah → Terkunci)

Tugas bikin program HTML + CSS + JS murni yang isinya ada percabangan dan
perulangan, dan keduanya harus nyambung. Jadi saya pilih kasus login yang
klasik: kalau salah password 3 kali, akunnya dikunci dulu 10 detik.

## Cara Menjalankan

Tinggal buka `index.html`-nya (double-click aja). Kalau mau lewat server:

```bash
python3 -m http.server 8765
# terus buka http://localhost:8765
```

Biar bisa dibuka dari HP/laptop lain (pakai IP LAN):

```bash
python3 -m http.server 8765 --bind 0.0.0.0
# dari HP buka http://<IP-laptop-saya>:8765
```

Akun buat demo: username `admin`, password `rahasia123`.

Font yang dipakai (Clash Display, Satoshi, Fragment Mono) sudah saya taruh
di folder `fonts/`, jadi walau lagi gapake internet tampilannya tetap sama.

## Logikanya

Inti programnya sebenernya pola kayak gini:

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

Jadi tiap kali user menekan tombol Masuk, itu dihitung satu iterasi dari
`while`-nya (program ini event-driven, jadi `while`-nya "berjalan" lewat
event submit). Yang bikin nyambung: hasil tiap `if/else` itu dia mengubah
nilai variabel — entah `percobaanKe` nambah, entah `sudahBerhasil` jadi
`true` — dan variabel-variabel itulah yang dicek sama kondisi `while`.
Percabangannya yang menentukan kapan perulangannya berhenti.

Selain `while` utama, ada dua perulangan lain:

1. Countdown 10 detik pas akun terkunci — pakai `setInterval`
   (prinsipnya sama kayak `while (detik > 0)`).
2. Nggambar titik jatah percobaan — pakai `for`.

## Skenario Demo

1. Isi username/password sembarang → salah, sisa jatah 2
2. Salah lagi → "sisa 1 kesempatan", kartunya bergetar
3. Salah yang ketiga → TERKUNCI, muncul countdown 10 detik,
   abis itu buka sendiri
4. Login `admin` / `rahasia123` → berhasil, muncul stempel "Akses Diberikan"
5. Klik tombol **Jejak Logika** di bawah → keliatan rekaman langkah-langkah
   programnya: mana bagian perulangan (`[LOOP]`), mana percabangan
   (`[CABANG]`), dan apa efeknya ke kondisi loop (`[HASIL]`).
   Dari sini ketauan kenapa loop-nya bisa berhenti.

## Catatan

- Semua cetakan/ikon di UI pakai teks, bukan emoji, biar konsisten.
- Panel Jejak Logika itu papan terpisah yang muncul pas tombolnya diklik,
  dan bisa ditutup lagi lewat tombol "Kembali ke Form".
- Lengkapnya di `script.js` — saya kasih komentar di hampir tiap blok
  biar gampang dijelasin.

## File

| File | Isi |
|------|-----|
| `index.html` | Struktur halaman (login / sukses / terkunci + panel log) |
| `style.css` | Styling-nya semua |
| `fonts/` | File font (offline) |
| `script.js` | Logika percabangan + perulangannya |
