import StaffInventoryView from "../../staff/staffPages/StaffInventoryView";

const NAVY = "#1E3A5F";

export default function AdminInventoryView() {
  return (
    <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", background: "#f8fafc" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: NAVY, letterSpacing: "-0.3px" }}>Inventory</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
          Track all stock items by category, receipts, issuances, and balances.
        </p>
      </div>
      <StaffInventoryView hideHeader />
    </div>
  );
}

