import React, { useMemo, useState, useEffect } from "react";

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
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
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
    <p className="text-3xl font-extrabold leading-none text-slate-950">{value}</p>
    <p className="mt-2 text-sm font-medium text-slate-950">{label}</p>
    {detail && (
      <p
        className={`mt-2 text-xs font-medium ${
          featured ? "text-orange-600" : "text-slate-500"
        }`}
      >
        {detail}
      </p>
    )}
  </article>
);

const ToolbarButton = ({ icon, children, primary }) => (
  <button
    type="button"
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition ${
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
      <th rowSpan="2" className="w-[160px] px-3 py-3 text-xs font-semibold">
        TYPE / BRAND
      </th>
      <th rowSpan="2" className="w-[95px] px-2 py-3 text-right text-xs font-semibold">
        BEGINNING BALANCE
      </th>
      <th colSpan={6} className="bg-emerald-50 px-2 py-3 text-center text-xs font-semibold">
        RECEIPTS
      </th>
      <th colSpan={9} className="bg-rose-50 px-2 py-3 text-center text-xs font-semibold">
        ISSUANCES
      </th>
      <th rowSpan="2" className="w-[95px] px-2 py-3 text-right text-xs font-semibold">
        ENDING BALANCE
      </th>
      <th rowSpan="2" className="w-[80px] px-2 py-3 text-center text-xs font-semibold">
        STATUS
      </th>
      <th rowSpan="2" className="w-[70px] px-2 py-3 text-center text-xs font-semibold">
        ACTIONS
      </th>
    </tr>
    <tr className="border-b border-slate-300 bg-white">
      {receiptColumns.map((column) => (
        <th
          key={`receipt-${column.label}`}
          title={column.fullName}
          className={`group px-1.5 py-2 text-right text-[10px] font-bold ${
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
          className={`group px-1.5 py-2 text-right text-[10px] font-bold ${
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

const StaffInventoryView = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState({});
  const [query, setQuery] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState("all");
  const [activeTableId, setActiveTableId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState(createEmptyItemForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [tableNameForm, setTableNameForm] = useState("");
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);
  const [categoryNameForm, setCategoryNameForm] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategoryTableId, setActiveCategoryTableId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inventory/tables", {
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

  const API = "http://localhost:5000/api/inventory";

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

    if (!searchValue) return scopedTables;

    return scopedTables
      .map((table) => {
        const tableMatches = table.name.toLowerCase().includes(searchValue);
        if (tableMatches) return table;
        return {
          ...table,
          categories: table.categories
            .map((cat) => {
              const catMatches = cat.name.toLowerCase().includes(searchValue);
              return {
                ...cat,
                items: catMatches
                  ? cat.items
                  : cat.items.filter((item) =>
                      item.name.toLowerCase().includes(searchValue)
                    ),
              };
            })
            .filter(
              (cat) =>
                cat.name.toLowerCase().includes(searchValue) ||
                cat.items.length > 0
            ),
        };
      })
      .filter(
        (table) =>
          table.name.toLowerCase().includes(searchValue) ||
          table.categories.length > 0
      );
  }, [tables, query, selectedTableFilter]);

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

  const openCreateTableModal = () => {
    setTableNameForm("");
    setIsCreateTableOpen(true);
  };

  const closeCreateTableModal = () => {
    setTableNameForm("");
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
        body: JSON.stringify({ name }),
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
      <main className="flex-1 bg-[#f8fafc] px-4 py-9 sm:px-8 lg:px-[32px]">
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A5F]" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-9 sm:px-8 lg:px-[32px]">
      <section className="mb-8">
        <h2 className="text-[34px] font-extrabold leading-tight text-slate-950">
          Inventory
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Track all stock items by category, receipts, issuances, and balances.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <div className="grid gap-4 xl:grid-cols-[repeat(3,minmax(160px,1fr))_repeat(4,minmax(140px,1fr))]">
          <select className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-blue-500">
            <option>Q2</option>
            <option>Q1</option>
            <option>Q3</option>
            <option>Q4</option>
          </select>
          <select className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-blue-500">
            <option>2026</option>
            <option>2025</option>
          </select>
          <select className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-blue-500">
            <option>All Branches</option>
            <option>Community</option>
            <option>Clinic</option>
          </select>
          <ToolbarButton icon="download">PDF</ToolbarButton>
          <ToolbarButton icon="download">Excel</ToolbarButton>
          <ToolbarButton icon="printer">Print</ToolbarButton>
          <ToolbarButton icon="plus" primary>
            Add Transaction
          </ToolbarButton>
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
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none focus:border-blue-500"
            />
          </label>
          <select
            value={selectedTableFilter}
            onChange={handleTableFilterChange}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-blue-500"
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
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-slate-50"
          >
            <Icon name="filter" className="h-4 w-4" />
            More Filters
          </button>
        </div>
      </section>

      <section className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-950">
            Inventory Tables
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {tables.length === 0
              ? "No tables yet. Create one to start tracking inventory."
              : `You have ${tables.length} ${tables.length === 1 ? "table" : "tables"}.`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateTableModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 text-sm font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
            <h4 className="text-lg font-extrabold text-slate-950">
              No Inventory Tables
            </h4>
            <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
              Create your first inventory table to start tracking stock items,
              receipts, issuances, and balances.
            </p>
            <button
              type="button"
              onClick={openCreateTableModal}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-sm font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
              <h3 className="text-lg font-extrabold text-slate-950">
                {table.name}
              </h3>
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
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 text-sm font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              <Icon name="plus" className="h-4 w-4" />
              Add Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full border-collapse text-left text-xs text-slate-950">
              <InventoryTableHeader />
              <tbody>
                {table.categories.length === 0 && (
                  <tr className="border-b border-slate-200 bg-white">
                    <td
                      colSpan={20}
                      className="px-5 py-6 text-center text-sm font-medium text-slate-500"
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
                              className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm font-extrabold text-[#F5C518]"
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
                                className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F5C518] text-[#1E3A5F] px-3 text-xs font-bold transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
                            className="px-5 py-6 text-center text-sm font-medium text-slate-500"
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
                            <td className="px-4 py-2.5 text-xs font-semibold">
                              {item.name}
                            </td>
                            <td className="px-2 py-2.5 text-right text-xs">
                              {formatNumber(item.beginning)}
                            </td>
                            {item.receipts.map((value, index) => (
                              <td
                                key={`${item._id}-receipt-${index}`}
                                className={`px-1.5 py-2.5 text-right text-[11px] ${
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
                                className={`px-1.5 py-2.5 text-right text-[11px] ${
                                  index === issuanceColumns.length - 1
                                    ? "bg-rose-100 font-extrabold"
                                    : "bg-rose-50"
                                }`}
                              >
                                {formatNumber(value)}
                              </td>
                            ))}
                            <td className="px-2 py-2.5 text-right text-xs font-extrabold">
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
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Create Table
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
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

            <form onSubmit={handleCreateTable} className="px-6 py-5">
              <label className="block">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Table Name
                </span>
                <input
                  value={tableNameForm}
                  onChange={(event) => setTableNameForm(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                  placeholder="Enter table name"
                  required
                />
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateTableModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-sm font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Add Category
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
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

            <form onSubmit={handleCreateCategory} className="px-6 py-5">
              <label className="block">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Category Name
                </span>
                <input
                  value={categoryNameForm}
                  onChange={(event) => setCategoryNameForm(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-sm font-bold text-[#152c4a] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  {modalMode === "edit"
                    ? `Edit ${editingItem?.name || itemForm.name}`
                    : `Add Item to ${activeCategory.name}`}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
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

            <form onSubmit={handleSaveItem} className="overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                <label className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">
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
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                    placeholder="Enter item or brand name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">
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
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-4 text-right text-sm font-semibold text-slate-950 outline-none focus:border-blue-500"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <fieldset className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                  <legend className="px-2 text-sm font-extrabold text-emerald-700">
                    Receipts
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {receiptInputColumns.map((column) => (
                      <label
                        key={`modal-receipt-${column.label}`}
                        className="block"
                      >
                        <span className="text-xs font-bold text-slate-600">
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
                          className="mt-1 h-10 w-full rounded-lg border border-emerald-200 bg-white px-3 text-right text-sm font-semibold text-slate-950 outline-none focus:border-emerald-500"
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
                  <legend className="px-2 text-sm font-extrabold text-rose-700">
                    Issuances
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {issuanceInputColumns.map((column) => (
                      <label
                        key={`modal-issuance-${column.label}`}
                        className="block"
                      >
                        <span className="text-xs font-bold text-slate-600">
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
                          className="mt-1 h-10 w-full rounded-lg border border-rose-200 bg-white px-3 text-right text-sm font-semibold text-slate-950 outline-none focus:border-rose-500"
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddItemModal}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-6 text-sm font-bold text-[#1E3A5F] transition-all hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
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
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-extrabold text-slate-950">
                Delete Item
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-extrabold text-slate-950">
                  {deleteTarget.item.name}
                </span>
                ? This will remove it from the current inventory list.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 px-6 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-bold text-white transition hover:bg-red-700"
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
