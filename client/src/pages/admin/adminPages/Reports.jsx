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

const lis5Head = [
  [{ content: "TYPE / BRAND", rowSpan: 2 }, { content: "BEGINNING\nBALANCE", rowSpan: 2 }, { content: "RECEIPTS", colSpan: 6 }, { content: "ISSUANCES", colSpan: 9 }, { content: "ENDING\nBALANCE", rowSpan: 2 }],
  ["National\nWarehouse", "Other Agency\n/ ROH, etc.", "Chapter\nLocal\nPurchase", "*Other\nFPOP\nClinics", "Returned\nby CSV", "Total", "Private Physicians\nand other\nMedical\nPractitioner", "Government", "Other\nAgency", "CBV", "Clinic", "Outreach /\nMobile", "*Other\nFPOP\nClinics", "Expired /\nPromo", "Total"],
  Array.from({ length: 18 }, (_, index) => String(index + 1)),
];
const numAt = (values, index) => Number(values?.[index]) || 0;
const sumAt = (values) => Array.isArray(values) ? Number(values[values.length - 1]) || values.reduce((sum, value) => sum + (Number(value) || 0), 0) : 0;
const lis5Row = (item) => [item.name || "", Number(item.beginning) || 0, ...Array.from({ length: 5 }, (_, i) => numAt(item.receipts, i)), sumAt(item.receipts), ...Array.from({ length: 8 }, (_, i) => numAt(item.issuances, i)), sumAt(item.issuances), Number(item.ending) || 0];
const lis5Rows = (table) => (table.categories || []).flatMap((category) => [[{ content: category.name || "Uncategorized", colSpan: 18, styles: { fillColor: [229, 231, 235], fontStyle: "bold" } }], ...(category.items || []).map(lis5Row)]);

