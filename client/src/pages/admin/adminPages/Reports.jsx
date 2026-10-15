import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addReportLogosToPdf, addReportLogosToWorksheet } from "../../../utils/reportLogos";
import API_BASE from "../../../apiBase";

const NAVY      = "#1E3A5F";
const GREEN     = "#22c55e";

const reportTemplates = [
  { id: 1, title: "Monthly Clinical Consultation Summary", desc: "Aggregated volumes of appointments, departments, and patient demographics.", category: "Operational" },
  { id: 2, title: "Client Feedback & Satisfaction Survey", desc: "Survey responses from clients including satisfaction ratings and suggestions for improvement.", category: "Feedback" },
  { id: 6, title: "Inventory Movement Summary", desc: "Receipts, issuances and ending balances per item across all inventory tables.", category: "Inventory" },
  { id: 7, title: "Service Activity Report", desc: "Appointment volume per service with status breakdown.", category: "Operational" },
];

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

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
    const statusKey = String(appointment.status || "").trim().toLowerCase().replace(/\s+/g, "_");
    if (current[statusKey] !== undefined) {
      current[statusKey] += 1;
    } else if (statusKey === "not_completed") {
      current.cancelled += 1;
    }
    grouped.set(service, current);
  });

  return Array.from(grouped.values()).sort((a, b) => b.total - a.total);
};

const flattenInventoryItems = (tables) =>
  tables.flatMap((table) =>
    (table.categories || []).flatMap((category) =>
      (category.items || []).map((item) => {
        const beginning = Number(item.beginning || 0);
        const receiptDetails = Array.isArray(item.receipts) ? item.receipts.slice(0, -1) : [];
        const receiptsTotal = beginning + receiptDetails.reduce((s, v) => s + (Number(v) || 0), 0);
        const issuances = Array.isArray(item.issuances) && item.issuances.length
          ? Number(item.issuances[item.issuances.length - 1]) || 0
          : 0;
        return {
          tableName: table.name || "Inventory Table",
          category: category.name || "Uncategorized",
          item: item.name || "Unnamed Item",
          beginning,
          receipts: receiptsTotal,
          issuances,
          ending: Number(item.ending || 0),
          status: item.status || "In Stock",
        };
      })
    )
  );

const todayKey = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-US");
};

const fileSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "admin-report";

const excelSheetName = (title, fallback = "Report") => {
  const cleaned = String(title || "").replace(/[*?:/\\[\]]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 31).trim() || fallback;
};

