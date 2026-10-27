const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

function tampilkan(yang) {
  const masuk = yang === 'login';
  tabLogin.classList.toggle('active', masuk);
  tabRegister.classList.toggle('active', !masuk);
  formLogin.classList.toggle('active', masuk);
  formRegister.classList.toggle('active', !masuk);
}

tabLogin.addEventListener('click', () => tampilkan('login'));
tabRegister.addEventListener('click', () => tampilkan('register'));

const pesan = (id, teks, jenis) => {
  const el = document.getElementById(id);
  el.textContent = teks;
  el.className = 'msg ' + (jenis || '');
};

function ambilAkun() {
  try { return JSON.parse(localStorage.getItem('akun') || '[]'); } catch (e) { return []; }
}
function simpanAkun(daftar) {
  try { localStorage.setItem('akun', JSON.stringify(daftar)); } catch (e) {}
}
async function acak(teks) {
  if (!(window.crypto && crypto.subtle)) return teks;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(teks));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;

  if (pass.length < 8) return pesan('msg-register', 'Password minimal 8 karakter.', 'error');
  if (pass !== pass2) return pesan('msg-register', 'Kedua password harus sama.', 'error');

  const daftar = ambilAkun();
  if (daftar.some(a => a.email === email)) {
    return pesan('msg-register', 'Email ini sudah terdaftar. Silakan masuk.', 'error');
  }
  daftar.push({ nama: nama, email: email, pass: await acak(pass) });
  simpanAkun(daftar);

  formRegister.reset();
  pesan('msg-register', '');
  tampilkan('login');
  document.getElementById('login-email').value = email;
  pesan('msg-login', 'Akun dibuat. Silakan masuk.', 'ok');
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = await acak(document.getElementById('login-pass').value);
  const akun = ambilAkun().find(a => a.email === email && a.pass === pass);

  if (!akun) return pesan('msg-login', 'Email atau password salah.', 'error');
  pesan('msg-login', 'Berhasil masuk. Halo, ' + akun.nama + '!', 'ok');
});
