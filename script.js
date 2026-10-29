/* ============================================================
   SISTEM LOGIN (3x SALAH -> TERKUNCI)
   Tugas: percabangan + perulangan yang BERKESINAMBUNGAN.

   Alur logika:

     while (percobaanKe < 3 && !sudahBerhasil && !terkunci) {
         if (input kosong)                   -> peringatan (jatah TIDAK hangus)
         else if (username & password benar) -> SUKSES -> loop berhenti
         else {
             percobaanKe++;                  <- hasil cabang MENGUBAH variabel
             if (sisa === 1) -> "kesempatan terakhir!"
             if (sisa === 0) -> TERKUNCI -> loop berhenti
         }
     }

   Interactive version: karena program berjalan di browser (event-driven),
   setiap tekan tombol "Masuk" = SATU ITERASI perulangan utama.
   Hasil tiap percabangan mengubah kondisi yang dibaca perulangan
   (percobaanKe / sudahBerhasil / terkunci) — itulah kesinambungannya.

   Ada 3 perulangan di program ini:
     #1 — perulangan utama percobaan login     (while, via event)
     #2 — countdown 10 detik saat terkunci     (setInterval = while)
     #3 — menggambar titik jatah percobaan     (for)
   Dan 4 kelompok percabangan (lihat komentar di bawah).

   Penanda Jejak Logika (digambar dengan warna + tag teks, tanpa emoji):
     [LOOP]   perulangan (while/for)
     [CABANG] percabangan (if/else)
     [HASIL]  dampak keputusan cabang terhadap kondisi loop
   (Penjelasan lengkap ada di README.md, bagian "Keterangan Teks".)
   ============================================================ */

"use strict";

/* ---------- KONSTANTA ---------- */
const MAKS_PERCOBAAN = 3;   // jatah salah maksimal
const DURASI_KUNCI   = 10;  // detik terkunci

/* Akun demo (di program nyata: berasal dari database/server) */
const AKUN = { username: "admin", password: "rahasia123" };

/* ---------- ELEMEN DOM ---------- */
const kartu         = document.getElementById("kartu");
const formLogin     = document.getElementById("form-login");
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");
const elTitik       = document.getElementById("titik-percobaan");
const elPesan       = document.getElementById("pesan");
const daftarLog     = document.getElementById("daftar-log");

const viewLogin    = document.getElementById("view-login");
const viewSukses   = document.getElementById("view-sukses");
const viewTerkunci = document.getElementById("view-terkunci");

/* Papan Jejak Logika (panel terpisah, dibuka lewat tombol) */
const tombolLog        = document.getElementById("tombol-log");
const tombolLogKembali = document.getElementById("tombol-log-kembali");
const panelLog         = document.getElementById("panel-log");

/* ---------- STATE (variabel yang dibaca KONDISI perulangan) ---------- */
let percobaanKe   = 0;      // jatah yang sudah terpakai
let sudahBerhasil = false;  // login sukses?
let terkunci      = false;  // akun terkunci?

/* ============================================================
   PERULANGAN #1 — UTAMA
   Satu tekan "Masuk" = satu iterasi.
   ============================================================ */
formLogin.addEventListener("submit", function (event) {
  event.preventDefault(); // cegah reload halaman

  /* ==== KONDISI PERULANGAN (seperti `while (...)`) ====
     Jika kondisi false -> iterasi tidak dijalankan (loop "berhenti"). */
  const loopBolehJalan = percobaanKe < MAKS_PERCOBAAN && !sudahBerhasil && !terkunci;
  if (!loopBolehJalan) {
    return;
  }

  tulisLog("loop", `[LOOP] while #1 — iterasi ${percobaanKe + 1}: (percobaanKe=${percobaanKe} < 3 && !berhasil && !terkunci) = true -> badan loop dijalankan`);

  const username = inputUsername.value.trim();
  const password = inputPassword.value;

  /* ============================================================
     PERCABANGAN A — VALIDASI & AUTENTIKASI
     ============================================================ */

  /* CABANG 1 — input kosong: jatah TIDAK hangus */
  if (username === "" || password === "") {
    tampilkanPesan("pesan-kuning", "Isi username dan password dulu.");
    tulisLog("cabang", `[CABANG] if (input kosong) = true -> peringatan; percobaanKe tetap ${percobaanKe} (jatah tidak hangus)`);
    return; // kembali ke "atas loop" tanpa mengubah kondisi
  }

  /* CABANG 2 — kredensial BENAR -> SUKSES */
  if (username === AKUN.username && password === AKUN.password) {
    sudahBerhasil = true; // <- hasil cabang MENGUBAH kondisi loop -> loop berhenti
    tulisLog("cabang", "[CABANG] if (username && password benar) = true -> sudahBerhasil = true");
    tulisLog("hasil", "[HASIL] SUKSES — kondisi while jadi FALSE -> perulangan #1 BERHENTI");
    tampilkanPesan("pesan-sukses", "Login berhasil! Mengalihkan...");
    tampilkanSukses(username);
    return;
  }

  /* CABANG 3 — kredensial SALAH */
  percobaanKe = percobaanKe + 1; // <- hasil cabang MENGUBAH kondisi loop!
  tulisLog("cabang", `[CABANG] else (kredensial salah) -> percobaanKe = ${percobaanKe}`);

  /* SUB-CABANG — berdasarkan sisa jatah (hasil hitung cabang sebelumnya) */
  const sisa = MAKS_PERCOBAAN - percobaanKe;

  if (sisa === 0) {
    /* SUB-CABANG 3a — jatah habis -> TERKUNCI */
    terkunci = true; // <- mengubah kondisi loop -> loop berhenti
    tulisLog("cabang", "[CABANG] if (sisa === 0) = true -> terkunci = true");
    tulisLog("hasil", "[HASIL] TERKUNCI — kondisi while jadi FALSE -> perulangan #1 BERHENTI");
    perbaruiTitik();
    tampilkanPesan("pesan-error", "Akun terkunci!");
    mulaiKunci();
  } else if (sisa === 1) {
    perbaruiTitik();
    tampilkanPesan("pesan-error", "Password salah — sisa 1 kesempatan. Hati-hati!");
    tulisLog("cabang", '[CABANG] else if (sisa === 1) -> pesan "kesempatan terakhir"');
      kartu.classList.add("guncang");
      setTimeout(() => kartu.classList.remove("guncang"), 500);
  } else {
    perbaruiTitik();
    tampilkanPesan("pesan-error", `Password salah — sisa ${sisa} kesempatan.`);
    tulisLog("cabang", `[CABANG] else -> pesan "sisa ${sisa} kesempatan"`);
      kartu.classList.add("guncang");
      setTimeout(() => kartu.classList.remove("guncang"), 500);
  }
});

/* ============================================================
   PERULANGAN #2 — COUNTDOWN TERKUNCI (while detik > 0)
   ============================================================ */
function mulaiKunci() {
  viewLogin.classList.add("tersembunyi");
  viewTerkunci.classList.remove("tersembunyi");
  formLogin.reset();

  let detik = DURASI_KUNCI;
  document.getElementById("angka-countdown").textContent = detik;
  tulisLog("loop", `[LOOP] while #2 mulai — setInterval: ulangi selama detik > 0 (mulai ${detik} detik)`);

  const timer = setInterval(function () {
    /* PERCABANGAN B — cek sisa detik */
    if (detik > 1) {
      detik = detik - 1; // hasil cabang mengubah variabel yang dicek loop
      document.getElementById("angka-countdown").textContent = detik;
      tulisLog("loop", `[LOOP] while #2: detik=${detik} > 0 = true -> lanjut hitung`);
    } else {
      clearInterval(timer); // padanan `while` berakhir
      tulisLog("hasil", "[HASIL] detik habis -> while #2 selesai -> akun dibuka lagi");
      bukaAkunLagi();
    }
  }, 1000);
}

