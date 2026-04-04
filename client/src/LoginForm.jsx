export default function LoginForm() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 text-white"
              >
                <path d="M12 21s-6.716-4.35-9.193-8.296C.682 9.327 2.245 5 6.33 5c2.13 0 3.57 1.165 4.364 2.358C11.487 6.165 12.927 5 15.057 5c4.084 0 5.648 4.327 3.523 7.704C18.716 16.65 12 21 12 21Z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              FPOP Clinic Portal
            </h1>
            <p className="mt-3 text-slate-500 text-lg">
              Welcome back! Please login to continue
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-slate-800 font-semibold mb-3">Role</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="rounded-2xl border-2 border-blue-600 text-blue-600 font-semibold py-3 bg-blue-50"
                >
                  Patient
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-300 text-slate-700 font-semibold py-3 bg-white"
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-300 text-slate-700 font-semibold py-3 bg-white"
                >
                  Staff
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-3">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="alvarezdareen776@gmail.com"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-3">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm md:text-base">
              <label className="flex items-center gap-2 text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>Remember me</span>
              </label>

              <a href="#" className="text-blue-600 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-xl hover:bg-blue-700 transition"
            >
              Sign In →
            </button>

            <p className="text-center text-slate-600 text-base">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 font-semibold">
                Sign Up
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          © 2026 FPOP Clinic. All rights reserved.
        </p>
      </div>
    </div>
  );
}