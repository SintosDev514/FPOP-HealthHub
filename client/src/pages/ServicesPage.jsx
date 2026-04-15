function ServicesPage() {
  return (
    <section className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="relative max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-md p-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/FPOPLOGO2.jpg"
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
            <div className="bg-white-400 backdrop-blur-sm border border-blue-200 rounded-3xl p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white-400 flex items-center justify-center shadow-sm">
                  <img
                    src="/capsule2.png"
                    alt="capsule"
                    className="w-10 h-10 object-contain drop-shadow-sm"
                  />
                </div>

                <h2 className="font-poppins font-bold text-base md:text-lg text-slate-900">
                  Family Planning & Contraceptive Services
                </h2>
              </div>

              <ul className="font-poppins text-sm space-y-2 text-slate-700">
                <li>✔ Counseling / Consultation</li>
                <li>✔ Oral Contraceptives</li>
                <li>✔ Combined Oral Contraceptive (COC)</li>
                <li>✔ Lady Pill / Trust / Althea</li>
                <li>✔ Progestin-Only Pill (POP)</li>
                <li>✔ Injectable (1 Month / 3 Months)</li>
                <li>✔ IUD (Insertion / Removal)</li>
                <li>✔ Implant (PSI)</li>
                <li>✔ Condom</li>
              </ul>
            </div>

            <div className="bg-white-400 backdrop-blur-sm border border-emerald-200 rounded-3xl p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white-500 flex items-center justify-center shadow-sm">
                  <img
                    src="/AIDS.png"
                    alt="test"
                    className="w-19 h-19 object-contain drop-shadow-sm"
                  />
                </div>
                <h2 className="font-poppins font-bold text-base md:text-lg text-slate-900">
                  STI & HIV-AIDS Services
                </h2>
              </div>

              <ul className="font-poppins text-sm space-y-2 text-slate-700">
                <li>✔ Awareness & Counseling</li>
                <li>✔ Community-Based Screening (HIV Testing)</li>
              </ul>
            </div>

            <div className="bg-white-400 backdrop-blur-sm border border-rose-200 rounded-3xl p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-450 flex items-center justify-center shadow-sm">
                  <img
                    src="/doctor2.png"
                    alt="education"
                    className="w-14 h-14 object-contain drop-shadow-sm"
                  />
                </div>
                <h2 className="font-poppins font-bold text-base md:text-lg text-slate-900">
                  Adolescent Sexual Reproductive Health (ASRH)
                </h2>
              </div>

              <ul className="font-poppins text-sm space-y-2 text-slate-700">
                <li>✔ Counseling & Education</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesPage;
