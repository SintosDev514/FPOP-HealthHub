import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* ── Colors matching screenshot design ── */
const NAVY_DARK   = "#0f2942";
const NAVY_TEXT   = "#1e293b";
const GRAY_TEXT   = "#64748b";
const GRAY_BORDER = "#e2e8f0";
const BG_PAGE     = "#f4f6fa";
const GREEN       = "#10b981";
const GREEN_DARK  = "#059669";
const GREEN_BG    = "#ecfdf5";
const GREEN_BORDER= "#a7f3d0";
const ORANGE      = "#f97316";

/* ── SVG Icons ── */
const IcoCalendarHeader = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="14" r="1.2" fill="#1e3a5f" />
    <circle cx="12" cy="14" r="1.2" fill="#1e3a5f" />
    <circle cx="16" cy="14" r="1.2" fill="#1e3a5f" />
    <circle cx="8" cy="18" r="1.2" fill="#1e3a5f" />
    <circle cx="12" cy="18" r="1.2" fill="#1e3a5f" />
    <circle cx="16" cy="18" r="1.2" fill="#1e3a5f" />
  </svg>
);

const IcoCalendarSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IcoChevronDown = ({ flipped }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: flipped ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IcoLogin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const IcoLogout = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IcoTeam = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoClockGreen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IcoClockOrange = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IcoCheckCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#059669">
    <circle cx="12" cy="12" r="10" fill="#059669" />
    <polyline points="9 12 11.5 14.5 15.5 9.5" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Date formatting helpers ── */
const dateToKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayKey = () => dateToKey(new Date());

const formatTimeDisplay = (timeStr) => {
  if (!timeStr || timeStr === "--:--" || timeStr.trim() === "") return "--:--";
  // If already contains AM or PM
  if (/am|pm/i.test(timeStr)) {
    return timeStr.trim();
  }
  // If in 24-hour format (e.g. 08:02 or 17:47)
  const parts = String(timeStr).split(":");
  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;
      return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    }
  }
  return timeStr;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Attendance({ isMobile }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter mode: "day" or "month"
  const [filterMode, setFilterMode] = useState("day");

  // Selected date state (defaults to today)
  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  // Popover calendar state
  const [pickerOpen, setPickerOpen] = useState(false);
  const popoverRef = useRef(null);

  // Month navigation in custom calendar popover
  const [calendarView, setCalendarView] = useState(() => {
    const [y, m] = getTodayKey().split("-").map(Number);
    return { year: y, month: m - 1 };
  });

  // Year state for Month mode popover
  const [monthPickerYear, setMonthPickerYear] = useState(() => {
    return Number(getTodayKey().split("-")[0]);
  });

  // Keep calendar view and monthPickerYear in sync when selected date changes
  useEffect(() => {
    try {
      const [y, m] = selectedDate.split("-").map(Number);
      setCalendarView({ year: y, month: m - 1 });
      if (y) setMonthPickerYear(y);
    } catch {
      // ignore
    }
  }, [selectedDate]);

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    if (pickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerOpen]);

  // Formatted date labels
  const formattedDates = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return {
        full: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        short: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    } catch {
      return { full: selectedDate, short: selectedDate };
    }
  }, [selectedDate]);

  // Fetch live attendance logs from backend
  const fetchAttendance = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${__API_BASE__}/api/admin/attendance`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.attendance)) {
        setAttendance(data.attendance);
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Polling every 10 seconds for real-time live attendance
  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(() => {
      fetchAttendance(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchAttendance]);

  // Real attendance records — filter by day or month
  const recordsForDate = useMemo(() => {
    const prefix = filterMode === "month"
      ? selectedDate.slice(0, 7)   // "YYYY-MM"
      : selectedDate;               // "YYYY-MM-DD"

    const matches = attendance.filter((r) =>
      filterMode === "month" ? r.date.startsWith(prefix) : r.date === prefix
    );

    // Sort by date asc when month view
    if (filterMode === "month") {
      matches.sort((a, b) => a.date.localeCompare(b.date));
    }

    return matches.map((r, index) => ({
      id: index + 1,
      _id: r._id,
      name: r.name || r.email || "Staff Member",
      date: r.date,
      timeIn: formatTimeDisplay(r.timeIn),
      timeOut: r.timeOut ? formatTimeDisplay(r.timeOut) : "--:--",
      status: r.timeIn ? "Present" : "Absent",
    }));
  }, [attendance, selectedDate, filterMode]);

  // Summary card calculations
  const summary = useMemo(() => {
    const validTimeIns = recordsForDate
      .map((r) => r.timeIn)
      .filter((t) => t && t !== "--:--");
    const validTimeOuts = recordsForDate
      .map((r) => r.timeOut)
      .filter((t) => t && t !== "--:--");

    const earliestTimeIn = validTimeIns.length > 0 ? validTimeIns[0] : "--:--";
    const latestTimeOut = validTimeOuts.length > 0 ? validTimeOuts[validTimeOuts.length - 1] : "--:--";

    return {
      firstLogin: earliestTimeIn,
      lastLogout: latestTimeOut,
    };
  }, [recordsForDate]);

  // Pagination — reset to page 1 when filter or date changes
  const totalRecords = recordsForDate.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return recordsForDate.slice(start, start + itemsPerPage);
  }, [recordsForDate, currentPage]);

  // Reset page when mode or date changes
  useEffect(() => { setCurrentPage(1); }, [filterMode, selectedDate]);

  /* ── Month label for headings ── */
  const monthLabel = useMemo(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return `${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDate]);

  /* ── Export: PDF ── */
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const title = filterMode === "month"
      ? `Attendance Records — ${monthLabel}`
      : `Attendance Records — ${formattedDates.full}`;

    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text("FPOP HealthHub", 14, 14);
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(title, 14, 21);

    autoTable(doc, {
      startY: 28,
      head: [["#", "Staff Name", "Date", "Time In", "Time Out", "Status"]],
      body: recordsForDate.map((r, i) => [
        i + 1,
        r.name,
        r.date,
        r.timeIn,
        r.timeOut,
        r.status,
      ]),
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [244, 246, 250] },
      columnStyles: { 0: { cellWidth: 12 }, 5: { halign: "center" } },
      styles: { cellPadding: 4 },
    });

    const filename = filterMode === "month"
      ? `attendance_${selectedDate.slice(0, 7)}.pdf`
      : `attendance_${selectedDate}.pdf`;
    doc.save(filename);
  };

  /* ── Export: Excel ── */
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "FPOP HealthHub";
    const sheet = workbook.addWorksheet("Attendance");

    // Title
    const titleLabel = filterMode === "month"
      ? `Attendance Records — ${monthLabel}`
      : `Attendance Records — ${formattedDates.full}`;
    sheet.mergeCells("A1:F1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `FPOP HealthHub — ${titleLabel}`;
    titleCell.font = { bold: true, size: 13, color: { argb: "FF1E3A5F" } };
    titleCell.alignment = { horizontal: "left" };
    sheet.getRow(1).height = 24;

    // Header row
    sheet.addRow(["#", "Staff Name", "Date", "Time In", "Time Out", "Status"]);
    const headerRow = sheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });

    // Data rows
    recordsForDate.forEach((r, i) => {
      const row = sheet.addRow([i + 1, r.name, r.date, r.timeIn, r.timeOut, r.status]);
      row.eachCell((cell, colNum) => {
        cell.alignment = { horizontal: colNum === 1 || colNum === 6 ? "center" : "left" };
        if (i % 2 === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4F6FA" } };
        }
      });
    });

    // Column widths
    sheet.columns = [
      { key: "num",    width: 6  },
      { key: "name",   width: 28 },
      { key: "date",   width: 14 },
      { key: "in",     width: 14 },
      { key: "out",    width: 14 },
      { key: "status", width: 12 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = filterMode === "month"
      ? `attendance_${selectedDate.slice(0, 7)}.xlsx`
      : `attendance_${selectedDate}.xlsx`;
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), filename);
  };

  // Quick navigation: Previous Day
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    setSelectedDate(dateToKey(dateObj));
    setCurrentPage(1);
  };

  // Quick navigation: Next Day
  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    setSelectedDate(dateToKey(dateObj));
    setCurrentPage(1);
  };

  // Quick navigation: Previous Month (Month Mode)
  const handlePrevMonthMode = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 2, 1);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, "0");
    const maxDays = new Date(newY, dateObj.getMonth() + 1, 0).getDate();
    const newD = String(Math.min(d || 1, maxDays)).padStart(2, "0");
    setSelectedDate(`${newY}-${newM}-${newD}`);
    setCurrentPage(1);
  };

  // Quick navigation: Next Month (Month Mode)
  const handleNextMonthMode = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m, 1);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, "0");
    const maxDays = new Date(newY, dateObj.getMonth() + 1, 0).getDate();
    const newD = String(Math.min(d || 1, maxDays)).padStart(2, "0");
    setSelectedDate(`${newY}-${newM}-${newD}`);
    setCurrentPage(1);
  };

  // Calendar popover month navigation
  const handlePrevMonth = () => {
    setCalendarView((curr) => {
      if (curr.month === 0) return { year: curr.year - 1, month: 11 };
      return { year: curr.year, month: curr.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCalendarView((curr) => {
      if (curr.month === 11) return { year: curr.year + 1, month: 0 };
      return { year: curr.year, month: curr.month + 1 };
    });
  };

  // Generate calendar days for the popover grid
  const calendarDays = useMemo(() => {
    const { year, month } = calendarView;
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        dayNumber: d,
        dateKey: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: false,
      });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        dayNumber: d,
        dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: true,
      });
    }
    // Next month padding to fill a complete 35 or 42 grid
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        dayNumber: d,
        dateKey: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: false,
      });
    }
    return days;
  }, [calendarView]);

  return (
    <main
      style={{
        flex: 1,
        padding: isMobile ? "20px 16px" : "28px 36px",
        overflowY: "auto",
        background: BG_PAGE,
        fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif",
      }}
    >
      {/* ════════════════ PAGE HEADER ════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Title + Subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "rgba(30, 58, 95, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IcoCalendarHeader />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? "22px" : "26px",
                fontWeight: 800,
                color: NAVY_TEXT,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              Attendance
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: GRAY_TEXT,
                fontWeight: 500,
              }}
            >
              View and manage staff attendance records based on their first login and last logout for the selected date.
            </p>
          </div>
        </div>

        {/* ════ Interactive Functional Date / Month Selector ════ */}
        <div
          ref={popoverRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            position: "relative",
          }}
        >
          {/* Previous Day / Month ‹ */}
          <button
            type="button"
            onClick={filterMode === "month" ? handlePrevMonthMode : handlePrevDay}
            title={filterMode === "month" ? "Previous month" : "Previous day"}
            style={{
              width: "34px",
              height: "38px",
              borderRadius: "8px",
              border: `1.5px solid ${GRAY_BORDER}`,
              background: "#ffffff",
              color: NAVY_TEXT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            ‹
          </button>

          {/* Main Date/Month Trigger Button */}
          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            title={filterMode === "month" ? "Click to pick month" : "Click to pick date"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#ffffff",
              border: `1.5px solid ${pickerOpen ? "#2563eb" : GRAY_BORDER}`,
              borderRadius: "8px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: NAVY_TEXT,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              transition: "all 0.15s ease",
            }}
          >
            <IcoCalendarSmall />
            <span>{filterMode === "month" ? monthLabel : formattedDates.full}</span>
            <IcoChevronDown flipped={pickerOpen} />
          </button>

          {/* Next Day / Month › */}
          <button
            type="button"
            onClick={filterMode === "month" ? handleNextMonthMode : handleNextDay}
            title={filterMode === "month" ? "Next month" : "Next day"}
            style={{
              width: "34px",
              height: "38px",
              borderRadius: "8px",
              border: `1.5px solid ${GRAY_BORDER}`,
              background: "#ffffff",
              color: NAVY_TEXT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            ›
          </button>

          {/* ════ Popover: Day Calendar or Month Picker ════ */}
          {pickerOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 12px 32px rgba(15, 41, 66, 0.18), 0 2px 6px rgba(0,0,0,0.05)",
                border: `1px solid ${GRAY_BORDER}`,
                padding: "16px",
                zIndex: 100,
                width: filterMode === "month" ? "280px" : "290px",
              }}
            >
              {/* Top Mode Selector Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  padding: "3px",
                  gap: "2px",
                  marginBottom: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFilterMode("day")}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: filterMode === "day" ? "#ffffff" : "transparent",
                    color: filterMode === "day" ? NAVY_TEXT : GRAY_TEXT,
                    boxShadow: filterMode === "day" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  By Day
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("month")}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: filterMode === "month" ? "#ffffff" : "transparent",
                    color: filterMode === "month" ? NAVY_TEXT : GRAY_TEXT,
                    boxShadow: filterMode === "month" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  By Month
                </button>
              </div>

              {filterMode === "month" ? (
                /* ── Month Selection Popover Mode ── */
                <div>
                  {/* Popover Header: Year Nav */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMonthPickerYear((y) => y - 1)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: NAVY_TEXT,
                        fontWeight: 700,
                      }}
                    >
                      ‹
                    </button>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: NAVY_TEXT }}>
                      {monthPickerYear}
                    </div>
                    <button
                      type="button"
                      onClick={() => setMonthPickerYear((y) => y + 1)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: NAVY_TEXT,
                        fontWeight: 700,
                      }}
                    >
                      ›
                    </button>
                  </div>

                  {/* 12 Months Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    {MONTH_NAMES.map((mName, idx) => {
                      const monthNum = idx + 1;
                      const monthPad = String(monthNum).padStart(2, "0");
                      const [currY, currM] = selectedDate.split("-").map(Number);
                      const isSelected = monthPickerYear === currY && monthNum === currM;
                      const today = new Date();
                      const isCurrentRealMonth =
                        today.getFullYear() === monthPickerYear && today.getMonth() === idx;

                      return (
                        <button
                          key={mName}
                          type="button"
                          onClick={() => {
                            setSelectedDate(`${monthPickerYear}-${monthPad}-01`);
                            setCurrentPage(1);
                            setPickerOpen(false);
                          }}
                          style={{
                            padding: "10px 4px",
                            borderRadius: "8px",
                            border: isSelected
                              ? "none"
                              : isCurrentRealMonth
                              ? `1.5px solid ${GREEN}`
                              : `1px solid ${GRAY_BORDER}`,
                            background: isSelected
                              ? "#2563eb"
                              : isCurrentRealMonth
                              ? GREEN_BG
                              : "#f8fafc",
                            color: isSelected
                              ? "#ffffff"
                              : isCurrentRealMonth
                              ? GREEN_DARK
                              : NAVY_TEXT,
                            fontSize: "12px",
                            fontWeight: isSelected || isCurrentRealMonth ? 700 : 600,
                            cursor: "pointer",
                            transition: "all 0.12s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = "#e2e8f0";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isCurrentRealMonth
                                ? GREEN_BG
                                : "#f8fafc";
                            }
                          }}
                        >
                          {mName.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Month Popover Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "10px",
                      borderTop: `1px solid ${GRAY_BORDER}`,
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const y = today.getFullYear();
                        const m = String(today.getMonth() + 1).padStart(2, "0");
                        setSelectedDate(`${y}-${m}-01`);
                        setMonthPickerYear(y);
                        setCurrentPage(1);
                        setPickerOpen(false);
                      }}
                      style={{
                        background: GREEN_BG,
                        color: GREEN_DARK,
                        border: `1px solid ${GREEN_BORDER}`,
                        borderRadius: "6px",
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Current Month
                    </button>

                    <input
                      type="month"
                      value={selectedDate.slice(0, 7)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedDate(`${e.target.value}-01`);
                          setCurrentPage(1);
                          setPickerOpen(false);
                        }
                      }}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        outline: "none",
                        color: NAVY_TEXT,
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* ── Day Selection Popover Mode ── */
                <div>
                  {/* Popover Header: Month Nav */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      style={{
                        background: "transparent",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: NAVY_TEXT,
                        fontWeight: 700,
                      }}
                    >
                      ‹
                    </button>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: NAVY_TEXT }}>
                      {MONTH_NAMES[calendarView.month]} {calendarView.year}
                    </div>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      style={{
                        background: "transparent",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: NAVY_TEXT,
                        fontWeight: 700,
                      }}
                    >
                      ›
                    </button>
                  </div>

                  {/* Day of week headers */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      textAlign: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: GRAY_TEXT,
                      marginBottom: "6px",
                    }}
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <div key={d} style={{ padding: "4px 0" }}>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day numbers grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "3px",
                      marginBottom: "12px",
                    }}
                  >
                    {calendarDays.map((item) => {
                      const isSelected = item.dateKey === selectedDate;
                      const isToday = item.dateKey === getTodayKey();

                      return (
                        <button
                          key={item.dateKey}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.dateKey);
                            setCurrentPage(1);
                            setPickerOpen(false);
                          }}
                          style={{
                            height: "32px",
                            border: isSelected
                              ? "none"
                              : isToday
                              ? `1.5px solid ${GREEN}`
                              : "none",
                            borderRadius: "6px",
                            background: isSelected
                              ? "#2563eb"
                              : isToday
                              ? GREEN_BG
                              : "transparent",
                            color: isSelected
                              ? "#ffffff"
                              : !item.isCurrentMonth
                              ? "#cbd5e1"
                              : isToday
                              ? GREEN_DARK
                              : NAVY_TEXT,
                            fontSize: "12px",
                            fontWeight: isSelected || isToday ? 700 : 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.1s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = "#f1f5f9";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isToday ? GREEN_BG : "transparent";
                            }
                          }}
                        >
                          {item.dayNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Day Popover Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "10px",
                      borderTop: `1px solid ${GRAY_BORDER}`,
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(getTodayKey());
                        setCurrentPage(1);
                        setPickerOpen(false);
                      }}
                      style={{
                        background: GREEN_BG,
                        color: GREEN_DARK,
                        border: `1px solid ${GREEN_BORDER}`,
                        borderRadius: "6px",
                        padding: "5px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Jump to Today
                    </button>

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedDate(e.target.value);
                          setCurrentPage(1);
                          setPickerOpen(false);
                        }
                      }}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        border: `1px solid ${GRAY_BORDER}`,
                        borderRadius: "6px",
                        outline: "none",
                        color: NAVY_TEXT,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* ════════════════ ATTENDANCE RECORDS TABLE ════════════════ */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: `1px solid ${GRAY_BORDER}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        {/* Table Card Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            borderBottom: `1px solid ${GRAY_BORDER}`,
          }}
        >
          {/* Left: title + subtitle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", color: NAVY_DARK }}>
              <IcoTeam />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: NAVY_TEXT }}>
                Attendance Records
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: GRAY_TEXT }}>
                {filterMode === "month"
                  ? `All records for ${monthLabel}`
                  : `Records for ${formattedDates.full}`}
              </p>
            </div>
          </div>

          {/* Right: Export buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Export PDF */}
            <button
              type="button"
              onClick={exportPDF}
              title="Export to PDF"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1.5px solid #ef4444",
                background: "#fff5f5",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff5f5"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <polyline points="9 14 12 17 15 14" />
              </svg>
              PDF
            </button>

            {/* Export Excel */}
            <button
              type="button"
              onClick={exportExcel}
              title="Export to Excel"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1.5px solid #16a34a",
                background: "#f0fdf4",
                color: "#15803d",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="8 13 10.5 17 13 13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
              Excel
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${GRAY_BORDER}` }}>
                <th style={{ padding: "14px 20px", color: GRAY_TEXT, fontWeight: 600, width: "45px" }}>#</th>
                <th style={{ padding: "14px 20px", color: NAVY_TEXT, fontWeight: 700 }}>Staff Name</th>
                <th style={{ padding: "14px 20px", color: NAVY_TEXT, fontWeight: 700 }}>Date</th>
                <th style={{ padding: "14px 20px", color: NAVY_TEXT }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <IcoClockGreen />
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY_TEXT, lineHeight: 1.1 }}>Time In</div>
                      <div style={{ fontSize: "10px", color: GRAY_TEXT, fontWeight: 500 }}>First Login of the Day</div>
                    </div>
                  </div>
                </th>
                <th style={{ padding: "14px 20px", color: NAVY_TEXT }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <IcoClockOrange />
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY_TEXT, lineHeight: 1.1 }}>Time Out</div>
                      <div style={{ fontSize: "10px", color: GRAY_TEXT, fontWeight: 500 }}>Last Logout of the Day</div>
                    </div>
                  </div>
                </th>
                <th style={{ padding: "14px 20px", color: NAVY_TEXT, fontWeight: 700, textAlign: "center", width: "120px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: GRAY_TEXT }}>
                    Loading attendance records...
                  </td>
                </tr>
              ) : paginatedRecords.length > 0 ? (
                paginatedRecords.map((row) => (
                  <tr
                    key={row._id || row.id}
                    style={{
                      borderBottom: `1px solid #f1f5f9`,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* # */}
                    <td style={{ padding: "14px 20px", color: GRAY_TEXT, fontSize: "12px", fontWeight: 500 }}>
                      {row.id}
                    </td>

                    {/* Staff Name */}
                    <td style={{ padding: "14px 20px", color: NAVY_TEXT, fontWeight: 600 }}>
                      {row.name}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 20px", color: "#475569", fontWeight: 500 }}>
                      {row.date || formattedDates.short}
                    </td>

                    {/* Time In */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: NAVY_TEXT, fontWeight: 500 }}>
                        <IcoClockGreen />
                        <span>{row.timeIn}</span>
                      </div>
                    </td>

                    {/* Time Out */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: NAVY_TEXT, fontWeight: 500 }}>
                        <IcoClockOrange />
                        <span>{row.timeOut}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: GREEN_BG,
                          border: `1px solid ${GREEN_BORDER}`,
                          color: GREEN_DARK,
                        }}
                      >
                        <IcoCheckCircle />
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px 20px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: NAVY_TEXT, marginBottom: "4px" }}>
                      No attendance records found
                    </div>
                    <div style={{ fontSize: "12px", color: GRAY_TEXT }}>
                      No staff attendance recorded for {formattedDates.full}. When staff members log in and out, their daily logs will appear here automatically.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ════════════════ TABLE FOOTER / PAGINATION ════════════════ */}
        <div
          style={{
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${GRAY_BORDER}`,
            fontSize: "12px",
            color: GRAY_TEXT,
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            Showing {totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: `1px solid ${GRAY_BORDER}`,
                background: "#ffffff",
                color: currentPage <= 1 ? "#cbd5e1" : GRAY_TEXT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: "28px",
                  height: "28px",
                  padding: "0 8px",
                  borderRadius: "6px",
                  border: page === currentPage ? "none" : `1px solid ${GRAY_BORDER}`,
                  background: page === currentPage ? "#2563eb" : "#ffffff",
                  color: page === currentPage ? "#ffffff" : GRAY_TEXT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: page === currentPage ? 700 : 500,
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: `1px solid ${GRAY_BORDER}`,
                background: "#ffffff",
                color: currentPage >= totalPages ? "#cbd5e1" : GRAY_TEXT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
