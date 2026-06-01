import React, { useState } from "react";

const Icon = ({ type, className = "h-5 w-5" }) => {
  const paths = {
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    clipboard:
      "M9 5h6m-6 4h6m-6 4h6m-8 8h10a2 2 0 002-2V7a2 2 0 00-2-2h-2.5a2.5 2.5 0 00-5 0H7a2 2 0 00-2 2v12a2 2 0 002 2z",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    chevron: "M19 9l-7 7-7-7",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  );
};

const toInputDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AppointmentBooking = ({ onSaveAppointment }) => {
  const services = [
    { id: "counseling-consultation", name: "Counseling / Consultation" },
    { id: "oral-contraceptives", name: "Oral Contraceptives" },
    { id: "combined-oral-contraceptive", name: "Combined Oral Contraceptive (COC)" },
    { id: "lady-pill-trust-althea", name: "Lady Pill / Trust / Althea" },
    { id: "progestin-only-pill", name: "Progestin-Only Pill (POP)" },
    { id: "injectable", name: "Injectable (1 Month / 3 Months)" },
    { id: "iud", name: "IUD (Insertion / Removal)" },
    { id: "implant", name: "Implant (PSI)" },
    { id: "condom", name: "Condom" },
    { id: "awareness-counseling", name: "Awareness & Counseling" },
    { id: "community-based-screening", name: "Community-Based Screening (HIV Testing)" },
    { id: "asrh", name: "Adolescent Sexual Reproductive Health (ASRH)" },
  ];

  const providers = [
    { id: "sarah-johnson", name: "Dr. Sarah Johnson" },
    { id: "michael-chen", name: "Dr. Michael Chen" },
    { id: "emily-rodriguez", name: "Dr. Emily Rodriguez" },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const serviceOptions = services;
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
  ];
  const activeTimeSlots = timeSlots;
  const selectedServiceDetails = serviceOptions.find((service) => service.id === selectedService);
  const selectedProviderDetails = providers.find((provider) => provider.id === selectedProvider);
  const hasAnyDetail = selectedService || selectedProvider || selectedDate || selectedTime;
  const canConfirm = selectedService && selectedProvider && selectedDate && selectedTime;

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleServiceChange = (event) => {
    const serviceId = event.target.value || null;
    setSelectedService(serviceId);
    setSelectedTime(null);
  };

  const handleDateChange = (event) => {
    const value = event.target.value;
    setSelectedDate(value ? new Date(`${value}T00:00:00`) : null);
  };

  const handleConfirm = () => {
    if (!selectedService) return alert("Please select a service");
    if (!selectedProvider) return alert("Please select a healthcare provider");
    if (!selectedDate) return alert("Please select a date");
    if (!selectedTime) return alert("Please select a time");

    if (onSaveAppointment) {
      onSaveAppointment({
        id: Date.now(),
        serviceId: selectedService,
        serviceName: services.find(s => s.id === selectedService)?.name,
        doctorName: selectedProviderDetails?.name,
        date: selectedDate,
        time: selectedTime,
      });
    } else {
      alert("Booking confirmed! (Demo)");
    }
  };

  const handleCancel = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <main className="flex-1 bg-[#f7f8fa] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1234px]">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#061022]">Book an Appointment</h1>
          <p className="mt-3 text-lg text-[#18304d]">
            Schedule your visit with our healthcare professionals
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px]">
          <section className="rounded-[12px] border border-slate-200 bg-white p-10 shadow-[0_3px_10px_rgba(15,23,42,0.1)]">
            <div>
              <h2 className="text-2xl font-bold text-[#061022]">Appointment Details</h2>
              <p className="mt-2 text-sm text-[#18304d]">Please fill in all required fields</p>
            </div>

            <div className="my-8 h-px bg-slate-200" />

            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-sm font-bold text-[#061022]">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedService || ""}
                    onChange={handleServiceChange}
                    className="h-12 w-full appearance-none rounded-[8px] border-0 bg-slate-100 px-4 pr-11 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30"
                  >
                    <option value="">Select the service you need</option>
                    {serviceOptions.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <Icon
                    type="chevron"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#061022]">
                  Healthcare Provider <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProvider || ""}
                    onChange={(event) => setSelectedProvider(event.target.value || null)}
                    className="h-12 w-full appearance-none rounded-[8px] border-0 bg-slate-100 px-4 pr-11 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30"
                  >
                    <option value="">Choose your preferred provider</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  <Icon
                    type="chevron"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-bold text-[#061022]">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Icon
                      type="calendar"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="date"
                      value={toInputDate(selectedDate)}
                      onChange={handleDateChange}
                      className="h-12 w-full rounded-[8px] border-0 bg-slate-100 pl-12 pr-4 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-[#061022]">
                    Appointment Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTime || ""}
                      onChange={(event) => setSelectedTime(event.target.value || null)}
                      className="h-12 w-full appearance-none rounded-[8px] border-0 bg-slate-100 px-4 pr-11 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30"
                    >
                      <option value="">Select preferred time</option>
                      {activeTimeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <Icon
                      type="chevron"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-8 h-px bg-slate-200" />

            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`flex h-12 flex-1 items-center justify-center gap-3 rounded-[8px] text-sm font-bold text-white transition ${
                  canConfirm
                    ? "bg-[#244783] hover:bg-[#1c396f]"
                    : "cursor-not-allowed bg-[#94a3bd]"
                }`}
              >
                <Icon type="check" className="h-5 w-5" />
                Confirm Appointment
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="h-12 rounded-[8px] border border-slate-200 bg-white px-8 text-sm font-bold text-[#061022] transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </section>

          <aside className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.13)]">
            <div className="bg-[#244783] px-8 py-8 text-white">
              <h2 className="text-2xl font-bold">Booking Summary</h2>
              <p className="mt-2 text-sm text-white/95">Review your details</p>
            </div>

            <div className="p-8">
              {!hasAnyDetail ? (
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 px-8 py-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                    <Icon type="clipboard" className="h-10 w-10" />
                  </div>
                  <h3 className="mt-8 text-base font-bold text-[#18304d]">No Details Yet</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4b6178]">
                    Fill out the form to see your appointment summary
                  </p>
                </div>
              ) : (
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-6">
                  <div className="space-y-5 text-sm">
                    <div>
                      <p className="text-slate-500">Service</p>
                      <p className="mt-1 font-bold text-[#061022]">
                        {selectedServiceDetails?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Provider</p>
                      <p className="mt-1 font-bold text-[#061022]">
                        {selectedProviderDetails?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Date</p>
                      <p className="mt-1 font-bold text-[#061022]">{formatDate(selectedDate)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Time</p>
                      <p className="mt-1 font-bold text-[#061022]">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AppointmentBooking;
