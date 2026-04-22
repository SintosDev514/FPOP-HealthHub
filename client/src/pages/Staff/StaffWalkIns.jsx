import React from "react";
import StaffSidebar from "../../components/StaffSidebar";

const StaffWalkIns = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <StaffSidebar />
      <main className="flex-1 flex flex-col pt-20 md:pt-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#1F2937" }}>Walk-Ins</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
          <p style={{ color: "#6B7280" }}>Manage walk-in patients here.</p>
          <div className="mt-8 flex justify-center py-12 md:py-20 border-2 border-dashed border-gray-200 rounded-xl px-4 text-center">
             <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1E3A5F] text-white font-bold hover:opacity-90 transition-opacity">
               Register New Walk-In
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffWalkIns;
