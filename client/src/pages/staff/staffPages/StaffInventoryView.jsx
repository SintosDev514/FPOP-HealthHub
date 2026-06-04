import React, { useMemo, useState } from "react";

const receiptColumns = ["NW", "OA", "LP", "FC", "RCBV", "Total"];
const issuanceColumns = [
  "PP",
  "Gov",
  "OA",
  "CBV",
  "Clinic",
  "Out/Mob",
  "OFC",
  "Exp/Promo",
  "Total",
];

const inventoryGroups = [
  {
    id: "pills",
    title: "PILLS (14 ITEMS)",
    items: [
      row("Exluton (IPPF)", 150, [100, 0, 0, 0, 0], [20, 30, 0, 10, 25, 15, 0, 0]),
      row("Exluton (DOH)", 200, [150, 0, 0, 0, 5], [30, 40, 0, 15, 35, 20, 0, 0]),
      row("Marvelon", 180, [120, 10, 25, 0, 3], [25, 35, 5, 12, 30, 18, 2, 0]),
      row("Protec Pills", 220, [150, 0, 30, 5, 0], [35, 45, 0, 20, 40, 25, 3, 0]),
      row("Femme Pills", 190, [130, 0, 20, 0, 2], [28, 38, 0, 15, 32, 20, 1, 0]),
      row("Charlize", 160, [110, 5, 15, 0, 0], [22, 32, 3, 13, 28, 17, 2, 0]),
      row("Trust Pills", 240, [180, 0, 35, 10, 0], [40, 50, 0, 25, 45, 30, 5, 0]),
      row("Lady Pills", 170, [120, 0, 18, 0, 4], [26, 36, 0, 14, 30, 19, 2, 0]),
      row("Daphne", 210, [140, 10, 28, 0, 0], [32, 42, 5, 18, 38, 23, 3, 0]),
      row("Althea Pills", 185, [125, 0, 22, 5, 3], [29, 39, 0, 16, 33, 21, 2, 0]),
      row("Ruby", 195, [135, 5, 24, 0, 0], [31, 41, 3, 17, 35, 22, 2, 0]),
      row("Roselle", 175, [115, 0, 20, 0, 5], [27, 37, 0, 14, 31, 20, 1, 0]),
      row("Micropil", 165, [110, 0, 17, 0, 2], [24, 34, 0, 13, 29, 18, 2, 0]),
      row("Triquilar", 155, [105, 5, 16, 0, 0], [23, 33, 2, 12, 27, 17, 1, 0]),
    ],
  },
  {
    id: "iud",
    title: "IUD (2 ITEMS)",
    items: [
      row("Copper T-380A (IPPF)", 50, [30, 0, 0, 0, 2], [5, 10, 0, 3, 8, 5, 0, 0]),
      row("Copper T-380A (DOH)", 65, [40, 5, 0, 0, 1], [7, 12, 2, 4, 10, 6, 0, 0]),
    ],
  },
  {
    id: "condom",
    title: "CONDOM (8 ITEMS)",
    items: [
      row("Protec", 5000, [2000, 500, 0, 0, 0], [200, 500, 100, 300, 400, 600, 50, 0]),
      row("DOH-Condom", 4500, [1800, 400, 0, 0, 0], [180, 450, 90, 270, 360, 540, 45, 0]),
      row("Nulatex - Smooth", 3800, [1500, 300, 200, 0, 0], [150, 380, 80, 230, 300, 450, 40, 0]),
      row("Nulatex - Sensitive", 3600, [1400, 280, 180, 0, 0], [140, 360, 75, 220, 290, 430, 38, 0]),
      row("Trust Condom - Ultra Thin", 4200, [1700, 350, 250, 0, 0], [170, 420, 85, 260, 340, 510, 42, 0]),
      row("Trust Condom - REGULAR", 4800, [1900, 450, 0, 0, 0], [190, 480, 95, 290, 380, 570, 48, 0]),
      row("Trust Condom - Powder Fresh", 4100, [1650, 330, 220, 0, 0], [165, 410, 83, 250, 330, 490, 41, 0]),
      row("NightRider", 3900, [1550, 310, 190, 0, 0], [155, 390, 78, 240, 315, 470, 39, 0]),
    ],
  },
  {
    id: "injectable",
    title: "INJECTABLE (7 ITEMS)",
    items: [
      row("DMPA (IPPF)", 300, [150, 0, 50, 0, 0], [40, 60, 10, 20, 50, 30, 10, 2], "Expiring Soon"),
      row("Norifam (165.00)", 250, [120, 0, 40, 5, 0], [35, 50, 8, 18, 42, 25, 8, 1]),
      row("Lyndavel (Local Purchased 64.38)", 280, [0, 0, 140, 0, 0], [38, 56, 9, 19, 47, 28, 9, 1]),
      row("Lyndavel", 270, [135, 0, 45, 0, 0], [37, 54, 9, 19, 45, 27, 9, 1]),
      row("Depo Gestlin", 260, [125, 5, 38, 0, 0], [36, 52, 8, 18, 43, 26, 8, 1]),
      row("Protec DMPA (Local Purchased)", 290, [0, 0, 145, 0, 0], [39, 58, 10, 20, 48, 29, 10, 2]),
      row("Medroxin", 240, [115, 0, 35, 5, 0], [34, 48, 7, 17, 40, 24, 7, 1]),
    ],
  },
  {
    id: "implant",
    title: "IMPLANT (1 ITEMS)",
    items: [
      row("Implanon", 80, [50, 0, 0, 0, 0], [10, 15, 0, 5, 12, 8, 0, 0]),
    ],
  },
];

