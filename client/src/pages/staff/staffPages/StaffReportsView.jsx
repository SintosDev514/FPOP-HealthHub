import React, { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_BASE from "../../../apiBase";

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

const todayKey = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const personName = (person) => {
  if (!person) return "N/A";
  if (typeof person === "string") return person;
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ");
  return fullName || person.name || person.fullName || person.email || "N/A";
};

const getPatientName = (appointment) =>
  personName(appointment.patientId || appointment.patient || appointment.userId);

const getStockTotal = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const total = Number(values[values.length - 1]);
  return Number.isFinite(total) ? total : 0;
};

const flattenInventoryItems = (tables) =>
  tables.flatMap((table) =>
    (table.categories || []).flatMap((category) =>
      (category.items || []).map((item) => ({
        tableName: table.name || "Inventory Table",
        chapter: table.chapter || "N/A",
        category: category.name || "Uncategorized",
        item: item.name || "Unnamed Item",
        beginning: Number(item.beginning || 0),
        receipts: getStockTotal(item.receipts),
        issuances: getStockTotal(item.issuances),
        ending: Number(item.ending || 0),
        status: item.status || "In Stock",
      }))
    )
  );

const groupByService = (appointments) => {
  const grouped = new Map();

  appointments.forEach((appointment) => {
    const service = appointment.serviceName || "Unspecified Service";
    const current = grouped.get(service) || {
      service,
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    current.total += 1;
    if (current[appointment.status] !== undefined) {
      current[appointment.status] += 1;
    }
    grouped.set(service, current);
  });

  return Array.from(grouped.values());
};

const getAppointmentsByStatus = (appointments, status) =>
  appointments.filter((appointment) => appointment.status === status);

const buildAppointmentStatusReport = (appointments, status, title) => ({
  id: `${status}-appointments`,
  title,
  department: "Appointments",
  type: "Status",
  generatedBy: "System",
  date: formatDate(new Date()),
  records: appointments.length,
  columns: ["Patient", "Service", "Date", "Time", "Status"],
  rows: appointments.map((appointment) => [
    getPatientName(appointment),
    appointment.serviceName || "N/A",
    formatDate(appointment.date),
    appointment.time || "N/A",
    appointment.status || "N/A",
  ]),
});

const buildReportRows = ({ appointments, staff, inventoryTables }) => {
  const today = todayKey();
  const inventoryItems = flattenInventoryItems(inventoryTables);
  const lowStockItems = inventoryItems.filter(
    (item) => item.status === "Low Stock" || item.ending <= 0
  );
  const todayAppointments = appointments.filter((appointment) => appointment.date === today);
  const serviceRows = groupByService(appointments);
  const pendingAppointments = getAppointmentsByStatus(appointments, "pending");
  const confirmedAppointments = getAppointmentsByStatus(appointments, "confirmed");
  const completedAppointments = getAppointmentsByStatus(appointments, "completed");
  const cancelledAppointments = getAppointmentsByStatus(appointments, "cancelled");
  const generatedDate = formatDate(new Date());

  return [
    {
      id: "appointment-summary",
      title: "Staff Appointment Summary",
      department: "Appointments",
      type: "Summary",
      generatedBy: "System",
      date: generatedDate,
      records: appointments.length,
      columns: ["Patient", "Service", "Date", "Time", "Status"],
      rows: appointments.map((appointment) => [
        getPatientName(appointment),
        appointment.serviceName || "N/A",
        formatDate(appointment.date),
        appointment.time || "N/A",
        appointment.status || "N/A",
      ]),
    },
    {
      id: "today-schedule",
      title: "Today's Schedule Report",
      department: "Appointments",
      type: "Schedule",
      generatedBy: "System",
      date: generatedDate,
      records: todayAppointments.length,
      columns: ["Patient", "Service", "Time", "Status"],
      rows: todayAppointments.map((appointment) => [
        getPatientName(appointment),
        appointment.serviceName || "N/A",
        appointment.time || "N/A",
        appointment.status || "N/A",
      ]),
    },
    buildAppointmentStatusReport(
      pendingAppointments,
      "pending",
      "Pending Appointment Report"
    ),
    buildAppointmentStatusReport(
      confirmedAppointments,
      "confirmed",
      "Confirmed Appointment Report"
    ),
    buildAppointmentStatusReport(
      completedAppointments,
      "completed",
      "Completed Appointment Report"
    ),
    buildAppointmentStatusReport(
      cancelledAppointments,
      "cancelled",
      "Cancelled Appointment Report"
    ),
    {
      id: "service-activity",
      title: "Service Activity Report",
      department: "Clinic Services",
      type: "Activity",
      generatedBy: "System",
      date: generatedDate,
      records: serviceRows.length,
      columns: ["Service", "Total", "Pending", "Confirmed", "Completed", "Cancelled"],
      rows: serviceRows.map((service) => [
        service.service,
        service.total,
        service.pending,
        service.confirmed,
        service.completed,
        service.cancelled,
      ]),
    },
    {
      id: "staff-directory",
      title: "Staff Directory Report",
      department: "Staff",
      type: "Directory",
      generatedBy: "System",
      date: generatedDate,
      records: staff.length,
      columns: ["Name", "Email", "Specialty", "Status"],
      rows: staff.map((member) => [
        member.name || personName(member),
        member.email || "N/A",
        member.specialty || "N/A",
        member.status || "Active",
      ]),
    },
    {
      id: "inventory-stock",
      title: "Inventory Stock Report",
      department: "Inventory",
      type: "Stock",
      generatedBy: "System",
      date: generatedDate,
      records: inventoryItems.length,
      columns: ["Table", "Category", "Item", "Beginning", "Ending", "Status"],
      rows: inventoryItems.map((item) => [
        item.tableName,
        item.category,
        item.item,
        formatNumber(item.beginning),
        formatNumber(item.ending),
        item.status,
      ]),
    },
    {
      id: "low-stock",
      title: "Low Stock Report",
      department: "Inventory",
      type: "Stock Alert",
      generatedBy: "System",
      date: generatedDate,
      records: lowStockItems.length,
      columns: ["Table", "Category", "Item", "Ending Balance", "Status"],
      rows: lowStockItems.map((item) => [
        item.tableName,
        item.category,
        item.item,
        formatNumber(item.ending),
        item.status,
      ]),
    },
    {
      id: "inventory-movement",
      title: "Inventory Movement Summary",
      department: "Inventory",
      type: "Movement",
      generatedBy: "System",
      date: generatedDate,
      records: inventoryItems.length,
      columns: ["Table", "Item", "Receipts", "Issuances", "Ending"],
      rows: inventoryItems.map((item) => [
        item.tableName,
        item.item,
        formatNumber(item.receipts),
        formatNumber(item.issuances),
        formatNumber(item.ending),
      ]),
    },
  ].map((report) => ({
    ...report,
    status: report.records > 0 ? "Available" : "No Data",
  }));
};

const downloadReportPdf = (report) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const filenameDate = todayKey();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(report.title, pageWidth / 2, 42, { align: "center" });
  doc.setFontSize(8);
  doc.text("FPOP HealthHub Staff Report", pageWidth / 2, 58, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Department: ${report.department}`, 32, 86);
  doc.text(`Type: ${report.type}`, 32, 100);
  doc.text(`Generated By: ${report.generatedBy}`, 32, 114);
  doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth - 32, 86, {
    align: "right",
  });
  doc.text(`Records: ${formatNumber(report.records)}`, pageWidth - 32, 100, {
    align: "right",
  });

  const body =
    report.rows.length > 0
      ? report.rows
      : [[`No records available for ${report.title}.`]];

  autoTable(doc, {
    startY: 136,
    margin: { left: 32, right: 32 },
    head: report.rows.length > 0 ? [report.columns] : [["Message"]],
    body,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 4,
      overflow: "linebreak",
      valign: "middle",
      textColor: [45, 55, 72],
    },
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [247, 250, 252],
    },
    didDrawPage: () => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        "Generated from current FPOP HealthHub records.",
        32,
        doc.internal.pageSize.getHeight() - 20
      );
    },
  });

  const fileSlug = report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`${fileSlug || "staff-report"}_${filenameDate}.pdf`);
};

const getReportFileSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
  "staff-report";

const getWorksheetName = (title) => {
  const cleaned = title
    .replace(/[*?:/\\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31);
  return cleaned || "Staff Report";
};

const thinExcelBorder = {
  top: { style: "thin", color: { argb: "FFE2E8F0" } },
  left: { style: "thin", color: { argb: "FFE2E8F0" } },
  bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
  right: { style: "thin", color: { argb: "FFE2E8F0" } },
};

const solidExcelFill = (argb) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

const getExcelColumnLetter = (columnNumber) => {
  let letter = "";
  let current = columnNumber;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }

  return letter;
};

const downloadReportExcel = async (report) => {
  const filenameDate = todayKey();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FPOP HealthHub";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(getWorksheetName(report.title), {
    views: [{ state: "frozen", ySplit: 7 }],
  });

  const columnCount = Math.max(report.columns.length, 5);
  const lastColumn = getExcelColumnLetter(columnCount);

  worksheet.mergeCells(`A1:${lastColumn}1`);
  worksheet.getCell("A1").value = report.title;
  worksheet.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF1E3A5F" } };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  worksheet.mergeCells(`A2:${lastColumn}2`);
  worksheet.getCell("A2").value = "FPOP HealthHub Staff Report";
  worksheet.getCell("A2").font = { bold: true, size: 10, color: { argb: "FF64748B" } };
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  worksheet.getCell("A4").value = "Department";
  worksheet.getCell("B4").value = report.department;
  worksheet.getCell("D4").value = "Generated";
  worksheet.getCell("E4").value = formatDateTime(new Date());
  worksheet.getCell("A5").value = "Type";
  worksheet.getCell("B5").value = report.type;
  worksheet.getCell("D5").value = "Records";
  worksheet.getCell("E5").value = report.records;

  ["A4", "A5", "D4", "D5"].forEach((cellAddress) => {
    worksheet.getCell(cellAddress).font = { bold: true, color: { argb: "FF1E3A5F" } };
  });

  const headerRow = worksheet.getRow(7);
  headerRow.values = ["", ...report.columns];
  headerRow.height = 22;
  for (let columnNumber = 1; columnNumber <= report.columns.length; columnNumber += 1) {
    const cell = headerRow.getCell(columnNumber);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = solidExcelFill("FF1E3A5F");
    cell.border = thinExcelBorder;
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
  }

  if (report.rows.length > 0) {
    report.rows.forEach((rowValues, rowIndex) => {
      const row = worksheet.getRow(rowIndex + 8);
      row.values = ["", ...rowValues];
      row.height = 20;
      for (let columnNumber = 1; columnNumber <= report.columns.length; columnNumber += 1) {
        const cell = row.getCell(columnNumber);
        cell.border = thinExcelBorder;
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
        if (rowIndex % 2 === 1) {
          cell.fill = solidExcelFill("FFF8FAFC");
        }
      }
    });
  } else {
    worksheet.mergeCells(`A8:${lastColumn}8`);
    worksheet.getCell("A8").value = `No records available for ${report.title}.`;
    worksheet.getCell("A8").font = { italic: true, color: { argb: "FF64748B" } };
    worksheet.getCell("A8").alignment = { horizontal: "center" };
  }

  report.columns.forEach((column, index) => {
    const columnNumber = index + 1;
    const longestCell = Math.max(
      String(column).length,
      ...report.rows.map((row) => String(row[index] ?? "").length)
    );
    worksheet.getColumn(columnNumber).width = Math.min(Math.max(longestCell + 3, 14), 36);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${getReportFileSlug(report.title)}_${filenameDate}.xlsx`
  );
};

