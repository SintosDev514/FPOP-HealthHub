function LocationPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Our Location</h1>

        <p className="text-slate-600 mb-6">
          Visit our clinic at the address below:
        </p>

        <div className="text-slate-700 mb-6">
          <p>
            <strong>FPOP Calbayog Clinic</strong>
          </p>
          <p>Calbayog City, Samar, Philippines</p>
        </div>

        {/* Google Map Embed */}
        <div className="w-full h-[300px] rounded-xl overflow-hidden">
          <iframe
            title="map"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            src="https://maps.google.com/maps?q=Calbayog%20City&t=&z=13&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