function row(name, beginning, receipts, issuances, status = "In Stock") {
  const receiptTotal = receipts.reduce((sum, value) => sum + value, 0);
  const issuanceTotal = issuances.reduce((sum, value) => sum + value, 0);

  return {
    name,
    beginning,
    receipts: [...receipts, receiptTotal],
    issuances: [...issuances, issuanceTotal],
    ending: beginning + receiptTotal - issuanceTotal,
    status,
  };
}

const Icon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    box: "m21 8-9-5-9 5m18 0-9 5m9-5v13m0-13L3 8m9 5 9-5M3 8v8l9 5 9-5V8",
    tray: "M6 4h12v6H6V4Zm0 10h12v6H6v-6Zm4-7h4m-4 10h4",
    trend: "m4 16 6-6 4 4 6-8M15 6h5v5",
    warning: "M12 9v4m0 4h.01M10.3 4.3 2.1 18a2 2 0 0 0 1.7 3h16.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z",
    info: "M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    filter: "M4 5h16l-6 7v5l-4 2v-7L4 5Z",
    download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
    printer: "M7 8V4h10v4M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1M7 14h10v6H7v-6Z",
    plus: "M12 5v14M5 12h14",
    chevron: "m9 18 6-6-6-6",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z",
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

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const statCards = [
  { label: "Total Inventory Items", value: "32", icon: "box", tone: "blue" },
  { label: "Total Available Stocks", value: "41,406", icon: "tray", tone: "green" },
  {
    label: "Total Receipts This Quarter",
    value: "20,880",
    icon: "trend",
    tone: "indigo",
    detail: "Items received",
  },
  {
    label: "Total Issuances This Quarter",
    value: "18,054",
    icon: "trend",
    tone: "purple",
    detail: "Items distributed",
  },
  {
    label: "Expiring Soon",
    value: "1",
    icon: "warning",
    tone: "amber",
    detail: "Needs attention",
    featured: true,
  },
  { label: "Low Stock", value: "0", icon: "warning", tone: "orange", detail: "All good" },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-500",
  orange: "bg-orange-50 text-orange-600",
};