const Icon = ({ name, className = "h-6 w-6" }) => {
  const paths = {
    file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6M9 17h6",
    check: "m8 12 3 3 6-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    alert: "M12 8v4M12 16h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
    download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
    refresh: "M21 12a9 9 0 0 1-15.4 6.4L3 16m0 0v5h5M3 12A9 9 0 0 1 18.4 5.6L21 8m0 0V3h-5",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

const statTones = {
  navy: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  green: "bg-[#dcfce7] text-[#22c55e]",
  orange: "bg-[#ffedd5] text-[#ea580c]",
  gold: "bg-[#F5C518]/20 text-[#B88900]",
};

const StatCard = ({ label, value, icon, tone = "navy" }) => (
  <article className="rounded-lg border border-[#1E3A5F]/[0.07] bg-white px-5 py-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(30,58,95,0.14)]">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-[#8a96a3]">
          {label}
        </p>
        <p className="mt-2 text-[20px] font-extrabold leading-none text-[#1E3A5F]">
          {value}
        </p>
      </div>
      <div className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg ${statTones[tone] || statTones.navy}`}>
        <Icon name={icon} className="h-[22px] w-[22px]" />
      </div>
    </div>
  </article>
);

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-[9px] font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const TypeBadge = ({ children }) => (
  <span className="inline-flex whitespace-nowrap rounded-full border border-[#1E3A5F]/10 bg-white px-2.5 py-1 text-[9px] font-semibold text-[#5a6475]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-[#dcfce7] text-[#15803d]",
    "No Data": "bg-[#f1f5f9] text-[#64748b]",
    Error: "bg-[#fee2e2] text-[#b91c1c]",
    Loading: "bg-[#ffedd5] text-[#ea580c]",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${
        styles[status] || styles.Available
      }`}
    >
      {status}
    </span>
  );
};

const DownloadButton = ({ children = "Download", onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#1E3A5F] px-3 py-2 text-[9px] font-bold text-white shadow transition hover:bg-[#264a77] disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
  >
    <Icon name="download" className="h-4 w-4" />
    {children}
  </button>
);

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || `Failed to load ${path}`);
  return data;
};

