from icalendar import Calendar, Event
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from patient.models import Patient
from doctor.models import Doctor
from employee.models import Employee
from bs4 import BeautifulSoup
from pathlib import Path
from hospital.models import Hospital

smtp_server = "smtp.gmail.com"
smtp_port = 587
smtp_username = "achieversgrand@gmail.com"
smtp_password = "bpfhbemqsenjkqud"
from_email = "achieversgrand@gmail.com"
BASE_DIR = Path(__file__).resolve().parent.parent


def send_appointment_email(appointment):
    patient = Patient.objects.get(patient_id=appointment.patient_id)
    doctor = Doctor.objects.get(doctor_id=appointment.doctor_id)
    employee = Employee.objects.get(employee_id=doctor.employee_id)
    hospital = Hospital.objects.get(hospital_email="singaji@gmail.com")
    cal = Calendar()
    event = Event()
    summary = 'Appointment With Dr. {}'.format(employee.employee_name)
    location = hospital.hospital_name + ', ' + hospital.hospital_address
    dstart = str(appointment.appointment_date) + ' ' + \
        str(appointment.appointment_time)
    date = datetime.strptime(dstart, '%Y-%m-%d %H:%M:%S')
    event.add('summary', summary)
    event.add('dtstart', date)
    event.add('dtend', datetime(2023, 10, 31, 10, 0, 0))
    event.add('location', location)
    event.add('description', 'Event Description')
    event.add('organizer', employee.employee_name)

    cal.add_component(event)

    ics_content = cal.to_ical().decode('utf-8')

    to_email = patient.patient_email
    subject = "Appointment Booked Successfully"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = patient.patient_email
    msg['Subject'] = subject

    body = """Dear {},

I hope this email finds you in good health. I am writing to inform you that your appointment has been successfully booked with our clinic. We are delighted to confirm the details of your upcoming appointment:

Date: {} Time: {} Location: {}

We understand the importance of your time and are committed to providing you with the best possible care. To ensure a smooth and efficient visit, we kindly request that you arrive at least 10 minutes before your scheduled appointment. This will allow us to complete any necessary paperwork and make sure you receive the full attention and care you deserve""".format(patient.patient_name, appointment.appointment_date, appointment.appointment_time, location)
    print(body)
    msg.attach(MIMEText(body, 'plain'))
    print("Email Sent Successfully")

    attachment = MIMEBase('text', 'calendar')
    attachment.set_payload(ics_content)
    encoders.encode_base64(attachment)
    msg.attach(attachment)
    print("Email Sent Successfully")

    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()
    print("Email Sent Successfully")


def send_verification_email(url, user_email):
    html_content = ""

    try:
        with open(BASE_DIR/'templates/verification.html', 'r') as file:
            html_content = file.read()
    except FileNotFoundError:
        print("File not found. Please provide a valid file path.")

    new_url = url
    soup = BeautifulSoup(html_content, 'html.parser')
    a_tag = soup.find('a')

    if a_tag:
        a_tag['href'] = new_url

    html_content = str(soup)

    url_element = soup.find(id='url')
    if url_element:
        url_element['href'] = new_url
    html_content = str(soup)

    img_element = soup.find(id='logo-img')
    new_src = "https://hospital0000.s3.ap-south-1.amazonaws.com/SGA+logo+(1).png"
    if img_element:
        img_element['src'] = new_src
    html_content = str(soup)

    message = MIMEMultipart("alternative")
    message["Subject"] = "Verification Email"
    message["From"] = from_email
    message["To"] = user_email
    to_email = user_email
    # Attach HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)
    server.sendmail(from_email, to_email, message.as_string())
    server.quit()