/* ============================================================
   PERULANGAN #3 — GAMBAR TITIK JATAH (for loop)
   ============================================================ */
function resetTitik() {
  elTitik.innerHTML = "";
  for (let i = 0; i < MAKS_PERCOBAAN; i++) {
    const dot = document.createElement("span");
    dot.className = "dot dot-hidup";
    elTitik.appendChild(dot);
    // perhatikan: i++ ada -> loop pasti berhenti di 3 (tidak infinite)
  }
}

function perbaruiTitik() {
  /* PERCABANGAN C — tentukan kelas tiap titik: hidup (jatah sisa) / mati (terpakai) */
  const dots = elTitik.children;
  for (let i = 0; i < dots.length; i++) {
    if (i < percobaanKe) {
      dots[i].className = "dot dot-mati"; // sudah terpakai
    } else {
      dots[i].className = "dot dot-hidup";
    }
  }
}

/* ============================================================
   TAMPILAN & UTIL
   ============================================================ */
function tampilkanPesan(kelas, teks) {
  elPesan.textContent = teks;
  elPesan.className = `pesan ${kelas}`;
}

function tampilkanSukses(username) {
  document.getElementById("teks-username").textContent = username;
  document.getElementById("waktu-sukses").textContent =
    new Date().toLocaleTimeString("id-ID");
  elTitik.textContent = "OK"; // bar percobaan sedang tersembunyi — cukup nilai rapi
  viewLogin.classList.add("tersembunyi");
  viewSukses.classList.remove("tersembunyi");
  formLogin.reset();
}

function bukaAkunLagi() {
  /* RESET state -> kondisi while #1 kembali true -> perulangan SIAP diulang */
  percobaanKe   = 0;
  sudahBerhasil = false;
  terkunci      = false;

  elPesan.textContent = "";
  elPesan.className = "pesan";
  resetTitik();

  /* sembunyikan SEMUA view selain login — termasuk view sukses,
     kalau tidak maka setelah logout kartu "Login Berhasil" tetap nampak */
  viewSukses.classList.add("tersembunyi");
  viewTerkunci.classList.add("tersembunyi");
  viewLogin.classList.remove("tersembunyi");

  tulisLog("hasil", "[HASIL] RESET — percobaanKe=0, terkunci=false -> while #1 siap diulang dari awal");
}

function tulisLog(jenis, teks) {
  const li = document.createElement("li");
  li.className = `log-${jenis}`;
  li.textContent = teks;
  daftarLog.appendChild(li);
  daftarLog.scrollTop = daftarLog.scrollHeight;
}

/* Tombol "keluar" di view sukses -> kembali ke login (reset state juga) */
document.getElementById("tombol-keluar").addEventListener("click", function () {
  sudahBerhasil = false;
  bukaAkunLagi();
});

/* ---------- NAVIGASI PANEL JEJAK LOGIKA ----------
   Tombol "Jejak Logika" -> arahkan tampilan ke papan log (kartu kedua).
   Dua kartu tampil bertumpuk: atas = UI utama, bawah = jejak logika,
   lalu halaman digulir otomatis ke papan log. */
tombolLog.addEventListener("click", function () {
  panelLog.classList.remove("tersembunyi");
  document.body.classList.add("tumpuk");
  panelLog.scrollIntoView({ behavior: "smooth", block: "start" });
});

tombolLogKembali.addEventListener("click", function () {
  /* sembunyikan lagi papan log -> kembali seperti semula */
  panelLog.classList.add("tersembunyi");
  document.body.classList.remove("tumpuk");
  kartu.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- MULAI ---------- */
resetTitik();
tulisLog("loop", '[LOOP] Program siap — while #1 menunggu iterasi pertama (tekan "Masuk")');
