import React from "react";

const staffMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@company.com",
    joinDate: "2020-03-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Project Manager",
    department: "Management",
    email: "sarah.johnson@company.com",
    joinDate: "2019-07-22",
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "UX Designer",
    department: "Design",
    email: "michael.chen@company.com",
    joinDate: "2021-01-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "HR Manager",
    department: "Human Resources",
    email: "emily.davis@company.com",
    joinDate: "2018-11-05",
    status: "On Leave",
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "david.wilson@company.com",
    joinDate: "2022-02-14",
    status: "Active",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    position: "Financial Analyst",
    department: "Finance",
    email: "lisa.anderson@company.com",
    joinDate: "2020-09-01",
    status: "Active",
  },
  {
    id: 7,
    name: "Robert Taylor",
    position: "Clinic Nurse",
    department: "Healthcare",
    email: "robert.taylor@company.com",
    joinDate: "2021-06-18",
    status: "Active",
  },
  {
    id: 8,
    name: "Maria Garcia",
    position: "Medical Assistant",
    department: "Healthcare",
    email: "maria.garcia@company.com",
    joinDate: "2023-04-03",
    status: "Active",
  },
  {
    id: 9,
    name: "James Brown",
    position: "Lab Technician",
    department: "Laboratory",
    email: "james.brown@company.com",
    joinDate: "2019-12-09",
    status: "On Leave",
  },
  {
    id: 10,
    name: "Anna Martinez",
    position: "Receptionist",
    department: "Front Desk",
    email: "anna.martinez@company.com",
    joinDate: "2022-08-27",
    status: "Active",
  },
];

const splitWords = (value) => value.split(" ");

const formatDate = (value) => {
  const [year, month, day] = value.split("-");
  return `${year}-${month}-${day}`;
};

const DepartmentBadge = ({ children }) => (
  <span className="inline-flex rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-xs font-bold text-[#1E3A5F]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
        isActive ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ffedd5] text-[#ea580c]"
      }`}
    >
      {status}
    </span>
  );
};

const StaffDirectoryView = () => (
  <main className="flex-1 bg-[#f1f4f8] px-4 py-7 sm:px-8 lg:px-[32px]">
    <section className="mb-7">
      <h2 className="text-[26px] font-extrabold leading-tight text-[#1E3A5F]">
        Staff Directory
      </h2>
      <p className="mt-1.5 text-sm font-medium text-[#8a96a3]">
        Total Staff Members: {staffMembers.length}
      </p>
    </section>

    <section className="overflow-hidden rounded-2xl border border-[#1E3A5F]/[0.07] bg-white shadow-[0_2px_14px_rgba(30,58,95,0.07)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead className="bg-[#1E3A5F] text-white">
            <tr>
              <th className="w-[70px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">ID</th>
              <th className="w-[150px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">Name</th>
              <th className="w-[210px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Position
              </th>
              <th className="w-[210px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Department
              </th>
              <th className="w-[300px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Email
              </th>
              <th className="w-[130px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Join
                <br />
                Date
              </th>
              <th className="w-[120px] px-5 py-4 text-xs font-bold uppercase tracking-[0.06em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((member) => (
              <tr
                key={member.id}
                className="border-b border-[#1E3A5F]/[0.06] transition hover:bg-[#f7fafc]"
              >
                <td className="px-5 py-4 text-sm font-bold text-[#1E3A5F]">
                  {member.id}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#2d3748]">
                  {splitWords(member.name).map((word) => (
                    <React.Fragment key={word}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td className="px-5 py-4 text-sm text-[#2d3748]">
                  {splitWords(member.position).map((word) => (
                    <React.Fragment key={word}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td className="px-5 py-4">
                  <DepartmentBadge>{member.department}</DepartmentBadge>
                </td>
                <td className="px-5 py-4 text-sm text-[#5a6475]">
                  {member.email}
                </td>
                <td className="px-5 py-4 text-sm text-[#5a6475]">
                  {formatDate(member.joinDate).slice(0, 5)}
                  <br />
                  {formatDate(member.joinDate).slice(5)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={member.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </main>
);

export default StaffDirectoryView;
