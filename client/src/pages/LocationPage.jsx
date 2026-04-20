import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

function LocationPage() {
  const rootRef = useRef(null);
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroVisualRef = useRef(null);
  const nurseRef = useRef(null);
  const floatingCardsRef = useRef([]);
  const infoRef = useRef(null);
  const mapCardRef = useRef(null);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const clinicRef = useRef(null);
  const addressRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(pageRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
      })
        .from(
          heroRef.current,
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          heroTextRef.current,
          {
            opacity: 0,
            x: -30,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          heroVisualRef.current,
          {
            opacity: 0,
            x: 30,
            duration: 0.8,
          },
          "-=0.55"
        )
        .from(
          floatingCardsRef.current,
          {
            opacity: 0,
            y: 16,
            stagger: 0.12,
            duration: 0.45,
          },
          "-=0.45"
        )
        .from(
          nurseRef.current,
          {
            opacity: 0,
            y: 24,
            scale: 0.96,
            duration: 0.75,
          },
          "-=0.35"
        )
        .from(
          infoRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.3"
        )
        .from(
          mapCardRef.current,
          {
            opacity: 0,
            y: 22,
            scale: 0.985,
            duration: 0.8,
          },
          "-=0.2"
        );

      gsap.to(".float-card", {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      const typeTargets = [
        { el: titleRef.current, text: "Our Location" },
        { el: subtitleRef.current, text: "Visit our clinic at the address below:" },
        { el: clinicRef.current, text: "FPOP Calbayog Clinic" },
        { el: addressRef.current, text: "Calbayog City, Samar, Philippines" },
      ];

      typeTargets.forEach((item) => {
        if (item.el) item.el.textContent = "";
      });

      const typeTl = gsap.timeline({ delay: 0.6 });

      typeTargets.forEach((item) => {
        typeTl.to(
          {},
          {
            duration: Math.max(item.text.length * 0.035, 0.6),
            ease: "none",
            onUpdate: function () {
              const progress = this.progress();
              const length = Math.floor(progress * item.text.length);
              if (item.el) item.el.textContent = item.text.slice(0, length);
            },
          }
        );
      });

      if (mapCardRef.current) {
        const enter = () => {
          if (window.innerWidth < 768) return;
          gsap.to(mapCardRef.current, {
            y: -6,
            duration: 0.3,
            ease: "power3.out",
            boxShadow: "0 26px 60px rgba(30,58,95,0.16)",
          });
        };

        const leave = () => {
          gsap.to(mapCardRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power3.out",
            boxShadow: "0 16px 38px rgba(30,58,95,0.10)",
          });
        };

        mapCardRef.current.addEventListener("mouseenter", enter);
        mapCardRef.current.addEventListener("mouseleave", leave);

        return () => {
          mapCardRef.current?.removeEventListener("mouseenter", enter);
          mapCardRef.current?.removeEventListener("mouseleave", leave);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const setFloatingCardRef = (el, index) => {
    floatingCardsRef.current[index] = el;
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-[#F9FAFB] px-4 py-6 text-[#1F2937] sm:px-6 md:px-8 lg:px-30"
    >
      <div ref={pageRef} className="mx-auto max-w-[1400px]">
        <div className="overflow-hidden rounded-[35px] bg-white shadow-[0_16px_40px_rgba(30,58,95,0.10)]">
        <section
  ref={heroRef}
  className="relative overflow-hidden bg-[#1E3A5F] px-4 pt-6 pb-0 sm:px-7 md:px-10 lg:px-12"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,197,24,0.12),transparent_22%)]" />

  <div className="relative grid items-center gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 ">
    {/* LEFT TEXT */}
    <div ref={heroTextRef} className="text-white text-center lg:text-left px-18">
      <h1
        ref={titleRef}
        className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
      >
        Our Location
      </h1>

      <p
        ref={subtitleRef}
        className="mt-3 text-base leading-7 text-white/80 sm:text-lg"
      >
        Visit our clinic at the address below:
      </p>

      <div className="mt-5">
        <p
          ref={clinicRef}
          className="text-2xl font-extrabold sm:text-3xl"
        >
          FPOP Calbayog Clinic
        </p>
        <p
          ref={addressRef}
          className="mt-2 text-lg text-white/80 sm:text-xl"
        >
          Calbayog City, Samar, Philippines
        </p>
      </div>
    </div>

    {/* RIGHT VISUAL */}
    <div
      ref={heroVisualRef}
      className="relative mt-2 flex min-h-[260px] items-end justify-center overflow-hidden sm:min-h-[300px] lg:mt-0 lg:min-h-[420px] lg:justify-end lg:overflow-visible"
    >
      {/* hide floating cards on mobile */}
      <div
        ref={(el) => setFloatingCardRef(el, 0)}
        className="float-card absolute left-0 top-25 z-10 hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-white backdrop-blur-md sm:block lg:left-30 px-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
          Visit Us
        </p>
        <p className="mt-1 text-sm font-bold">Calbayog City</p>
      </div>

      <div
        ref={(el) => setFloatingCardRef(el, 1)}
        className="float-card absolute right-2 top-8 z-10 hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-white backdrop-blur-md sm:block lg:right-0"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
          Clinic
        </p>
        <p className="mt-1 text-sm font-bold">FPOP Calbayog</p>
      </div>

      <img
        ref={nurseRef}
        src="/nurseloc.png"
        alt="Nurse"
        className="relative z-20 h-[220px] w-auto object-contain sm:h-[270px] md:h-[300px] lg:h-[470px] xl:h-[500px] px-4"
      />
    </div>
  </div>
</section>

          <section className="px-5 py-6 sm:px-7 md:px-10 lg:px-12 lg:py-8">
            <div ref={infoRef} className="mb-6 grid gap-4 sm:grid-cols-3"></div>

            <div
              ref={mapCardRef}
              className="overflow-hidden rounded-[24px] border border-[#1E3A5F]/10 bg-white shadow-[0_16px_38px_rgba(30,58,95,0.10)]"
            >
              <div className="flex items-center justify-between border-b border-[#1E3A5F]/10 bg-[#F9FAFB] px-4 py-3 sm:px-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1E3A5F]/65">
                    Map Preview
                  </p>
                  <p className="mt-1 text-sm text-[#1F2937]/75">
                    View our clinic location in Calbayog City
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps/place/Calbayog+City,+Samar,+Philippines"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden rounded-xl bg-[#1E3A5F] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-[#F5C518] hover:text-[#1F2937] sm:inline-flex"
                >
                  Open Map
                </a>
              </div>

              <div className="h-[280px] w-full sm:h-[340px] md:h-[420px] lg:h-[500px]">
                <iframe
                  title="map"
                  src="https://www.google.com/maps?q=Calbayog%20City,%20Samar,%20Philippines&z=13&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="border-t border-[#1E3A5F]/10 bg-white px-4 py-3 sm:hidden">
                <a
                  href="https://www.google.com/maps/place/Calbayog+City,+Samar,+Philippines"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-xl bg-[#1E3A5F] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-[#F5C518] hover:text-[#1F2937]"
                >
                  Open Map
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LocationPage;