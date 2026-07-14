import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";

const Icon = ({ name, className = "h-5 w-5" }) => {
  const paths = {
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    clipboard:
      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6M9 17h6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Zm11-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    chevronLeft: "m15 18-6-6 6-6",
    chevronRight: "m9 18 6-6-6-6",
    download: "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
    users:
      "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 1 1-8 0m8 0c2.2.5 4 2 4 4v1M8 11c-2.2.5-4 2-4 4v1M18 8.5a3 3 0 0 1 0 5M6 8.5a3 3 0 0 0 0 5",
    shield:
      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    heart:
      "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    x: "M18 6 6 18M6 6l12 12",
    printer: "M7 8V4h10v4M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1M7 14h10v6H7v-6Z",
    activity:
      "M22 12h-4l-3 9L9 3l-3 9H2",
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

const FORM_TYPE_LABEL = { fp: "FP Assessment", hiv: "HIV Testing (HTS)" };
const FORM_TYPE_TONE = {
  fp: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  hiv: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "\u2014";
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
};

const val = (v) => {
  if (v === undefined || v === null || v === "") return "\u2014";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
};

const StaffAssessmentInventory = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, fp: 0, hiv: 0 });

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (search.trim()) params.set("search", search.trim());
      if (typeFilter !== "all") params.set("formType", typeFilter);

      const res = await fetch(
        `${__API_BASE__}/api/assessments?${params.toString()}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setAssessments(data.assessments);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, fpRes, hivRes] = await Promise.all([
        fetch(`${__API_BASE__}/api/assessments?limit=1`, {
          credentials: "include",
        }),
        fetch(`${__API_BASE__}/api/assessments?limit=1&formType=fp`, {
          credentials: "include",
        }),
        fetch(`${__API_BASE__}/api/assessments?limit=1&formType=hiv`, {
          credentials: "include",
        }),
      ]);
      const [all, fp, hiv] = await Promise.all([
        allRes.json(),
        fpRes.json(),
        hivRes.json(),
      ]);
      setStats({
        total: all.total || 0,
        fp: fp.total || 0,
        hiv: hiv.total || 0,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const openDetail = async (id) => {
    try {
      setDetailLoading(true);
      setDetailModal(null);
      const res = await fetch(`${__API_BASE__}/api/assessments/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setDetailModal(data.assessment);
      }
    } catch (err) {
      console.error("Failed to load assessment detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const getKeyInfo = (a) => {
    if (a.formType === "hiv") {
      const fd = a.formData;
      return fd?.result
        ? fd.result.charAt(0).toUpperCase() + fd.result.slice(1)
        : "\u2014";
    }
    const fd = a.formData;
    if (fd?.clientType?.method) return fd.clientType.method;
    if (fd?.clientType?.type) return fd.clientType.type;
    return "\u2014";
  };

  const getClientAddress = (fd) => {
    if (!fd) return "";
    const ci = fd.clientInfo || fd;
    return [ci.houseUnitNo, ci.street, ci.barangay, ci.municipalityCity, ci.province]
      .filter(Boolean)
      .join(", ");
  };

  const buildPDF = (a) => {
    const fd = a.formData || {};
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 40;

    const drawHeader = () => {
      doc.setFillColor(30, 58, 95);
      doc.rect(0, 0, pageW, 72, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("FPOP HealthHub", margin, 30);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        a.formType === "fp"
          ? "Family Planning Assessment Record"
          : "HIV Testing (HTS) Assessment Record",
        margin,
        48
      );

      doc.setFontSize(8);
      doc.text(`Date Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW - margin, 30, { align: "right" });
      doc.text(`Record ID: ${a._id}`, pageW - margin, 44, { align: "right" });

      y = 90;
    };

    const sectionTitle = (title) => {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 4, pageW - margin * 2, 22, "F");
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 4, pageW - margin, y - 4);
      doc.line(margin, y + 18, pageW - margin, y + 18);
      doc.setTextColor(30, 58, 95);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(title.toUpperCase(), margin + 6, y + 12);
      y += 30;
    };

    const fieldRow = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(label, margin + 6, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(val(value), margin + 140, y);
      y += 16;
    };

    const checkPage = (needed = 40) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage("a4", "portrait");
        y = 40;
        return true;
      }
      return false;
    };

    const footer = () => {
      const h = doc.internal.pageSize.getHeight();
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, h - 28, pageW - margin, h - 28);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.text("FPOP HealthHub \u2014 Assessment Record", margin, h - 16);
      doc.text(
        `Page ${doc.getCurrentPageInfo().pageNumber}`,
        pageW - margin,
        h - 16,
        { align: "right" }
      );
    };

    drawHeader();

    if (a.formType === "fp") {
      const ci = fd.clientInfo || {};
      const ct = fd.clientType || {};
      const mh = fd.medicalHistory || {};
      const ob = fd.obstetrical || {};
      const pe = fd.physicalExam || {};
      const vr = fd.visitRecords || {};

      sectionTitle("Client Information");
      fieldRow("Client ID", ci.clientId);
      fieldRow("Name", `${ci.lastName || ""}, ${ci.firstName || ""} ${ci.middleName || ""}`.trim());
      fieldRow("Date of Birth", ci.dob);
      fieldRow("Age", ci.age);
      fieldRow("Contact", ci.contact);
      fieldRow("Civil Status", ci.civilStatus);
      fieldRow("Religion", ci.religion);
      fieldRow("Address", getClientAddress(fd));
      fieldRow("PhilHealth", ci.philhealth);
      fieldRow("NHTS", ci.nhts);
      fieldRow("4Ps", ci.fourPs);
      fieldRow("Spouse Name", [ci.spouseLastName, ci.spouseFirstName, ci.spouseMiddleName].filter(Boolean).join(", "));
      fieldRow("Spouse Occupation", ci.spouseOccupation);
      fieldRow("Education", ci.educationalAttainment);
      fieldRow("Occupation", ci.occupation);

      checkPage(60);
      sectionTitle("Client Type");
      fieldRow("Type", ct.type);
      fieldRow("FP Reason", ct.fpReason);
      fieldRow("Method", ct.method);
      fieldRow("Medical Condition", ct.medicalCondition);
      fieldRow("Side Effects", ct.sideEffects);
      fieldRow("Notes", ct.additionalNotes);

      checkPage(60);
      sectionTitle("Medical History");
      fieldRow("Severe Headaches", mh.severeHeadaches);
      fieldRow("Stroke / Hypertension", mh.strokeHeartHypertension);
      fieldRow("Frequent Bruising / Bleeding", mh.frequentBruisingBleeding);
      fieldRow("Breast Cancer / Mass", mh.breastCancerMass);
      fieldRow("Severe Chest Pain", mh.severeChestPain);
      fieldRow("Cough > 14 Days", mh.coughMoreThan14Days);
      fieldRow("Jaundice", mh.jaundice);
      fieldRow("Unexplained Vaginal Bleeding", mh.unexplainedVaginalBleeding);
      fieldRow("Abnormal Vaginal Discharge", mh.abnormalVaginalDischarge);
      fieldRow("Phenobarbital / Rifampicin", mh.phenobarbitalRifampicin);
      fieldRow("Smoker", mh.smoker);
      fieldRow("With Disability", mh.withDisability);
      fieldRow("Disability Details", mh.disabilityDetails);

      checkPage(60);
      sectionTitle("Obstetrical History");
      fieldRow("Gravida", ob.gravida);
      fieldRow("Parity", ob.parity);
      fieldRow("Full Term", ob.term);
      fieldRow("Premature", ob.premature);
      fieldRow("Abortions", ob.abortion);
      fieldRow("Living Children", ob.living);
      fieldRow("Last Delivery Date", ob.lastDeliveryDate);
      fieldRow("Last Delivery Type", ob.lastDeliveryType);
      fieldRow("LMP", ob.lmp);
      fieldRow("Menstrual Flow", ob.menstrualFlow);
      fieldRow("Dysmenorrhea", ob.dysmenorrhea);

      checkPage(60);
      sectionTitle("Physical Examination");
      fieldRow("Weight", pe.weight ? `${pe.weight} kg` : "\u2014");
      fieldRow("Blood Pressure", pe.bp ? `${pe.bp} mmHg` : "\u2014");
      fieldRow("Height", pe.height ? `${pe.height} m` : "\u2014");
      fieldRow("Pulse Rate", pe.pulse ? `${pe.pulse} /min` : "\u2014");
      fieldRow("Additional Notes", pe.additionalNotes);

      if (vr.visitDate || vr.nextVisit || vr.services || vr.provider) {
        checkPage(60);
        sectionTitle("Visit Record");
        fieldRow("Visit Date", vr.visitDate);
        fieldRow("Next Visit", vr.nextVisit);
        fieldRow("Services", vr.services);
        fieldRow("Meds", vr.meds);
        fieldRow("Provider", vr.provider);
        fieldRow("Remarks", vr.remarks);
      }
    } else {
      sectionTitle("Consent & Demographics");
      fieldRow("Client Name", fd.clientName);
      fieldRow("Contact Number", fd.contactNumber);
      fieldRow("Email", fd.email);
      fieldRow("Sex", fd.sex);
      fieldRow("Gender Identity", fd.gender);
      fieldRow("Civil Status", fd.civilStatus);
      fieldRow("Age", fd.age);
      fieldRow("Date of Birth", [fd.dobMonth, fd.dobDay, fd.dobYear].filter(Boolean).join("/"));

      checkPage(60);
      sectionTitle("Location");
      fieldRow("Current City", fd.currentCity);
      fieldRow("Current Province", fd.currentProvince);
      fieldRow("Permanent City", fd.permCity);
      fieldRow("Permanent Province", fd.permProvince);
      fieldRow("Birth City", fd.birthCity);
      fieldRow("Birth Province", fd.birthProvince);
      fieldRow("Nationality", fd.nationality);

      checkPage(60);
      sectionTitle("Personal Background");
      fieldRow("In School", fd.inSchool);
      fieldRow("Currently Working", fd.currentlyWorking);
      fieldRow("Occupation", fd.occupation);
      fieldRow("Has Partner", fd.hasPartner);
      fieldRow("Number of Children", fd.numChildren);
      fieldRow("Pregnant", fd.pregnant);

      checkPage(60);
      sectionTitle("Risk Assessment");
      fieldRow("Sub-population", fd.popGroup);
      fieldRow("Reason for Testing", fd.reason);
      fieldRow("Previous HIV Test", fd.prevTest);
      fieldRow("Previous Test Date", fd.prevTestDate);

      checkPage(60);
      sectionTitle("Medical History");
      fieldRow("Unusual Discharge", fd.unusualDischarge);
      fieldRow("Sores / Rashes", fd.soresRashes);
      fieldRow("Pain on Urination", fd.painUrination);
      fieldRow("History of STI", fd.historySTI);
      fieldRow("TB History", fd.tbHistory);

      checkPage(60);
      sectionTitle("Test Information");
      fieldRow("Test Kit", fd.kitName);
      fieldRow("Lot Number", fd.lotNo);
      fieldRow("Expiry Date", fd.expiryDate);
      fieldRow("Date of Test", fd.dateOfTest);
      fieldRow("Screening Result", fd.result);
      fieldRow("Confirmatory Date", fd.confirmatoryDate);
      fieldRow("Confirmatory Result", fd.confirmatoryResult);
      fieldRow("Referral", fd.referral);
      fieldRow("Follow-up Date", fd.followUpDate);
      fieldRow("Provider", fd.provider);
      fieldRow("Remarks", fd.remarks);
    }

    y += 10;
    checkPage(30);
    sectionTitle("Submitted By");
    fieldRow("Submitted By", a.submittedBy?.name || a.submittedBy?.email || "\u2014");
    fieldRow("Submitted At", formatDateTime(a.submittedAt));

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      footer();
    }

    const clientName = (a.clientLastName || "unknown").replace(/\s+/g, "_");
    const ts = new Date(a.submittedAt || Date.now())
      .toISOString()
      .slice(0, 10);
    doc.save(`assessment_${a.formType}_${clientName}_${ts}.pdf`);
  };

  const statCards = [
    {
      label: "Total Records",
      value: stats.total,
      icon: "clipboard",
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "FP Assessments",
      value: stats.fp,
      icon: "heart",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "HIV Assessments",
      value: stats.hiv,
      icon: "activity",
      tone: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 sm:px-8 lg:px-[32px] overflow-y-auto overflow-x-hidden min-w-0 py-9">
      {/* ── Page Header ── */}
      <section className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A5F]">
            <Icon name="clipboard" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold leading-tight text-slate-950">
              Assessment Logs
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-slate-500">
              Search, view, and download submitted FP and HIV assessment forms.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Cards ── */}
      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statCards.map((c) => (
          <article
            key={c.label}
            className="group relative min-h-[120px] overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] transition hover:shadow-[0_4px_20px_rgba(15,23,42,0.10)]"
          >
            <div className="flex items-start justify-between">
                <div>
                  <p className="text-[18px] font-extrabold leading-none text-slate-950">
                    {c.value}
                  </p>
                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                    {c.label}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tone}`}
                >
                  <Icon name={c.icon} className="h-5 w-5" />
                </div>
              </div>
          </article>
        ))}
      </section>

      {/* ── Search & Filters ── */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1 block">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name or ID..."
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-[10px] text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </label>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All Types", icon: null },
              { value: "fp", label: "FP", icon: "heart" },
              { value: "hiv", label: "HIV", icon: "activity" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTypeFilter(opt.value)}
                className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-[10px] font-bold transition-all ${
                  typeFilter === opt.value
                    ? "bg-[#1E3A5F] text-white shadow-md shadow-[#1E3A5F]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.icon && <Icon name={opt.icon} className="h-3.5 w-3.5" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.07)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A5F]" />
            <p className="text-[9px] font-medium text-slate-400">Loading records...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Icon name="clipboard" className="h-8 w-8 text-slate-300" />
            </div>
            <h4 className="text-[11px] font-extrabold text-slate-950">
              {search.trim() ? "No matching records found" : "No Assessment Records"}
            </h4>
            <p className="mt-2 max-w-sm text-[10px] font-medium text-slate-500">
              {search.trim()
                ? `No assessments match "${search.trim()}". Try a different search.`
                : "Submitted assessments will appear here once clients complete the form."}
            </p>
          </div>
        ) : (
          <>
            {/* Table header bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-5 py-3">
              <p className="text-[9px] font-semibold text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {(page - 1) * 15 + 1}\u2013{Math.min(page * 15, total)}
                </span>{" "}
                of <span className="font-bold text-slate-700">{total}</span> records
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-[#4E6E85]">
                  <tr>
                    <th className="px-5 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-white">
                      Client Name
                    </th>
                    <th className="px-5 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-white">
                      Form Type
                    </th>
                    <th className="px-5 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-white">
                      Key Info
                    </th>
                    <th className="px-5 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-white">
                      Submitted
                    </th>
                    <th className="px-5 py-3 text-center text-[8px] font-bold uppercase tracking-wider text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {assessments.map((a, idx) => {
                    const tone = FORM_TYPE_TONE[a.formType] || {
                      bg: "bg-slate-100",
                      text: "text-slate-600",
                      dot: "bg-slate-400",
                    };
                    return (
                      <tr
                        key={a._id}
                        className={`transition hover:bg-blue-50/50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-[10px] font-bold text-slate-900">
                            {a.clientLastName || "\u2014"}
                            {a.clientFirstName
                              ? `, ${a.clientFirstName}`
                              : ""}
                          </p>
                          {a.clientId && (
                            <p className="text-[8px] text-slate-400 mt-0.5">
                              ID: {a.clientId}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold ${tone.bg} ${tone.text}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                            {FORM_TYPE_LABEL[a.formType] || a.formType}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[9px] font-medium text-slate-600">
                          {getKeyInfo(a)}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[9px] font-semibold text-slate-700">
                            {formatDate(a.submittedAt)}
                          </p>
                          <p className="text-[8px] text-slate-400">
                            {formatTime(a.submittedAt)}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openDetail(a._id)}
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold text-[#1E3A5F] transition hover:border-[#1E3A5F] hover:bg-blue-50"
                              title="View details"
                            >
                              <Icon name="eye" className="h-3.5 w-3.5" />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => buildPDF(a)}
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
                              title="Download PDF"
                            >
                              <Icon name="download" className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3">
                <p className="text-[9px] font-medium text-slate-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[9px] font-bold transition ${
                      page <= 1
                        ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                        : "border-slate-300 text-slate-600 bg-white hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                    }`}
                  >
                    <Icon name="chevronLeft" className="h-4 w-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[9px] font-bold transition ${
                          pageNum === page
                            ? "border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-md"
                            : "border-slate-300 text-slate-600 bg-white hover:border-[#1E3A5F]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[9px] font-bold transition ${
                      page >= totalPages
                        ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                        : "border-slate-300 text-slate-600 bg-white hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                    }`}
                  >
                    <Icon name="chevronRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Detail Modal ── */}
      {(detailModal || detailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailModal(null);
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-[#1E3A5F] to-[#2a4f7a] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[12px] font-extrabold text-white">
                    {detailModal
                      ? `${detailModal.clientLastName || ""}, ${detailModal.clientFirstName || ""}`.trim() || "Assessment Record"
                      : "Loading..."}
                  </h3>
                  <p className="mt-1 text-[10px] font-medium text-blue-200">
                    {detailModal
                      ? `${FORM_TYPE_LABEL[detailModal.formType] || detailModal.formType} \u2014 ${formatDateTime(detailModal.submittedAt)}`
                      : "Fetching assessment data..."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {detailModal && (
                    <button
                      type="button"
                      onClick={() => buildPDF(detailModal)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white/15 px-4 text-[10px] font-bold text-white transition hover:bg-white/25"
                      title="Download PDF"
                    >
                      <Icon name="download" className="h-4 w-4" />
                      PDF
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDetailModal(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/15 hover:text-white"
                  >
                    <Icon name="x" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {detailLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A5F]" />
                  <p className="text-[9px] font-medium text-slate-400">Loading assessment data...</p>
                </div>
              )}
              {detailModal && renderDetailContent(detailModal)}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
              <p className="text-[8px] text-slate-400">
                Record ID: {detailModal?._id}
              </p>
              <div className="flex gap-2">
                {detailModal && (
                  <button
                    type="button"
                    onClick={() => buildPDF(detailModal)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-[10px] font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Download PDF
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDetailModal(null)}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-200 px-6 text-[10px] font-bold text-slate-950 transition hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );

  function renderDetailContent(a) {
    const fd = a.formData || {};
    if (a.formType === "fp") return renderFPDetail(fd);
    return renderHIVDetail(fd);
  }

  function renderFPDetail(fd) {
    const sections = [
      {
        title: "Client Information",
        icon: "users",
        color: "text-blue-600",
        accent: "from-blue-500 to-blue-400",
        fields: [
          ["Client ID", fd.clientInfo?.clientId],
          ["Name", `${fd.clientInfo?.lastName || ""}, ${fd.clientInfo?.firstName || ""} ${fd.clientInfo?.middleName || ""}`.trim()],
          ["Date of Birth", fd.clientInfo?.dob],
          ["Age", fd.clientInfo?.age],
          ["Contact", fd.clientInfo?.contact],
          ["Civil Status", fd.clientInfo?.civilStatus],
          ["Religion", fd.clientInfo?.religion],
          ["Address", (() => {
            const ci = fd.clientInfo || {};
            return [ci.houseUnitNo, ci.street, ci.barangay, ci.municipalityCity, ci.province].filter(Boolean).join(", ");
          })()],
          ["PhilHealth", fd.clientInfo?.philhealth],
          ["NHTS", fd.clientInfo?.nhts],
          ["4Ps", fd.clientInfo?.fourPs],
          ["Education", fd.clientInfo?.educationalAttainment],
          ["Occupation", fd.clientInfo?.occupation],
        ],
      },
      {
        title: "Spouse Information",
        icon: "users",
        color: "text-pink-600",
        accent: "from-pink-500 to-pink-400",
        fields: [
          ["Spouse Name", [fd.clientInfo?.spouseLastName, fd.clientInfo?.spouseFirstName, fd.clientInfo?.spouseMiddleName].filter(Boolean).join(", ")],
          ["Spouse Age", fd.clientInfo?.spouseAge],
          ["Spouse Occupation", fd.clientInfo?.spouseOccupation],
          ["Living Children", fd.clientInfo?.livingChildren],
          ["Plan More Children", fd.clientInfo?.planMoreChildren],
          ["Average Monthly Income", fd.clientInfo?.averageMonthlyIncome],
        ],
      },
      {
        title: "Client Type",
        icon: "file",
        color: "text-emerald-600",
        accent: "from-emerald-500 to-emerald-400",
        fields: [
          ["Client Type", fd.clientType?.type],
          ["FP Reason", fd.clientType?.fpReason],
          ["Method", fd.clientType?.method],
          ["Medical Condition", fd.clientType?.medicalCondition],
          ["Side Effects", fd.clientType?.sideEffects],
          ["Additional Notes", fd.clientType?.additionalNotes],
        ],
      },
      {
        title: "Medical History",
        icon: "heart",
        color: "text-rose-600",
        accent: "from-rose-500 to-rose-400",
        fields: [
          ["Severe Headaches", fd.medicalHistory?.severeHeadaches],
          ["Stroke / Hypertension", fd.medicalHistory?.strokeHeartHypertension],
          ["Frequent Bruising / Bleeding", fd.medicalHistory?.frequentBruisingBleeding],
          ["Breast Cancer / Mass", fd.medicalHistory?.breastCancerMass],
          ["Severe Chest Pain", fd.medicalHistory?.severeChestPain],
          ["Cough > 14 Days", fd.medicalHistory?.coughMoreThan14Days],
          ["Jaundice", fd.medicalHistory?.jaundice],
          ["Unexplained Vaginal Bleeding", fd.medicalHistory?.unexplainedVaginalBleeding],
          ["Abnormal Vaginal Discharge", fd.medicalHistory?.abnormalVaginalDischarge],
          ["Smoker", fd.medicalHistory?.smoker],
          ["With Disability", fd.medicalHistory?.withDisability],
          ["Disability Details", fd.medicalHistory?.disabilityDetails],
        ],
      },
      {
        title: "Obstetrical History",
        icon: "clipboard",
        color: "text-amber-600",
        accent: "from-amber-500 to-amber-400",
        fields: [
          ["Gravida", fd.obstetrical?.gravida],
          ["Parity", fd.obstetrical?.parity],
          ["Full Term", fd.obstetrical?.term],
          ["Premature", fd.obstetrical?.premature],
          ["Abortions", fd.obstetrical?.abortion],
          ["Living Children", fd.obstetrical?.living],
          ["Last Delivery Date", fd.obstetrical?.lastDeliveryDate],
          ["Last Delivery Type", fd.obstetrical?.lastDeliveryType],
          ["LMP", fd.obstetrical?.lmp],
          ["Menstrual Flow", fd.obstetrical?.menstrualFlow],
          ["Dysmenorrhea", fd.obstetrical?.dysmenorrhea],
        ],
      },
      {
        title: "Physical Examination",
        icon: "shield",
        color: "text-indigo-600",
        accent: "from-indigo-500 to-indigo-400",
        fields: [
          ["Weight", fd.physicalExam?.weight ? `${fd.physicalExam.weight} kg` : "\u2014"],
          ["Blood Pressure", fd.physicalExam?.bp ? `${fd.physicalExam.bp} mmHg` : "\u2014"],
          ["Height", fd.physicalExam?.height ? `${fd.physicalExam.height} m` : "\u2014"],
          ["Pulse Rate", fd.physicalExam?.pulse ? `${fd.physicalExam.pulse} /min` : "\u2014"],
          ["Additional Notes", fd.physicalExam?.additionalNotes],
        ],
      },
    ];

    if (fd.visitRecords && (fd.visitRecords.visitDate || fd.visitRecords.services)) {
      sections.push({
        title: "Visit Record",
        icon: "clipboard",
        color: "text-teal-600",
        accent: "from-teal-500 to-teal-400",
        fields: [
          ["Visit Date", fd.visitRecords?.visitDate],
          ["Next Visit", fd.visitRecords?.nextVisit],
          ["Services", fd.visitRecords?.services],
          ["Meds", fd.visitRecords?.meds],
          ["Provider", fd.visitRecords?.provider],
          ["Remarks", fd.visitRecords?.remarks],
        ],
      });
    }

    return (
      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
              <Icon name={s.icon} className={`h-3.5 w-3.5 ${s.color}`} />
              <h4 className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
                {s.title}
              </h4>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {s.fields.map(([label, value]) => (
                <div key={label} className="flex gap-2 text-[9px]">
                  <span className="font-semibold text-slate-500 shrink-0">{label}:</span>
                  <span className="font-medium text-slate-800">{val(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderHIVDetail(fd) {
    const sections = [
      {
        title: "Consent & Demographics",
        icon: "users",
        color: "text-purple-600",
        accent: "from-purple-500 to-purple-400",
        fields: [
          ["Client Name", fd.clientName],
          ["Contact Number", fd.contactNumber],
          ["Email", fd.email],
          ["Sex", fd.sex],
          ["Gender Identity", fd.gender],
          ["Civil Status", fd.civilStatus],
          ["Age", fd.age],
          ["Date of Birth", [fd.dobMonth, fd.dobDay, fd.dobYear].filter(Boolean).join("/")],
          ["Mother's Initials", fd.motherInitials],
          ["Father's Initials", fd.fatherInitials],
        ],
      },
      {
        title: "Location",
        icon: "shield",
        color: "text-blue-600",
        accent: "from-blue-500 to-blue-400",
        fields: [
          ["Current City", fd.currentCity],
          ["Current Province", fd.currentProvince],
          ["Permanent City", fd.permCity],
          ["Permanent Province", fd.permProvince],
          ["Birth City", fd.birthCity],
          ["Birth Province", fd.birthProvince],
          ["Nationality", fd.nationality],
        ],
      },
      {
        title: "Personal Background",
        icon: "users",
        color: "text-teal-600",
        accent: "from-teal-500 to-teal-400",
        fields: [
          ["In School", fd.inSchool],
          ["Currently Working", fd.currentlyWorking],
          ["Occupation", fd.occupation],
          ["Has Partner", fd.hasPartner],
          ["Number of Children", fd.numChildren],
          ["Pregnant", fd.pregnant],
          ["PhilHealth", fd.philhealth],
          ["PhilSys", fd.philsys],
        ],
      },
      {
        title: "Risk Assessment",
        icon: "shield",
        color: "text-amber-600",
        accent: "from-amber-500 to-amber-400",
        fields: [
          ["Sub-population", fd.popGroup],
          ["Reason for Testing", fd.reason],
          ["Previous HIV Test", fd.prevTest],
          ["Previous Test Date", fd.prevTestDate],
        ],
      },
      {
        title: "Medical History",
        icon: "heart",
        color: "text-rose-600",
        accent: "from-rose-500 to-rose-400",
        fields: [
          ["Unusual Discharge", fd.unusualDischarge],
          ["Sores / Rashes", fd.soresRashes],
          ["Pain on Urination", fd.painUrination],
          ["History of STI", fd.historySTI],
          ["TB History", fd.tbHistory],
        ],
      },
      {
        title: "Test Information",
        icon: "clipboard",
        color: "text-emerald-600",
        accent: "from-emerald-500 to-emerald-400",
        fields: [
          ["Test Kit", fd.kitName],
          ["Lot Number", fd.lotNo],
          ["Expiry Date", fd.expiryDate],
          ["Date of Test", fd.dateOfTest],
          ["Screening Result", fd.result],
          ["Confirmatory Date", fd.confirmatoryDate],
          ["Confirmatory Result", fd.confirmatoryResult],
          ["Referral", fd.referral],
          ["Follow-up Date", fd.followUpDate],
          ["Provider", fd.provider],
          ["Remarks", fd.remarks],
        ],
      },
    ];

    return (
      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
              <Icon name={s.icon} className={`h-3.5 w-3.5 ${s.color}`} />
              <h4 className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
                {s.title}
              </h4>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {s.fields.map(([label, value]) => (
                <div key={label} className="flex gap-2 text-[9px]">
                  <span className="font-semibold text-slate-500 shrink-0">{label}:</span>
                  <span className="font-medium text-slate-800">{val(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default StaffAssessmentInventory;
