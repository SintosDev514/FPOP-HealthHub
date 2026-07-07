import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP connection failed:", err.message);
    console.error("Check Render env vars: SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL");
  } else {
    console.log("SMTP connected successfully");
  }
});

export default transporter;
