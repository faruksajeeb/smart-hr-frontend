import { Download } from "lucide-react";

export default function Sidebar({ sidebarOpen }) {
  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform lg:static fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r p-4 flex-shrink-0`}
    >
      <nav className="space-y-1">
        {["Overview", "Employees", "Attendance", "Payroll", "Leaves", "Settings"].map(
          (item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 rounded-xl text-sm hover:bg-gray-100"
            >
              {item}
            </a>
          )
        )}
      </nav>

      <div className="mt-6 p-3 rounded-2xl bg-amber-50 border border-amber-100">
        <div className="text-sm font-medium text-amber-900">Monthly Payroll</div>
        <div className="text-amber-700 text-xs mt-1">Due on Aug 28</div>
        <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 text-white px-3 py-2 text-sm hover:bg-amber-800">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
    </aside>
  );
}