const downloadCsv = (report) => {
  if (report.id === 4) {
    const rows = [["FAMILY PLANNING ORGANIZATION OF THE PHILIPPINES"], ["CONSUMABLE/DISPOSABLE COMMODITIES INVENTORY LIS-5"], [`Generated: ${new Date().toLocaleString()}`], []];
    const groupHeader = Array(18).fill(""); groupHeader[0] = "TYPE / BRAND"; groupHeader[1] = "BEGINNING BALANCE"; groupHeader[2] = "RECEIPTS"; groupHeader[8] = "ISSUANCES"; groupHeader[17] = "ENDING BALANCE";
    const subHeaders = ["", "", "National Warehouse", "Other Agency / ROH, etc.", "Chapter Local Purchase", "Other FPOP Clinics", "Returned by CSV", "Receipt Total", "Private Physicians and other Medical Practitioner", "Government", "Other Agency", "CBV", "Clinic", "Outreach / Mobile", "Other FPOP Clinics", "Expired / Promo", "Issuance Total", ""];
    const tables = report.inventoryTables || [];
    tables.forEach((table) => {
      rows.push([`Chapter: ${table.chapter || ""}`, `Quarter: ${table.quarter || "N/A"}`, `Year: ${table.year || "N/A"}`]);
      rows.push([table.name || "Inventory Report"]);
      rows.push(groupHeader, subHeaders, Array.from({ length: 18 }, (_, index) => index + 1));
      (table.categories || []).forEach((category) => {
        rows.push([category.name || "Uncategorized"]);
        (category.items || []).forEach((item) => rows.push(lis5Row(item)));
      });
      rows.push([]);
    });
    const csv = rows.map((row) => row.map(csvValue).join(",")).join("\r\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${fileSlug(report.title)}_${todayKey()}.csv`);
    return;
  }
  const csvRows = [
    ["FAMILY PLANNING ORGANIZATION OF THE PHILIPPINES"],
    ["SYSTEM REPORT"],
    [report.title],
    [`Category: ${report.category}`, `Generated: ${new Date().toLocaleString()}`, `Records: ${report.rows.length}`],
    [],
    report.columns,
    ...report.rows,
  ];
  const csv = csvRows.map((row) => row.map(csvValue).join(",")).join("\r\n");
  saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${fileSlug(report.title)}_${todayKey()}.csv`);
};

const downloadPdf = (report) => {
  if (report.id === 4) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const tables = report.inventoryTables?.length ? report.inventoryTables : [{ name: "Inventory Report", categories: [] }];
    tables.forEach((table, index) => {
      if (index) doc.addPage("a4", "landscape");
      const width = doc.internal.pageSize.getWidth();
      addReportLogosToPdf(doc, { x: 28, y: 16, height: 22 });
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("F A M I L Y  P L A N N I N G  O R G A N I Z A T I O N  O F  T H E  P H I L I P P I N E S", width / 2, 46, { align: "center" });
      doc.setFontSize(7.5); doc.text("CONSUMABLE/DISPOSABLE COMMODITIES INVENTORY LIS-5", width / 2, 60, { align: "center" });
      doc.setFontSize(7); doc.text(`Chapter: ${table.chapter || ""}`, 28, 82); doc.text(`Quarter: ${table.quarter || "N/A"}`, 28, 95); doc.text(`Year: ${table.year || "N/A"}`, 28, 108); doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, width - 28, 108, { align: "right" }); doc.text(table.name || "Inventory Report", 28, 129);
      autoTable(doc, { startY: 136, margin: { left: 28, right: 28 }, head: lis5Head, body: lis5Rows(table), theme: "grid", styles: { font: "helvetica", fontSize: 5.5, cellPadding: 1.5, overflow: "linebreak", valign: "middle", minCellHeight: 9, lineColor: [74, 85, 104], lineWidth: 0.25 }, headStyles: { fillColor: [250, 230, 195], textColor: [31, 41, 55], fontStyle: "bold", halign: "center", lineColor: [55, 65, 81], lineWidth: 0.35 }, columnStyles: { 0: { cellWidth: 96, halign: "left" }, 1: { cellWidth: 42, halign: "right" }, 7: { fillColor: [239, 246, 255] }, 16: { fillColor: [239, 246, 255] }, 17: { fillColor: [254, 243, 199] } }, didParseCell: (data) => { if (data.section === "head") data.cell.styles.minCellHeight = data.row.index === 0 ? 14 : data.row.index === 2 ? 9 : 26; } });
    });
    doc.save(`contraceptive-supply-inventory_${todayKey()}.pdf`);
    return;
  }
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
  if (report.id === 4) {
    const workbook = new ExcelJS.Workbook();
    workbook.views = [{ activeTab: 0, firstSheet: 0, visibility: "visible" }];
    const tables = report.inventoryTables?.length ? report.inventoryTables : [{ name: "Inventory Report", categories: [] }];
    const usedNames = new Set();
    const labels = ["TYPE / BRAND", "BEGINNING BALANCE", "National Warehouse", "Other Agency / ROH, etc.", "Chapter Local Purchase", "Other FPOP Clinics", "Returned by CSV", "Receipt Total", "Private Physicians and other Medical Practitioner", "Government", "Other Agency", "CBV", "Clinic", "Outreach / Mobile", "Other FPOP Clinics", "Expired / Promo", "Issuance Total", "ENDING BALANCE"];
    tables.forEach((table, index) => {
      const rawName = (table.name || `Inventory ${index + 1}`).replace(/[*?:/\\[\]]/g, " ").slice(0, 31) || `Inventory ${index + 1}`;
      let name = rawName; let suffix = 2; while (usedNames.has(name)) name = `${rawName.slice(0, 27)} ${suffix++}`; usedNames.add(name);
      const sheet = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 11, topLeftCell: "A1", activeCell: "A1" }], pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
      sheet.columns = labels.map((_, i) => ({ width: i === 0 ? 28 : i === 8 ? 20 : 13 }));
      sheet.mergeCells("A1:R1"); sheet.getCell("A1").value = "FAMILY PLANNING ORGANIZATION OF THE PHILIPPINES"; sheet.mergeCells("A2:R2"); sheet.getCell("A2").value = "CONSUMABLE/DISPOSABLE COMMODITIES INVENTORY LIS-5";
      ["A1", "A2"].forEach((address) => { sheet.getCell(address).font = { bold: true, size: address === "A1" ? 12 : 10 }; sheet.getCell(address).alignment = { horizontal: "center" }; });
      addReportLogosToWorksheet(sheet, { row: 0, col: 0, height: 20 });
      sheet.getRow(1).height = 18; sheet.getRow(2).height = 14;
      sheet.getCell("A4").value = `Chapter: ${table.chapter || ""}`; sheet.getCell("A5").value = `Quarter: ${table.quarter || "N/A"}`; sheet.getCell("A6").value = `Year: ${table.year || "N/A"}`; sheet.getCell("N6").value = `Date Generated: ${new Date().toLocaleDateString()}`; sheet.mergeCells("A8:R8"); sheet.getCell("A8").value = table.name || "Inventory Report";
      sheet.mergeCells("A9:A10"); sheet.mergeCells("B9:B10"); sheet.mergeCells("C9:H9"); sheet.mergeCells("I9:Q9"); sheet.mergeCells("R9:R10");
      sheet.getCell("A9").value = "TYPE / BRAND";
      sheet.getCell("B9").value = "BEGINNING BALANCE";
      sheet.getCell("C9").value = "RECEIPTS";
      sheet.getCell("I9").value = "ISSUANCES";
      sheet.getCell("R9").value = "ENDING BALANCE";
      labels.slice(2, 17).forEach((value, i) => { sheet.getRow(10).getCell(i + 3).value = value; }); sheet.getRow(11).values = Array.from({ length: 18 }, (_, i) => i + 1);
      [9, 10, 11].forEach((rowNumber) => sheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell) => { cell.font = { bold: true, size: 7 }; cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAE6C3" } }; cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; }));
      let rowNumber = 12; (table.categories || []).forEach((category) => { sheet.mergeCells(`A${rowNumber}:R${rowNumber}`); sheet.getCell(`A${rowNumber}`).value = category.name || "Uncategorized"; sheet.getCell(`A${rowNumber}`).font = { bold: true }; sheet.getCell(`A${rowNumber}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } }; rowNumber += 1; (category.items || []).forEach((item) => { const row = sheet.getRow(rowNumber++); row.values = lis5Row(item); row.eachCell({ includeEmpty: true }, (cell, column) => { cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }; cell.alignment = { horizontal: column === 1 ? "left" : "right", vertical: "middle", wrapText: true }; if (column === 8 || column === 17) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFF6FF" } }; if (column === 18) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } }; }); }); });
      sheet.pageSetup.printArea = `A1:R${Math.max(12, rowNumber - 1)}`;
    });
    const buffer = await workbook.xlsx.writeBuffer(); saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `contraceptive-supply-inventory_${todayKey()}.xlsx`); return;
  }
  const workbook = new ExcelJS.Workbook();
  workbook.views = [{ activeTab: 0, firstSheet: 0, visibility: "visible" }];
  const worksheet = workbook.addWorksheet(report.title.slice(0, 31), {
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
  worksheet.columns.forEach((column) => { column.width = Math.min(Math.max(...column.values.map((value) => String(value ?? "").length), 12) + 2, 36); });
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
      inventoryTables: inventory,
      columns: ["Table", "Category", "Item", "Beginning", "Receipts", "Issuances", "Ending", "Status"],
      rows: inventory.flatMap((table) => (table.categories || []).flatMap((category) => (category.items || []).map((item) => {
        const beginning = Number(item.beginning || 0);
        const receiptDetails = Array.isArray(item.receipts) ? item.receipts.slice(0, -1) : [];
        const receiptsTotal = beginning + receiptDetails.reduce((s, v) => s + (Number(v) || 0), 0);
        return [table.name || "N/A", category.name || "N/A", item.name || "N/A", beginning, receiptsTotal, item.issuances?.at(-1) || 0, item.ending || 0, item.status || "In Stock"];
      }))),
    },
  ], [appointments, inventory, surveys]);

  const handleExport = async (report) => {
    setExportingId(report.id);
    setSuccessId(null);
    try {
      const format = formats[report.id] || "pdf";
      if (format === "excel") {
        await downloadExcel(report);
      } else if (format === "csv") {
        downloadCsv(report);
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
