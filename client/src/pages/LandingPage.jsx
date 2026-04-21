import bgImage from "../assets/staff.png";

import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="min-h-screen  flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE */}

          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Better healthcare starts with a simpler patient portal.
            </h1>

            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-8">
              Manage appointments, access your records, and stay connected with
              your clinic in one secure place.
            </p>

            <div className="mt-8">
              <button
                onClick={() => navigate("/services")}
                className="h-14 rounded-sm px-8 border bg-[#1E3A5F] text-white font-semibold 
               hover:bg-white hover:border-[#F5C518] hover:text-[#1E3A5F]  
               transition duration-300 hover:scale-105"
              >
                Offered Services
              </button>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="w-full p-4">
            <div className="relative overflow-hidden rounded-lg transition-all duration-300 group hover:scale-[1.02] p-6 hover:shadow-lg hover:shadow-[#1E3A5F]/20">
              <div
                className="absolute inset-0 -z-10 bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                }}
              ></div>

              <div className="absolute inset-0 -z-10 bg-[#1E3A5F]/60 backdrop-blur-[2px]"></div>


              <div className="absolute inset-0 z-0 rounded-lg pointer-events-none shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]"></div>

              <div className="relative z-10 grid grid-cols-2 gap-4 text-white">
                {/* Card 1 */}
                <div className="rounded-xl p-5 border border-white/10 bg-white/5 backdrop-blur-md">
                  <p className="text-sm text-white/70">Appointments</p>
                  <h3 className="text-2xl font-bold mt-2">24/7</h3>
                  <p className="text-sm text-white/60 mt-2">Book anytime</p>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl p-5 border border-white/10 bg-white/5 backdrop-blur-md">
                  <p className="text-sm text-white/70">Patient Access</p>
                  <h3 className="text-2xl font-bold mt-2">Secure</h3>
                  <p className="text-sm text-white/60 mt-2">Safe & private</p>
                </div>

                {/* Card 3 */}
                <div className="col-span-2 rounded-xl p-5 bg-[#1E3A5F]/50 backdrop-blur-md">
                  <p className="text-sm text-blue-100">Portal Experience</p>
                  <h3 className="text-3xl font-bold mt-2">Fast & Simple</h3>
                  <p className="text-sm text-blue-100 mt-3">
                    Clean and easy workflow for patients and staff.
                  </p>
                </div>
              </div>

              {/* Hover shine */}
              <div className="absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"></div>
            </div>
          </div>

          {/*ened*/}
        </div>
      </section>
    </>
  );
}

export default LandingPage;
