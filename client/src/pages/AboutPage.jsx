import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AboutPage() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroCardsRef = useRef([]);
  const secondSectionRef = useRef(null);
  const secondImageRef = useRef(null);
  const secondTextRef = useRef(null);
  const featureRefs = useRef([]);
  const nurseCardRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
      })
        .from(
          heroTextRef.current,
          {
            opacity: 0,
            x: -40,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          heroTextRef.current.querySelectorAll("p"),
          {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          heroImageRef.current,
          {
            opacity: 0,
            x: 60,
            duration: 0.9,
          },
          "-=0.6"
        )
        .from(
          heroCardsRef.current,
          {
            opacity: 0,
            y: 24,
            stagger: 0.12,
            duration: 0.5,
          },
          "-=0.5"
        );

      gsap.to(".floating-ui", {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.from(secondSectionRef.current, {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(secondImageRef.current, {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(secondTextRef.current, {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      if (secondTextRef.current) {
        const el = secondTextRef.current;
        const onEnter = () => {
          gsap.to(secondTextRef.current, {
            y: -8,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const onLeave = () => {
          gsap.to(secondTextRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };
        
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
         
          return () => {            
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          };
       
      }

      gsap.from(featureRefs.current, {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.5,
        ease: "power3.out",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const setHeroCardRef = (el, index) => {
    heroCardsRef.current[index] = el;
  };

  const handleNurseEnter = () => {
    if (!nurseCardRef.current) return;
    gsap.to(nurseCardRef.current, {
      y: -10,
      scale: 1.02,
      boxShadow: "0 24px 60px rgba(30,58,95,0.22)",
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handleNurseLeave = () => {
    if (!nurseCardRef.current) return;
    gsap.to(nurseCardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 18px 45px rgba(30,58,95,0.16)",
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* HERO */}
      <section className="mx-auto max-w-[1400px] px-6 py-6 md:px-10 lg:px-16">
        <div
          ref={heroRef}
          className="overflow-visible rounded-[28px] bg-[#1E3A5F] px-6 pt-6 pb-2 shadow-[0_16px_40px_rgba(30,58,95,0.25)] md:px-10 md:pt-6 md:pb-2"
        >
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div ref={heroTextRef} className="text-center md:text-left text-white">
              <h1 className="text-3xl font-extrabold md:text-5xl">About Us</h1>

              <p className="mt-4 max-w-[520px] text-base leading-7 text-white/80">
                Building healthier communities through education, outreach, and
                accessible reproductive health services.
              </p>

              <p className="mt-6 max-w-[520px] text-sm leading-7 text-white/75">
                At FPOP, we are committed to providing comprehensive reproductive health services with compassion and expertise. Our mission is to empower individuals and families with knowledge, resources, and quality care that respects their needs and values.
              </p>
            </div>

            <div
              ref={heroImageRef}
              className="relative flex min-h-[300px] items-end justify-center md:min-h-[380px]"
            >
              <div
                ref={(el) => setHeroCardRef(el, 0)}
                className="floating-ui absolute left-10 top-6 z-10 hidden w-44 rounded-2xl bg-white px-4 py-3 shadow-xl md:block"
              >
                <p className="text-xs text-slate-500">Appointments</p>
                <p className="mt-1 text-xl font-bold text-[#1E3A5F]">24/7</p>
                <p className="mt-1 text-sm text-slate-500">Book anytime</p>
              </div>

              <div
                ref={(el) => setHeroCardRef(el, 1)}
                className="floating-ui absolute right-10 top-0 z-10 hidden w-48 rounded-2xl bg-white px-4 py-3 shadow-xl md:block"
              >
                <p className="text-xs text-slate-500">Patient Access</p>
                <p className="mt-1 text-xl font-bold text-[#1E3A5F]">Secure</p>
                <p className="mt-1 text-sm text-slate-500">Safe & private</p>
              </div>

              <div
                ref={(el) => setHeroCardRef(el, 2)}
                className="floating-ui absolute left-20 top-40 z-10 hidden w-56 rounded-2xl bg-white px-4 py-3 shadow-xl md:block"
              >
                <p className="text-xs text-slate-500">Portal Experience</p>
                <p className="mt-1 text-xl font-bold text-[#1E3A5F]">
                  Fast & Simple
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Easy workflow for patients and staff
                </p>
              </div>

              <img
                src="/DOCTOR1.png"
                alt="Doctor"
                className="relative z-20 -mb-8 h-[380px] w-auto object-contain md:-mb-8 md:h-[450px] lg:-mb-12 lg:h-[580px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section
        ref={secondSectionRef}
        className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-16"
      >
        <div className="grid items-stretch gap-12 lg:grid-cols-3">
          {/* LEFT - NURSE DESIGN */}
          <div ref={secondImageRef} className="relative flex justify-center">
            <div
              ref={nurseCardRef}
              onMouseEnter={handleNurseEnter}
              onMouseLeave={handleNurseLeave}
              className="relative flex h-[280px] w-[120px] items-center justify-center rounded-[38px] bg-[#1E3A5F] shadow-[0_18px_45px_rgba(30,58,95,0.16)] md:h-[380px] md:w-[380px]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[38px] bg-gradient-to-br from-white/10 to-transparent opacity-40" />

              <div className="absolute -bottom-8 -left-8 h-28 w-24 rounded-[24px] bg-black md:h-32 md:w-28" />
              <div className="absolute -bottom-20 left-12 h-28 w-24 rounded-[24px] bg-black md:h-32 md:w-28" />

              <img
                src="/NURSE1.png"
                alt="Nurse"
                className="relative z-10 h-[1100px] w-auto object-contain md:h-[950px]"
              />
            </div>
          </div>

          {/* RIGHT - THREE CONTAINERS */}
          <div className="lg:col-span-2 space-y-6">
            <div 
              ref={secondTextRef}
              className="rounded-2xl border border-white/15 bg-white/8 px-6 py-6 shadow-[0_8px_32px_rgba(30,58,95,0.1)] transition-all duration-300 backdrop-blur-sm hover:border-[#F5C518]/30 hover:shadow-[0_16px_48px_rgba(245,197,24,0.2)] hover:bg-white/12 md:px-8 md:py-8"
            >
              <p className="text-lg font-black uppercase tracking-[0.3em] text-black/50">
                Our Mission
              </p>
              
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#1E3A5F] md:text-4xl">
                Making healthcare easier and more accessible.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-700 md:text-base">
                Connecting patients with healthcare providers through an innovative digital platform for better access, education, and care for all communities.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl bg-[#1E3A5F] px-6 py-8 text-left text-white shadow-[0_16px_28px_rgba(30,58,95,0.18)] transition-all duration-300 border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:text-[#1E3A5F] md:px-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-white/90 transition-colors duration-300">
                  Community Outreach
                </p>
                <p className="mt-4 text-[15px] leading-7 text-blue  transition-colors duration-300">                  Bringing family planning information, health counseling, and
                  support directly to underserved communities.
                </p>
              </article>

              <article className="rounded-xl bg-[#1E3A5F] px-6 py-8 text-left text-white shadow-[0_16px_28px_rgba(30,58,95,0.18)] transition-all duration-300 border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:text-[#1E3A5F] md:px-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-blue   transition-colors duration-300">
                  Youth Education
                </p>
                <p className="mt-4 text-[15px] leading-7 text-blue  transition-colors duration-300">
                  Promoting adolescent reproductive health, comprehensive sexuality
                  education, and informed decision-making.
                </p>
              </article>

              <article className="rounded-xl bg-[#1E3A5F] px-6 py-8 text-left text-white shadow-[0_16px_28px_rgba(30,58,95,0.18)] transition-all duration-300 border-2 border-transparent hover:bg-white hover:border-[#F5C518] hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:text-[#1E3A5F] md:px-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-blue transition-colors duration-300">
                  Clinic Services
                </p>
                <p className="mt-4 text-[15px] leading-7 text-blue   transition-colors duration-300">
                  Supporting appointments, records access, referrals, and patient
                  communication through a secure digital portal.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;