const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const verifyRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({
      success: false,
      message: "Please complete the CAPTCHA and try again.",
    });
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: "CAPTCHA verification is not configured.",
    });
  }

  try {
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: recaptchaToken,
    });

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(400).json({
        success: false,
        message: "Please complete the CAPTCHA and try again.",
      });
    }

    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: "Please complete the CAPTCHA and try again.",
    });
  }
};

export default verifyRecaptcha;
