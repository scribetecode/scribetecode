# نموذج التسجيل - منصة تعليم البرمجة

## التشغيل
1. ثبّت Python 3.9 أو أحدث.
2. `pip install -r requirements.txt`
3. `python app.py`
4. افتح المتصفح على: http://localhost:5000

## عرض الطلبات المسجّلة
- تُحفظ الطلبات في ملف `registrations.db` (قاعدة بيانات SQLite).
- لعرضها: http://localhost:5000/api/registrations?key=change-me
- غيّر كلمة المرور بمتغيّر البيئة: `ADMIN_KEY=كلمتك python app.py`

## الملفات
- `static/index.html` واجهة النموذج
- `static/style.css` التصميم
- `static/script.js` التحقق من البيانات والإرسال
- `app.py` الخادم وقاعدة البيانات
