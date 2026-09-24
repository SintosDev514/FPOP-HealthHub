import { useState, useEffect } from "react";
import checkIcon from "../assets/checkmark.svg";
import capsuleIcon from "../assets/capsule.svg";
import heartIcon from "../assets/heart.svg";
import stethoscopeIcon from "../assets/stethoscope.svg";

const CATEGORIES = [
  {
    key: "family-planning",
    icon: capsuleIcon,
    border: "border-blue-200",
    title: "Family Planning & Contraceptive Services",
    wide: false,
  },
  {
    key: "sti-hiv",
    icon: heartIcon,
    border: "border-emerald-200",
    title: "STI & HIV-AIDS Services",
    wide: false,
  },
  {
    key: "asrh",
    icon: stethoscopeIcon,
    border: "border-rose-200",
    title: "Adolescent Sexual Reproductive Health (ASRH)",
    wide: true,
  },
];

function ServicesPage() {
  const [groups, setGroups] = useState({
    "family-planning": [],
    "sti-hiv": [],
    asrh: [],
  });

  useEffect(() => {
    fetch(`${__API_BASE__}/api/services`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        const next = { "family-planning": [], "sti-hiv": [], asrh: [] };
        data.services.forEach((service) => {
          if (next[service.category]) next[service.category].push(service.name);
        });
        setGroups(next);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="relative max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/logoo.png"
            alt="bg-logo"
            className="w-[320px] md:w-[450px] opacity-50 object-contain"
          />
        </div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-slate-900">
              Offered Services
            </h1>
            <p className="font-poppins text-sm text-slate-500">
              FPOP Calbayog Clinic
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {CATEGORIES.map((category) => {
              const items = groups[category.key] || [];
              return (
                <div
                  key={category.key}
                  className={`bg-white/90 backdrop-blur-sm border ${category.border} rounded-3xl p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    category.wide ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <img
                        src={category.icon}
                        alt={category.title}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <h2 className="font-poppins font-bold text-base md:text-lg text-slate-900">
                      {category.title}
                    </h2>
                  </div>

                  <ul className="font-poppins text-sm space-y-2 text-slate-700">
                    {items.length > 0 ? (
                      items.map((name) => (
                        <li key={name} className="flex items-start gap-2">
                          <img src={checkIcon} alt="check" className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{name}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400">No services available yet.</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesPage;