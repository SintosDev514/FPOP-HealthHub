import React, { useEffect, useRef, useState } from "react";

const emailAddress = "fpophealthhub@gmail.com";
const phoneNumber = "09556127415";

const Footer = () => {
  const [copiedItem, setCopiedItem] = useState(null);
  const copiedTimerRef = useRef(null);

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
    <footer className="mt-auto w-full bg-[#1E3A5F] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-white">
              Family Planning Organization of the Philippines
            </p>
            <p className="mt-1 text-xs text-[#F5C518]">- Established 1969</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Calbayog Clinic <br />
              Community Healthcare Clinic
            </p>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <svg
                className="h-4 w-4 text-[#F5C518]"
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
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/70">{phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/70">{emailAddress}</span>
              </div>
              <div className="leading-relaxed text-white/70">
                Rosales Blvd Corner Galit St.
                <br />
                Brgy. East Awang, Calbayog City, Samar.
                <br />
                Philippines
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <svg
                className="h-4 w-4 text-[#F5C518]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Follow Us
            </h3>
            <p className="mb-4 text-sm text-white/70">
              Stay connected for updates and health information.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1C2otjjGyM/"
                className="text-white/60 transition hover:text-[#F5C518]"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(emailAddress, "email")}
                className="text-white/60 transition hover:text-[#F5C518]"
                aria-label="Copy email address"
                title={copiedItem === "email" ? "Copied" : "Copy email address"}
              >
                <svg
                  className="h-5 w-5"
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
                <span className="text-xs font-medium text-[#F5C518]">
                  Copied
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => copyToClipboard(phoneNumber, "phone")}
                className="text-white/60 transition hover:text-[#F5C518]"
                aria-label="Copy phone number"
                title={copiedItem === "phone" ? "Copied" : "Copy phone number"}
              >
                <svg
                  className="h-5 w-5"
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
                <span className="text-xs font-medium text-[#F5C518]">
                  Copied
                </span>
              ) : null}
            </div>
          </div>

          <div />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/50">
            © {new Date().getFullYear()}Family Planning Organization of the
            Philippines. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
