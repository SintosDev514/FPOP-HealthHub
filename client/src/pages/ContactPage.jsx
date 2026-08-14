import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import API_BASE from "../apiBase";

function ContactPage() {
  const titleRef = useRef(null);
  const typewriterRef = useRef(null);
  const formRef = useRef(null);
  const cardsRef = useRef([]);

  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.message.trim()) {
      setError("Please write a message.");
      return;
    }
    if (!form.consent) {
      setError("Please agree to discuss your concerns with FPOP Clinic.");
      return;
    }

    setError("");
    setStatus("sending");

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send your message.");
      }

      setForm({ name: "", email: "", message: "", consent: false });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    tl.fromTo(
      formRef.current,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
      "-=0.4"
    );

    tl.fromTo(
      cardsRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );

    const words = [
      "Get in Touch",
      "We’re Here to Help",
      "Let’s Talk About Your Health",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const currentWord = words[wordIndex];

      if (!isDeleting) {
        charIndex++;
      } else {
        charIndex--;
      }

      if (typewriterRef.current) {
        typewriterRef.current.textContent = currentWord.substring(0, charIndex);
      }

      let speed = isDeleting ? 45 : 90;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }

      timeout = setTimeout(type, speed);
    };

    type();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div ref={titleRef} className="mb-6 text-center">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1E3A5F]">
            Contact Us
          </p>

          <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl lg:text-4xl">
            <span ref={typewriterRef}></span>
            <span className="ml-1 inline-block animate-pulse text-[#F5C518]">|</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-[#1F2937]/75">
            Reach out to FPOP Clinic anytime. We are ready to assist you with
            your questions, appointments, and healthcare concerns.
          </p>
        </div>

        <div
          ref={formRef}
          className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#1E3A5F] p-4 shadow-2xl sm:p-6 lg:p-8"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#F5C518]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[#F5C518]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-white">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5C518]">
                Contact Information
              </p>

              <h2 className="text-xl font-bold sm:text-2xl">Get in Touch</h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-white/75">
                Have questions or need help? Send us a message and our team will
                get back to you as soon as possible.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <img
                      src="GmailLogo.png"
                      alt="Email"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Email</p>
                    <p className="text-xs text-white/75">fpophealthhub@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ">
                    <img
                      src="PhoneLogo.png"
                      alt="Phone"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Phone</p>
                    <p className="text-xs text-white/75">+63 912 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <img
                      src="ClockLogo.png"
                      alt="Office Hours"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Office Hours</p>
                    <p className="text-xs text-white/75">
                      Monday - Friday, 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[8px] border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-5"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/90">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-xs text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/90">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-xs text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-medium text-white/90">
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-xs text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                />
              </div>

              <label className="mt-3 flex items-center gap-2.5 text-xs text-white/75">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-white/30 bg-transparent accent-[#F5C518]"
                />
                I agree to discuss my concerns with FPOP Clinic
              </label>

              {error && (
                <p className="mt-3 rounded-md bg-red-500/15 px-3 py-2 text-xs text-red-200">
                  {error}
                </p>
              )}

              {status === "success" && (
                <p className="mt-3 rounded-md bg-green-500/15 px-3 py-2 text-xs text-green-200">
                  Your message has been sent! We will get back to you soon.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#F9FAFB] px-6 font-semibold text-[#1E3A5F] text-xs transition-all duration-300 hover:bg-[#F5C518] hover:text-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;