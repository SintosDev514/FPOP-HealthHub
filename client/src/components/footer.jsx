import { useEffect, useRef, useState } from "react";

import {
  FacebookIcon,
  FollowUsIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "./icon/FooterIcons";

const DEFAULT_CLINIC = {
  clinicName: "Family Planning Organization of the Philippines",
  clinicEmail: "fpophealthhub@gmail.com",
  clinicPhone: "09556127415",
  clinicAddress: "Rosales Blvd Corner Galit St.\nBrgy. East Awang, Calbayog City, Samar.\nPhilippines",
};

const Footer = () => {
  const [clinic, setClinic] = useState(DEFAULT_CLINIC);
  const [copiedItem, setCopiedItem] = useState(null);
  const copiedTimerRef = useRef(null);

  useEffect(() => {
    fetch(`${__API_BASE__}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setClinic({
            clinicName:
              data.settings.clinicName || DEFAULT_CLINIC.clinicName,
            clinicEmail:
              data.settings.clinicEmail || DEFAULT_CLINIC.clinicEmail,
            clinicPhone:
              data.settings.clinicPhone || DEFAULT_CLINIC.clinicPhone,
            clinicAddress:
              data.settings.clinicAddress || DEFAULT_CLINIC.clinicAddress,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const copyToClipboard = async (value, item) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedItem(item);

    if (copiedTimerRef.current) {
      window.clearTimeout(copiedTimerRef.current);
    }

    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedItem(null);
    }, 1500);
  };

  return (
    <footer className="mt-auto w-full bg-[#F5C518] text-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <p className="max-w-[260px] text-xs font-semibold leading-tight text-black">
              {clinic.clinicName}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-black/70">
              Calbayog Clinic <br />
              Community Healthcare Clinic
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-black">
              <LocationIcon className="h-3.5 w-3.5 text-black" />
              Location
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="leading-relaxed text-black/70">
                {clinic.clinicAddress.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < clinic.clinicAddress.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-black">
              <FollowUsIcon className="h-3.5 w-3.5 text-black" />
              Follow Us
            </h3>
            <p className="mb-3 text-xs text-black/70">
              Stay connected for updates and health information.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/share/1C2otjjGyM/"
                className="text-black/60 transition hover:text-black"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(clinic.clinicEmail, "email")}
                className="text-black/60 transition hover:text-black"
                aria-label="Copy email address"
                title={copiedItem === "email" ? "Copied" : "Copy email address"}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7l9 6 9-6"
                  />
                </svg>
              </button>
              {copiedItem === "email" ? (
                <span className="text-[10px] font-medium text-black">
                  Copied
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => copyToClipboard(clinic.clinicPhone, "phone")}
                className="text-black/60 transition hover:text-black"
                aria-label="Copy phone number"
                title={copiedItem === "phone" ? "Copied" : "Copy phone number"}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
              {copiedItem === "phone" ? (
                <span className="text-[10px] font-medium text-black">
                  Copied
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] text-black/50">
            © {new Date().getFullYear()} Family Planning Organization of the
            Philippines. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
