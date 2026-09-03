import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ratingOptions = [
  { value: 5, emoji: "\u{1F60D}", label: "Strongly Agree" },
  { value: 4, emoji: "\u{1F642}", label: "Agree" },
  { value: 3, emoji: "\u{1F610}", label: "Not Sure" },
  { value: 2, emoji: "\u{1F641}", label: "Disagree" },
  { value: 1, emoji: "\u{1F62D}", label: "Strongly Disagree" },
];

const feedbackQuestions = [
  {
    id: "appropriateService",
    question: "I was provided the appropriate service.",
  },
  {
    id: "facilityResources",
    question:
      "The quality of the facility and resources provided were appropriate.",
  },
  {
    id: "providerResponsiveness",
    question:
      "I am satisfied with the quality and responsiveness of the service provider.",
  },
];

const inputClassName =
  "h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-xs text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15";

function UserInformation({ form, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F5C518]">
        User Information
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/90">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your name"
            className={inputClassName}
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
            onChange={onChange}
            placeholder="Enter your email"
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-white/90">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={form.contactNumber}
            onChange={onChange}
            placeholder="Enter your phone number"
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
}

function RatingScale({ name, value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {ratingOptions.map((option) => {
        const isSelected = value === option.value;
        const tooltipId = `${name}-${option.value}-tooltip`;

        return (
          <div key={`${name}-${option.value}`} className="group relative">
            <button
              type="button"
              onClick={() => onChange(name, option.value)}
              aria-pressed={isSelected}
              aria-label={`${option.value} - ${option.label}`}
              aria-describedby={tooltipId}
              className={`flex h-11 w-full items-center justify-center rounded-xl border text-xl transition-all duration-300 ${
                isSelected
                  ? "scale-[1.04] border-[#F5C518] bg-[#F5C518]/15 shadow-[0_0_18px_rgba(245,197,24,0.22)]"
                  : "border-white/10 bg-white/10 hover:border-[#F5C518]/70 hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              {option.emoji}
            </button>
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 flex min-w-[7rem] -translate-x-1/2 translate-y-1 flex-col items-center rounded-[8px] border border-[#F5C518]/30 bg-white px-3 py-2 text-center opacity-0 shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E3A5F]/60">
                {option.value} / 5
              </span>
              <span className="mt-0.5 text-[11px] font-bold leading-4 text-[#1E3A5F]">
                {option.label}
              </span>
              <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[#F5C518]/30 bg-white" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FeedbackQuestion({ id, question, value, onChange }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
      <p className="mb-1.5 text-[11px] font-medium leading-4 text-white/90">
        {question}
      </p>
      <RatingScale name={id} value={value} onChange={onChange} />
    </div>
  );
}

function SuggestionBox({ value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/90">
        Suggestions for Improvement <span className="text-white/45">(Optional)</span>
      </label>
      <textarea
        rows={3}
        name="suggestions"
        value={value}
        onChange={onChange}
        placeholder="Tell us how we can improve our service..."
        className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-xs text-white placeholder:text-white/45 outline-none transition duration-300 focus:border-[#F5C518] focus:bg-white/15"
      />
    </div>
  );
}

function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    suggestions: "",
  });
  const [ratings, setRatings] = useState({
    satisfaction: null,
    appropriateService: null,
    facilityResources: null,
    providerResponsiveness: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const stepLabels = ["Info", "Ratings", "Suggestions"];
  const currentRatingLabel = ratingOptions.find(
    (option) => option.value === ratings.satisfaction
  )?.label;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
    setError("");
  };

  const handleRatingChange = (name, value) => {
    setRatings((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await fetch(`${window.location.origin}/api/surveys`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contactNumber: form.contactNumber,
          satisfaction: ratings.satisfaction,
          appropriateService: ratings.appropriateService,
          facilityResources: ratings.facilityResources,
          providerResponsiveness: ratings.providerResponsiveness,
          suggestions: form.suggestions,
        }),
      });
    } catch {}
  };

  const goToNextStep = () => {
    if (step === 0) {
      if (!form.name.trim() || !form.email.trim() || !form.contactNumber.trim()) {
        setError("Please complete your information first.");
        return;
      }
    }

    if (step === 1) {
      const allRatingsSelected = [
        ratings.satisfaction,
        ...feedbackQuestions.map((item) => ratings[item.id]),
      ].every(Boolean);

      if (!allRatingsSelected) {
        setError("Please select a rating for each question.");
        return;
      }
    }

    setError("");
    setSubmitted(false);
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  };

  const goToPreviousStep = () => {
    setError("");
    setSubmitted(false);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[8px] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md sm:p-5"
    >
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Survey Form
        </h2>
        <p className="mt-1.5 text-xs leading-5 text-white/75">
          Help us improve our emergency response service by sharing your
          experience.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-1.5">
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index <= step ? "bg-[#F5C518]" : "bg-white/15"
            }`}
            aria-label={`${label} step`}
          />
        ))}
      </div>

      <div className="min-h-[286px]">
        {step === 0 && <UserInformation form={form} onChange={handleChange} />}

        {step === 1 && (
          <div className="space-y-2.5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F5C518]">
                  Service Satisfaction Rating
                </p>
                {currentRatingLabel && (
                  <p className="text-[10px] font-medium text-white/70">
                    {ratings.satisfaction} - {currentRatingLabel}
                  </p>
                )}
              </div>
              <RatingScale
                name="satisfaction"
                value={ratings.satisfaction}
                onChange={handleRatingChange}
              />
            </div>

            {feedbackQuestions.map((item) => (
              <FeedbackQuestion
                key={item.id}
                id={item.id}
                question={item.question}
                value={ratings[item.id]}
                onChange={handleRatingChange}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <SuggestionBox value={form.suggestions} onChange={handleChange} />
            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F5C518]">
                Rating Guide
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ratingOptions.map((option) => (
                  <span
                    key={option.value}
                    className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] text-white/75"
                  >
                    {option.emoji} {option.value} {option.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-red-500/15 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {submitted && step === stepLabels.length - 1 && (
        <p className="mt-3 rounded-md bg-green-500/15 px-3 py-2 text-xs text-green-200">
          Thank you for sharing your feedback.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={goToPreviousStep}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 text-xs font-semibold text-white transition-all duration-300 hover:border-[#F5C518]/70 hover:bg-white/15 sm:w-auto"
          >
            Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < stepLabels.length - 1 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#F9FAFB] px-6 text-xs font-semibold text-[#1E3A5F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5C518] hover:text-[#1F2937] hover:shadow-lg sm:w-auto"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#F9FAFB] px-6 text-xs font-semibold text-[#1E3A5F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5C518] hover:text-[#1F2937] hover:shadow-lg sm:w-auto"
          >
            Submit Feedback
          </button>
        )}
      </div>
    </form>
  );
}

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
      "We're Here to Help",
      "Let's Talk About Your Health",
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

            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