const downloadPdf = (report) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  addReportLogosToPdf(doc, { x: 28, y: 16, height: 22 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("F A M I L Y  P L A N N I N G  O R G A N I Z A T I O N  O F  T H E  P H I L I P P I N E S", pageWidth / 2, 46, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("SYSTEM REPORT", pageWidth / 2, 60, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Category: ${report.category}`, 28, 82);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 28, 82, { align: "right" });
  doc.text(`Records: ${report.rows.length}`, pageWidth - 28, 95, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(report.title, 28, 119);
  autoTable(doc, {
    startY: 126,
    margin: { left: 28, right: 28 },
    head: [report.columns],
    body: report.rows.length ? report.rows : [[`No records available for ${report.title}.`]],
    theme: "grid",
    styles: { font: "helvetica", fontSize: 7, cellPadding: 2, overflow: "linebreak", valign: "middle", lineColor: [74, 85, 104], lineWidth: 0.25 },
    headStyles: { fillColor: [250, 230, 195], textColor: [31, 41, 55], fontStyle: "bold", halign: "center", lineColor: [55, 65, 81], lineWidth: 0.35 },
    alternateRowStyles: { fillColor: [255, 255, 255] },
  });
  doc.save(`${fileSlug(report.title)}_${todayKey()}.pdf`);
};

const downloadExcel = async (report) => {
  const workbook = new ExcelJS.Workbook();
  workbook.views = [{ activeTab: 0, firstSheet: 0, visibility: "visible" }];
  const worksheet = workbook.addWorksheet(excelSheetName(report.title), {
    views: [{ state: "normal", topLeftCell: "A1", activeCell: "A1", zoomScale: 90 }],
  });
  const columnCount = Math.max(report.columns.length, 5);
  const lastColumn = columnCount <= 26 ? String.fromCharCode(64 + columnCount) : "Z";
  worksheet.mergeCells(`A1:${lastColumn}1`); worksheet.getCell("A1").value = "FAMILY PLANNING ORGANIZATION OF THE PHILIPPINES";
  worksheet.mergeCells(`A2:${lastColumn}2`); worksheet.getCell("A2").value = "SYSTEM REPORT";
  ["A1", "A2"].forEach((address) => { worksheet.getCell(address).font = { bold: true, size: address === "A1" ? 12 : 10 }; worksheet.getCell(address).alignment = { horizontal: "center" }; });
  addReportLogosToWorksheet(worksheet, { row: 0, col: 0, height: 20 });
  worksheet.getRow(1).height = 18; worksheet.getRow(2).height = 14;
  worksheet.getCell("A4").value = `Category: ${report.category}`; worksheet.getCell("D4").value = `Generated: ${new Date().toLocaleString()}`; worksheet.getCell("D5").value = `Records: ${report.rows.length}`;
  worksheet.mergeCells(`A7:${lastColumn}7`); worksheet.getCell("A7").value = report.title; worksheet.getCell("A7").font = { bold: true, size: 10 };
  const header = worksheet.getRow(9);
  report.columns.forEach((value, index) => { header.getCell(index + 1).value = value; });
  header.height = 28; header.eachCell((cell) => { cell.font = { bold: true, size: 8 }; cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAE6C3" } }; cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; });
  const exportedRows = report.rows.length ? report.rows : [[`No records available for ${report.title}.`]];
  exportedRows.forEach((values, rowIndex) => {
    const dataRow = worksheet.getRow(rowIndex + 10);
    values.forEach((value, columnIndex) => { dataRow.getCell(columnIndex + 1).value = value ?? ""; });
    dataRow.eachCell((cell) => { cell.alignment = { vertical: "middle", wrapText: true }; cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; });
  });
  const recordsSheet = workbook.addWorksheet("Records");
  recordsSheet.views = [{ state: "normal", topLeftCell: "A1", activeCell: "A1", zoomScale: 90 }];
  recordsSheet.columns = report.columns.map((column) => ({ width: Math.min(Math.max(String(column).length + 3, 14), 36) }));
  recordsSheet.addRow(report.columns);
  report.rows.forEach((row) => recordsSheet.addRow(row.map((value) => value ?? "")));
  recordsSheet.getRow(1).height = 28;
  recordsSheet.getRow(1).eachCell((cell) => { cell.font = { bold: true, size: 8 }; cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAE6C3" } }; cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; });
  report.rows.forEach((_, rowIndex) => recordsSheet.getRow(rowIndex + 2).eachCell({ includeEmpty: true }, (cell) => { cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; cell.alignment = { vertical: "middle", wrapText: true }; }));
  worksheet.columns.forEach((column) => {
    const lengths = [];
    column.eachCell({ includeEmpty: false }, (cell) => {
      const value = cell?.value;
      if (value !== null && value !== undefined && value !== "") lengths.push(String(value).length);
    });
    const longest = lengths.length ? Math.max(...lengths) : 12;
    const width = Math.min(Math.max(longest, 12) + 2, 36);
    column.width = Number.isFinite(width) ? width : 12;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${fileSlug(report.title)}_${todayKey()}.xlsx`);
};

export default function Reports({ isMobile }) {
  const [appointments, setAppointments] = useState([]);
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
        const fetchJson = async (path) => {
          try {
            const res = await fetch(`${API_BASE}${path}`, {
              credentials: "include",
            });
            const text = await res.text();
            return JSON.parse(text);
          } catch {
            return { success: false };
          }
        };
        const results = await Promise.all([
          fetchJson("/api/admin/appointments"),
          fetchJson("/api/inventory/tables"),
          fetchJson("/api/surveys"),
        ]);
        setAppointments(results[0].success ? results[0].appointments || [] : []);
        setInventory(results[1].success ? results[1].tables || [] : []);
        setSurveys(results[2].success ? results[2].surveys || [] : []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load report data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reports = useMemo(() => {
    const inventoryItems = flattenInventoryItems(inventory);

    const sections = {
      1: {
        columns: ["Client", "Service", "Department", "Date", "Time", "Status"],
        rows: appointments.map((appointment) => [appointment.patient || "N/A", appointment.serviceName || "N/A", appointment.department || "N/A", formatDate(appointment.date), appointment.time || "N/A", appointment.status || "N/A"]),
      },
      2: {
        columns: ["Name", "Email", "Contact", "Satisfaction", "Service Rating", "Facility Rating", "Provider Rating", "Suggestions", "Date"],
        rows: surveys.map((s) => [s.name || "N/A", s.email || "N/A", s.contactNumber || "N/A", `${s.satisfaction}/5`, `${s.appropriateService}/5`, `${s.facilityResources}/5`, `${s.providerResponsiveness}/5`, s.suggestions || "None", formatDate(s.createdAt)]),
      },
      6: {
        columns: ["Table", "Item", "Receipts", "Issuances", "Ending"],
        rows: [
          ...inventoryItems.map((item) => [
            item.tableName,
            item.item,
            formatNumber(item.receipts),
            formatNumber(item.issuances),
            formatNumber(item.ending),
          ]),
          ...(inventoryItems.length > 0
            ? [[
                "TOTAL",
                "",
                formatNumber(inventoryItems.reduce((sum, item) => sum + item.receipts, 0)),
                formatNumber(inventoryItems.reduce((sum, item) => sum + item.issuances, 0)),
                formatNumber(inventoryItems.reduce((sum, item) => sum + item.ending, 0)),
              ]]
            : []),
        ],
      },
      7: {
        columns: ["Service", "Total", "Pending", "Confirmed", "Completed", "Cancelled"],
        rows: groupByService(appointments).map((service) => [
          service.service,
          service.total,
          service.pending,
          service.confirmed,
          service.completed,
          service.cancelled,
        ]),
      },
    };

    return reportTemplates.map((template) => ({ ...template, ...(sections[template.id] || {}) }));
  }, [appointments, inventory, surveys]);

  const handleExport = async (report) => {
    setExportingId(report.id);
    setSuccessId(null);
    try {
      const format = formats[report.id] || "pdf";
      if (format === "excel") {
        await downloadExcel(report);
      } else {
        downloadPdf(report);
      }
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
