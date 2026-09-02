const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

const mailer = {
  sendMail: async ({ to, subject, html, fromName, replyTo }) => {
    const templateParams = {
      to_email: to,
      subject,
      message: html,
    };

    if (fromName) templateParams.from_name = fromName;
    if (replyTo) templateParams.reply_to = replyTo;

    const params = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    };

    const res = await fetch(EMAILJS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`EmailJS error ${res.status}: ${text}`);
    }

    return { messageId: text };
  },
};

export default mailer;