const StatusBadge = ({ status }) => {
  const isExpiring = status === "Expiring Soon";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
        isExpiring
          ? "bg-amber-100 text-amber-700"
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

const StaffInventoryView = () => {
  const [openGroups, setOpenGroups] = useState({
    pills: true,
    iud: false,
    condom: false,
    injectable: false,
    implant: false,
  });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visibleGroups = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    return inventoryGroups
      .filter((group) => category === "All" || group.title.startsWith(category))
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!searchValue) return true;
          return (
            item.name.toLowerCase().includes(searchValue) ||
            group.title.toLowerCase().includes(searchValue)
          );
        }),
      }));
  }, [category, query]);

  const toggleGroup = (id) => {
    setOpenGroups((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

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

      <section className="mb-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-7 text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
          <Icon name="info" className="mt-1 h-6 w-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold">
              How to Use Inventory Management
            </h3>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <p className="font-bold">1. View Stock Status</p>
                <p className="mt-2">Click any row to highlight and view details</p>
              </div>
              <div>
                <p className="font-bold">2. Add Transactions</p>
                <p className="mt-2">
                  Click "Add Transaction" to record receipts or issuances
                </p>
              </div>
              <div>
                <p className="font-bold">3. Monitor Alerts</p>
                <p className="mt-2">Watch for low stock and expiring items below</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px_150px]">
          <label className="relative block">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name or category..."
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none focus:border-blue-500"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>PILLS</option>
            <option>IUD</option>
            <option>CONDOM</option>
            <option>INJECTABLE</option>
            <option>IMPLANT</option>
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

      <section className="mb-4 flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <p>
          <span className="font-bold">Column Abbreviations:</span> NW = National
          Warehouse, OA = Other Agency, LP = Local Purchase, FC = FPOP Clinic,
          RCBV = Returned by CBV, PP = Private Physicians, Gov = Government, CBV
          = Community Based Volunteers, Out/Mob = Outreach/Mobile, OFC = Other
          FPOP Clinics, Exp/Promo = Expired/Promo
        </p>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1460px] w-full border-collapse text-left text-xs text-slate-950">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th rowSpan="2" className="w-[230px] px-5 py-4 font-semibold">
                  TYPE / BRAND
                </th>
                <th rowSpan="2" className="w-[145px] px-4 py-4 text-right font-semibold">
                  BEGINNING BALANCE
                </th>
                <th
                  colSpan={6}
                  className="bg-emerald-50 px-4 py-4 text-center font-semibold"
                >
                  RECEIPTS
                </th>
                <th
                  colSpan={9}
                  className="bg-rose-50 px-4 py-4 text-center font-semibold"
                >
                  ISSUANCES
                </th>
                <th rowSpan="2" className="w-[145px] px-4 py-4 text-right font-semibold">
                  ENDING BALANCE
                </th>
                <th rowSpan="2" className="w-[120px] px-4 py-4 text-center font-semibold">
                  STATUS
                </th>
                <th rowSpan="2" className="w-[90px] px-4 py-4 text-center font-semibold">
                  ACTIONS
                </th>
              </tr>
              <tr className="border-b border-slate-300 bg-white">
                {receiptColumns.map((column) => (
                  <th
                    key={`receipt-${column}`}
                    className={`px-3 py-3 text-right font-bold ${
                      column === "Total" ? "bg-emerald-100" : "bg-emerald-50"
                    }`}
                  >
                    {column}
                  </th>
                ))}
                {issuanceColumns.map((column) => (
                  <th
                    key={`issuance-${column}`}
                    className={`px-3 py-3 text-right font-bold ${
                      column === "Total" ? "bg-rose-100" : "bg-rose-50"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleGroups.map((group) => {
                const isOpen = openGroups[group.id];

                return (
                  <React.Fragment key={group.id}>
                    <tr className="border-y border-slate-300 bg-slate-100">
                      <td colSpan={20} className="px-4 py-0">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          className="flex h-11 w-full items-center gap-3 text-left text-sm font-extrabold text-slate-950"
                        >
                          <Icon
                            name="chevron"
                            className={`h-4 w-4 transition-transform ${
                              isOpen ? "rotate-90" : ""
                            }`}
                          />
                          {group.title}
                        </button>
                      </td>
                    </tr>
                    {isOpen &&
                      group.items.map((item) => (
                        <tr
                          key={`${group.id}-${item.name}`}
                          className="border-b border-slate-200 bg-white transition hover:bg-blue-50/40"
                        >
                          <td className="px-5 py-4 text-sm font-semibold">{item.name}</td>
                          <td className="px-4 py-4 text-right">{formatNumber(item.beginning)}</td>
                          {item.receipts.map((value, index) => (
                            <td
                              key={`${item.name}-receipt-${index}`}
                              className={`px-3 py-4 text-right ${
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
                              key={`${item.name}-issuance-${index}`}
                              className={`px-3 py-4 text-right ${
                                index === issuanceColumns.length - 1
                                  ? "bg-rose-100 font-extrabold"
                                  : "bg-rose-50"
                              }`}
                            >
                              {formatNumber(value)}
                            </td>
                          ))}
                          <td className="px-4 py-4 text-right font-extrabold">
                            {formatNumber(item.ending)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
                              aria-label={`Edit ${item.name}`}
                            >
                              <Icon name="edit" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing 1 to 10 of 32 items</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
              aria-label="Previous page"
            >
              <Icon name="chevron" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              aria-label="Next page"
            >
              <Icon name="chevron" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StaffInventoryView;
