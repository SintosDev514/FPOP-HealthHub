import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const SCRIPT_ID = "google-recaptcha-script";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const loadRecaptchaScript = () => {
  if (window.grecaptcha) return Promise.resolve();

  const existingScript = document.getElementById(SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const ReCaptcha = forwardRef(function ReCaptcha({ onChange }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState(
    SITE_KEY ? "" : "CAPTCHA is not configured."
  );

  useImperativeHandle(ref, () => ({
    reset() {
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
      onChange("");
    },
  }));

  useEffect(() => {
    let isMounted = true;

    if (!SITE_KEY) {
      return;
    }

    loadRecaptchaScript()
      .then(() => {
        if (!isMounted || !containerRef.current || widgetIdRef.current !== null) {
          return;
        }

        window.grecaptcha.ready(() => {
          if (!isMounted || !containerRef.current || widgetIdRef.current !== null) {
            return;
          }

          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: SITE_KEY,
            callback: (token) => onChange(token),
            "expired-callback": () => onChange(""),
            "error-callback": () => onChange(""),
          });
        });
      })
      .catch(() => {
        if (isMounted) setError("CAPTCHA failed to load.");
      });

    return () => {
      isMounted = false;
    };
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <div ref={containerRef} />
      </div>
      {error && (
        <p className="text-center text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
});

export default ReCaptcha;
