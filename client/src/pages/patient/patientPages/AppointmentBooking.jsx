import React, { useState, useEffect } from "react";

const Icon = ({ type, className = "h-5 w-5" }) => {
  const paths = {
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    clipboard: "M9 5h6m-6 4h6m-6 4h6m-8 8h10a2 2 0 002-2V7a2 2 0 00-2-2h-2.5a2.5 2.5 0 00-5 0H7a2 2 0 00-2 2v12a2 2 0 002 2z",
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

const AppointmentBooking = ({ onSaveAppointment }) => {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const res = await fetch("http://localhost:5000/api/staff", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff);
      }
    } catch {
      setError("Failed to load staff");
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    if (!selectedProvider || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError("");
      try {
        const dateStr = toInputDate(selectedDate);
        const res = await fetch(
          `http://localhost:5000/api/appointments/slots?staffId=${selectedProvider}&date=${dateStr}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.slots);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Failed to load available times");
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedProvider, selectedDate]);

  const isStaffAvailableOnDate = (staff, date) => {
    if (!date) return true;
    const dayOfWeek = date.getDay();
    const daySchedule = staff.schedule ? staff.schedule[dayOfWeek] : null;
    return daySchedule && daySchedule.active;
  };

  const availableStaff = selectedDate
    ? staffList.filter((s) => isStaffAvailableOnDate(s, selectedDate))
    : staffList;

  const selectedStaff = staffList.find((s) => s._id === selectedProvider);

  const selectedServiceDetails = services.find((s) => s.id === selectedService);
  const hasAnyDetail = selectedService || selectedProvider || selectedDate || selectedTime;
  const canConfirm = selectedService && selectedProvider && selectedDate && selectedTime && !submitting;

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value || null);
    setSelectedTime(null);
  };

  const handleDateChange = (event) => {
    const value = event.target.value;
    setSelectedDate(value ? new Date(`${value}T00:00:00`) : null);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!selectedService) return alert("Please select a service");
    if (!selectedProvider) return alert("Please select a healthcare provider");
    if (!selectedDate) return alert("Please select a date");
    if (!selectedTime) return alert("Please select a time");

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedProvider,
          serviceId: selectedService,
          serviceName: selectedServiceDetails?.name,
          date: toInputDate(selectedDate),
          time: selectedTime,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSaveAppointment?.(data.appointment);
      } else {
        setError(data.message || "Failed to book appointment");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setError("");
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
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <Icon type="chevron" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[#061022]">
                  Healthcare Provider <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProvider || ""}
                    onChange={(event) => {
                      setSelectedProvider(event.target.value || null);
                      setSelectedTime(null);
                    }}
                    className="h-12 w-full appearance-none rounded-[8px] border-0 bg-slate-100 px-4 pr-11 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30"
                  >
                    <option value="">
                      {loadingStaff ? "Loading staff..." : selectedDate ? "Choose available provider" : "First select a date"}
                    </option>
                    {!selectedDate && (
                      <option value="" disabled>
                        Select a date first to see available providers
                      </option>
                    )}
                    {availableStaff.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name}{staff.specialty ? ` - ${staff.specialty}` : ""}
                      </option>
                    ))}
                  </select>
                  <Icon type="chevron" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {selectedDate && availableStaff.length === 0 && !loadingStaff && (
                  <p className="mt-2 text-sm text-red-600">No providers available on this date</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-bold text-[#061022]">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Icon type="calendar" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
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
                      disabled={!selectedProvider || !selectedDate || loadingSlots}
                      className="h-12 w-full appearance-none rounded-[8px] border-0 bg-slate-100 px-4 pr-11 text-sm font-medium text-[#4b5563] outline-none focus:ring-2 focus:ring-[#244783]/30 disabled:opacity-50"
                    >
                      <option value="">
                        {loadingSlots
                          ? "Loading available times..."
                          : !selectedProvider
                            ? "Select a provider first"
                            : availableSlots.length === 0
                              ? "No available times"
                              : "Select preferred time"}
                      </option>
                      {availableSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <Icon type="chevron" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-8 h-px bg-slate-200" />

            {error && (
              <p className="mb-4 rounded-[8px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>
            )}

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
                {submitting ? "Booking..." : (
                  <>
                    <Icon type="check" className="h-5 w-5" />
                    Confirm Appointment
                  </>
                )}
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
                        {selectedStaff?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Date</p>
                      <p className="mt-1 font-bold text-[#061022]">{formatDate(selectedDate)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Time</p>
                      <p className="mt-1 font-bold text-[#061022]">{selectedTime || "Not selected"}</p>
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
