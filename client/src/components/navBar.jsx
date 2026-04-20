import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export default function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const blobRef = useRef(null);
  const blobTwoRef = useRef(null);
  const glowRef = useRef(null);
  const navRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.set(blobRef.current, { x: -120, y: -80 });
      gsap.set(blobTwoRef.current, { x: 220, y: -50 });
      gsap.set(glowRef.current, { x: 0, y: 0, scale: 0.8, opacity: 0 });

      gsap.to(blobRef.current, {
        borderRadius: "58% 42% 63% 37% / 40% 53% 47% 60%",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blobTwoRef.current, {
        borderRadius: "43% 57% 35% 65% / 58% 42% 58% 42%",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const headerEl = headerRef.current;
      const blobEl = blobRef.current;
      const blob2El = blobTwoRef.current;
      const glowEl = glowRef.current;

      const moveEffects = (e) => {
        const rect = headerEl.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(blobEl, {
          x: -120 + relX * 60,
          y: -80 + relY * 25,
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(blob2El, {
          x: 220 - relX * 50,
          y: -50 + relY * 20,
          duration: 1.4,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(glowEl, {
          x: x - 70,
          y: y - 70,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const showGlow = () => {
        gsap.to(glowEl, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      };

      const hideGlow = () => {
        gsap.to(glowEl, {
          opacity: 0,
          scale: 0.8,
          duration: 0.35,
          ease: "power2.out",
        });
      };

      headerEl.addEventListener("mousemove", moveEffects);
      headerEl.addEventListener("mouseenter", showGlow);
      headerEl.addEventListener("mouseleave", hideGlow);

      return () => {
        headerEl.removeEventListener("mousemove", moveEffects);
        headerEl.removeEventListener("mouseenter", showGlow);
        headerEl.removeEventListener("mouseleave", hideGlow);
      };
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const setNavRef = (el, i) => {
    navRef.current[i] = el;
  };

  const handleGlowEnter = (scale = 1.2, opacity = 1) => {
    gsap.to(glowRef.current, {
      scale,
      opacity,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleGlowLeave = () => {
    gsap.to(glowRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <header
      ref={headerRef}
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-white/70
        border-b border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        overflow-hidden
      "
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          ref={blobRef}
          className="absolute h-[220px] w-[320px] rounded-full bg-[#F5C518]/6 blur-3xl"
        />
        <div
          ref={blobTwoRef}
          className="absolute h-[170px] w-[240px] rounded-full bg-[#1E3A5F]/4 blur-3xl"
        />
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none absolute z-10 h-[140px] w-[140px] rounded-full bg-[#F5C518]/20 blur-3xl"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[72px]">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-0 cursor-pointer"
          >
            <img
              src="/FPOPLOGO1.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
            <h2 className="text-lg sm:text-1xl font-bold text-[#1F2937]">
              FPOP Clinic Portal
            </h2>
          </div>

          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
            {[
              { name: "Contact", path: "/contact" },
              { name: "About Us", path: "/about" },
              { name: "Location", path: "/location" },
            ].map((item, i) => (
              <button
                key={i}
                ref={(el) => setNavRef(el, i)}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => handleGlowEnter(1.25, 1)}
                onMouseLeave={handleGlowLeave}
                className="
                  group relative z-20
                  font-semibold text-[#1F2937]
                  transition-all duration-300
                  hover:text-[#1E3A5F]
                "
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#F5C518] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              onMouseEnter={() => handleGlowEnter(1.45, 1)}
              onMouseLeave={handleGlowLeave}
              className="
                relative z-20
                h-10 px-5 rounded-xl
                bg-[#1E3A5F] text-white
                font-semibold
                transition-all duration-300
                hover:bg-white hover:text-[#1F2937]
                hover:border hover:border-[#F5C518]
              "
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              onMouseEnter={() => handleGlowEnter(1.45, 1)}
              onMouseLeave={handleGlowLeave}
              className="
                relative z-20
                h-10 px-5 rounded-xl
                bg-[#1E3A5F] text-white
                font-semibold
                transition-all duration-300
                hover:bg-white hover:text-[#1F2937]
                hover:border hover:border-[#F5C518]
              "
            >
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-lg border border-gray-300"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  navigate("/contact");
                  setMenuOpen(false);
                }}
                className="rounded-xl px-3 py-3 text-left font-medium text-[#1F2937] transition-all duration-300 hover:bg-[#F5C518]/20 hover:text-[#1E3A5F]"
              >
                Contact
              </button>

              <button
                onClick={() => {
                  navigate("/about");
                  setMenuOpen(false);
                }}
                className="rounded-xl px-3 py-3 text-left font-medium text-[#1F2937] transition-all duration-300 hover:bg-[#F5C518]/20 hover:text-[#1E3A5F]"
              >
                About Us
              </button>

              <button
                onClick={() => {
                  navigate("/location");
                  setMenuOpen(false);
                }}
                className="rounded-xl px-3 py-3 text-left font-medium text-[#1F2937] transition-all duration-300 hover:bg-[#F5C518]/20 hover:text-[#1E3A5F]"
              >
                Location
              </button>

              <div className="mt-2 flex flex-col gap-3 border-t border-[#1E3A5F]/10 pt-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="
                    h-11 rounded-xl
                    bg-[#1E3A5F] text-white
                    font-semibold
                    transition-all duration-300
                    hover:bg-white hover:text-[#1F2937]
                    hover:border hover:border-[#F5C518]
                  "
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  className="
                    h-11 rounded-xl
                    bg-[#1E3A5F] text-white
                    font-semibold
                    transition-all duration-300
                    hover:bg-white hover:text-[#1F2937]
                    hover:border hover:border-[#F5C518]
                  "
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}