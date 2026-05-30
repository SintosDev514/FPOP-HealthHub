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
  <span className="inline-flex rounded-full bg-[#E4F2FF] px-3 py-1 text-sm font-bold text-[#0071CE]">
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-7 py-1 text-sm font-bold text-white ${
        isActive ? "bg-[#2E7D32]" : "bg-[#EF6C00]"
      }`}
    >
      {status}
    </span>
  );
};

const StaffDirectoryView = () => (
  <main className="flex-1 px-4 py-8 sm:px-8 lg:px-[60px]">
    <section className="mb-11">
      <h2 className="text-4xl font-bold leading-tight text-[#1E3A5F] sm:text-[44px]">
        Staff Directory
      </h2>
      <p className="mt-3 text-xl text-[#4B5563]">
        Total Staff Members: {staffMembers.length}
      </p>
    </section>

    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead className="bg-gradient-to-r from-[#435B9C] to-[#1E3A5F] text-white">
            <tr>
              <th className="w-[70px] px-5 py-6 text-base font-bold">ID</th>
              <th className="w-[150px] px-5 py-6 text-base font-bold">Name</th>
              <th className="w-[210px] px-5 py-6 text-base font-bold">
                Position
              </th>
              <th className="w-[210px] px-5 py-6 text-base font-bold">
                Department
              </th>
              <th className="w-[300px] px-5 py-6 text-base font-bold">
                Email
              </th>
              <th className="w-[130px] px-5 py-6 text-base font-bold">
                Join
                <br />
                Date
              </th>
              <th className="w-[120px] px-5 py-6 text-base font-bold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((member) => (
              <tr
                key={member.id}
                className="border-b border-slate-200 transition hover:bg-[#F9FAFB]"
              >
                <td className="px-5 py-6 text-base font-bold text-black">
                  {member.id}
                </td>
                <td className="px-5 py-6 text-lg font-medium text-black">
                  {splitWords(member.name).map((word) => (
                    <React.Fragment key={word}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td className="px-5 py-6 text-lg text-black">
                  {splitWords(member.position).map((word) => (
                    <React.Fragment key={word}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td className="px-5 py-6">
                  <DepartmentBadge>{member.department}</DepartmentBadge>
                </td>
                <td className="px-5 py-6 text-base text-black">
                  {member.email}
                </td>
                <td className="px-5 py-6 text-lg text-black">
                  {formatDate(member.joinDate).slice(0, 5)}
                  <br />
                  {formatDate(member.joinDate).slice(5)}
                </td>
                <td className="px-5 py-6">
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
