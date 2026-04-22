import { useEffect, useRef } from "react";
import gsap from "gsap";

function ContactPage() {
  const titleRef = useRef(null);
  const typewriterRef = useRef(null);
  const formRef = useRef(null);
  const cardsRef = useRef([]);

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
        <div ref={titleRef} className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#1E3A5F]">
            Contact Us
          </p>

          <h1 className="text-3xl font-bold text-[#1F2937] sm:text-4xl lg:text-5xl">
            <span ref={typewriterRef}></span>
            <span className="ml-1 inline-block animate-pulse text-[#F5C518]">|</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#1F2937]/75 sm:text-base">
            Reach out to FPOP Clinic anytime. We are ready to assist you with
            your questions, appointments, and healthcare concerns.
          </p>
        </div>

        <div
          ref={formRef}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1E3A5F] p-5 shadow-2xl sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#F5C518]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[#F5C518]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-white">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5C518]">
                Contact Information
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">Get in Touch</h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Have questions or need help? Send us a message and our team will
                get back to you as soon as possible.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Email</p>
                    <p className="text-sm text-white/75">fpopclinic@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                    📞
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Phone</p>
                    <p className="text-sm text-white/75">+63 912 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                    🕒
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Office Hours</p>
                    <p className="text-sm text-white/75">
                      Monday - Friday, 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Inquiry Type
                  </label>
                  <input
                    type="text"
                    placeholder="Inquiry Type"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
                />
              </div>

              <label className="mt-4 flex items-center gap-3 text-sm text-white/75">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-transparent accent-[#F5C518]"
                />
                I agree to discuss my concerns with FPOP Clinic
              </label>

              <button
                type="submit"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F9FAFB] px-6 font-semibold text-[#1E3A5F] transition-all duration-300 hover:bg-[#F5C518] hover:text-[#1F2937] sm:w-auto"
              >
                Send Message 
                <span className="text-lg"></span>
              </button>
            </form>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default ContactPage;