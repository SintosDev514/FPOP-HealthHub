import React, { useState } from "react";
import ClockIcon from "./ClockIcon";



const AppointmentBooking = ({ onSaveAppointment }) => {
  const services = [
    { id: "general", name: "General Consultation", duration: "30 min", price: "$50" },
    { id: "family", name: "Family Planning", duration: "45 min", price: "$80" },
    { id: "prenatal", name: "Prenatal Care", duration: "60 min", price: "$100" }
  ];

  const screeningOption = { id: "screening", name: "Health Screening", duration: "30 min", price: "$40" };

  const [selectedService, setSelectedService] = useState(null);
  const [includeScreening, setIncludeScreening] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const calendarDays = getDaysInMonth(currentMonthDate);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM"
  ];
  const screeningTimes = ["02:00 PM", "02:30 PM"];

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleConfirm = () => {
    if (!selectedService) return alert("Please select a service");
    if (!selectedDate) return alert("Please select a date");
    if (!selectedTime) return alert("Please select a time");

    if (onSaveAppointment) {
      onSaveAppointment({
        id: Date.now(),
        serviceId: selectedService,
        serviceName: [...services, screeningOption].find(s => s.id === selectedService)?.name,
        doctorName: "Assigned Doctor",
        date: selectedDate,
        time: selectedTime,
      });
    } else {
      alert("Booking confirmed! (Demo)");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-gray-600">Choose your preferred date, time, and service</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Service</h2>
            </div>
            <div className="p-4 space-y-2">
              {[...services, screeningOption].map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setIncludeScreening(service.id === screeningOption.id);
                    setSelectedTime(null);
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-all ${selectedService === service.id
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-blue-300"
                    }`}
                >
                  <div className="font-semibold text-sm text-slate-900">{service.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{service.duration}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Date</h2>
              <div className="flex items-center text-slate-700 bg-white rounded-xl shadow-sm border border-slate-200 p-0.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="w-24 text-center text-xs font-semibold text-slate-800 px-1">
                  {currentMonthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-4">
                {weekdays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-400">{day.substring(0, 2)}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {calendarDays.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-8 w-8 mx-auto"></div>;
                  }

                  const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                  const isPast = date < new Date().setHours(0, 0, 0, 0);

                  return (
                    <button
                      key={idx}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs transition-all ${isSelected
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : isPast
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-700 hover:bg-blue-50"
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Select Time</h2>
              <ClockIcon />
            </div>
            <div className="p-4">
              <div className="max-h-[300px] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  {(includeScreening ? screeningTimes : timeSlots).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${selectedTime === time
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-500"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#1E3A5F] mb-6">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Service</p>
                <p className="text-base font-medium text-slate-900">
                  {selectedService ? [...services, screeningOption].find(s => s.id === selectedService)?.name : "Not selected"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="text-base font-medium text-slate-900">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 mb-1">Time</p>
                <p className="text-base font-medium text-slate-900">
                  {selectedTime || "Not selected"}
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedService || !selectedDate || !selectedTime}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition shadow-sm text-center ${selectedService && selectedDate && selectedTime
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#cbd5e1] text-white cursor-not-allowed"
                }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;