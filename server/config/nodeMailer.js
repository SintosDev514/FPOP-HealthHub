import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailer = {
  sendMail: async ({ from, to, subject, html }) => {
    const msg = { to, from, subject, html };
    return sgMail.send(msg);
  },
};

export default mailer;
