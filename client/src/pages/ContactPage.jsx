function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-600 mb-6">
          Have questions or need help? Reach out to us anytime.
        </p>

        <div className="space-y-4 text-slate-700">
          <p>
            <strong>Email:</strong> fpopclinic@gmail.com
          </p>
          <p>
            <strong>Phone:</strong> +63 912 345 6789
          </p>
          <p>
            <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full h-12 px-4 rounded-xl border border-slate-300"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full h-12 px-4 rounded-xl border border-slate-300"
          />
          <textarea
            placeholder="Your Message"
            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-300"
          />
          <button className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