const StaffReportsView = () => {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inventoryTables, setInventoryTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const loadReports = async () => {
    setLoading(true);
    setErrors([]);

    const results = await Promise.allSettled([
      fetchJson("/api/appointments/staff"),
      fetchJson("/api/staff"),
      fetchJson("/api/inventory/tables"),
    ]);

    const nextErrors = [];
    const [appointmentsResult, staffResult, inventoryResult] = results;

    if (appointmentsResult.status === "fulfilled") {
      setAppointments(appointmentsResult.value.appointments || []);
    } else {
      setAppointments([]);
      nextErrors.push("Appointments");
    }

    if (staffResult.status === "fulfilled") {
      setStaff(staffResult.value.staff || []);
    } else {
      setStaff([]);
      nextErrors.push("Staff directory");
    }

    if (inventoryResult.status === "fulfilled") {
      setInventoryTables(inventoryResult.value.tables || []);
    } else {
      setInventoryTables([]);
      nextErrors.push("Inventory");
    }

    setErrors(nextErrors);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const reports = useMemo(
    () => buildReportRows({ appointments, staff, inventoryTables }),
    [appointments, staff, inventoryTables]
  );
  const availableReports = useMemo(
    () => reports.filter((report) => report.status === "Available"),
    [reports]
  );

  const sourceCount = 3 - errors.length;
  const downloadableRecords = availableReports.reduce(
    (sum, report) => sum + report.records,
    0
  );
  const reportStats = [
    {
      label: "Available Reports",
      value: loading ? "..." : formatNumber(availableReports.length),
      icon: "file",
      tone: "navy",
    },
    {
      label: "Ready",
      value: loading ? "..." : formatNumber(availableReports.length),
      icon: "check",
      tone: "green",
    },
    {
      label: "Data Sources",
      value: loading ? "..." : `${sourceCount}/3`,
      icon: errors.length ? "alert" : "check",
      tone: errors.length ? "orange" : "green",
    },
    {
      label: "Downloadable Records",
      value: loading ? "..." : formatNumber(downloadableRecords),
      icon: "trend",
      tone: "gold",
    },
  ];

  return (
    <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
      <section className="mb-7">
        <h2 className="text-base font-extrabold leading-tight text-[#1E3A5F]">
          Reports
        </h2>
        <p className="mt-1.5 text-[10px] font-medium text-[#8a96a3]">
          Access and download generated reports
        </p>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {errors.length > 0 && (
        <section className="mb-5 flex flex-col gap-3 rounded-lg border border-[#ea580c]/20 bg-[#fff7ed] px-4 py-3 text-[#9a3412] shadow-[0_2px_14px_rgba(30,58,95,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-semibold">
            Some data sources could not be loaded: {errors.join(", ")}.
          </p>
          <button
            type="button"
            onClick={loadReports}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#1E3A5F] px-3 py-2 text-[9px] font-bold text-white"
          >
            <Icon name="refresh" className="h-4 w-4" />
            Retry
          </button>
        </section>
      )}

      {!loading && availableReports.length === 0 && (
        <section className="rounded-lg border border-dashed border-[#1E3A5F]/20 bg-white px-6 py-10 text-center shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F]">
            <Icon name="file" className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1E3A5F]">
            No available reports yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[11px] font-medium leading-5 text-[#6B7280]">
            Reports will appear here once appointments, staff records, or inventory
            records are available.
          </p>
        </section>
      )}

      {(loading || availableReports.length > 0) && (
      <section className="hidden overflow-hidden rounded-lg border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)] lg:block">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="w-[25%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Report Title
                </th>
                <th className="w-[15%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Department
                </th>
                <th className="w-[11%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Type</th>
                <th className="w-[14%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Generated By
                </th>
                <th className="w-[12%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">Date</th>
                <th className="w-[10%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Status
                </th>
                <th className="w-[13%] px-4 py-4 text-[9px] font-bold uppercase tracking-[0.06em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(loading ? reports : availableReports).map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F]">
                        <Icon name="file" className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-[10px] font-bold text-[#2d3748]">
                          {report.title}
                        </span>
                        <span className="mt-0.5 block text-[9px] font-medium text-[#8a96a3]">
                          {formatNumber(report.records)} records
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <DepartmentBadge>{report.department}</DepartmentBadge>
                  </td>
                  <td className="px-4 py-4">
                    <TypeBadge>{report.type}</TypeBadge>
                  </td>
                  <td className="px-4 py-4 text-[10px] text-[#5a6475]">
                    {report.generatedBy}
                  </td>
                  <td className="px-4 py-4 text-[10px] text-[#5a6475]">
                    {report.date}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={loading ? "Loading" : report.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <DownloadButton
                        onClick={() => downloadReportPdf(report)}
                        disabled={loading}
                      >
                        PDF
                      </DownloadButton>
                      <DownloadButton
                        onClick={() => downloadReportExcel(report)}
                        disabled={loading}
                      >
                        Excel
                      </DownloadButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {(loading || availableReports.length > 0) && (
      <section className="space-y-4 lg:hidden">
        {(loading ? reports : availableReports).map((report) => (
          <article
            key={report.id}
            className="rounded-lg border border-[#1E3A5F]/[0.07] bg-white p-5 shadow-[0_2px_14px_rgba(30,58,95,0.07)]"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F]">
                <Icon name="file" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] font-bold text-[#1E3A5F]">{report.title}</h3>
                <p className="mt-1 text-[10px] text-[#6B7280]">
                  {formatNumber(report.records)} records
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                  Department
                </p>
                <DepartmentBadge>{report.department}</DepartmentBadge>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                  Type
                </p>
                <TypeBadge>{report.type}</TypeBadge>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                  Date
                </p>
                <p className="text-[11px] text-black">{report.date}</p>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase text-[#6B7280]">
                  Status
                </p>
                <StatusBadge status={loading ? "Loading" : report.status} />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                <DownloadButton
                  onClick={() => downloadReportPdf(report)}
                  disabled={loading}
                >
                  PDF
                </DownloadButton>
                <DownloadButton
                  onClick={() => downloadReportExcel(report)}
                  disabled={loading}
                >
                  Excel
                </DownloadButton>
              </div>
            </div>
          </article>
        ))}
      </section>
      )}
    </main>
  );
};

export default StaffReportsView;
