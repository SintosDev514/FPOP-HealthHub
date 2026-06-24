import React, { useState, useEffect } from "react";
import useLocalStorageSave from "../../../hooks/useLocalStorageSave";
import useUnsavedFormWarning from "../../../hooks/useUnsavedFormWarning";
import { deepMerge } from "../../../utils/storageHelpers";

/* ─── Step definitions ──────────────────────────────────────────────── */
const STEPS = [
  {
    id: "clientInfo",
    label: "Client Info",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "clientType",
    label: "Client Type",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
  {
    id: "medicalHistory",
    label: "Medical History",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: "obstetrical",
    label: "Obstetrical",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "stiRisks",
    label: "STI Risks",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "vawRisks",
    label: "VAW Risks",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    id: "physicalExam",
    label: "Physical Exam",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "review",
    label: "Review",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

/* ─── Reusable components ───────────────────────────────────────────── */
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-base font-bold text-[#1E3A5F]">{title}</h2>
    <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>
    <div className="mt-3 h-0.5 bg-[#F5C518] rounded-full" />
  </div>
);

const TextField = ({ label, type = "text", value, onChange, className = "", rows, disabled }) => (
  <div className={`relative ${className}`}>
    {type === "date" ? (
      <div className="relative">
        <span className="absolute -top-2.5 left-3 bg-white px-1 text-[9px] font-medium text-[#F5C518] leading-none z-10">
          {label}
        </span>
        <input type="date" value={value} onChange={onChange} disabled={disabled}
          className="w-full rounded-lg border border-slate-300 px-3 pt-4 pb-2.5 text-[10px] text-slate-700 outline-none transition focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 bg-white disabled:bg-slate-50 disabled:text-slate-700 disabled:border-slate-200 disabled:opacity-100" />
      </div>
    ) : rows ? (
      <textarea placeholder={label} value={value} onChange={onChange} rows={rows} disabled={disabled}
        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[10px] text-slate-700 placeholder-slate-400 outline-none transition focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 bg-white resize-none disabled:bg-slate-50 disabled:text-slate-700 disabled:border-slate-200 disabled:opacity-100" />
    ) : (
      <input type={type} placeholder={label} value={value} onChange={onChange} disabled={disabled}
        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[10px] text-slate-700 placeholder-slate-400 outline-none transition focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 bg-white disabled:bg-slate-50 disabled:text-slate-700 disabled:border-slate-200 disabled:opacity-100" />
    )}
  </div>
);

/* Yes/No radio card for Medical History */
const YesNoCard = ({ label, name, value, onChange, disabled }) => {
  const radioName = disabled ? `${name}-review` : name;
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 gap-4">
      <span className="text-[9px] font-semibold text-[#1E3A5F] min-w-0 flex-1">{label}</span>
      <div className="flex items-center gap-4 shrink-0">
        <label className={`flex items-center gap-1.5 text-[10px] text-slate-700 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
          <input type="radio" name={radioName} value="yes" checked={value === "yes"} onChange={() => onChange("yes")}
            disabled={disabled}
            className="accent-[#1E3A5F] w-4 h-4 disabled:opacity-100" />
          Yes
        </label>
        <label className={`flex items-center gap-1.5 text-[10px] text-slate-700 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
          <input type="radio" name={radioName} value="no" checked={value === "no"} onChange={() => onChange("no")}
            disabled={disabled}
            className="accent-[#1E3A5F] w-4 h-4 disabled:opacity-100" />
          No
        </label>
      </div>
    </div>
  );
};

const CheckboxOptionGroup = ({ label, name, options, value, onChange, disabled, columns = "sm:grid-cols-2" }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="mb-3 text-[9px] font-semibold text-[#1E3A5F]">{label}</p>
    <div className={`grid grid-cols-1 ${columns} gap-2`}>
      {options.map(option => (
        <label
          key={option.value}
          className={`flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition-colors ${
            disabled ? "cursor-default opacity-100" : "cursor-pointer hover:border-[#F5C518]"
          }`}
        >
          <input
            type="checkbox"
            name={disabled ? `${name}-review` : name}
            checked={value === option.value}
            onChange={() => onChange(value === option.value ? "" : option.value)}
            disabled={disabled}
            className="h-4 w-4 rounded border-slate-300 accent-[#1E3A5F] disabled:opacity-100"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxField = ({ label, name, checked, onChange, disabled }) => (
  <label
    className={`flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition-colors ${
      disabled ? "cursor-default opacity-100" : "cursor-pointer hover:border-[#F5C518]"
    }`}
  >
    <input
      type="checkbox"
      name={disabled ? `${name}-review` : name}
      checked={Boolean(checked)}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
      className="h-4 w-4 rounded border-slate-300 accent-[#1E3A5F] disabled:opacity-100"
    />
    <span>{label}</span>
  </label>
);

const VAWReferralOption = ({ label, name, checked, onChange, disabled, children }) => {
  const optionClass = `flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition-colors ${
    disabled ? "cursor-default opacity-100" : "cursor-pointer hover:border-[#F5C518]"
  }`;
  const checkbox = (
    <input
      type="checkbox"
      name={disabled ? `${name}-review` : name}
      aria-label={label || name}
      checked={Boolean(checked)}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
      className="h-4 w-4 shrink-0 rounded border-slate-300 accent-[#1E3A5F] disabled:opacity-100"
    />
  );

  if (children) {
    return (
      <div className={optionClass}>
        {checkbox}
        {children}
      </div>
    );
  }

  return (
    <label className={optionClass}>
      {checkbox}
      <span>{label}</span>
    </label>
  );
};

const ClientInfoSection = ({ title, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-[10px] font-bold text-[#1E3A5F] mb-4">{title}</h3>
    {children}
  </section>
);

/* ─── Step 1: Client Information ────────────────────────────────────── */
const ClientInfoStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="Client Information" subtitle="Please enter the client's personal and contact details" />}
    <div className="grid gap-6">
      <ClientInfoSection title="Client Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TextField label="Client ID" value={data.clientId} onChange={e => onChange("clientId", e.target.value)} disabled={disabled} />
        <TextField label="PhilHealth No." value={data.philhealth} onChange={e => onChange("philhealth", e.target.value)} disabled={disabled} />
          <YesNoCard label="NHTS?" name="nhts" value={data.nhts} onChange={v => onChange("nhts", v)} disabled={disabled} />
          <YesNoCard label="4Ps?" name="fourPs" value={data.fourPs} onChange={v => onChange("fourPs", v)} disabled={disabled} />
        </div>
      </ClientInfoSection>

      <ClientInfoSection title="Name of Client">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextField label="Last Name" value={data.lastName} onChange={e => onChange("lastName", e.target.value)} disabled={disabled} />
          <TextField label="Given Name / First Name" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} disabled={disabled} />
          <TextField label="Middle Initial / Middle Name" value={data.middleName} onChange={e => onChange("middleName", e.target.value)} disabled={disabled} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <TextField label="Date of Birth" type="date" value={data.dob} onChange={e => onChange("dob", e.target.value)} disabled={disabled} />
        <TextField label="Age" type="number" value={data.age} onChange={e => onChange("age", e.target.value)} disabled={disabled} />
          <TextField label="Educational Attainment" value={data.educationalAttainment} onChange={e => onChange("educationalAttainment", e.target.value)} disabled={disabled} />
          <TextField label="Occupation" value={data.occupation} onChange={e => onChange("occupation", e.target.value)} disabled={disabled} />
        </div>
      </ClientInfoSection>

      <ClientInfoSection title="Address">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <TextField label="House/Unit No." value={data.houseUnitNo} onChange={e => onChange("houseUnitNo", e.target.value)} disabled={disabled} />
          <TextField label="Street" value={data.street} onChange={e => onChange("street", e.target.value)} disabled={disabled} />
          <TextField label="Barangay" value={data.barangay} onChange={e => onChange("barangay", e.target.value)} disabled={disabled} />
          <TextField label="Municipality/City" value={data.municipalityCity} onChange={e => onChange("municipalityCity", e.target.value)} disabled={disabled} />
          <TextField label="Province" value={data.province} onChange={e => onChange("province", e.target.value)} disabled={disabled} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <TextField label="Contact Number" value={data.contact} onChange={e => onChange("contact", e.target.value)} disabled={disabled} />
        <TextField label="Civil Status" value={data.civilStatus} onChange={e => onChange("civilStatus", e.target.value)} disabled={disabled} />
          <TextField label="Religion" value={data.religion} onChange={e => onChange("religion", e.target.value)} disabled={disabled} />
        </div>
      </ClientInfoSection>

      <ClientInfoSection title="Spouse Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField label="Last Name" value={data.spouseLastName} onChange={e => onChange("spouseLastName", e.target.value)} disabled={disabled} />
          <TextField label="Given Name / First Name" value={data.spouseFirstName} onChange={e => onChange("spouseFirstName", e.target.value)} disabled={disabled} />
          <TextField label="Middle Initial / Middle Name" value={data.spouseMiddleName} onChange={e => onChange("spouseMiddleName", e.target.value)} disabled={disabled} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <TextField label="Date of Birth" type="date" value={data.spouseDob} onChange={e => onChange("spouseDob", e.target.value)} disabled={disabled} />
          <TextField label="Age" type="number" value={data.spouseAge} onChange={e => onChange("spouseAge", e.target.value)} disabled={disabled} />
          <TextField label="Occupation" value={data.spouseOccupation} onChange={e => onChange("spouseOccupation", e.target.value)} disabled={disabled} />
        </div>
      </ClientInfoSection>

      <ClientInfoSection title="Family Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Number of Living Children" type="number" value={data.livingChildren} onChange={e => onChange("livingChildren", e.target.value)} disabled={disabled} />
          <YesNoCard label="Plan to Have More Children?" name="planMoreChildren" value={data.planMoreChildren} onChange={v => onChange("planMoreChildren", v)} disabled={disabled} />
          <TextField label="Average Monthly Income" type="number" value={data.averageMonthlyIncome} onChange={e => onChange("averageMonthlyIncome", e.target.value)} disabled={disabled} />
        </div>
      </ClientInfoSection>
    </div>
  </div>
);

/* ─── Step 2: Client Type ───────────────────────────────────────────── */
const CLIENT_TYPES = ["New Acceptor", "Current User", "Changing Method", "Changing Clinic", "Dropout/Restart"];
const FP_REASONS = ["Spacing", "Limiting", "Others (specify)"];
const FP_METHODS = [
  "COC",
  "IUD",
  "BOM/CMM",
  "LAM",
  "POP",
  "Interval",
  "BBT",
  "STM",
  "Injectable",
  "Post-Partum",
  "Implant",
  "Condom",
  "SDM",
  "Others (specify)",
];
const FP_ADDITIONAL_NOTES = [
  { key: "medicalCondition", label: "Medical condition" },
  { key: "sideEffects", label: "Side-effects" },
];

const ClientTypeStep = ({ data, onChange, disabled, hideHeader }) => {
  const typeName = disabled ? "clientType-review" : "clientType";
  const fpName = disabled ? "fpReason-review" : "fpReason";
  const methodName = disabled ? "fpMethod-review" : "fpMethod";
  return (
    <div>
      {!hideHeader && <SectionHeader title="Client Type" subtitle="Record the client's FP classification, reason, method, and notes" />}
      <div className="grid gap-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5C518] mb-2">Step 1</p>
          <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">Select Client Type</p>
          <div className="flex flex-col gap-3">
            {CLIENT_TYPES.map(t => (
              <label key={t} className={`flex items-center gap-3 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                <input type="radio" name={typeName} value={t} checked={data.type === t}
                  onChange={() => onChange("type", t)}
                  disabled={disabled}
                  className="accent-[#1E3A5F] w-4 h-4 shrink-0" />
                <span className="text-[10px] text-slate-700">{t}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5C518] mb-2">Step 2</p>
          <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">Reason for Family Planning <span className="font-medium text-slate-400">(if applicable)</span></p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
            <div className="flex flex-col gap-3">
              {FP_REASONS.map(r => (
                <label key={r} className={`flex items-center gap-3 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                  <input type="radio" name={fpName} value={r} checked={data.fpReason === r}
                    onChange={() => onChange("fpReason", r)}
                    disabled={disabled}
                    className="accent-[#1E3A5F] w-4 h-4 shrink-0" />
                  <span className="text-[10px] text-slate-700">{r}</span>
                </label>
              ))}
            </div>
            <TextField label="Others, please specify" value={data.fpOther}
              onChange={e => onChange("fpOther", e.target.value)}
              disabled={disabled}
              className={`w-full transition-opacity ${data.fpReason === "Others (specify)" ? "opacity-100" : "opacity-40 pointer-events-none"}`} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5C518] mb-2">Step 3</p>
          <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">Specify Method Currently Used / Changing To <span className="font-medium text-slate-400">(optional)</span></p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {FP_METHODS.map(method => (
                <label key={method} className={`flex items-center gap-3 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                  <input type="radio" name={methodName} value={method} checked={data.method === method}
                    onChange={() => onChange("method", method)}
                    disabled={disabled}
                    className="accent-[#1E3A5F] w-4 h-4 shrink-0" />
                  <span className="text-[10px] text-slate-700">{method}</span>
                </label>
              ))}
            </div>
            <TextField label="Others, please specify" value={data.methodOther}
              onChange={e => onChange("methodOther", e.target.value)}
              disabled={disabled}
              className={`w-full transition-opacity ${data.method === "Others (specify)" ? "opacity-100" : "opacity-40 pointer-events-none"}`} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5C518] mb-2">Step 4</p>
          <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">Additional Notes <span className="font-medium text-slate-400">(if needed)</span></p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4">
            <div className="flex flex-col gap-3">
              {FP_ADDITIONAL_NOTES.map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-3 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                  <input type="checkbox" checked={Boolean(data[key])}
                    onChange={e => onChange(key, e.target.checked)}
                    disabled={disabled}
                    className="accent-[#1E3A5F] w-4 h-4 shrink-0" />
                  <span className="text-[10px] text-slate-700">{label}</span>
                </label>
              ))}
            </div>
            <TextField label="Notes or details" value={data.additionalNotes}
              onChange={e => onChange("additionalNotes", e.target.value)} rows={3}
              disabled={disabled} />
          </div>
        </section>
      </div>
    </div>
  );
};

/* ─── Step 3: Medical History ───────────────────────────────────────── */
const MEDICAL_CONDITIONS = [
  { key: "severeHeadaches", label: "Severe headaches / migraine" },
  { key: "strokeHeartHypertension", label: "History of stroke / heart attack / hypertension" },
  { key: "frequentBruisingBleeding", label: "Non-traumatic hematoma / frequent bruising or gum bleeding" },
  { key: "breastCancerMass", label: "Current or history of breast cancer / breast mass" },
  { key: "severeChestPain", label: "Severe chest pain" },
  { key: "coughMoreThan14Days", label: "Cough for more than 14 days" },
  { key: "jaundice", label: "Jaundice" },
  { key: "unexplainedVaginalBleeding", label: "Unexplained vaginal bleeding" },
  { key: "abnormalVaginalDischarge", label: "Abnormal vaginal discharge" },
  { key: "phenobarbitalRifampicin", label: "Intake of phenobarbital anti-seizure or rifampicin anti-TB" },
  { key: "smoker", label: "Is the client a smoker?" },
  { key: "withDisability", label: "With disability?" },
];

const MedicalHistoryStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="Medical History" subtitle="Please provide information about the client's past and current medical conditions." />}
    <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">
      Does the client have any of the following?
    </p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {MEDICAL_CONDITIONS.map(({ key, label }) => (
        <div key={key} className={key === "withDisability" && data.withDisability === "yes" ? "grid gap-3" : ""}>
          <YesNoCard label={label} name={key}
            value={data[key]}
            onChange={v => {
              onChange(key, v);
              if (key === "withDisability" && v !== "yes") onChange("disabilityDetails", "");
            }}
            disabled={disabled} />
          {key === "withDisability" && data.withDisability === "yes" && (
            <TextField
              label="If yes, please specify: ____________________"
              value={data.disabilityDetails}
              onChange={e => onChange("disabilityDetails", e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Step 4: Obstetrical ───────────────────────────────────────────── */
const PREGNANCY_QUESTIONS = [
  "Did you have a baby less than six months ago, are you fully or nearly-fully breastfeeding, and have you had no menstrual period since then?",
  "Have you abstained from sexual intercourse since your last menstrual period or delivery?",
  "Have you had a baby in the last four (4) weeks?",
  "Did your last menstrual period start within the past seven (7) days?",
  "Have you had a miscarriage or abortion in the last seven (7) days?",
  "Have you been using a reliable contraceptive method consistently and correctly?",
];

const LAST_DELIVERY_OPTIONS = [
  { value: "vaginal", label: "Vaginal" },
  { value: "cesareanSection", label: "Cesarean Section" },
];

const MENSTRUAL_FLOW_OPTIONS = [
  { value: "scanty", label: "Scanty: 1-2 pads per day" },
  { value: "moderate", label: "Moderate: 3-5 pads per day" },
  { value: "heavy", label: "Heavy: more than 5 pads per day" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const ObstetricalStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="Obstetrical History" subtitle="Information about pregnancy and childbirth history" />}

    <div className="grid gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextField label="Number of Pregnancies (G)" type="number" value={data.gravida}
          onChange={e => onChange("gravida", e.target.value)} disabled={disabled} />
        <TextField label="Parity / Number of Deliveries (P)" type="number" value={data.parity}
          onChange={e => onChange("parity", e.target.value)} disabled={disabled} />
        <TextField label="Full Term" type="number" value={data.term}
          onChange={e => onChange("term", e.target.value)} disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextField label="Premature" type="number" value={data.premature}
          onChange={e => onChange("premature", e.target.value)} disabled={disabled} />
        <TextField label="Number of Abortions (A)" type="number" value={data.abortion}
          onChange={e => onChange("abortion", e.target.value)} disabled={disabled} />
        <TextField label="Living Children (L)" type="number" value={data.living}
          onChange={e => onChange("living", e.target.value)} disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Date of Last Delivery (dd/mm/yyyy)" type="date" value={data.lastDeliveryDate}
          onChange={e => onChange("lastDeliveryDate", e.target.value)} disabled={disabled} />
        <CheckboxOptionGroup
          label="Type of Last Delivery"
          name="lastDeliveryType"
          options={LAST_DELIVERY_OPTIONS}
          value={data.lastDeliveryType}
          onChange={v => onChange("lastDeliveryType", v)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Last Menstrual Period (dd/mm/yyyy)" type="date" value={data.lmp}
          onChange={e => onChange("lmp", e.target.value)} disabled={disabled} />
        <TextField label="Previous Menstrual Period (dd/mm/yyyy)" type="date" value={data.previousMenstrualPeriod}
          onChange={e => onChange("previousMenstrualPeriod", e.target.value)} disabled={disabled} />
      </div>

      <CheckboxOptionGroup
        label="Menstrual Flow"
        name="menstrualFlow"
        options={MENSTRUAL_FLOW_OPTIONS}
        value={data.menstrualFlow}
        onChange={v => onChange("menstrualFlow", v)}
        disabled={disabled}
        columns="md:grid-cols-3"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CheckboxOptionGroup
          label="Dysmenorrhea"
          name="dysmenorrhea"
          options={YES_NO_OPTIONS}
          value={data.dysmenorrhea}
          onChange={v => onChange("dysmenorrhea", v)}
          disabled={disabled}
        />
        <CheckboxOptionGroup
          label="Hydatidiform Mole within the Last 12 Months"
          name="hydatidiformMole"
          options={YES_NO_OPTIONS}
          value={data.hydatidiformMole}
          onChange={v => onChange("hydatidiformMole", v)}
          disabled={disabled}
        />
        <CheckboxOptionGroup
          label="History of Ectopic Pregnancy"
          name="ectopicPregnancy"
          options={YES_NO_OPTIONS}
          value={data.ectopicPregnancy}
          onChange={v => onChange("ectopicPregnancy", v)}
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

/* ─── Step 5: STI Risks ─────────────────────────────────────────────── */
const STIRisksStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="RISKS FOR SEXUALLY TRANSMITTED INFECTIONS" subtitle="Screening for sexually transmitted infections risk factors" />}
    <p className="text-[10px] font-bold text-[#1E3A5F] mb-4">
      Does the client or the client's partner have any of the following?
    </p>
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <YesNoCard
          label="Abnormal discharge from the genital area"
          name="abnormalDischarge"
          value={data.abnormalDischarge}
          onChange={v => {
            onChange("abnormalDischarge", v);
            if (v !== "yes") {
              onChange("dischargeFromVagina", false);
              onChange("dischargeFromPenis", false);
            }
          }}
          disabled={disabled}
        />
        {data.abnormalDischarge === "yes" && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
            <p className="mb-2 text-[9px] font-semibold text-[#1E3A5F]">If YES, please indicate if from:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxField
                label="Vagina"
                name="dischargeFromVagina"
                checked={data.dischargeFromVagina}
                onChange={checked => onChange("dischargeFromVagina", checked)}
                disabled={disabled}
              />
              <CheckboxField
                label="Penis"
                name="dischargeFromPenis"
                checked={data.dischargeFromPenis}
                onChange={checked => onChange("dischargeFromPenis", checked)}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <YesNoCard
          label="Sores or ulcers in the genital area"
          name="soresUlcers"
          value={data.soresUlcers}
          onChange={v => onChange("soresUlcers", v)}
          disabled={disabled}
        />
        <YesNoCard
          label="Pain or burning sensation in the genital area"
          name="painBurningGenital"
          value={data.painBurningGenital}
          onChange={v => onChange("painBurningGenital", v)}
          disabled={disabled}
        />
        <YesNoCard
          label="History of treatment for sexually transmitted infections"
          name="historyTreatmentSTI"
          value={data.historyTreatmentSTI}
          onChange={v => onChange("historyTreatmentSTI", v)}
          disabled={disabled}
        />
        <YesNoCard
          label="HIV / AIDS / Pelvic inflammatory disease"
          name="hivAidsPid"
          value={data.hivAidsPid}
          onChange={v => onChange("hivAidsPid", v)}
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

/* ─── Step 6: VAW Risks ─────────────────────────────────────────────── */
const VAWRisksStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="Violence Against Women (VAW) Screening"
      subtitle="Confidential screening for domestic violence" />}

    <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 px-5 py-3">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
        Confidentiality Notice:
      </p>
      <p className="text-[10px] italic text-slate-700">
        All information provided is strictly confidential and will be used only for appropriate counseling and referral.
      </p>
    </div>

    <div className="grid gap-5">
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
          <span className="h-3 w-1.5 rounded-full bg-[#F5C518]" />
          IV. RISKS FOR VIOLENCE AGAINST WOMEN (VAW)
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <YesNoCard
            label="1. Unpleasant relationship with partner"
            name="unpleasantRelationship"
            value={data.unpleasantRelationship}
            onChange={v => onChange("unpleasantRelationship", v)}
            disabled={disabled}
          />
          <YesNoCard
            label="2. Partner does not approve of the visit to FP clinic"
            name="partnerDisapprovesFPVisit"
            value={data.partnerDisapprovesFPVisit}
            onChange={v => onChange("partnerDisapprovesFPVisit", v)}
            disabled={disabled}
          />
          <YesNoCard
            label="3. History of domestic violence or VAW"
            name="historyDomesticViolenceVAW"
            value={data.historyDomesticViolenceVAW}
            onChange={v => onChange("historyDomesticViolenceVAW", v)}
            disabled={disabled}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="mb-3 text-[9px] font-semibold text-[#1E3A5F]">Referred to:</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <VAWReferralOption
            label="DSWD"
            name="referredDSWD"
            checked={data.referredDSWD}
            onChange={v => onChange("referredDSWD", v)}
            disabled={disabled}
          />
          <VAWReferralOption
            label="WCPU"
            name="referredWCPU"
            checked={data.referredWCPU}
            onChange={v => onChange("referredWCPU", v)}
            disabled={disabled}
          />
          <VAWReferralOption
            label="NGOs"
            name="referredNGOs"
            checked={data.referredNGOs}
            onChange={v => onChange("referredNGOs", v)}
            disabled={disabled}
          />
          <VAWReferralOption
            name="referredOthers"
            checked={data.referredOthers}
            onChange={v => onChange("referredOthers", v)}
            disabled={disabled}
          >
            <span className="shrink-0">Others (Specify:</span>
            <input
              type="text"
              value={data.referredOthersSpecify}
              onChange={e => onChange("referredOthersSpecify", e.target.value)}
              disabled={disabled}
              aria-label="Others specify"
              className="min-w-0 flex-1 border-0 border-b border-slate-300 bg-transparent px-1 py-0.5 text-[10px] text-slate-700 outline-none transition focus:border-[#F5C518] disabled:text-slate-700 disabled:opacity-100"
            />
            <span>)</span>
          </VAWReferralOption>
        </div>
      </section>

      <TextField
        label="Counseling Notes / Remarks"
        value={data.counselingNotes}
        onChange={e => onChange("counselingNotes", e.target.value)}
        rows={3}
        disabled={disabled}
      />
    </div>
  </div>
);

/* ─── Step 7: Physical Exam ─────────────────────────────────────────── */
const MeasurementField = ({ label, unit, value, onChange, disabled }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <label className="mb-2 block text-[9px] font-semibold text-[#1E3A5F]">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[10px] text-slate-700 outline-none transition focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100"
      />
      <span className="shrink-0 text-[10px] font-semibold text-slate-600">{unit}</span>
    </div>
  </div>
);

const ExamCheckboxGroup = ({ title, options, data, onChange, disabled }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="mb-3 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">{title}</h4>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map(option => (
        <CheckboxField
          key={option.key}
          label={option.label}
          name={option.key}
          checked={data[option.key]}
          onChange={checked => onChange(option.key, checked)}
          disabled={disabled}
        />
      ))}
    </div>
  </section>
);

const PHYSICAL_EXAM_GROUPS = [
  {
    title: "SKIN:",
    options: [
      { key: "skinNormal", label: "normal" },
      { key: "skinPale", label: "pale" },
      { key: "skinYellowish", label: "yellowish" },
      { key: "skinHematoma", label: "hematoma" },
    ],
  },
  {
    title: "CONJUNCTIVA:",
    options: [
      { key: "conjunctivaNormal", label: "normal" },
      { key: "conjunctivaPale", label: "pale" },
      { key: "conjunctivaYellowish", label: "yellowish" },
    ],
  },
  {
    title: "NECK:",
    options: [
      { key: "neckNormal", label: "normal" },
      { key: "neckMass", label: "neck mass" },
      { key: "neckEnlargedLymphNodes", label: "enlarged lymph nodes" },
    ],
  },
  {
    title: "BREAST:",
    options: [
      { key: "breastNormal", label: "normal" },
      { key: "breastMass", label: "mass" },
      { key: "breastNippleDischarge", label: "nipple discharge" },
    ],
  },
  {
    title: "ABDOMEN:",
    options: [
      { key: "abdomenNormal", label: "normal" },
      { key: "abdomenMass", label: "abdominal mass" },
      { key: "abdomenVaricosities", label: "varicosities" },
    ],
  },
  {
    title: "EXTREMITIES:",
    options: [
      { key: "extremitiesNormal", label: "normal" },
      { key: "extremitiesEdema", label: "edema" },
      { key: "extremitiesVaricosities", label: "varicosities" },
    ],
  },
];

const PhysicalExamStep = ({ data, onChange, disabled, hideHeader }) => (
  <div>
    {!hideHeader && <SectionHeader title="Physical Examination"
      subtitle="Record vital signs and physical examination findings" />}

    <div className="grid gap-6">

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
          <span className="h-3 w-1.5 rounded-full bg-[#F5C518]" />
          VITAL SIGNS:
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MeasurementField label="Weight:" unit="kg" value={data.weight} onChange={e => onChange("weight", e.target.value)} disabled={disabled} />
          <MeasurementField label="Blood pressure:" unit="mmHg" value={data.bp} onChange={e => onChange("bp", e.target.value)} disabled={disabled} />
          <MeasurementField label="Height:" unit="m" value={data.height} onChange={e => onChange("height", e.target.value)} disabled={disabled} />
          <MeasurementField label="Pulse rate:" unit="/min" value={data.pulse} onChange={e => onChange("pulse", e.target.value)} disabled={disabled} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
          <span className="h-3 w-1.5 rounded-full bg-[#F5C518]" />
          PHYSICAL EXAMINATION FINDINGS:
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PHYSICAL_EXAM_GROUPS.map(group => (
            <ExamCheckboxGroup
              key={group.title}
              title={group.title}
              options={group.options}
              data={data}
              onChange={onChange}
              disabled={disabled}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
          <span className="h-3 w-1.5 rounded-full bg-[#F5C518]" />
          PELVIC EXAMINATION:
        </h3>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-[10px] font-bold text-[#1E3A5F]">For IUD Acceptors</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <CheckboxField label="normal" name="pelvicNormal" checked={data.pelvicNormal} onChange={checked => onChange("pelvicNormal", checked)} disabled={disabled} />
            <CheckboxField label="mass" name="pelvicMass" checked={data.pelvicMass} onChange={checked => onChange("pelvicMass", checked)} disabled={disabled} />
            <CheckboxField label="abnormal discharge" name="pelvicAbnormalDischarge" checked={data.pelvicAbnormalDischarge} onChange={checked => onChange("pelvicAbnormalDischarge", checked)} disabled={disabled} />
            <CheckboxField label="cervical tenderness" name="cervicalTenderness" checked={data.cervicalTenderness} onChange={checked => onChange("cervicalTenderness", checked)} disabled={disabled} />
            <CheckboxField label="adnexal mass / tenderness" name="adnexalMassTenderness" checked={data.adnexalMassTenderness} onChange={checked => onChange("adnexalMassTenderness", checked)} disabled={disabled} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <CheckboxField label="cervical abnormalities" name="cervicalAbnormalities" checked={data.cervicalAbnormalities} onChange={checked => onChange("cervicalAbnormalities", checked)} disabled={disabled} />
              <div className="mt-2 grid grid-cols-1 gap-2 pl-6">
                <CheckboxField label="warts" name="cervicalWarts" checked={data.cervicalWarts} onChange={checked => onChange("cervicalWarts", checked)} disabled={disabled} />
                <CheckboxField label="polyp or cyst" name="cervicalPolypOrCyst" checked={data.cervicalPolypOrCyst} onChange={checked => onChange("cervicalPolypOrCyst", checked)} disabled={disabled} />
                <CheckboxField label="inflammation or erosion" name="cervicalInflammationOrErosion" checked={data.cervicalInflammationOrErosion} onChange={checked => onChange("cervicalInflammationOrErosion", checked)} disabled={disabled} />
                <CheckboxField label="bloody discharge" name="cervicalBloodyDischarge" checked={data.cervicalBloodyDischarge} onChange={checked => onChange("cervicalBloodyDischarge", checked)} disabled={disabled} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <CheckboxField label="cervical consistency" name="cervicalConsistency" checked={data.cervicalConsistency} onChange={checked => onChange("cervicalConsistency", checked)} disabled={disabled} />
              <div className="mt-2 grid grid-cols-1 gap-2 pl-6">
                <CheckboxField label="firm" name="cervicalFirm" checked={data.cervicalFirm} onChange={checked => onChange("cervicalFirm", checked)} disabled={disabled} />
                <CheckboxField label="soft" name="cervicalSoft" checked={data.cervicalSoft} onChange={checked => onChange("cervicalSoft", checked)} disabled={disabled} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <CheckboxField label="uterine position:" name="uterinePosition" checked={data.uterinePosition} onChange={checked => onChange("uterinePosition", checked)} disabled={disabled} />
              <div className="mt-2 grid grid-cols-1 gap-2 pl-6">
                <CheckboxField label="mid" name="uterineMid" checked={data.uterineMid} onChange={checked => onChange("uterineMid", checked)} disabled={disabled} />
                <CheckboxField label="anteflexed" name="uterineAnteflexed" checked={data.uterineAnteflexed} onChange={checked => onChange("uterineAnteflexed", checked)} disabled={disabled} />
                <CheckboxField label="retroflexed" name="uterineRetroflexed" checked={data.uterineRetroflexed} onChange={checked => onChange("uterineRetroflexed", checked)} disabled={disabled} />
              </div>
            </div>
          </div>

          <div className="mt-3 max-w-sm">
            <MeasurementField label="uterine depth:" unit="cm" value={data.uterineDepth} onChange={e => onChange("uterineDepth", e.target.value)} disabled={disabled} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F]">
          <span className="h-3 w-1.5 rounded-full bg-[#F5C518]" />
          Additional examination Notes
        </h3>
        <TextField label="Additional examination Notes" value={data.additionalNotes}
          onChange={e => onChange("additionalNotes", e.target.value)} rows={3} disabled={disabled} />
      </section>
    </div>
  </div>
);

/* ─── Step 8: Visit Records (Side B) ────────────────────────────────── */
const VisitRecordsStep = ({
  visits,
  onChange,
  onAddVisit,
  onDeleteVisit,
  onSave,
  submitted,
  setSubmitted,
  obstetricalData,
  onObstetricalChange,
  disabled = false
}) => {
  if (submitted) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[#1E3A5F] mb-2">Visit Records Saved!</h2>
        <p className="text-slate-500 mb-6 font-medium">The Client Visit Log has been updated and saved successfully.</p>
        <button onClick={() => setSubmitted(false)}
          className="rounded-xl bg-[#1E3A5F] px-6 py-2.5 text-[10px] font-bold text-white hover:bg-[#152c4a] transition-all duration-200 shadow-md">
          View Visit Log
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Yellow pregnancy check box */}
      <div className="border-l-4 border-[#F5C518] bg-slate-50/50 p-6 rounded-r-xl border-y border-r border-slate-200 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5C518]/15 text-[#B88900]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h3 className="text-md font-bold text-[#1E3A5F]">
              How to be Reasonably Sure a Client is Not Pregnant
            </h3>
            <p className="text-[9px] text-slate-500 mt-0.5">
              If at least one of the questions is answered <span className="font-bold text-[#1E3A5F]">YES</span> and the client has no symptoms of pregnancy, provide client with desired method.
            </p>
          </div>
        </div>

        <div className="h-0.5 bg-[#F5C518] rounded-full mb-6" />

        <div className="flex flex-col gap-4">
          {PREGNANCY_QUESTIONS.map((q, idx) => {
            const key = `pregQ${idx + 1}`;
            const radioName = disabled ? `${key}-review` : key;

            return (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[10px] font-medium text-slate-700 leading-relaxed">
                    {q}
                  </p>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 shrink-0 self-end md:self-center">
                  <label className={`flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                    <input type="radio" name={radioName} value="yes"
                      checked={obstetricalData?.[key] === "yes"}
                      onChange={() => onObstetricalChange?.(key, "yes")}
                      disabled={disabled}
                      className="accent-[#1E3A5F] w-4 h-4" />
                    Yes
                  </label>
                  <label className={`flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 ${disabled ? "cursor-default opacity-100" : "cursor-pointer"}`}>
                    <input type="radio" name={radioName} value="no"
                      checked={obstetricalData?.[key] === "no"}
                      onChange={() => onObstetricalChange?.(key, "no")}
                      disabled={disabled}
                      className="accent-[#1E3A5F] w-4 h-4" />
                    No
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Panel */}
        <div className="mt-6 border border-amber-300 bg-amber-50/70 p-4 rounded-xl flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#1E3A5F]">Important:</span>
            <span className="text-[10px] text-slate-600 ml-1 leading-relaxed">
              If the client answered NO to all of the questions, pregnancy cannot be ruled out. The client should await menses or use a pregnancy test.
            </span>
          </div>
        </div>
      </div>

      {/* Client Visit Records */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#1E3A5F]">Client Visit Records</h2>
            <p className="text-[9px] text-slate-500 mt-1">Track all client visits, medical observations, and follow-up appointments</p>
          </div>
          <button
            type="button"
            onClick={onAddVisit}
            className="flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-[10px] font-bold text-white shadow-md hover:bg-[#152c4a] transition-all hover:-translate-y-0.5 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Visit
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#4E6E85] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-left w-[180px]">
                  Date of Visit<br /><span className="text-[8px] opacity-80">(MM/DD/YYYY)</span>
                </th>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-left min-w-[280px]">
                  Medical Findings<br />
                  <span className="text-[8px] opacity-80 normal-case font-medium">(Medical observation, complaint/complication, service rendered)</span>
                </th>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-left w-[160px]">
                  Method Accepted
                </th>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-left w-[220px]">
                  Name and Signature<br /><span className="text-[8px] opacity-80">of Service Provider</span>
                </th>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-left w-[180px]">
                  Date of Follow-up Visit<br /><span className="text-[8px] opacity-80">(MM/DD/YYYY)</span>
                </th>
                <th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-center w-[70px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {visits.map((visit, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {/* Date of Visit */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="date"
                      value={visit.dateOfVisit}
                      onChange={e => onChange(idx, "dateOfVisit", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white transition"
                    />
                  </td>

                  {/* Medical Findings */}
                  <td className="px-3 py-4 align-top">
                    <textarea
                      rows={3}
                      placeholder="Enter medical observations, laboratory examination, treatment, and referrals..."
                      value={visit.medicalFindings}
                      onChange={e => onChange(idx, "medicalFindings", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 placeholder-slate-400 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white resize-none transition"
                    />
                  </td>

                  {/* Method Accepted */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="text"
                      placeholder="e.g., Pills, Condoms"
                      value={visit.methodAccepted}
                      onChange={e => onChange(idx, "methodAccepted", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 placeholder-slate-400 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white transition"
                    />
                  </td>

                  {/* Name & Signature */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="text"
                      placeholder="Provider name"
                      value={visit.providerName}
                      onChange={e => onChange(idx, "providerName", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 placeholder-slate-400 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white transition mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Signature"
                      value={visit.providerSignature}
                      onChange={e => onChange(idx, "providerSignature", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 placeholder-slate-400 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white transition"
                    />
                  </td>

                  {/* Date of Follow-up */}
                  <td className="px-3 py-4 align-top">
                    <input
                      type="date"
                      value={visit.followUpDate}
                      onChange={e => onChange(idx, "followUpDate", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] text-slate-700 focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/25 outline-none bg-white transition"
                    />
                  </td>

                  {/* Action Delete */}
                  <td className="px-3 py-4 text-center align-middle">
                    <button
                      type="button"
                      disabled={visits.length <= 1}
                      onClick={() => onDeleteVisit(idx)}
                      className={`p-2 rounded-lg transition-colors ${
                        visits.length <= 1
                          ? "text-slate-200 cursor-not-allowed"
                          : "text-red-500 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 rounded-xl bg-[#F5C518] px-6 py-3 text-[10px] font-bold text-[#1E3A5F] shadow-md shadow-[#F5C518]/20 hover:bg-[#e6b800] hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            Save Visit Records
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Step 9: Review ────────────────────────────────────────────────── */
const ReviewStep = ({ allData, onEditSection }) => {
  return (
    <div>
      <SectionHeader title="Review & Submit"
        subtitle="Please review all entered information before submitting. Click 'Edit Section' to make changes." />
      <div className="flex flex-col gap-8">
        {/* Client Info Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">Client Information</h3>
            </div>
            <button type="button" onClick={() => onEditSection(0)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <ClientInfoStep data={allData.clientInfo} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* Client Type Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M9 7h6M9 11h6M9 15h4" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">Client Type</h3>
            </div>
            <button type="button" onClick={() => onEditSection(1)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <ClientTypeStep data={allData.clientType} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* Medical History Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">Medical History</h3>
            </div>
            <button type="button" onClick={() => onEditSection(2)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <MedicalHistoryStep data={allData.medicalHistory} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* Obstetrical Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">Obstetrical History</h3>
            </div>
            <button type="button" onClick={() => onEditSection(3)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <ObstetricalStep data={allData.obstetrical} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* STI Risks Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">III. RISKS FOR SEXUALLY TRANSMITTED INFECTIONS</h3>
            </div>
            <button type="button" onClick={() => onEditSection(4)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <STIRisksStep data={allData.stiRisks} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* VAW Risks Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">IV. RISKS FOR VIOLENCE AGAINST WOMEN (VAW)</h3>
            </div>
            <button type="button" onClick={() => onEditSection(5)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <VAWRisksStep data={allData.vawRisks} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>

        {/* Physical Exam Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#1E3A5F]/5 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#1E3A5F]">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h3 className="text-[10px] font-bold text-[#1E3A5F]">V. PHYSICAL EXAMINATION</h3>
            </div>
            <button type="button" onClick={() => onEditSection(6)}
              className="text-[9px] font-bold text-[#1E3A5F] hover:text-[#F5C518] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Section
            </button>
          </div>
          <div className="p-6">
            <PhysicalExamStep data={allData.physicalExam} onChange={() => {}} disabled={true} hideHeader={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── HTS Form 2021 — 6-Step Wizard Components ─────────────────────── */
const HTS_STEPS = [
  { id: "consent",      label: "Informed Consent" },
  { id: "demographics", label: "Demographic Data" },
  { id: "education",    label: "Education & Occupation" },
  { id: "risk",         label: "Risk Assessment" },
  { id: "medical",      label: "Medical History" },
  { id: "provider",     label: "Provider Details" },
];

/* ─ Step 1: Informed Consent ─ */
const HivConsentStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">About the Test & Informed Consent</h2>
      <p className="text-[10px] text-purple-600 mt-1">Read and acknowledge the HIV testing information before proceeding.</p>
    </div>
    <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-[10px] text-blue-800">
      <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>The Department of Health (DOH) has an existing program for the prevention and control of the Human Immunodeficiency Virus (HIV) in the Philippines. The Epidemiology Bureau (EB) of DOH is mandated by Republic Act 11166 &amp; 11332 to collect information that will be used in planning activities to help stop the spread of HIV and to support and treat those diagnosed with HIV. Your full cooperation is very important to this program. Please answer all questions as honestly as possible.</p>
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200 mb-6">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">About the Test</h3>
      </div>
      <div className="p-5 space-y-4 text-[10px] text-slate-700">
        <div>
          <p className="font-bold text-slate-800 mb-1">What is HIV testing?</p>
          <p>An HIV test refers to a procedure used to identify if you have antibodies to HIV – the virus that causes AIDS. A specimen, usually blood, and a DOH-Food and Drug Administration (FDA)-registered diagnostic kit is needed to perform the test. The test may be performed by a trained/supervised healthcare worker or lay person, or by oneself, depending on the modality.</p>
        </div>
        <p>If the first test (screening) is reactive, another test (confirmatory) will be done to make sure that the first test is confirmed to be positive. A positive test means you have been infected with HIV. A non-reactive or negative test means you are not infected or your body has not produced the sufficient level of antibodies (within window period) that can be detected by the HIV rapid diagnostic test kits. If you are non-reactive or negative, and had a recent exposure within the window period, you need to undergo another test 4 weeks after your risk exposure.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-bold text-amber-800 text-[9px]">Confidentiality of HIV Testing</p>
          <p className="text-[9px] text-amber-700 mt-1">Your personal information and HIV test result is confidential adherent to the provisions of RA 11166 Philippine HIV and AIDS Policy Act, RA-10173 Data Privacy Act of 2012 and its IRR of 2016.</p>
        </div>
      </div>
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200 mb-5">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">Informed Consent</h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/40 text-[10px] text-blue-900 font-medium italic">
          I, <span className="font-bold uppercase not-italic">CLIENT / CHILD / PROXY CONSENT PROVIDER</span>, was given information about HIV, its testing process, and was able to ask questions about HIV. I agree to undergo HIV testing.
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[9px] font-semibold text-slate-600 mb-1">Name and Signature</label>
            <input type="text" placeholder="Full name of client or proxy" value={data.clientName} onChange={e => onChange("clientName", e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-[10px] text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[9px] font-semibold text-slate-600 mb-1 cursor-pointer">
              <input type="checkbox" checked={!!data.verbalConsent} onChange={e => onChange("verbalConsent", e.target.checked)} className="w-4 h-4 accent-purple-600" />
              <span>Verbal Consent</span>
            </label>
            <p className="text-[8px] text-slate-400 leading-tight">Applicable for clients 15 y/o and above undergoing either CBS or self-testing</p>
          </div>
          <div>
            <label className="block text-[9px] font-semibold text-slate-600 mb-1">Contact Number</label>
            <input type="tel" placeholder="+63 XXX XXX XXXX" value={data.contactNumber} onChange={e => onChange("contactNumber", e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-[10px] text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-semibold text-slate-600 mb-1">Email Address</label>
          <input type="email" placeholder="client@email.com" value={data.email} onChange={e => onChange("email", e.target.value)}
            className="w-full max-w-xs rounded border border-slate-300 px-3 py-2 text-[10px] text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
        </div>
        <label className="flex items-start gap-2 cursor-pointer text-[10px] text-slate-700">
          <input type="checkbox" checked={!!data.consentConfirmed} onChange={e => onChange("consentConfirmed", e.target.checked)} className="mt-0.5 w-4 h-4 accent-purple-600 shrink-0" />
          <span className="underline decoration-purple-400 underline-offset-2">I confirm that the client has provided informed consent and understands the HIV testing process.</span>
        </label>
      </div>
    </div>
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-[9px] text-amber-700">
      <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <p>By allowing the client to provide contact details, the HTS provider is allowed to contact the client on updates regarding services provided including but not limited to: test result, combination prevention services, and notification for retesting.</p>
    </div>
  </div>
);

/* ─ Step 2: Demographic Data ─ */
const HivDemographicsStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">Demographic Data</h2>
      <p className="text-[10px] text-purple-600 mt-1">Personal Information Sheet — All information is STRICTLY CONFIDENTIAL. Fill out COMPLETELY and as honestly as possible. Write in CAPITAL LETTERS.</p>
    </div>
    <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-5 text-[9px] text-blue-700">
      <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Please check the appropriate boxes and fill in all required fields accurately.
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">Demographic Data</h3>
      </div>
      <div className="divide-y divide-slate-100">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-[10px] font-semibold text-slate-700">Test Date</span>
          </div>
          <div className="grid grid-cols-3 gap-3 ml-8">
            {["testDateMonth","testDateDay","testDateYear"].map((f,i) => (
              <input key={f} type="text" placeholder={["Month","Day","Year"][i]} value={data[f]} onChange={e => onChange(f, e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-[10px] font-semibold text-slate-700">PhilHealth Number</span>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <input type="text" placeholder="XX-XXXXXXXXXX-X" value={data.philhealth} onChange={e => onChange("philhealth", e.target.value)} disabled={!!data.noPhilhealth}
              className="w-48 rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-400" />
            <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer">
              <input type="checkbox" checked={!!data.noPhilhealth} onChange={e => onChange("noPhilhealth", e.target.checked)} className="w-4 h-4 accent-purple-600" />
              Not enrolled in PhilHealth
            </label>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-[10px] font-semibold text-slate-700">PhilSys Number</span>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <input type="text" placeholder="XXXX-XXXX-XXXX" value={data.philsys} onChange={e => onChange("philsys", e.target.value)} disabled={!!data.noPhilsys}
              className="w-48 rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-400" />
            <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer">
              <input type="checkbox" checked={!!data.noPhilsys} onChange={e => onChange("noPhilsys", e.target.checked)} className="w-4 h-4 accent-purple-600" />
              No PhilSys Number
            </label>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-[10px] font-semibold text-slate-700">Name (Full Name)</span>
          </div>
          <div className="grid grid-cols-4 gap-3 ml-8">
            {[["firstName","First Name"],["middleName","Middle Name"],["lastName","Last Name"],["suffix","Suffix"]].map(([f,ph]) => (
              <input key={f} type="text" placeholder={ph} value={data[f]} onChange={e => onChange(f, e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">5</span>
            <span className="text-[10px] font-semibold text-slate-700">Family Reference</span>
          </div>
          <div className="grid grid-cols-3 gap-3 ml-8">
            <input type="text" placeholder="First 2 letters of Mother's name" value={data.motherInitials} onChange={e => onChange("motherInitials", e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
            <input type="text" placeholder="First 2 letters of Father's name" value={data.fatherInitials} onChange={e => onChange("fatherInitials", e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
            <input type="text" placeholder="Birth Order (among mother's children)" value={data.birthOrder} onChange={e => onChange("birthOrder", e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">6</span>
            <span className="text-[10px] font-semibold text-slate-700">Birth Date &amp; Age</span>
          </div>
          <div className="ml-8">
            <p className="text-[9px] text-slate-500 mb-2">Birth Date</p>
            <div className="grid grid-cols-5 gap-3">
              {["dobMonth","dobDay","dobYear"].map((f,i) => (
                <input key={f} type="text" placeholder={["Month","Day","Year"][i]} value={data[f]} onChange={e => onChange(f, e.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
              ))}
              <input type="number" placeholder="Age" value={data.age} onChange={e => onChange("age", e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
              <input type="number" placeholder="Age in months (< 1 year)" value={data.ageMonths} onChange={e => onChange("ageMonths", e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-[10px] outline-none focus:border-purple-500" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">7</span>
            <span className="text-[10px] font-semibold text-slate-700">Sex &amp; Gender Identity</span>
          </div>
          <div className="ml-8 flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <span className="text-[9px] font-semibold text-slate-600 w-40 shrink-0">Sex (assigned at birth):</span>
              {["Male","Female"].map(s => (
                <label key={s} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                  <input type="radio" name="hts-sex" value={s} checked={data.sex === s} onChange={() => onChange("sex", s)} className="accent-purple-600 w-4 h-4" />
                  {s}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[9px] font-semibold text-slate-600 w-40 shrink-0">Gender Identity:</span>
              {["Man","Woman","Others"].map(g => (
                <label key={g} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                  <input type="radio" name="hts-gender" value={g} checked={data.gender === g} onChange={() => onChange("gender", g)} className="accent-purple-600 w-4 h-4" />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">8</span>
            <span className="text-[10px] font-semibold text-slate-700">Place of Residence &amp; Birth</span>
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-semibold text-slate-600 w-44 shrink-0">Current Place of Residence:</span>
              <input type="text" placeholder="City/Municipality" value={data.currentCity} onChange={e => onChange("currentCity", e.target.value)}
                className="flex-1 min-w-[120px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
              <input type="text" placeholder="Province" value={data.currentProvince} onChange={e => onChange("currentProvince", e.target.value)}
                className="flex-1 min-w-[120px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
              <span className="text-[9px] font-semibold text-slate-600 shrink-0">Permanent Residence:</span>
              <input type="text" placeholder="City/Municipality" value={data.permCity} onChange={e => onChange("permCity", e.target.value)}
                className="flex-1 min-w-[120px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
              <input type="text" placeholder="Province" value={data.permProvince} onChange={e => onChange("permProvince", e.target.value)}
                className="flex-1 min-w-[120px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-slate-600 w-44 shrink-0">Place of Birth:</span>
              <input type="text" placeholder="City/Municipality" value={data.birthCity} onChange={e => onChange("birthCity", e.target.value)}
                className="flex-1 max-w-[180px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
              <input type="text" placeholder="Province" value={data.birthProvince} onChange={e => onChange("birthProvince", e.target.value)}
                className="flex-1 max-w-[180px] rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">9</span>
            <span className="text-[10px] font-semibold text-slate-700">Nationality</span>
          </div>
          <div className="ml-8 flex items-center gap-6">
            {["Filipino","Other"].map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-nationality" value={v} checked={(data.nationality || "Filipino") === v}
                  onChange={() => { onChange("nationality", v); if(v !== "Other") onChange("nationalityOther",""); }} className="accent-purple-600 w-4 h-4" />
                {v === "Other" ? "Other, please specify:" : v}
              </label>
            ))}
            {data.nationality === "Other" && (
              <input type="text" placeholder="Specify nationality" value={data.nationalityOther} onChange={e => onChange("nationalityOther", e.target.value)}
                className="rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500 w-40" />
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">10</span>
            <span className="text-[10px] font-semibold text-slate-700">Civil Status</span>
          </div>
          <div className="ml-8 flex flex-wrap gap-4">
            {["Single","Married","Separated","Widowed","Divorced"].map(s => (
              <label key={s} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-civil" value={s} checked={data.civilStatus === s} onChange={() => onChange("civilStatus", s)} className="accent-purple-600 w-4 h-4" />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">11</span>
            <span className="text-[10px] font-semibold text-slate-700">Are you currently living with a partner?</span>
          </div>
          <div className="ml-8 flex items-center gap-6">
            {["No","Yes"].map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-partner" value={v} checked={data.hasPartner === v} onChange={() => onChange("hasPartner", v)} className="accent-purple-600 w-4 h-4" />
                {v}
              </label>
            ))}
            <span className="text-[10px] font-semibold text-slate-600 ml-4">Number of children:</span>
            <input type="number" min="0" value={data.numChildren} onChange={e => onChange("numChildren", e.target.value)}
              className="w-20 rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">12</span>
            <span className="text-[10px] font-semibold text-slate-700">Are you currently pregnant? <span className="text-[9px] font-normal text-slate-400">(for female clients only)</span></span>
          </div>
          <div className="ml-8 flex gap-6">
            {["No","Yes"].map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-pregnant" value={v} checked={data.pregnant === v} onChange={() => onChange("pregnant", v)} className="accent-purple-600 w-4 h-4" />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─ Step 3: Education & Occupation ─ */
const HivEducationStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">Education &amp; Occupation</h2>
      <p className="text-[10px] text-purple-600 mt-1">Educational background and employment information.</p>
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">Education &amp; Occupation</h3>
      </div>
      <div className="divide-y divide-slate-100">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">13</span>
            <span className="text-[10px] font-semibold text-slate-700">Highest Education Attainment?</span>
          </div>
          <div className="ml-8 flex flex-wrap gap-4">
            {["No grade completed","Pre-school","Elementary","Highschool","College","Vocational","Post-Graduate"].map(e => (
              <label key={e} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="checkbox" checked={!!data[`edu_${e.replace(/[\s-]/g,"_")}`]}
                  onChange={ev => onChange(`edu_${e.replace(/[\s-]/g,"_")}`, ev.target.checked)} className="w-4 h-4 accent-purple-600" />
                {e}
              </label>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">14</span>
            <span className="text-[10px] font-semibold text-slate-700">Are you currently in school?</span>
          </div>
          <div className="ml-8 flex gap-6">
            {["No","Yes"].map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-school" value={v} checked={data.inSchool === v} onChange={() => onChange("inSchool", v)} className="accent-purple-600 w-4 h-4" />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">15</span>
            <span className="text-[10px] font-semibold text-slate-700">Are you currently working?</span>
          </div>
          <div className="ml-8 space-y-2">
            <label className="flex items-start gap-2 text-[10px] text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!data.currentlyWorking} onChange={e => onChange("currentlyWorking", e.target.checked)} className="w-4 h-4 accent-purple-600 mt-0.5 shrink-0" />
              <span>Yes. Current occupation (main source of income):</span>
            </label>
            {data.currentlyWorking && (
              <input type="text" placeholder="Current occupation" value={data.occupation} onChange={e => onChange("occupation", e.target.value)}
                className="ml-6 w-64 rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
            )}
            <label className="flex items-start gap-2 text-[10px] text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!data.notWorking} onChange={e => onChange("notWorking", e.target.checked)} className="w-4 h-4 accent-purple-600 mt-0.5 shrink-0" />
              <span>No. Previous occupation in the past 12 months:</span>
            </label>
            {data.notWorking && (
              <input type="text" placeholder="Previous occupation" value={data.prevOccupation} onChange={e => onChange("prevOccupation", e.target.value)}
                className="ml-6 w-64 rounded border border-slate-300 px-3 py-1.5 text-[10px] outline-none focus:border-purple-500" />
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold flex items-center justify-center shrink-0">16</span>
            <span className="text-[10px] font-semibold text-slate-700">Did you reside or work overseas/abroad in the past 6 years?</span>
          </div>
          <div className="ml-8 flex gap-6">
            {["No","Yes"].map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                <input type="radio" name="hts-overseas" value={v} checked={data.overseas === v} onChange={() => onChange("overseas", v)} className="accent-purple-600 w-4 h-4" />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─ Step 4: Risk Assessment ─ */
const HivRiskStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">Risk Assessment</h2>
      <p className="text-[10px] text-purple-600 mt-1">Information about HIV testing history and risk factors.</p>
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">Testing History &amp; Sub-population</h3>
      </div>
      <div className="p-5 grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-bold text-[#1E3A5F] mb-2 uppercase tracking-wider">Sub-population Group</label>
            <select value={data.popGroup} onChange={e => onChange("popGroup", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[10px] text-slate-700 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 bg-white">
              <option value="">Select Sub-population...</option>
              <option value="MSM">Men who have Sex with Men (MSM)</option>
              <option value="TGW">Transgender Women (TGW)</option>
              <option value="FSW">Female Sex Worker (FSW)</option>
              <option value="PWID">People Who Inject Drugs (PWID)</option>
              <option value="Partner of PLHIV">Partner of PLHIV</option>
              <option value="OFW">Overseas Filipino Worker (OFW)</option>
              <option value="General Population">General Population</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-[#1E3A5F] mb-2 uppercase tracking-wider">Reason for HIV Testing</label>
            <select value={data.reason} onChange={e => onChange("reason", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[10px] text-slate-700 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 bg-white">
              <option value="">Select Reason...</option>
              <option value="Voluntary">Voluntary / Self-referred</option>
              <option value="Employment">Employment requirement</option>
              <option value="Pre-marital">Pre-marital counseling</option>
              <option value="Travel">Travel / Visa requirement</option>
              <option value="Referral">Medical Referral</option>
              <option value="Exposure">Known exposure history</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 gap-4">
            <span className="text-[9px] font-semibold text-[#1E3A5F]">Had a previous HIV test?</span>
            <div className="flex gap-4">
              {["yes","no"].map(v => (
                <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                  <input type="radio" name="hts-prevtest" value={v} checked={data.prevTest === v} onChange={() => onChange("prevTest", v)} className="accent-purple-600 w-4 h-4" />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="absolute -top-2.5 left-3 bg-white px-1 text-[9px] font-medium text-purple-600 leading-none z-10">Date of Previous Test (if applicable)</span>
            <input type="date" value={data.prevTestDate} onChange={e => onChange("prevTestDate", e.target.value)} disabled={data.prevTest !== "yes"}
              className="w-full rounded-lg border border-slate-300 px-3 pt-4 pb-2.5 text-[10px] text-slate-700 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 disabled:bg-slate-50 disabled:text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─ Step 5: Medical History & Pre-Test Checklist ─ */
const PRE_TEST_CHECKLIST = [
  "Explained the purpose and benefits of HIV testing",
  "Discussed what a positive and negative result means",
  "Assessed client's risk factors and behaviors",
  "Discussed confidentiality and consent",
  "Provided information on HIV transmission and prevention",
  "Client asked questions and received adequate answers",
];

const HivMedicalStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">Medical History</h2>
      <p className="text-[10px] text-purple-600 mt-1">Client's relevant medical history and pre-test counseling checklist.</p>
    </div>
    <div className="rounded-lg overflow-hidden border border-slate-200 mb-5">
      <div className="bg-[#1E3A5F] px-5 py-3">
        <h3 className="text-[9px] font-bold text-white uppercase tracking-widest">Medical History</h3>
      </div>
      <div className="p-5 grid gap-3">
        {[
          { key: "unusualDischarge", label: "Unusual discharge from penis/vagina/anus?" },
          { key: "soresRashes",      label: "Sores or rashes on genital area or body?" },
          { key: "painUrination",    label: "Pain or burning sensation during urination?" },
          { key: "historySTI",       label: "History of sexually transmitted infection (STI)?" },
          { key: "tbHistory",        label: "History of tuberculosis (TB) or current TB treatment?" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 gap-4">
            <span className="text-[9px] font-semibold text-[#1E3A5F]">{label}</span>
            <div className="flex gap-4 shrink-0">
              {["yes","no"].map(v => (
                <label key={v} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer">
                  <input type="radio" name={`hts-med-${key}`} value={v} checked={data[key] === v} onChange={() => onChange(key, v)} className="accent-purple-600 w-4 h-4" />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-purple-950">Pre-Test Counseling Checklist</h3>
          <p className="text-[9px] text-slate-500 mt-0.5">Check all topics discussed with the client before testing</p>
        </div>
      </div>
      <div className="h-0.5 bg-purple-200 rounded-full mb-4" />
      <div className="flex flex-col gap-3">
        {PRE_TEST_CHECKLIST.map((item, idx) => {
          const key = `preCheck${idx}`;
          return (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!data[key]} onChange={e => onChange(key, e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-purple-600 shrink-0" />
              <span className={`text-[10px] leading-relaxed transition-colors ${data[key] ? "text-slate-800 font-medium" : "text-slate-500"}`}>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  </div>
);

/* ─ Step 6: Provider Details & Test Results ─ */
const POST_TEST_CHECKLIST = [
  "Disclosed test result to the client",
  "Provided counseling based on test result",
  "Discussed partner notification (if applicable)",
  "Provided referral for confirmatory testing (if reactive)",
  "Discussed prevention strategies and risk reduction",
  "Scheduled follow-up / repeat testing (if indicated)",
];

const HivProviderStep = ({ data, onChange }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-base font-bold text-[#1E3A5F]">Provider Details &amp; Test Results</h2>
      <p className="text-[10px] text-purple-600 mt-1">Record the HIV test result, post-test counseling, and referral information.</p>
    </div>
    <div className="grid gap-5">
      <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-5">
        <h3 className="text-[10px] font-bold text-purple-950 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-purple-600 rounded-full" />
          HIV Rapid Screening Test Details
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <TextField label="Test Kit Name / Brand" value={data.kitName} onChange={e => onChange("kitName", e.target.value)} />
          <TextField label="Lot / Batch Number" value={data.lotNo} onChange={e => onChange("lotNo", e.target.value)} />
          <TextField label="Kit Expiry Date" type="date" value={data.expiryDate} onChange={e => onChange("expiryDate", e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <TextField label="Date of Test" type="date" value={data.dateOfTest} onChange={e => onChange("dateOfTest", e.target.value)} />
          <div className="col-span-2">
            <label className="block text-[9px] font-bold text-[#1E3A5F] mb-2 uppercase tracking-wider">Screening Test Result</label>
            <div className="flex gap-6 bg-white border border-slate-200 rounded-lg px-4 py-3">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold text-emerald-700">
                <input type="radio" name="hts-result" value="non-reactive" checked={data.result === "non-reactive"} onChange={() => onChange("result", "non-reactive")} className="accent-emerald-600 w-4 h-4" />
                Non-reactive
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold text-red-600">
                <input type="radio" name="hts-result" value="reactive" checked={data.result === "reactive"} onChange={() => onChange("result", "reactive")} className="accent-red-600 w-4 h-4" />
                Reactive
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold text-amber-600">
                <input type="radio" name="hts-result" value="invalid" checked={data.result === "invalid"} onChange={() => onChange("result", "invalid")} className="accent-amber-500 w-4 h-4" />
                Invalid / Indeterminate
              </label>
            </div>
          </div>
        </div>
      </div>
      {data.result === "reactive" && (
        <div className="rounded-xl border border-red-300 bg-red-50/60 p-5">
          <h3 className="text-[10px] font-bold text-red-700 mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Reactive — Confirmatory Testing Required
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Confirmatory Test Date" type="date" value={data.confirmatoryDate} onChange={e => onChange("confirmatoryDate", e.target.value)} />
            <TextField label="Confirmatory Test Result" value={data.confirmatoryResult} onChange={e => onChange("confirmatoryResult", e.target.value)} />
          </div>
        </div>
      )}
      <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-purple-950">Post-Test Counseling Checklist</h3>
            <p className="text-[9px] text-slate-500 mt-0.5">Check all items completed during post-test counseling</p>
          </div>
        </div>
        <div className="h-0.5 bg-purple-200 rounded-full mb-4" />
        <div className="flex flex-col gap-3">
          {POST_TEST_CHECKLIST.map((item, idx) => {
            const key = `postCheck${idx}`;
            return (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={!!data[key]} onChange={e => onChange(key, e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-purple-600 shrink-0" />
                <span className={`text-[10px] leading-relaxed transition-colors ${data[key] ? "text-slate-800 font-medium" : "text-slate-500"}`}>{item}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-bold text-[#1E3A5F] mb-2 uppercase tracking-wider">Referred to (Facility/Service)</label>
          <TextField label="Referral destination" value={data.referral} onChange={e => onChange("referral", e.target.value)} />
        </div>
        <TextField label="Scheduled Follow-up Date" type="date" value={data.followUpDate} onChange={e => onChange("followUpDate", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Post-Test Counselor / Provider" value={data.provider} onChange={e => onChange("provider", e.target.value)} />
        <TextField label="Remarks / Action Taken" value={data.remarks} onChange={e => onChange("remarks", e.target.value)} rows={3} />
      </div>
    </div>
  </div>
);


/* ─── Main Component ────────────────────────────────────────────────── */
const StaffAssessmentView = () => {
  const [activeForm, setActiveForm] = useState("fp"); // "fp" or "hiv"
  const [fpTab, setFpTab] = useState("side-a");        // "side-a" or "side-b"
  const [hivCurrentStep, setHivCurrentStep] = useState(0); // 0-5 for 6 HTS steps
  const [hivSaved, setHivSaved] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [visitsSubmitted, setVisitsSubmitted] = useState(false);

  const [visits, setVisits] = useState([
    {
      dateOfVisit: "",
      medicalFindings: "",
      methodAccepted: "",
      providerName: "",
      providerSignature: "",
      followUpDate: ""
    }
  ]);

  const handleAddVisit = () => {
    setVisits(prev => [
      ...prev,
      {
        dateOfVisit: "",
        medicalFindings: "",
        methodAccepted: "",
        providerName: "",
        providerSignature: "",
        followUpDate: ""
      }
    ]);
  };

  const handleDeleteVisit = (index) => {
    setVisits(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleVisitChange = (index, field, value) => {
    setVisits(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const [formData, setFormData] = useState({
    clientInfo: {
      clientId: "", philhealth: "", nhts: "", fourPs: "",
      firstName: "", middleName: "", lastName: "",
      dob: "", age: "", educationalAttainment: "", occupation: "",
      houseUnitNo: "", street: "", barangay: "", municipalityCity: "", province: "",
      contact: "", civilStatus: "", religion: "",
      spouseLastName: "", spouseFirstName: "", spouseMiddleName: "",
      spouseDob: "", spouseAge: "", spouseOccupation: "",
      livingChildren: "", planMoreChildren: "", averageMonthlyIncome: "",
    },
    clientType: {
      type: "", fpReason: "", fpOther: "",
      method: "", methodOther: "",
      medicalCondition: false, sideEffects: false, additionalNotes: "",
    },
    medicalHistory: {
      severeHeadaches: "", strokeHeartHypertension: "", frequentBruisingBleeding: "",
      breastCancerMass: "", severeChestPain: "", coughMoreThan14Days: "",
      jaundice: "", unexplainedVaginalBleeding: "", abnormalVaginalDischarge: "",
      phenobarbitalRifampicin: "", smoker: "", withDisability: "", disabilityDetails: "",
    },
    obstetrical: {
      gravida: "", parity: "", term: "", premature: "", abortion: "", living: "",
      lastDeliveryDate: "", lastDeliveryType: "", lmp: "", previousMenstrualPeriod: "",
      menstrualFlow: "", dysmenorrhea: "", hydatidiformMole: "", ectopicPregnancy: "",
      pregQ1: "", pregQ2: "", pregQ3: "", pregQ4: "", pregQ5: "", pregQ6: "",
    },
    stiRisks: {
      abnormalDischarge: "", dischargeFromVagina: false, dischargeFromPenis: false,
      soresUlcers: "", painBurningGenital: "", historyTreatmentSTI: "", hivAidsPid: "",
    },
    vawRisks: {
      unpleasantRelationship: "", partnerDisapprovesFPVisit: "", historyDomesticViolenceVAW: "",
      referredDSWD: false, referredWCPU: false, referredNGOs: false,
      referredOthers: false, referredOthersSpecify: "", counselingNotes: "",
    },
    physicalExam: {
      weight: "", bp: "", height: "", pulse: "",
      skinNormal: false, skinPale: false, skinYellowish: false, skinHematoma: false,
      conjunctivaNormal: false, conjunctivaPale: false, conjunctivaYellowish: false,
      neckNormal: false, neckMass: false, neckEnlargedLymphNodes: false,
      breastNormal: false, breastMass: false, breastNippleDischarge: false,
      abdomenNormal: false, abdomenMass: false, abdomenVaricosities: false,
      extremitiesNormal: false, extremitiesEdema: false, extremitiesVaricosities: false,
      pelvicNormal: false, pelvicMass: false, pelvicAbnormalDischarge: false,
      cervicalAbnormalities: false, cervicalWarts: false, cervicalPolypOrCyst: false,
      cervicalInflammationOrErosion: false, cervicalBloodyDischarge: false,
      cervicalConsistency: false, cervicalFirm: false, cervicalSoft: false,
      cervicalTenderness: false, adnexalMassTenderness: false,
      uterinePosition: false, uterineMid: false, uterineAnteflexed: false,
      uterineRetroflexed: false, uterineDepth: "", additionalNotes: "",
    },
    visitRecords: {
      visitDate: "", nextVisit: "", services: "", meds: "", provider: "", remarks: "",
    },
  });

  /* HTS Form 2021 — unified state */
  const [hivFormData, setHivFormData] = useState({
    // Step 1: Consent
    clientName: "", verbalConsent: false, contactNumber: "", email: "", consentConfirmed: false,
    // Step 2: Demographics
    testDateMonth: "", testDateDay: "", testDateYear: "",
    philhealth: "", noPhilhealth: false, philsys: "", noPhilsys: false,
    firstName: "", middleName: "", lastName: "", suffix: "",
    motherInitials: "", fatherInitials: "", birthOrder: "",
    dobMonth: "", dobDay: "", dobYear: "", age: "", ageMonths: "",
    sex: "", gender: "",
    currentCity: "", currentProvince: "", permCity: "", permProvince: "",
    birthCity: "", birthProvince: "",
    nationality: "Filipino", nationalityOther: "",
    civilStatus: "", hasPartner: "", numChildren: "", pregnant: "",
    // Step 3: Education
    inSchool: "", currentlyWorking: false, occupation: "", notWorking: false, prevOccupation: "", overseas: "",
    // Step 4: Risk
    popGroup: "", reason: "", prevTest: "", prevTestDate: "",
    // Step 5: Medical
    unusualDischarge: "", soresRashes: "", painUrination: "", historySTI: "", tbHistory: "",
    preCheck0: false, preCheck1: false, preCheck2: false,
    preCheck3: false, preCheck4: false, preCheck5: false,
    // Step 6: Provider
    kitName: "", lotNo: "", expiryDate: "", dateOfTest: "", result: "",
    confirmatoryDate: "", confirmatoryResult: "",
    postCheck0: false, postCheck1: false, postCheck2: false,
    postCheck3: false, postCheck4: false, postCheck5: false,
    referral: "", followUpDate: "", provider: "", remarks: "",
  });

  const updateHivForm = (field, value) =>
    setHivFormData(prev => ({ ...prev, [field]: value }));

  /* ─── localStorage Auto-Save Hooks ────────────────────────────────── */
  const fpFormASave = useLocalStorageSave("fp_assessment_form_a_data", formData);
  const fpFormBSave = useLocalStorageSave("fp_assessment_form_b_data", visits);
  const hivFormSave = useLocalStorageSave("hiv_assessment_form_data", hivFormData);

  /* ─── Unsaved Form Warning ────────────────────────────────────────── */
  const hasUnsavedFPA = fpFormASave.hasUnsavedChanges && !submitted;
  const hasUnsavedFPB = fpFormBSave.hasUnsavedChanges && !visitsSubmitted;
  useUnsavedFormWarning(hasUnsavedFPA || hasUnsavedFPB, "FP Assessment Form");

  /* ─── Load Saved Data on Mount ────────────────────────────────────── */
  useEffect(() => {
    const savedFormA = fpFormASave.loadData();
    const savedFormB = fpFormBSave.loadData();
    const savedHiv = hivFormSave.loadData();

    if (savedFormA && Object.keys(savedFormA).length > 0) {
      setFormData(prev => deepMerge(prev, savedFormA));
    }

    if (savedFormB && Array.isArray(savedFormB) && savedFormB.length > 0) {
      setVisits(savedFormB);
    }

    if (savedHiv && Object.keys(savedHiv).length > 0) {
      setHivFormData(prev => deepMerge(prev, savedHiv));
    }
    // Only run on mount - disable eslint rule since we're intentionally loading data once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Auto-Save formData on Change ────────────────────────────────── */
  useEffect(() => {
    if (formData && formData.clientInfo) {
      fpFormASave.autoSave(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  /* ─── Auto-Save visits on Change ──────────────────────────────────── */
  useEffect(() => {
    if (visits && Array.isArray(visits)) {
      fpFormBSave.autoSave(visits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits]);

  /* ─── Auto-Save hivFormData on Change ─────────────────────────────── */
  useEffect(() => {
    if (hivFormData && hivFormData.clientName !== "") {
      hivFormSave.autoSave(hivFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hivFormData]);

  /* ─── Form Reset & Clear Handlers ─────────────────────────────────── */
  const handleResetFormA = () => {
    if (window.confirm("Are you sure you want to clear all Side A data? This action cannot be undone.")) {
      setFormData({
        clientInfo: {
          clientId: "", philhealth: "", nhts: "", fourPs: "",
          firstName: "", middleName: "", lastName: "",
          dob: "", age: "", educationalAttainment: "", occupation: "",
          houseUnitNo: "", street: "", barangay: "", municipalityCity: "", province: "",
          contact: "", civilStatus: "", religion: "",
          spouseLastName: "", spouseFirstName: "", spouseMiddleName: "",
          spouseDob: "", spouseAge: "", spouseOccupation: "",
          livingChildren: "", planMoreChildren: "", averageMonthlyIncome: "",
        },
        clientType: {
          type: "", fpReason: "", fpOther: "",
          method: "", methodOther: "",
          medicalCondition: false, sideEffects: false, additionalNotes: "",
        },
        medicalHistory: {
          severeHeadaches: "", strokeHeartHypertension: "", frequentBruisingBleeding: "",
          breastCancerMass: "", severeChestPain: "", coughMoreThan14Days: "",
          jaundice: "", unexplainedVaginalBleeding: "", abnormalVaginalDischarge: "",
          phenobarbitalRifampicin: "", smoker: "", withDisability: "", disabilityDetails: "",
        },
        obstetrical: {
          gravida: "", parity: "", term: "", premature: "", abortion: "", living: "",
          lastDeliveryDate: "", lastDeliveryType: "", lmp: "", previousMenstrualPeriod: "",
          menstrualFlow: "", dysmenorrhea: "", hydatidiformMole: "", ectopicPregnancy: "",
          pregQ1: "", pregQ2: "", pregQ3: "", pregQ4: "", pregQ5: "", pregQ6: "",
        },
        stiRisks: {
          abnormalDischarge: "", dischargeFromVagina: false, dischargeFromPenis: false,
          soresUlcers: "", painBurningGenital: "", historyTreatmentSTI: "", hivAidsPid: "",
        },
        vawRisks: {
          unpleasantRelationship: "", partnerDisapprovesFPVisit: "", historyDomesticViolenceVAW: "",
          referredDSWD: false, referredWCPU: false, referredNGOs: false,
          referredOthers: false, referredOthersSpecify: "", counselingNotes: "",
        },
        physicalExam: {
          weight: "", bp: "", height: "", pulse: "",
          skinNormal: false, skinPale: false, skinYellowish: false, skinHematoma: false,
          conjunctivaNormal: false, conjunctivaPale: false, conjunctivaYellowish: false,
          neckNormal: false, neckMass: false, neckEnlargedLymphNodes: false,
          breastNormal: false, breastMass: false, breastNippleDischarge: false,
          abdomenNormal: false, abdomenMass: false, abdomenVaricosities: false,
          extremitiesNormal: false, extremitiesEdema: false, extremitiesVaricosities: false,
          pelvicNormal: false, pelvicMass: false, pelvicAbnormalDischarge: false,
          cervicalAbnormalities: false, cervicalWarts: false, cervicalPolypOrCyst: false,
          cervicalInflammationOrErosion: false, cervicalBloodyDischarge: false,
          cervicalConsistency: false, cervicalFirm: false, cervicalSoft: false,
          cervicalTenderness: false, adnexalMassTenderness: false,
          uterinePosition: false, uterineMid: false, uterineAnteflexed: false,
          uterineRetroflexed: false, uterineDepth: "", additionalNotes: "",
        },
        visitRecords: {
          visitDate: "", nextVisit: "", services: "", meds: "", provider: "", remarks: "",
        },
      });
      fpFormASave.clearData();
      setCurrentStep(0);
      setSubmitted(false);
    }
  };

  const handleResetFormB = () => {
    if (window.confirm("Are you sure you want to clear all Visit Records data? This action cannot be undone.")) {
      setVisits([
        {
          dateOfVisit: "",
          medicalFindings: "",
          methodAccepted: "",
          providerName: "",
          providerSignature: "",
          followUpDate: ""
        }
      ]);
      fpFormBSave.clearData();
      setVisitsSubmitted(false);
    }
  };

  const handleSubmitFormA = () => {
    setSubmitted(true);
    // Clear localStorage data after successful submission
    setTimeout(() => {
      fpFormASave.clearData();
    }, 500);
  };

  const handleSubmitFormB = () => {
    setVisitsSubmitted(true);
    // Clear localStorage data after successful submission
    setTimeout(() => {
      fpFormBSave.clearData();
    }, 500);
  };

  const updateSection = (section) => (field, value) =>
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const stepComponents = [
    <ClientInfoStep data={formData.clientInfo} onChange={updateSection("clientInfo")} />,
    <ClientTypeStep data={formData.clientType} onChange={updateSection("clientType")} />,
    <MedicalHistoryStep data={formData.medicalHistory} onChange={updateSection("medicalHistory")} />,
    <ObstetricalStep data={formData.obstetrical} onChange={updateSection("obstetrical")} />,
    <STIRisksStep data={formData.stiRisks} onChange={updateSection("stiRisks")} />,
    <VAWRisksStep data={formData.vawRisks} onChange={updateSection("vawRisks")} />,
    <PhysicalExamStep data={formData.physicalExam} onChange={updateSection("physicalExam")} />,
    <ReviewStep allData={formData} onEditSection={setCurrentStep} />,
  ];



  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F9FAFB] p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-100 bg-slate-50/20">
          <h1 className="text-base font-bold text-[#1E3A5F]">
            {activeForm === "fp" ? "Family Planning Client Assessment Record" : "HIV Testing Service (HTS) Form 2021"}
          </h1>
          <span className={`rounded-full px-4 py-1.5 text-[9px] font-bold shadow-sm transition-colors duration-250 ${
            activeForm === "fp"
              ? fpTab === "side-a" ? "bg-[#1E3A5F]/15 text-[#1E3A5F]" : "bg-[#F5C518] text-[#1E3A5F]"
              : "bg-purple-100 text-purple-700"
          }`}>
            {activeForm === "fp"
              ? fpTab === "side-a" ? "FP FORM 1 - Side A" : "FP FORM 1 - Side B"
              : hivSaved ? "HTS Record Saved" : `Step ${hivCurrentStep + 1} of 6 — ${HTS_STEPS[hivCurrentStep].label}`}
          </span>
        </div>

        {/* Main Tab Switcher */}
        <div className="px-8 pt-4">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
            {/* FP Assessment Tab */}
            <button
              type="button"
              onClick={() => setActiveForm("fp")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 text-[10px] font-bold transition-all relative border-r border-slate-200
                ${activeForm === "fp"
                  ? "bg-white text-[#1E3A5F]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100/70"}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                className={`w-4.5 h-4.5 ${activeForm === "fp" ? "text-[#1E3A5F]" : "text-slate-400"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
              <span>FP Assessment — Visit Records</span>
              {activeForm === "fp" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E3A5F]" />
              )}
            </button>

            {/* HIV Testing Tab */}
            <button
              type="button"
              onClick={() => setActiveForm("hiv")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 text-[10px] font-bold transition-all relative
                ${activeForm === "hiv"
                  ? "bg-white text-purple-700"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100/70"}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                className={`w-4.5 h-4.5 ${activeForm === "hiv" ? "text-purple-600" : "text-slate-400"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h3m.325 0l2.5-6 2.5 12 2.5-9 1.5 3h3" />
              </svg>
              <span>HIV Testing (HTS Form 2021)</span>
              {activeForm === "hiv" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* FP Guided Progress Indicator */}
        {activeForm === "fp" && (
          <div className="px-8 pt-5 pb-1">
            {/* Step label */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  fpTab === "side-a" ? "text-[#1E3A5F]" : "text-[#B88900]"
                }`}>
                  {fpTab === "side-a" ? "Step 1 of 2 — FP Assessment (Side A)" : "Step 2 of 2 — Visit Records (Side B)"}
                </span>
              </div>
              {/* Step pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFpTab("side-a")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold border transition-all duration-200 ${
                    fpTab === "side-a"
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-sm"
                      : "bg-white text-slate-500 border-slate-300 hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                  }`}
                >
                  {submitted ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-3 h-3 flex items-center justify-center text-[8px]">1</span>
                  )}
                  Side A
                </button>
                <div className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
                  submitted ? "bg-[#1E3A5F]" : "bg-slate-200"
                }`} />
                <button
                  type="button"
                  onClick={() => submitted && setFpTab("side-b")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold border transition-all duration-200 ${
                    fpTab === "side-b"
                      ? "bg-[#F5C518] text-[#1E3A5F] border-[#F5C518] shadow-sm"
                      : submitted
                        ? "bg-white text-slate-500 border-slate-300 hover:border-[#F5C518] hover:text-[#B88900]"
                        : "bg-white text-slate-300 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <span className="w-3 h-3 flex items-center justify-center text-[8px]">2</span>
                  Side B
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: fpTab === "side-a" ? "50%" : "100%",
                  background: fpTab === "side-a"
                    ? "linear-gradient(90deg, #1E3A5F 0%, #4E6E85 100%)"
                    : "linear-gradient(90deg, #1E3A5F 0%, #F5C518 100%)"
                }}
              />
            </div>
          </div>
        )}

        {/* HTS 6-Step DOH Progress Indicator */}
        {activeForm === "hiv" && !hivSaved && (
          <div className="pt-5 pb-2 overflow-x-auto">
            {/* Step nodes */}
            <div className="flex items-start min-w-max gap-0 px-6">
              {HTS_STEPS.map((step, idx) => {
                const isActive = idx === hivCurrentStep;
                const isDone = idx < hivCurrentStep;
                return (
                  <React.Fragment key={step.id}>
                    <div
                      className="flex flex-col items-center gap-1.5 cursor-pointer"
                      style={{ minWidth: 90 }}
                      onClick={() => isDone && setHivCurrentStep(idx)}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200
                        ${isActive
                          ? "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : isDone
                            ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                            : "border-slate-300 bg-white text-slate-400"}`}>
                        {isDone ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[8px] font-semibold text-center leading-tight max-w-[80px]
                        ${isActive ? "text-purple-700" : isDone ? "text-[#1E3A5F]" : "text-slate-400"}`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < HTS_STEPS.length - 1 && (
                      <div className={`mt-5 h-0.5 flex-1 min-w-[20px] transition-colors duration-300
                        ${isDone ? "bg-[#1E3A5F]" : "bg-slate-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Step label & progress bar */}
            <div className="px-6 mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-purple-700 uppercase tracking-widest">
                  Step {hivCurrentStep + 1} of 6 — {HTS_STEPS[hivCurrentStep].label}
                </span>
                <div className="flex items-center gap-2 text-[9px]">
                  {hivFormSave.isSaving && (
                    <>
                      <div className="animate-spin w-3 h-3 border-1.5 border-slate-300 border-t-purple-600 rounded-full" />
                      <span className="text-slate-500">Saving...</span>
                    </>
                  )}
                  {!hivFormSave.isSaving && hivFormSave.lastSaveTime && !hivFormSave.hasUnsavedChanges && (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-500">Saved at {hivFormSave.lastSaveTime}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-in-out bg-purple-600"
                  style={{ width: `${((hivCurrentStep + 1) / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {activeForm === "fp" ? (
          <div
            key={fpTab}
            style={{ animation: "fpFadeIn 0.28s ease" }}
          >
            <style>{`@keyframes fpFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {fpTab === "side-a" ? (
              submitted ? (
                /* ── Side A success / transition screen ── */
                <div className="px-8 py-12 min-h-[380px] flex items-center justify-center">
                  <div className="text-center max-w-sm w-full">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-[#1E3A5F] mb-1">Side A Saved!</h2>
                    <p className="text-slate-500 mb-6 text-[10px] font-medium">FP Assessment recorded. Proceed to fill in Visit Records.</p>
                    {/* Progress mini */}
                    <div className="flex items-center justify-center gap-3 mb-7">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#1E3A5F] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-semibold text-[#1E3A5F]">Side A</span>
                      </div>
                      <div className="h-0.5 w-8 bg-[#F5C518] rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#F5C518] flex items-center justify-center">
                          <span className="text-[8px] font-bold text-[#1E3A5F]">2</span>
                        </div>
                        <span className="text-[9px] font-semibold text-[#B88900]">Side B</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => { setSubmitted(false); setCurrentStep(0); }}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[10px] font-semibold text-slate-600 hover:border-slate-400 transition"
                      >
                        ← Edit Side A
                      </button>
                      <button
                        onClick={() => { setFpTab("side-b"); }}
                        className="rounded-xl bg-[#F5C518] px-7 py-2.5 text-[10px] font-bold text-[#1E3A5F] hover:bg-[#e6b800] transition shadow-md shadow-[#F5C518]/25 hover:-translate-y-0.5 active:translate-y-0 duration-200"
                      >
                        Continue to Visit Records →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Side A internal stepper */}
                  <div className="px-8 py-5 border-b border-slate-100 overflow-x-auto">
                    <div className="flex items-start min-w-max gap-0">
                      {STEPS.map((step, idx) => {
                        const isActive = idx === currentStep;
                        const isDone = idx < currentStep;
                        return (
                          <React.Fragment key={step.id}>
                            <div
                              className="flex flex-col items-center gap-1.5 cursor-pointer"
                              style={{ minWidth: 80 }}
                              onClick={() => isDone && setCurrentStep(idx)}
                            >
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                                ${isActive
                                  ? "border-[#F5C518] bg-[#F5C518] text-[#1E3A5F] shadow-md shadow-[#F5C518]/30"
                                  : isDone
                                    ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                                    : "border-slate-300 bg-white text-slate-400"}`}>
                                {isDone ? (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : step.icon()}
                              </div>
                              <span className={`text-[9px] font-semibold text-center leading-tight
                                ${isActive ? "text-[#1E3A5F]" : isDone ? "text-[#1E3A5F]" : "text-slate-400"}`}>
                                {step.label}
                              </span>
                            </div>
                            {idx < STEPS.length - 1 && (
                              <div className={`mt-6 h-0.5 flex-1 min-w-[16px] transition-colors duration-300
                                ${isDone ? "bg-[#1E3A5F]" : "bg-slate-200"}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form content */}
                  <div className="px-8 py-6 min-h-[380px]">
                    {stepComponents[currentStep]}
                  </div>

                  {/* Side A navigation */}
                  <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50/60">
                    <button
                      onClick={() => currentStep > 0 && setCurrentStep(s => s - 1)}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 rounded-xl border px-6 py-2.5 text-[10px] font-semibold transition-all
                        ${currentStep === 0
                          ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                          : "border-slate-300 text-slate-600 bg-white hover:border-[#1E3A5F] hover:text-[#1E3A5F]"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      Previous
                    </button>

                    {currentStep < STEPS.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep(s => s + 1)}
                        className="flex items-center gap-2 rounded-xl bg-[#F5C518] px-6 py-2.5 text-[10px] font-bold text-[#1E3A5F] shadow-md shadow-[#F5C518]/30 hover:bg-[#e6b800] transition-all hover:-translate-y-0.5"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitFormA}
                        className="flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-7 py-2.5 text-[10px] font-bold text-white shadow-md hover:bg-[#152c4a] transition-all hover:-translate-y-0.5"
                      >
                        Submit Side A
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-2 text-[9px]">
                        {fpFormASave.isSaving && (
                          <>
                            <div className="animate-spin w-3 h-3 border-1.5 border-slate-300 border-t-[#F5C518] rounded-full" />
                            <span className="text-slate-500">Saving...</span>
                          </>
                        )}
                        {!fpFormASave.isSaving && fpFormASave.lastSaveTime && !fpFormASave.hasUnsavedChanges && (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-500">Saved at {fpFormASave.lastSaveTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetFormA}
                      className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 hover:border-red-400 transition-colors"
                      title="Clear all form data and localStorage"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Form
                    </button>
                  </div>
                </>
              )
            ) : (
              /* ── Side B: Visit Records ── */
              <div className="min-h-[380px]">
                {/* Side B back nav bar */}
                {!visitsSubmitted && (
                  <div className="flex items-center justify-between px-8 py-3 border-b border-slate-100 bg-slate-50/60">
                    <button
                      type="button"
                      onClick={() => setFpTab("side-a")}
                      className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 hover:text-[#1E3A5F] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      Back to FP Assessment (Side A)
                    </button>
                    <span className="text-[9px] text-slate-400 font-medium">Step 2 of 2 — Visit Records</span>
                  </div>
                )}
                <div className="px-8 py-6">
                  <VisitRecordsStep
                    visits={visits}
                    onChange={handleVisitChange}
                    onAddVisit={handleAddVisit}
                    onDeleteVisit={handleDeleteVisit}
                    onSave={handleSubmitFormB}
                    submitted={visitsSubmitted}
                    setSubmitted={setVisitsSubmitted}
                    obstetricalData={formData.obstetrical}
                    onObstetricalChange={updateSection("obstetrical")}
                  />
                  
                  {/* Side B Action Buttons */}
                  {!visitsSubmitted && (
                    <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[9px]">
                        {fpFormBSave.isSaving && (
                          <>
                            <div className="animate-spin w-3 h-3 border-1.5 border-slate-300 border-t-[#F5C518] rounded-full" />
                            <span className="text-slate-500">Saving...</span>
                          </>
                        )}
                        {!fpFormBSave.isSaving && fpFormBSave.lastSaveTime && !fpFormBSave.hasUnsavedChanges && (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-500">Last saved at {fpFormBSave.lastSaveTime}</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleResetFormB}
                        className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-[9px] font-semibold text-red-600 hover:bg-red-100 hover:border-red-400 transition-colors"
                        title="Clear all visit records and localStorage"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Records
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            key={hivCurrentStep}
            style={{ animation: "hivFadeIn 0.28s ease" }}
          >
            <style>{`@keyframes hivFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {hivSaved ? (
              /* ── HTS Record Saved ── */
              <div className="px-8 py-16 flex items-center justify-center min-h-[420px]">
                <div className="text-center max-w-sm w-full">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-12 w-12 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-purple-950 mb-2">HTS Record Saved!</h2>
                  <p className="text-slate-500 mb-2 font-medium">All 6 steps of the HTS Form 2021 have been saved successfully.</p>
                  <p className="text-[9px] text-slate-400 mb-8">Client: <span className="font-bold text-purple-700">{hivFormData.firstName} {hivFormData.lastName}</span></p>
                  <button
                    onClick={() => { hivFormSave.clearData(); setHivSaved(false); setHivCurrentStep(0); }}
                    className="rounded-xl bg-purple-600 px-7 py-2.5 text-[10px] font-bold text-white hover:bg-purple-700 transition shadow-md"
                  >
                    Start New HTS Record
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Step content */}
                <div className="px-8 py-6 min-h-[420px]">
                  {hivCurrentStep === 0 && <HivConsentStep data={hivFormData} onChange={updateHivForm} />}
                  {hivCurrentStep === 1 && <HivDemographicsStep data={hivFormData} onChange={updateHivForm} />}
                  {hivCurrentStep === 2 && <HivEducationStep data={hivFormData} onChange={updateHivForm} />}
                  {hivCurrentStep === 3 && <HivRiskStep data={hivFormData} onChange={updateHivForm} />}
                  {hivCurrentStep === 4 && <HivMedicalStep data={hivFormData} onChange={updateHivForm} />}
                  {hivCurrentStep === 5 && <HivProviderStep data={hivFormData} onChange={updateHivForm} />}
                </div>

                {/* Footer navigation */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50/60">
                  <button
                    type="button"
                    onClick={() => hivCurrentStep > 0 && setHivCurrentStep(s => s - 1)}
                    disabled={hivCurrentStep === 0}
                    className={`flex items-center gap-2 rounded-xl border px-6 py-2.5 text-[10px] font-semibold transition-all
                      ${hivCurrentStep === 0
                        ? "border-slate-200 text-slate-300 cursor-not-allowed bg-white"
                        : "border-slate-300 text-slate-600 bg-white hover:border-purple-600 hover:text-purple-700"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Previous
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => hivFormSave.autoSave(hivFormData)}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[10px] font-semibold text-slate-600 hover:border-slate-400 transition"
                    >
                      {hivFormSave.isSaving ? "Saving…" : "Save Draft"}
                    </button>
                    {hivCurrentStep < HTS_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setHivCurrentStep(s => s + 1)}
                        className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-[10px] font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                      >
                        Next Step
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { hivFormSave.clearData(); setHivSaved(true); }}
                        className="flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-7 py-2.5 text-[10px] font-bold text-white shadow-md hover:bg-[#152c4a] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                      >
                        Save HTS Record
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAssessmentView;
