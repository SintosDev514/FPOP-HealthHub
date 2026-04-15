function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">About Us</h1>

        <p className="text-slate-600 leading-7 mb-4">
          FPOP Clinic Portal is designed to provide patients with easy access to
          healthcare services. Our goal is to make appointment booking, medical
          records, and communication seamless and secure.
        </p>

        <p className="text-slate-600 leading-7 mb-4">
          We are committed to improving healthcare accessibility in Calbayog
          City through modern digital solutions.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Our Mission
          </h2>
          <p className="text-slate-600">
            To deliver accessible, efficient, and patient-centered healthcare
            services through technology.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
