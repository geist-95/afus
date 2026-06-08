import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend with the provided API key
const resend = new Resend('re_SWGUarpy_6ChxSXSePx7U5uC97JRaDAEa');

// List of emails to send to
const emails = [
  // "example@domain.com",
  "mti.yazid@gmail.com"
];

async function sendEmails() {
  if (emails.length === 0) {
    console.error("Please add some email addresses to the 'emails' array in send_emails.mjs.");
    return;
  }

  const htmlContent = fs.readFileSync(path.join(__dirname, 'waitlist_email_primary.html'), 'utf-8');

  for (const email of emails) {
    try {
      const data = await resend.emails.send({
        from: 'Afus <contact@afus.ma>', // Using the verified afus.ma domain
        to: email,
        subject: 'Your Afus beta access',
        html: htmlContent,
      });

      console.log(`Email successfully sent to ${email}:`, data);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
}

sendEmails();
