import mailer from "../config/nodeMailer.js";

const CONTACT_RECIPIENT =
  process.env.CONTACT_RECIPIENT || "fpophealthhub@gmail.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Full name is required." });
  }
  if (!email || !emailRegex.test(String(email).trim())) {
    return res.status(400).json({ success: false, message: "A valid email address is required." });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ success: false, message: "A message is required." });
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; padding: 20px;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E6EFF7;">
        <div style="background-color: #003B6F; padding: 20px 24px; color: #ffffff; border-bottom: 4px solid #F5C518;">
          <h2 style="margin: 0; font-size: 18px;">New Contact Form Message</h2>
        </div>
        <div style="padding: 24px;">
          <p style="margin: 0 0 12px 0; color: #555555; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1F2937;">From:</strong> ${String(name).trim()}
          </p>
          <p style="margin: 0 0 12px 0; color: #555555; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1F2937;">Email:</strong>
            <a href="mailto:${String(email).trim()}" style="color: #003B6F;">${String(email).trim()}</a>
          </p>
          <div style="background-color: #F5F8FA; border-radius: 8px; padding: 16px; border-left: 4px solid #F5C518; margin-top: 12px;">
            <p style="margin: 0; color: #1F2937; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${String(message).trim()}</p>
          </div>
        </div>
        <div style="background-color: #F5F8FA; padding: 16px 24px; text-align: center; border-top: 1px solid #E6EFF7;">
          <p style="margin: 0; font-size: 12px; color: #8A9CB0;">Sent via the FPOP HealthHub website contact form</p>
        </div>
      </div>
    </div>
  `;

  try {
    await mailer.sendMail({
      to: CONTACT_RECIPIENT,
      subject: `New message from ${String(name).trim()}`,
      html,
      fromName: String(name).trim(),
      replyTo: String(email).trim(),
    });
    return res.json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("CONTACT EMAIL FAILED:", err.message || err);
    return res.status(500).json({ success: false, message: "Failed to send your message. Please try again later." });
  }
};
