const form = document.getElementById('form');
const modal = document.getElementById('modal');
const other = form.otherTrack;
const btn = document.getElementById('submit');

form.phone.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
form.querySelectorAll('input[name=track]').forEach(r =>
  r.addEventListener('change', () => other.classList.toggle('hidden', form.track.value !== 'other')));

function validate(d) {
  const e = {};
  if (d.name.trim().length < 3) e.name = 'الرجاء إدخال الاسم بالكامل';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'صيغة البريد الإلكتروني غير صحيحة';
  if (!/^\d{7,14}$/.test(d.phone)) e.phone = 'رقم هاتف غير صالح (أرقام فقط)';
  if (!d.level) e.level = 'اختر مستواك الحالي';
  if (!d.track) e.track = 'اختر المسار';
  if (d.track === 'other' && d.otherTrack.trim().length < 2) e.otherTrack = 'اكتب المسار الذي تريده';
  if (!d.mode) e.mode = 'اختر نظام الدراسة';
  if (!d.laptop) e.laptop = 'الرجاء الاختيار';
  return e;
}

form.addEventListener('submit', async ev => {
  ev.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  ['track', 'mode', 'laptop'].forEach(k => d[k] = d[k] || '');
  const errs = validate(d);
  form.querySelectorAll('.err[data-for]').forEach(p => p.textContent = errs[p.dataset.for] || '');
  document.getElementById('server-err').textContent = '';
  if (Object.keys(errs).length) return;
  btn.disabled = true; btn.textContent = 'جارٍ الإرسال...';
  try {
    const res = await fetch('/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'حدث خطأ');
    form.reset(); other.classList.add('hidden');
    modal.classList.remove('hidden');
  } catch (e) {
    document.getElementById('server-err').textContent = e.message || 'تعذّر الإرسال، حاول مرة أخرى';
  } finally {
    btn.disabled = false; btn.textContent = 'أرسل طلب التقديم 🚀';
  }
});

document.getElementById('close').onclick = () => modal.classList.add('hidden');
modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };


