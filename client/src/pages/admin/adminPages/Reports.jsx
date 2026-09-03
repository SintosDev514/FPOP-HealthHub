import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_BASE from "../../../apiBase";

const NAVY      = "#1E3A5F";
const GREEN     = "#22c55e";

const reportTemplates = [
  { id: 1, title: "Monthly Clinical Consultation Summary", desc: "Aggregated volumes of appointments, departments, and patient demographics.", category: "Operational" },
  { id: 2, title: "Client Feedback & Satisfaction Survey", desc: "Survey responses from clients including satisfaction ratings and suggestions for improvement.", category: "Feedback" },
  { id: 3, title: "Staff Attendance & Performance Analysis", desc: "Consultation durations, attendance metrics, and service delivery benchmarks for physicians.", category: "Staff" },
  { id: 4, title: "Contraceptive Supply & Inventory Report", desc: "Current stock status of family planning supplies, distribution logs, and reorder levels.", category: "Inventory" },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-US");
};

const fileSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "admin-report";

const csvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const downloadCsv = (report) => {
  const csv = [report.columns, ...report.rows].map((row) => row.map(csvValue).join(",")).join("\r\n");
  saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${fileSlug(report.title)}_${todayKey()}.csv`);
};

const downloadPdf = (report) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(15);
  doc.text(report.title, 32, 38);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()} | Records: ${report.rows.length}`, 32, 56);
  autoTable(doc, {
    startY: 72,
    head: [report.columns],
    body: report.rows.length ? report.rows : [[`No records available for ${report.title}.`]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [30, 58, 95] },
  });
  doc.save(`${fileSlug(report.title)}_${todayKey()}.pdf`);
};

const downloadExcel = async (report) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(report.title.slice(0, 31));
  worksheet.addRow([report.title]);
  worksheet.addRow([`Generated: ${new Date().toLocaleString()}`, `Records: ${report.rows.length}`]);
  worksheet.addRow([]);
  const header = worksheet.addRow(report.columns);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
  report.rows.forEach((row) => worksheet.addRow(row));
  worksheet.columns.forEach((column) => { column.width = Math.min(Math.max(...column.values.map((value) => String(value ?? "").length), 12) + 2, 36); });
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${fileSlug(report.title)}_${todayKey()}.xlsx`);
};

export default function Reports({ isMobile }) {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingId, setExportingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [formats, setFormats] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const paths = ["/api/admin/appointments", "/api/staff", "/api/inventory/tables", "/api/surveys"];
        const results = await Promise.all(paths.map((path) => fetch(`${API_BASE}${path}`, { credentials: "include" }).then((response) => response.json())));
        if (results.some((result) => !result.success)) throw new Error("Some report data could not be loaded.");
        setAppointments(results[0].appointments || []);
        setStaff(results[1].staff || []);
        setInventory(results[2].tables || []);
        setSurveys(results[3].surveys || []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load report data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reports = useMemo(() => [
    {
      ...reportTemplates[0],
      columns: ["Client", "Service", "Department", "Date", "Time", "Status"],
      rows: appointments.map((appointment) => [appointment.patient || "N/A", appointment.serviceName || "N/A", appointment.department || "N/A", formatDate(appointment.date), appointment.time || "N/A", appointment.status || "N/A"]),
    },
    {
      ...reportTemplates[1],
      columns: ["Name", "Email", "Contact", "Satisfaction", "Service Rating", "Facility Rating", "Provider Rating", "Suggestions", "Date"],
      rows: surveys.map((s) => [s.name || "N/A", s.email || "N/A", s.contactNumber || "N/A", `${s.satisfaction}/5`, `${s.appropriateService}/5`, `${s.facilityResources}/5`, `${s.providerResponsiveness}/5`, s.suggestions || "None", formatDate(s.createdAt)]),
    },
    {
      ...reportTemplates[2],
      columns: ["Staff Member", "Email", "Specialty", "Schedule"],
      rows: staff.map((member) => [member.name || "N/A", member.email || "N/A", member.specialty || "N/A", typeof member.schedule === "object" ? JSON.stringify(member.schedule) : member.schedule || "N/A"]),
    },
    {
      ...reportTemplates[3],
      columns: ["Table", "Category", "Item", "Beginning", "Receipts", "Issuances", "Ending", "Status"],
      rows: inventory.flatMap((table) => (table.categories || []).flatMap((category) => (category.items || []).map((item) => [table.name || "N/A", category.name || "N/A", item.name || "N/A", item.beginning || 0, item.receipts?.at(-1) || 0, item.issuances?.at(-1) || 0, item.ending || 0, item.status || "In Stock"]))),
    },
  ], [appointments, inventory, staff, surveys]);

  const handleExport = async (report) => {
    setExportingId(report.id);
    setSuccessId(null);
    try {
      const format = formats[report.id] || "pdf";
      if (format === "excel") await downloadExcel(report);
      else if (format === "csv") downloadCsv(report);
      else downloadPdf(report);
      setSuccessId(report.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (exportError) {
      setError(exportError.message || "Unable to export report.");
    } finally {
      setExportingId(null);
    }
  };

  return (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "28px 32px", overflowY: "auto", background: "#f1f4f8" }}>

<div style={{ marginBottom: "26px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>System Reports</h1>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#8a96a3", fontWeight: 500 }}>
          Generate and export clinical activity, billing and operational summaries
        </p>
      </div>

<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && <p style={{ color: "#b91c1c", fontSize: "13px" }}>{error}</p>}
        {loading && <p style={{ color: "#718096", fontSize: "13px" }}>Loading report data...</p>}
        {reports.map(report => (
          <div key={report.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(30,58,95,0.07)", boxShadow: "0 2px 12px rgba(30,58,95,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <span style={{ 
                padding: "3px 8px", 
                borderRadius: "4px", 
                fontSize: "10px", 
                fontWeight: 700, 
                textTransform: "uppercase",
                background: report.category === "Operational" ? "rgba(30,58,95,0.08)" : report.category === "Inventory" ? "rgba(34,197,94,0.08)" : report.category === "Feedback" ? "rgba(168,85,247,0.1)" : "rgba(245,197,24,0.14)",
                color: report.category === "Operational" ? NAVY : report.category === "Inventory" ? GREEN : report.category === "Feedback" ? "#7c3aed" : "#9a6700",
                display: "inline-block",
                marginBottom: "8px"
              }}>
                {report.category}
              </span>
              <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: NAVY }}>{report.title}</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#718096", lineHeight: 1.4 }}>{report.desc}</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "180px", justifyContent: "flex-end" }}>
              {exportingId === report.id ? (
                <span style={{ color: NAVY, fontSize: "12px", fontWeight: 700 }}>Exporting...</span>
              ) : (
                <>
                  {successId === report.id ? (
                    <span style={{ color: GREEN, fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      Downloaded
                    </span>
                  ) : (
                    <>
                      <select value={formats[report.id] || "pdf"} onChange={(event) => setFormats({ ...formats, [report.id]: event.target.value })} style={{ padding: "6px 12px", borderRadius: "6px", border: "1.5px solid rgba(30,58,95,0.12)", background: "#fff", fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                        <option value="pdf">PDF Format</option>
                        <option value="excel">Excel Format</option>
                        <option value="csv">CSV Format</option>
                      </select>
                      <button 
                        onClick={() => handleExport(report)}
                        style={{ background: NAVY, color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(30,58,95,0.15)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#152c4a"}
                        onMouseLeave={e => e.currentTarget.style.background = NAVY}
                      >
                        Export
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
