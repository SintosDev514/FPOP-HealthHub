import React, { useMemo, useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const receiptColumns = [
  { label: "NW", fullName: "National Warehouse" },
  { label: "OA", fullName: "Other Agency" },
  { label: "LP", fullName: "Local Purchase" },
  { label: "FC", fullName: "FPOP Clinic" },
  { label: "RCBV", fullName: "Returned by CBV" },
  { label: "Total", fullName: "Total" },
];
const issuanceColumns = [
  { label: "PP", fullName: "Private Physicians" },
  { label: "Gov", fullName: "Government" },
  { label: "OA", fullName: "Other Agency" },
  { label: "CBV", fullName: "Community Based Volunteers" },
  { label: "Clinic", fullName: "Clinic" },
  { label: "Out/Mob", fullName: "Outreach/Mobile" },
  { label: "OFC", fullName: "Other FPOP Clinics" },
  { label: "Exp/Promo", fullName: "Expired/Promo" },
  { label: "Total", fullName: "Total" },
];

const receiptInputColumns = receiptColumns.filter((c) => c.label !== "Total");
const issuanceInputColumns = issuanceColumns.filter((c) => c.label !== "Total");

const createEmptyStockValues = (columns) =>
  columns.reduce((values, column) => ({ ...values, [column.label]: "0" }), {});

const createEmptyItemForm = () => ({
  name: "",
  beginning: "0",
  receipts: createEmptyStockValues(receiptInputColumns),
  issuances: createEmptyStockValues(issuanceInputColumns),
});

const createItemFormFromItem = (item) => ({
  name: item.name,
  beginning: String(item.beginning),
  receipts: receiptInputColumns.reduce(
    (values, column, index) => ({
      ...values,
      [column.label]: String(item.receipts[index] || 0),
    }),
    {}
  ),
  issuances: issuanceInputColumns.reduce(
    (values, column, index) => ({
      ...values,
      [column.label]: String(item.issuances[index] || 0),
    }),
    {}
  ),
});

const toStockNumber = (value) => {
  if (value === "") return 0;
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
};

const toStockInputValue = (value) => {
  if (value === "") return "";
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? String(Math.max(0, parsedValue)) : "0";
};

const getGroupTitle = (group) => {
  const itemCount = group.items.length;
  return `${group.name} (${itemCount} ${itemCount === 1 ? "ITEM" : "ITEMS"})`;
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const getReportDate = () => {
  const now = new Date();
  const filenameDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return {
    filenameDate,
    displayDate: now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

const toSafeNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getStockTotal = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  return toSafeNumber(values[values.length - 1]);
};

const getStockValue = (values, index) => {
  if (!Array.isArray(values)) return 0;
  return toSafeNumber(values[index]);
};

const formatPdfStockValue = (value) => {
  const numericValue = toSafeNumber(value);
  return numericValue === 0 ? "" : formatNumber(numericValue);
};

const createLis5HeaderRows = () => [
  [
    { content: "TYPE / BRAND", rowSpan: 2 },
    { content: "BEGINNING\nBALANCE", rowSpan: 2 },
    { content: "RECEIPTS", colSpan: 6 },
    { content: "ISSUANCES", colSpan: 9 },
    { content: "ENDING\nBALANCE", rowSpan: 2 },
  ],
  [
    "Stockroom\n(Total)",
    "National\nWarehouse",
    "Other Agency\n/ ROH, etc.",
    "Chapter\nLocal\nPurchase",
    "*Other\nFPOP\nClinics",
    "Returned\nby CSV",
    "Total",
    "Private Physicians\nand other\nMedical\nPractitioner",
    "Government",
    "Other\nAgency",
    "CBV",
    "Clinic",
    "Outreach /\nMobile",
    "*Other\nFPOP\nClinics",
    "Expired /\nPromo",
    "Total",
    "Stockroom\n(Total)",
  ],
  Array.from({ length: 18 }, (_, index) => String(index + 1)),
];

const createLis5ItemRow = (item) => [
  item.name || "",
  formatPdfStockValue(item.beginning),
  formatPdfStockValue(getStockValue(item.receipts, 0)),
  formatPdfStockValue(getStockValue(item.receipts, 1)),
  formatPdfStockValue(getStockValue(item.receipts, 2)),
  formatPdfStockValue(getStockValue(item.receipts, 3)),
  formatPdfStockValue(getStockValue(item.receipts, 4)),
  formatPdfStockValue(getStockTotal(item.receipts)),
  formatPdfStockValue(getStockValue(item.issuances, 0)),
  formatPdfStockValue(getStockValue(item.issuances, 1)),
  formatPdfStockValue(getStockValue(item.issuances, 2)),
  formatPdfStockValue(getStockValue(item.issuances, 3)),
  formatPdfStockValue(getStockValue(item.issuances, 4)),
  formatPdfStockValue(getStockValue(item.issuances, 5)),
  formatPdfStockValue(getStockValue(item.issuances, 6)),
  formatPdfStockValue(getStockValue(item.issuances, 7)),
  formatPdfStockValue(getStockTotal(item.issuances)),
  formatPdfStockValue(item.ending),
];

const createBlankLis5Row = () => Array.from({ length: 18 }, () => "");

const createLis5BodyRows = (table) => {
  const rows = [];

  (table.categories || []).forEach((category) => {
    rows.push([
      {
        content: category.name,
        colSpan: 18,
        styles: {
          fillColor: [229, 231, 235],
          fontStyle: "bold",
          halign: "left",
          textColor: [31, 41, 55],
        },
      },
    ]);

    (category.items || []).forEach((item) => {
      rows.push(createLis5ItemRow(item));
    });

    const blankRows = Math.max(2, 4 - (category.items || []).length);
    Array.from({ length: blankRows }).forEach(() => rows.push(createBlankLis5Row()));
  });

  if (rows.length === 0) {
    rows.push([
      {
        content: "No inventory items match the current filters.",
        colSpan: 18,
        styles: {
          halign: "center",
          fontStyle: "italic",
          textColor: [100, 116, 139],
        },
      },
    ]);
    Array.from({ length: 6 }).forEach(() => rows.push(createBlankLis5Row()));
  }

  return rows;
};

const createLis5ExcelItemRow = (item) => [
  item.name || "",
  toSafeNumber(item.beginning),
  getStockValue(item.receipts, 0),
  getStockValue(item.receipts, 1),
  getStockValue(item.receipts, 2),
  getStockValue(item.receipts, 3),
  getStockValue(item.receipts, 4),
  getStockTotal(item.receipts),
  getStockValue(item.issuances, 0),
  getStockValue(item.issuances, 1),
  getStockValue(item.issuances, 2),
  getStockValue(item.issuances, 3),
  getStockValue(item.issuances, 4),
  getStockValue(item.issuances, 5),
  getStockValue(item.issuances, 6),
  getStockValue(item.issuances, 7),
  getStockTotal(item.issuances),
  toSafeNumber(item.ending),
];

const sanitizeWorksheetName = (name, fallback, existingNames) => {
  const cleanedName = (name || fallback)
    .replace(/[*?:/\\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31);
  const baseName = cleanedName || fallback;
  let worksheetName = baseName;
  let counter = 2;

  while (existingNames.has(worksheetName)) {
    const suffix = ` ${counter}`;
    worksheetName = `${baseName.slice(0, 31 - suffix.length)}${suffix}`;
    counter += 1;
  }

  existingNames.add(worksheetName);
  return worksheetName;
};

const thinExcelBorder = {
  top: { style: "thin", color: { argb: "FF4B5563" } },
  left: { style: "thin", color: { argb: "FF4B5563" } },
  bottom: { style: "thin", color: { argb: "FF4B5563" } },
  right: { style: "thin", color: { argb: "FF4B5563" } },
};

const solidExcelFill = (argb) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

const styleExcelRange = (worksheet, rowNumber, startColumn, endColumn, styles) => {
  for (let columnNumber = startColumn; columnNumber <= endColumn; columnNumber += 1) {
    const cell = worksheet.getCell(rowNumber, columnNumber);
    Object.assign(cell, styles);
  }
};

const filterTablesBySearch = (inventoryTables, searchValue) => {
  if (!searchValue) return inventoryTables;

  return inventoryTables
    .map((table) => {
      const tableMatches = table.name.toLowerCase().includes(searchValue);
      if (tableMatches) return table;

      return {
        ...table,
        categories: table.categories
          .map((category) => {
            const categoryMatches = category.name.toLowerCase().includes(searchValue);
            return {
              ...category,
              items: categoryMatches
                ? category.items
                : category.items.filter((item) =>
                    item.name.toLowerCase().includes(searchValue)
                  ),
            };
          })
          .filter(
            (category) =>
              category.name.toLowerCase().includes(searchValue) ||
              category.items.length > 0
          ),
      };
    })
    .filter(
      (table) =>
        table.name.toLowerCase().includes(searchValue) ||
        table.categories.length > 0
    );
};

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-500",
  orange: "bg-orange-50 text-orange-600",
};

const StatusBadge = ({ status }) => {
  const isLowStock = status === "Low Stock";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${
        isLowStock
          ? "bg-orange-100 text-orange-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {status}
    </span>
  );
};

const StatCard = ({ label, value, icon, tone, detail, featured }) => (
  <article
    className={`min-h-[176px] rounded-lg border bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] ${
      featured ? "border-orange-500 ring-1 ring-orange-500" : "border-slate-200"
    }`}
  >
    <div
      className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${
        toneClasses[tone] || toneClasses.blue
      }`}
    >
      <Icon name={icon} className="h-6 w-6" />
    </div>
    <p className="text-[20px] font-extrabold leading-none text-slate-950">{value}</p>
    <p className="mt-2 text-[10px] font-medium text-slate-950">{label}</p>
    {detail && (
      <p
        className={`mt-2 text-[9px] font-medium ${
          featured ? "text-orange-600" : "text-slate-500"
        }`}
      >
        {detail}
      </p>
    )}
  </article>
);

const ToolbarButton = ({ icon, children, primary, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-[10px] font-bold transition ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-slate-100 text-slate-950 hover:bg-slate-200"
    }`}
  >
    <Icon name={icon} className="h-4 w-4" />
    {children}
  </button>
);

const Icon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    box: "m21 8-9-5-9 5m18 0-9 5m9-5v13m0-13L3 8m9 5 9-5M3 8v8l9 5 9-5V8",
    tray: "M6 4h12v6H6V4Zm0 10h12v6H6v-6Zm4-7h4m-4 10h4",
    trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
    warning:
      "M12 9v4m0 4h.01M10.3 4.3 2.1 18a2 2 0 0 0 1.7 3h16.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z",
    info: "M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    filter: "M4 5h16l-6 7v5l-4 2v-7L4 5Z",
    download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
    printer: "M7 8V4h10v4M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1M7 14h10v6H7v-6Z",
    plus: "M12 5v14M5 12h14",
    chevron: "m9 18 6-6-6-6",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z",
    trash: "M3 6h18m-2 0-.9 14.1A2 2 0 0 1 16.1 22H7.9a2 2 0 0 1-2-1.9L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6",
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

const InventoryTableHeader = () => (
  <thead className="sticky top-0 z-10">
    <tr className="border-b border-slate-200 bg-white">
      <th rowSpan="2" className="w-[160px] px-3 py-3 text-[9px] font-semibold">
        TYPE / BRAND
      </th>
      <th rowSpan="2" className="w-[95px] px-2 py-3 text-right text-[9px] font-semibold">
        BEGINNING BALANCE
      </th>
      <th colSpan={6} className="bg-emerald-50 px-2 py-3 text-center text-[9px] font-semibold">
        RECEIPTS
      </th>
      <th colSpan={9} className="bg-rose-50 px-2 py-3 text-center text-[9px] font-semibold">
        ISSUANCES
      </th>
      <th rowSpan="2" className="w-[95px] px-2 py-3 text-right text-[9px] font-semibold">
        ENDING BALANCE
      </th>
      <th rowSpan="2" className="w-[80px] px-2 py-3 text-center text-[9px] font-semibold">
        STATUS
      </th>
      <th rowSpan="2" className="w-[70px] px-2 py-3 text-center text-[9px] font-semibold">
        ACTIONS
      </th>
    </tr>
    <tr className="border-b border-slate-300 bg-white">
      {receiptColumns.map((column) => (
        <th
          key={`receipt-${column.label}`}
          title={column.fullName}
          className={`group px-1.5 py-2 text-right text-[8px] font-bold ${
            column.label === "Total" ? "bg-emerald-100" : "bg-emerald-50"
          }`}
        >
          <span className="block whitespace-nowrap">
            <span className="group-hover:hidden">{column.label}</span>
            <span className="hidden group-hover:inline">{column.fullName}</span>
          </span>
        </th>
      ))}
      {issuanceColumns.map((column) => (
        <th
          key={`issuance-${column.label}`}
          title={column.fullName}
          className={`group px-1.5 py-2 text-right text-[8px] font-bold ${
            column.label === "Total" ? "bg-rose-100" : "bg-rose-50"
          }`}
        >
          <span className="block whitespace-nowrap">
            <span className="group-hover:hidden">{column.label}</span>
            <span className="hidden group-hover:inline">{column.fullName}</span>
          </span>
        </th>
      ))}
    </tr>
  </thead>
);

const StaffInventoryView = ({ hideHeader }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState({});
  const [query, setQuery] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState("all");
  const [selectedQuarter, setSelectedQuarter] = useState("Q2");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [exportTableScope, setExportTableScope] = useState("all");
  const [selectedExportTableId, setSelectedExportTableId] = useState("all");
  const [activeTableId, setActiveTableId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState(createEmptyItemForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [tableNameForm, setTableNameForm] = useState("");
  const [tableChapterForm, setTableChapterForm] = useState("");
  const [tableQuarterForm, setTableQuarterForm] = useState("");
  const [tableYearForm, setTableYearForm] = useState("");
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);
  const [categoryNameForm, setCategoryNameForm] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategoryTableId, setActiveCategoryTableId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch(`${__API_BASE__}/api/inventory/tables`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setTables(data.tables);
    } catch (err) {
      console.error("Failed to load inventory tables:", err);
    } finally {
      setLoading(false);
    }
  };

  const API = `${__API_BASE__}/api/inventory`;

  const activeTable = tables.find((t) => t._id === activeTableId);
  const activeCategory = activeTable?.categories.find(
    (cat) => cat._id === activeCategoryId
  );
  const editingItem = activeCategory?.items.find(
    (item) => item._id === editingItemId
  );

  const visibleTables = useMemo(() => {
    const searchValue = query.trim().toLowerCase();
    const scopedTables =
      selectedTableFilter === "all"
        ? tables
        : tables.filter((table) => table._id === selectedTableFilter);

    return filterTablesBySearch(scopedTables, searchValue);
  }, [tables, query, selectedTableFilter]);

  const tablesForExport = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    if (exportTableScope === "specific" && selectedExportTableId === "all") {
      return filterTablesBySearch(tables, searchValue);
    }

    const scopedTables =
      exportTableScope === "specific"
        ? tables.filter((table) => table._id === selectedExportTableId)
        : tables;

    return filterTablesBySearch(scopedTables, searchValue);
  }, [exportTableScope, query, selectedExportTableId, tables]);

  const getStatCards = (allTables) => {
    const items = allTables.flatMap((table) =>
      table.categories.flatMap((cat) => cat.items)
    );
    const totalReceipts = items.reduce(
      (sum, item) => sum + (item.receipts[item.receipts.length - 1] || 0),
      0
    );
    const totalIssuances = items.reduce(
      (sum, item) => sum + (item.issuances[item.issuances.length - 1] || 0),
      0
    );
    const totalAvailableStocks = items.reduce(
      (sum, item) => sum + (item.ending || 0),
      0
    );
    const lowStockCount = items.filter(
      (item) => item.status === "Low Stock"
    ).length;

    return [
      {
        label: "Total Inventory Items",
        value: formatNumber(items.length),
        icon: "box",
        tone: "blue",
      },
      {
        label: "Total Available Stocks",
        value: formatNumber(totalAvailableStocks),
        icon: "tray",
        tone: "green",
      },
      {
        label: "Total Receipts This Quarter",
        value: formatNumber(totalReceipts),
        icon: "trend",
        tone: "indigo",
        detail: "Items received",
      },
      {
        label: "Total Issuances This Quarter",
        value: formatNumber(totalIssuances),
        icon: "trend",
        tone: "purple",
        detail: "Items distributed",
      },
      {
        label: "Expiring Soon",
        value: "0",
        icon: "warning",
        tone: "amber",
        detail: "No items flagged",
        featured: true,
      },
      {
        label: "Low Stock",
        value: formatNumber(lowStockCount),
        icon: "warning",
        tone: "orange",
        detail: lowStockCount ? "Needs attention" : "All good",
      },
    ];
  };

  const statCards = useMemo(() => getStatCards(tables), [tables]);

  const toggleCategory = (id) => {
    setOpenCategories((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const handleTableFilterChange = (event) => {
    setSelectedTableFilter(event.target.value);
  };

  const handleExportPDF = () => {
    const { filenameDate, displayDate } = getReportDate();
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const reportTables =
      tablesForExport.length > 0
        ? tablesForExport
        : [
            {
              name: "Inventory Report",
              chapter: "",
              categories: [],
            },
          ];

    reportTables.forEach((table, index) => {
      if (index > 0) doc.addPage("a4", "landscape");

      const pageWidth = doc.internal.pageSize.getWidth();
      const chapter = table.chapter || "";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(
        "F A M I L Y  P L A N N I N G  O R G A N I Z A T I O N  O F  T H E  P H I L I P P I N E S",
        pageWidth / 2,
        32,
        { align: "center" }
      );
      doc.setFontSize(7.5);
      doc.text(
        "CONSUMABLE/DISPOSABLE COMMODITIES INVENTORY LIS-5",
        pageWidth / 2,
        48,
        { align: "center" }
      );

      doc.setFontSize(7);
      doc.text(`Chapter: ${chapter}`, 32, 78);
      doc.text(`Quarter: ${selectedQuarter}`, 32, 91);
      doc.text(`Year: ${selectedYear}`, 32, 104);
      doc.setFont("helvetica", "normal");
      doc.text(`Date Generated: ${displayDate}`, pageWidth - 32, 104, {
        align: "right",
      });

      doc.setFont("helvetica", "bold");
      doc.text(table.name || "Inventory Report", 32, 128);

      autoTable(doc, {
        startY: 136,
        margin: { left: 32, right: 32 },
        tableWidth: "auto",
        head: createLis5HeaderRows(),
        body: createLis5BodyRows(table),
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 5.5,
          cellPadding: 1.4,
          overflow: "linebreak",
          lineColor: [74, 85, 104],
          lineWidth: 0.25,
          textColor: [31, 41, 55],
          minCellHeight: 9,
          valign: "middle",
        },
        headStyles: {
          fillColor: [229, 231, 235],
          textColor: [17, 24, 39],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          lineColor: [55, 65, 81],
          lineWidth: 0.35,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 96, halign: "left" },
          1: { cellWidth: 42, halign: "right", fillColor: [249, 250, 251] },
          2: { cellWidth: 44, halign: "right" },
          3: { cellWidth: 48, halign: "right" },
          4: { cellWidth: 42, halign: "right" },
          5: { cellWidth: 42, halign: "right" },
          6: { cellWidth: 38, halign: "right" },
          7: { cellWidth: 38, halign: "right", fillColor: [239, 246, 255] },
          8: { cellWidth: 50, halign: "right" },
          9: { cellWidth: 44, halign: "right" },
          10: { cellWidth: 42, halign: "right" },
          11: { cellWidth: 38, halign: "right" },
          12: { cellWidth: 38, halign: "right" },
          13: { cellWidth: 38, halign: "right" },
          14: { cellWidth: 42, halign: "right" },
          15: { cellWidth: 40, halign: "right" },
          16: { cellWidth: 38, halign: "right", fillColor: [239, 246, 255] },
          17: { cellWidth: 42, halign: "right", fillColor: [254, 243, 199] },
        },
        didParseCell: (data) => {
          if (data.section === "head") {
            data.cell.styles.minCellHeight = data.row.index === 0 ? 14 : 26;
            if (data.row.index === 2) {
              data.cell.styles.minCellHeight = 9;
              data.cell.styles.fontSize = 5;
            }
          }

          if (data.section === "body" && data.cell.raw === "") {
            data.cell.styles.minCellHeight = 9.5;
          }
        },
        didDrawPage: () => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6);
          doc.text(
            "*Other information / additional relevant commodities must be recorded to the blank rows provided in the quarterly clinic issue",
            32,
            doc.internal.pageSize.getHeight() - 20
          );
        },
      });
    });

    doc.save(`staff_inventory_lis5_report_${filenameDate}.pdf`);
  };

  const handleExportExcel = async () => {
    const { filenameDate, displayDate } = getReportDate();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "FPOP Clinic Portal";
    workbook.created = new Date();
    const worksheetNames = new Set();
    const reportTables =
      tablesForExport.length > 0
        ? tablesForExport
        : [
            {
              name: "Inventory Report",
              chapter: "",
              categories: [],
            },
          ];

    reportTables.forEach((table, tableIndex) => {
      const worksheet = workbook.addWorksheet(
        sanitizeWorksheetName(table.name, `Inventory ${tableIndex + 1}`, worksheetNames),
        {
          views: [{ state: "frozen", ySplit: 11 }],
          pageSetup: {
            orientation: "landscape",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            margins: {
              left: 0.25,
              right: 0.25,
              top: 0.35,
              bottom: 0.35,
              header: 0.15,
              footer: 0.15,
            },
          },
        }
      );

      worksheet.columns = [
        { width: 28 },
        { width: 11 },
        { width: 12 },
        { width: 13 },
        { width: 12 },
        { width: 12 },
        { width: 11 },
        { width: 10 },
        { width: 15 },
        { width: 12 },
        { width: 11 },
        { width: 9 },
        { width: 9 },
        { width: 10 },
        { width: 12 },
        { width: 11 },
        { width: 10 },
        { width: 12 },
      ];

      worksheet.mergeCells("A1:R1");
      worksheet.getCell("A1").value =
        "FAMILY PLANNING ORGANIZATION OF THE PHILIPPINES";
      worksheet.getCell("A1").font = { bold: true, size: 12 };
      worksheet.getCell("A1").alignment = { horizontal: "center" };

      worksheet.mergeCells("A2:R2");
      worksheet.getCell("A2").value =
        "CONSUMABLE/DISPOSABLE COMMODITIES INVENTORY LIS-5";
      worksheet.getCell("A2").font = { bold: true, size: 10 };
      worksheet.getCell("A2").alignment = { horizontal: "center" };

      worksheet.getCell("A4").value = `Chapter: ${table.chapter || ""}`;
      worksheet.getCell("A5").value = `Quarter: ${selectedQuarter}`;
      worksheet.getCell("A6").value = `Year: ${selectedYear}`;
      worksheet.getCell("N6").value = `Generated: ${displayDate}`;

      ["A4", "A5", "A6", "N6"].forEach((cellAddress) => {
        worksheet.getCell(cellAddress).font = { bold: true, size: 9 };
      });

      worksheet.mergeCells("A8:R8");
      worksheet.getCell("A8").value = table.name || "Inventory Report";
      worksheet.getCell("A8").font = { bold: true, size: 9 };

      worksheet.mergeCells("A9:A10");
      worksheet.mergeCells("B9:B10");
      worksheet.mergeCells("C9:H9");
      worksheet.mergeCells("I9:Q9");
      worksheet.mergeCells("R9:R10");

      worksheet.getRow(9).values = [
        "",
        "TYPE / BRAND",
        "BEGINNING\nBALANCE",
        "RECEIPTS",
        "",
        "",
        "",
        "",
        "",
        "ISSUANCES",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "ENDING\nBALANCE",
      ];
      worksheet.getRow(10).values = [
        "",
        "",
        "",
        "National\nWarehouse",
        "Other Agency\n/ ROH, etc.",
        "Chapter\nLocal\nPurchase",
        "*Other\nFPOP\nClinics",
        "Returned\nby CSV",
        "Total",
        "Private Physicians\nand other\nMedical\nPractitioner",
        "Government",
        "Other\nAgency",
        "CBV",
        "Clinic",
        "Outreach /\nMobile",
        "*Other\nFPOP\nClinics",
        "Expired /\nPromo",
        "Total",
        "",
      ];
      worksheet.getRow(11).values = [
        "",
        ...Array.from({ length: 18 }, (_, index) => index + 1),
      ];

      [9, 10, 11].forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.height = rowNumber === 10 ? 50 : 20;
        for (let columnNumber = 1; columnNumber <= 18; columnNumber += 1) {
          const cell = row.getCell(columnNumber);
          cell.font = { bold: true, size: rowNumber === 11 ? 8 : 7 };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.fill = solidExcelFill("FFE5E7EB");
          cell.border = thinExcelBorder;
        }
      });

      let nextRowNumber = 12;
      let hasItems = false;

      (table.categories || []).forEach((category) => {
        worksheet.mergeCells(`A${nextRowNumber}:R${nextRowNumber}`);
        const categoryCell = worksheet.getCell(`A${nextRowNumber}`);
        categoryCell.value = category.name;
        categoryCell.font = { bold: true, size: 9 };
        categoryCell.fill = solidExcelFill("FFE5E7EB");
        categoryCell.alignment = { horizontal: "left", vertical: "middle" };
        styleExcelRange(worksheet, nextRowNumber, 1, 18, {
          border: thinExcelBorder,
          fill: solidExcelFill("FFE5E7EB"),
        });
        nextRowNumber += 1;

        (category.items || []).forEach((item) => {
          hasItems = true;
          const row = worksheet.getRow(nextRowNumber);
          row.values = ["", ...createLis5ExcelItemRow(item)];
          row.height = 18;

          for (let columnNumber = 1; columnNumber <= 18; columnNumber += 1) {
            const cell = row.getCell(columnNumber);
            cell.border = thinExcelBorder;
            cell.font = { size: 8 };
            cell.alignment = {
              horizontal: columnNumber === 1 ? "left" : "right",
              vertical: "middle",
              wrapText: true,
            };

            if (columnNumber === 8 || columnNumber === 17) {
              cell.fill = solidExcelFill("FFEFF6FF");
              cell.font = { bold: true, size: 8 };
            }

            if (columnNumber === 18) {
              cell.fill = solidExcelFill("FFFEF3C7");
              cell.font = { bold: true, size: 8 };
            }

            if (columnNumber > 1) {
              cell.numFmt = "#,##0";
            }
          }

          nextRowNumber += 1;
        });

        const blankRows = Math.max(2, 4 - (category.items || []).length);
        Array.from({ length: blankRows }).forEach(() => {
          const row = worksheet.getRow(nextRowNumber);
          row.height = 18;
          for (let columnNumber = 1; columnNumber <= 18; columnNumber += 1) {
            const cell = row.getCell(columnNumber);
            cell.border = thinExcelBorder;
            cell.alignment = { vertical: "middle" };
            if (columnNumber === 8 || columnNumber === 17) {
              cell.fill = solidExcelFill("FFEFF6FF");
            }
            if (columnNumber === 18) {
              cell.fill = solidExcelFill("FFFEF3C7");
            }
          }
          nextRowNumber += 1;
        });
      });

      if (!hasItems) {
        worksheet.mergeCells(`A${nextRowNumber}:R${nextRowNumber}`);
        const emptyCell = worksheet.getCell(`A${nextRowNumber}`);
        emptyCell.value = "No inventory items match the current filters.";
        emptyCell.font = { italic: true, color: { argb: "FF64748B" } };
        emptyCell.alignment = { horizontal: "center" };
        styleExcelRange(worksheet, nextRowNumber, 1, 18, {
          border: thinExcelBorder,
        });
        nextRowNumber += 1;

        Array.from({ length: 6 }).forEach(() => {
          for (let columnNumber = 1; columnNumber <= 18; columnNumber += 1) {
            worksheet.getCell(nextRowNumber, columnNumber).border = thinExcelBorder;
          }
          nextRowNumber += 1;
        });
      }

      worksheet.getCell(`A${nextRowNumber + 1}`).value =
        "*Other information / additional relevant commodities must be recorded to the blank rows provided in the quarterly clinic issue";
      worksheet.getCell(`A${nextRowNumber + 1}`).font = { italic: true, size: 8 };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `staff_inventory_lis5_report_${filenameDate}.xlsx`
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const { displayDate } = getReportDate();

    let html = `
      <html>
        <head>
          <title>Inventory LIS-5 Report - ${displayDate}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: landscape; margin: 1cm; }
            }
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              color: #1e293b;
              padding: 20px;
              line-height: 1.2;
            }
            .header-container {
              text-align: center;
              margin-bottom: 20px;
            }
            .org-title {
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              color: #1e3a5f;
              letter-spacing: 0.5px;
              margin: 0 0 4px 0;
            }
            .report-title {
              font-size: 12px;
              font-weight: 700;
              color: #475569;
              margin: 0 0 15px 0;
            }
            .meta-grid {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              font-weight: 600;
              margin-bottom: 15px;
              border-bottom: 1.5px solid #cbd5e1;
              padding-bottom: 8px;
            }
            .table-container {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .table-name {
              font-size: 11px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 8px;
              margin-bottom: 10px;
            }
            th, td {
              border: 0.5px solid #475569;
              padding: 4px 5px;
              text-align: center;
              vertical-align: middle;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 700;
              color: #0f172a;
              font-size: 7.5px;
            }
            .col-left {
              text-align: left;
              font-weight: 600;
            }
            .category-row {
              background-color: #e2e8f0;
              font-weight: 700;
              text-align: left;
            }
            .category-row td {
              text-align: left;
              padding: 5px 8px;
              font-size: 9px;
            }
            .footnote {
              font-size: 7px;
              font-style: italic;
              color: #64748b;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <h1 class="org-title">Family Planning Organization of the Philippines</h1>
            <h2 class="report-title">Consumable/Disposable Commodities Inventory LIS-5 Report</h2>
          </div>
          
          <div class="meta-grid">
            <div>Quarter: ${selectedQuarter} | Year: ${selectedYear}</div>
            <div>Generated: ${displayDate}</div>
          </div>
    `;

    const reportTables = tablesForExport.length > 0 ? tablesForExport : tables;

    reportTables.forEach((table) => {
      html += `
        <div class="table-container">
          <div class="table-name">${table.name || "Inventory Report"} ${table.chapter ? `(${table.chapter})` : ""}</div>
          <table>
            <thead>
              <tr>
                <th rowspan="2" style="width: 15%; text-align: left;">TYPE / BRAND</th>
                <th rowspan="2" style="width: 6%;">BEGINNING BALANCE</th>
                <th colspan="6">RECEIPTS</th>
                <th colspan="9">ISSUANCES</th>
                <th rowspan="2" style="width: 6%;">ENDING BALANCE</th>
              </tr>
              <tr>
                <th style="font-size: 7px;">National Warehouse</th>
                <th style="font-size: 7px;">Other Agency / ROH</th>
                <th style="font-size: 7px;">Chapter Local Purchase</th>
                <th style="font-size: 7px;">*Other FPOP Clinics</th>
                <th style="font-size: 7px;">Returned by CSV</th>
                <th style="font-weight: 800;">Total</th>
                <th style="font-size: 7px;">Private Physicians</th>
                <th style="font-size: 7px;">Government</th>
                <th style="font-size: 7px;">Other Agency</th>
                <th style="font-size: 7px;">CBV</th>
                <th style="font-size: 7px;">Clinic</th>
                <th style="font-size: 7px;">Outreach / Mobile</th>
                <th style="font-size: 7px;">*Other FPOP Clinics</th>
                <th style="font-size: 7px;">Expired / Promo</th>
                <th style="font-weight: 800;">Total</th>
              </tr>
              <tr style="background-color: #f8fafc; font-size: 7px; height: 12px;">
                ${Array.from({ length: 18 }, (_, i) => `<th style="padding: 1px 0; font-weight: normal; color: #64748b;">${i + 1}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
      `;

      if (!table.categories || table.categories.length === 0) {
        html += `<tr><td colspan="18" style="text-align: center; color: #64748b; font-style: italic;">No categories or items available</td></tr>`;
      } else {
        table.categories.forEach((cat) => {
          html += `
            <tr class="category-row">
              <td colspan="18">${cat.name}</td>
            </tr>
          `;

          if (!cat.items || cat.items.length === 0) {
            html += `<tr><td colspan="18" style="text-align: center; color: #94a3b8; font-style: italic;">No items in this category</td></tr>`;
          } else {
            cat.items.forEach((item) => {
              const rowData = createLis5ExcelItemRow(item);
              html += `
                <tr>
                  <td class="col-left">${rowData[0]}</td>
                  <td>${rowData[1] || "-"}</td>
                  <td>${rowData[2] || "-"}</td>
                  <td>${rowData[3] || "-"}</td>
                  <td>${rowData[4] || "-"}</td>
                  <td>${rowData[5] || "-"}</td>
                  <td>${rowData[6] || "-"}</td>
                  <td style="font-weight: 700;">${rowData[7] || "-"}</td>
                  <td>${rowData[8] || "-"}</td>
                  <td>${rowData[9] || "-"}</td>
                  <td>${rowData[10] || "-"}</td>
                  <td>${rowData[11] || "-"}</td>
                  <td>${rowData[12] || "-"}</td>
                  <td>${rowData[13] || "-"}</td>
                  <td>${rowData[14] || "-"}</td>
                  <td>${rowData[15] || "-"}</td>
                  <td style="font-weight: 700;">${rowData[16] || "-"}</td>
                  <td style="font-weight: 700;">${rowData[17] || "-"}</td>
                </tr>
              `;
            });
          }

          // Add blank rows for formatting
          const blankRowsCount = Math.max(2, 4 - (cat.items || []).length);
          Array.from({ length: blankRowsCount }).forEach(() => {
            html += `
              <tr style="height: 18px;">
                ${Array.from({ length: 18 }, () => `<td></td>`).join("")}
              </tr>
            `;
          });
        });
      }

      html += `
            </tbody>
          </table>
          <div class="footnote">*Other information / additional relevant commodities must be recorded to the blank rows provided.</div>
        </div>
      `;
    });

    html += `
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const openCreateTableModal = () => {
    setTableNameForm("");
    setTableChapterForm("");
    setTableQuarterForm("");
    setTableYearForm(new Date().getFullYear().toString());
    setIsCreateTableOpen(true);
  };

  const closeCreateTableModal = () => {
    setTableNameForm("");
    setTableChapterForm("");
    setTableQuarterForm("");
    setTableYearForm("");
    setIsCreateTableOpen(false);
  };

  const handleCreateTable = async (event) => {
    event.preventDefault();
    const name = tableNameForm.trim();
    if (!name) return;
    try {
      const res = await fetch(`${API}/tables`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          chapter: tableChapterForm.trim(),
          quarter: tableQuarterForm,
          year: tableYearForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTables((current) => [data.table, ...current]);
        closeCreateTableModal();
      }
    } catch (err) {
      console.error("Failed to create table:", err);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Delete this table and all its data?")) return;
    try {
      const res = await fetch(`${API}/tables/${tableId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setTables((current) => current.filter((t) => t._id !== tableId));
      }
    } catch (err) {
      console.error("Failed to delete table:", err);
    }
  };

  const openCategoryModal = (tableId) => {
    setActiveCategoryTableId(tableId);
    setCategoryNameForm("");
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setActiveCategoryTableId(null);
    setCategoryNameForm("");
    setIsCategoryModalOpen(false);
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    const name = categoryNameForm.trim();
    if (!activeCategoryTableId || !name) return;
    try {
      const res = await fetch(
        `${API}/tables/${activeCategoryTableId}/categories`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setTables((current) =>
          current.map((t) =>
            t._id === activeCategoryTableId ? data.table : t
          )
        );
        setOpenCategories((current) => ({
          ...current,
          [data.table.categories[data.table.categories.length - 1]._id]: true,
        }));
        closeCategoryModal();
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  const handleDeleteCategory = async (tableId, catId) => {
    if (!window.confirm("Delete this category and all its items?")) return;
    try {
      const res = await fetch(
        `${API}/tables/${tableId}/categories/${catId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setTables((current) =>
          current.map((t) => (t._id === tableId ? data.table : t))
        );
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const openAddItemModal = (tableId, categoryId) => {
    setActiveTableId(tableId);
    setActiveCategoryId(categoryId);
    setModalMode("add");
    setEditingItemId(null);
    setItemForm(createEmptyItemForm());
    setOpenCategories((current) => ({ ...current, [categoryId]: true }));
  };

  const openEditItemModal = (tableId, categoryId, item) => {
    setActiveTableId(tableId);
    setActiveCategoryId(categoryId);
    setModalMode("edit");
    setEditingItemId(item._id);
    setItemForm(createItemFormFromItem(item));
  };

  const closeAddItemModal = () => {
    setActiveTableId(null);
    setActiveCategoryId(null);
    setModalMode("add");
    setEditingItemId(null);
    setItemForm(createEmptyItemForm());
  };

  const updateStockValue = (section, label, value) => {
    setItemForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [label]: toStockInputValue(value),
      },
    }));
  };

  const handleSaveItem = async (event) => {
    event.preventDefault();
    if (!activeCategory || !itemForm.name.trim()) return;

    const receipts = receiptInputColumns.map((column) =>
      toStockNumber(itemForm.receipts[column.label])
    );
    const issuances = issuanceInputColumns.map((column) =>
      toStockNumber(itemForm.issuances[column.label])
    );

    try {
      const isEdit = modalMode === "edit" && editingItemId;
      const url = isEdit
        ? `${API}/tables/${activeTableId}/categories/${activeCategoryId}/items/${editingItemId}`
        : `${API}/tables/${activeTableId}/categories/${activeCategoryId}/items`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemForm.name.trim(),
          beginning: itemForm.beginning,
          receipts,
          issuances,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTables((current) =>
          current.map((t) => (t._id === activeTableId ? data.table : t))
        );
        closeAddItemModal();
      }
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  const openDeleteConfirmation = (tableId, categoryId, item) => {
    setDeleteTarget({ tableId, categoryId, item });
  };

  const closeDeleteConfirmation = () => {
    setDeleteTarget(null);
  };

  const confirmDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `${API}/tables/${deleteTarget.tableId}/categories/${deleteTarget.categoryId}/items/${deleteTarget.item._id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setTables((current) =>
          current.map((t) =>
            t._id === deleteTarget.tableId ? data.table : t
          )
        );
        closeDeleteConfirmation();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  if (loading) {
    return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-9 sm:px-8 lg:px-[32px] overflow-y-auto">
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A5F]" />
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 bg-[#f8fafc] px-4 sm:px-8 lg:px-[32px] overflow-y-auto overflow-x-hidden min-w-0 ${hideHeader ? "py-4" : "py-9"}`}>
      {!hideHeader && (
        <section className="mb-8">
          <h2 className="text-base font-extrabold leading-tight text-slate-950">
            Inventory
          </h2>
          <p className="mt-2 text-[10px] font-medium text-slate-600">
            Track all stock items by category, receipts, issuances, and balances.
          </p>
        </section>
      )}

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedQuarter}
            onChange={(event) => setSelectedQuarter(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
          >
            <option value="Q2">Q2</option>
            <option value="Q1">Q1</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500">
            <option>All Branches</option>
            <option>Community</option>
            <option>Clinic</option>
          </select>
          <select
            value={exportTableScope}
            onChange={(event) => {
              setExportTableScope(event.target.value);
              if (event.target.value !== "specific") {
                setSelectedExportTableId("all");
              }
            }}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
            aria-label="Export scope"
          >
            <option value="all">All tables</option>
            <option value="specific">Specific table</option>
          </select>
          <select
            value={selectedExportTableId}
            onChange={(event) => setSelectedExportTableId(event.target.value)}
            disabled={exportTableScope !== "specific"}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            aria-label="Export table"
          >
            <option value="all">Select table</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                {table.name}
              </option>
            ))}
          </select>
          <ToolbarButton icon="download" onClick={handleExportPDF}>
            PDF
          </ToolbarButton>
          <ToolbarButton icon="download" onClick={handleExportExcel}>
            Excel
          </ToolbarButton>
          <ToolbarButton icon="printer" onClick={handlePrint}>Print</ToolbarButton>

        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px_150px]">
          <label className="relative block">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search item or type/brand..."
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
            />
          </label>
          <select
            value={selectedTableFilter}
            onChange={handleTableFilterChange}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
          >
            <option value="all">All Tables</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                {table.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-[10px] font-bold text-slate-950 transition hover:bg-slate-50"
          >
            <Icon name="filter" className="h-4 w-4" />
            More Filters
          </button>
        </div>
      </section>

      <section className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[10px] font-extrabold text-slate-950">
            Inventory Tables
          </h3>
          <p className="mt-1 text-[9px] font-medium text-slate-500">
            {tables.length === 0
              ? "No tables yet. Create one to start tracking inventory."
              : `You have ${tables.length} ${tables.length === 1 ? "table" : "tables"}.`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateTableModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 text-[10px] font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
        >
          <Icon name="plus" className="h-4 w-4" />
          Create Table
        </button>
      </section>

      {tables.length === 0 && (
        <section className="rounded-lg border border-slate-200 bg-white p-12 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Icon name="box" className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-[11px] font-extrabold text-slate-950">
              No Inventory Tables
            </h4>
            <p className="mt-2 max-w-md text-[10px] font-medium text-slate-500">
              Create your first inventory table to start tracking stock items,
              receipts, issuances, and balances.
            </p>
            <button
              type="button"
              onClick={openCreateTableModal}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-[10px] font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              <Icon name="plus" className="h-4 w-4" />
              Create Table
            </button>
          </div>
        </section>
      )}

      {visibleTables.map((table) => (
        <section
          key={table._id}
          className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.07)]"
        >
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-extrabold text-slate-950">
                {table.name}
              </h3>
              {(table.chapter || table.quarter || table.year) && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-600">
                  {[table.chapter && `Ch. ${table.chapter}`, table.quarter, table.year]
                    .filter(Boolean)
                    .join(" | ")}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDeleteTable(table._id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${table.name}`}
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => openCategoryModal(table._id)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 text-[10px] font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              <Icon name="plus" className="h-4 w-4" />
              Add Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full border-collapse text-left text-[9px] text-slate-950">
              <InventoryTableHeader />
              <tbody>
                {table.categories.length === 0 && (
                  <tr className="border-b border-slate-200 bg-white">
                    <td
                      colSpan={20}
                      className="px-5 py-6 text-center text-[10px] font-medium text-slate-500"
                    >
                      No categories yet. Add a category to this table.
                    </td>
                  </tr>
                )}
                {table.categories.map((cat) => {
                  const isOpen = openCategories[cat._id];

                  return (
                    <React.Fragment key={cat._id}>
                      <tr className="border-y border-[#F5C518]/20 bg-[#152c4a]">
                        <td colSpan={20} className="px-4 py-0">
                          <div className="flex min-h-11 items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => toggleCategory(cat._id)}
                              className="flex min-w-0 flex-1 items-center gap-3 text-left text-[10px] font-extrabold text-[#F5C518]"
                            >
                              <Icon
                                name="chevron"
                                className={`h-4 w-4 shrink-0 transition-transform ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                              <span className="truncate">
                                {getGroupTitle(cat)}
                              </span>
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCategory(table._id, cat._id)
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-red-400"
                                aria-label={`Delete ${cat.name}`}
                              >
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  openAddItemModal(table._id, cat._id)
                                }
                                className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F5C518] text-[#1E3A5F] px-3 text-[9px] font-bold transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                              >
                                <Icon name="plus" className="h-3.5 w-3.5" />
                                Add Item
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {isOpen && cat.items.length === 0 && (
                        <tr className="border-b border-slate-200 bg-white">
                          <td
                            colSpan={20}
                            className="px-5 py-6 text-center text-[10px] font-medium text-slate-500"
                          >
                            {query.trim()
                              ? "No matching items found in this category."
                              : "No items yet. Add an item to this category."}
                          </td>
                        </tr>
                      )}
                      {isOpen &&
                        cat.items.map((item) => (
                          <tr
                            key={item._id}
                            className="border-b border-slate-200 bg-white transition hover:bg-blue-50/40"
                          >
                            <td className="px-4 py-2.5 text-[9px] font-semibold">
                              {item.name}
                            </td>
                            <td className="px-2 py-2.5 text-right text-[9px]">
                              {formatNumber(item.beginning)}
                            </td>
                            {item.receipts.map((value, index) => (
                              <td
                                key={`${item._id}-receipt-${index}`}
                                className={`px-1.5 py-2.5 text-right text-[9px] ${
                                  index === receiptColumns.length - 1
                                    ? "bg-emerald-100 font-extrabold"
                                    : "bg-emerald-50"
                                }`}
                              >
                                {formatNumber(value)}
                              </td>
                            ))}
                            {item.issuances.map((value, index) => (
                              <td
                                key={`${item._id}-issuance-${index}`}
                                className={`px-1.5 py-2.5 text-right text-[9px] ${
                                  index === issuanceColumns.length - 1
                                    ? "bg-rose-100 font-extrabold"
                                    : "bg-rose-50"
                                }`}
                              >
                                {formatNumber(value)}
                              </td>
                            ))}
                            <td className="px-2 py-2.5 text-right text-[9px] font-extrabold">
                              {formatNumber(item.ending)}
                            </td>
                            <td className="px-2 py-2.5 text-center">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="px-2 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditItemModal(
                                      table._id,
                                      cat._id,
                                      item
                                    )
                                  }
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50"
                                  aria-label={`Edit ${item.name}`}
                                >
                                  <Icon name="edit" className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openDeleteConfirmation(
                                      table._id,
                                      cat._id,
                                      item
                                    )
                                  }
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50"
                                  aria-label={`Delete ${item.name}`}
                                >
                                  <Icon
                                    name="trash"
                                    className="h-3.5 w-3.5"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {isCreateTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-950">
                  Create Table
                </h3>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  Name the empty inventory table you want to add.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateTableModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close create table modal"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <form onSubmit={handleCreateTable} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <label className="block">
                  <span className="text-[9px] font-bold uppercase text-slate-500">
                    Table Name
                  </span>
                  <input
                    value={tableNameForm}
                    onChange={(event) => setTableNameForm(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-[10px] font-semibold text-slate-950 outline-none focus:border-blue-500"
                    placeholder="Enter table name"
                    required
                  />
                </label>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      Chapter
                    </span>
                    <input
                      value={tableChapterForm}
                      onChange={(event) => setTableChapterForm(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-[10px] font-semibold text-slate-950 outline-none focus:border-blue-500"
                      placeholder="e.g. 1"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      Quarter
                    </span>
                    <select
                      value={tableQuarterForm}
                      onChange={(event) => setTableQuarterForm(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      Year
                    </span>
                    <select
                      value={tableYearForm}
                      onChange={(event) => setTableYearForm(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-[10px] text-slate-950 outline-none focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const y = new Date().getFullYear() - 5 + i;
                        return <option key={y} value={y}>{y}</option>;
                      })}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end bg-slate-50">
                <button
                  type="button"
                  onClick={closeCreateTableModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-[10px] font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-[10px] font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-950">
                  Add Category
                </h3>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  Create a category before adding Type/Brand items.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCategoryModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close add category modal"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <label className="block">
                  <span className="text-[9px] font-bold uppercase text-slate-500">
                    Category Name
                  </span>
                  <input
                    value={categoryNameForm}
                    onChange={(event) => setCategoryNameForm(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-[10px] font-semibold text-slate-950 outline-none focus:border-blue-500"
                    placeholder="Enter category name"
                    required
                  />
                </label>
              </div>

              <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end bg-slate-50">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-[10px] font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-[10px] font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-[11px] font-extrabold text-slate-950">
                  {modalMode === "edit"
                    ? `Edit ${editingItem?.name || itemForm.name}`
                    : `Add Item to ${activeCategory.name}`}
                </h3>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  {modalMode === "edit"
                    ? "Update item details and stock values."
                    : "Enter beginning balance, receipts, and issuances for this item."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddItemModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close add item modal"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      Type/Brand Name
                    </span>
                    <input
                      value={itemForm.name}
                      onChange={(event) =>
                        setItemForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-[10px] font-semibold text-slate-950 outline-none focus:border-blue-500"
                      placeholder="Enter item or brand name"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                      Beginning Balance
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={itemForm.beginning}
                      onChange={(event) =>
                        setItemForm((current) => ({
                          ...current,
                          beginning: toStockInputValue(event.target.value),
                        }))
                      }
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-right text-[10px] font-semibold text-slate-950 outline-none focus:border-blue-500"
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <fieldset className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                    <legend className="px-2 text-[10px] font-extrabold text-emerald-700">
                      Receipts
                    </legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {receiptInputColumns.map((column) => (
                        <label
                          key={`modal-receipt-${column.label}`}
                          className="block"
                        >
                          <span className="text-[9px] font-bold text-slate-600">
                            {column.label}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={itemForm.receipts[column.label]}
                            onChange={(event) =>
                              updateStockValue(
                                "receipts",
                                column.label,
                                event.target.value
                              )
                            }
                            className="mt-1 h-10 w-full rounded-lg border border-emerald-200 bg-white px-3 text-right text-[10px] font-semibold text-slate-950 outline-none focus:border-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
                    <legend className="px-2 text-[10px] font-extrabold text-rose-700">
                      Issuances
                    </legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {issuanceInputColumns.map((column) => (
                        <label
                          key={`modal-issuance-${column.label}`}
                          className="block"
                        >
                          <span className="text-[9px] font-bold text-slate-600">
                            {column.label}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={itemForm.issuances[column.label]}
                            onChange={(event) =>
                              updateStockValue(
                                "issuances",
                                column.label,
                                event.target.value
                              )
                            }
                            className="mt-1 h-10 w-full rounded-lg border border-rose-200 bg-white px-3 text-right text-[10px] font-semibold text-slate-950 outline-none focus:border-rose-500"
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end bg-slate-50">
                <button
                  type="button"
                  onClick={closeAddItemModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-[10px] font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-[10px] font-bold text-[#1E3A5F] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  {modalMode === "edit" ? "Save Changes" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <h3 className="text-[11px] font-extrabold text-slate-950">
                Delete Item
              </h3>
              <p className="mt-2 text-[10px] font-medium text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-extrabold text-slate-950">
                  {deleteTarget.item.name}
                </span>
                ? This will remove it from the current inventory list.
              </p>
            </div>
            <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end bg-slate-50">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-[10px] font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-[10px] font-bold text-white transition hover:bg-red-700"
              >
                <Icon name="trash" className="h-4 w-4" />
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffInventoryView;
