import { useEffect, useRef, useState } from "react";

import {
  FacebookIcon,
  FollowUsIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "./icon/FooterIcons";

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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start">
          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <p className="max-w-[260px] text-sm font-semibold leading-tight text-white">
              Family Planning Organization of the Philippines
            </p>
            <p className="mt-1 text-xs text-[#F5C518]">- Established 1969</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Calbayog Clinic <br />
              Community Healthcare Clinic
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <LocationIcon className="h-4 w-4 text-[#F5C518]" />
              Location
            </h3>
            <div className="space-y-2 text-sm">
              <div className="leading-relaxed text-white/70">
                Rosales Blvd Corner Galit St.
                <br />
                Brgy. East Awang, Calbayog City, Samar.
                <br />
                Philippines
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col items-start text-left">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <FollowUsIcon className="h-4 w-4 text-[#F5C518]" />
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
                <FacebookIcon className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(emailAddress, "email")}
                className="text-white/60 transition hover:text-[#F5C518]"
                aria-label="Copy email address"
                title={copiedItem === "email" ? "Copied" : "Copy email address"}
              >
                <MailIcon className="h-5 w-5" />
              </button>
              {copiedItem === "email" ? (
                <span className="text-xs font-medium text-[#F5C518]">Copied</span>
              ) : null}
              <button
                type="button"
                onClick={() => copyToClipboard(phoneNumber, "phone")}
                className="text-white/60 transition hover:text-[#F5C518]"
                aria-label="Copy phone number"
                title={copiedItem === "phone" ? "Copied" : "Copy phone number"}
              >
                <PhoneIcon className="h-5 w-5" />
              </button>
              {copiedItem === "phone" ? (
                <span className="text-xs font-medium text-[#F5C518]">Copied</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/50">
            &copy; {new Date().getFullYear()} Family Planning Organization of the Philippines. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
