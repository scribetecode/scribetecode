from flask import Flask, jsonify, render_template, request
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit():

    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not phone:
        return "من فضلك أكمل البيانات المطلوبة.", 400

    email_message = EmailMessage()

    email_message["Subject"] = f"بيانات عميل جديدة - {name}"
    email_message["From"] = SMTP_USERNAME
    email_message["To"] = RECEIVER_EMAIL

    email_message.set_content(
        f"""
تم استقبال بيانات عميل جديد:

الاسم:
{name}

البريد الإلكتروني:
{email}

رقم الهاتف:
{phone}

الرسالة:
{message}
"""
    )  
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:

            server.starttls()

            server.login(
                SMTP_USERNAME,
                SMTP_PASSWORD
            )

            server.send_message(email_message)

        return jsonify({
            "success": True,
            "message": "تم إرسال البيانات بنجاح"
        }), 200

    except Exception as error:

     print("Email error:", error)

    return jsonify({
            "success": False,
            "message": "حدث خطأ أثناء إرسال البيانات"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
    
