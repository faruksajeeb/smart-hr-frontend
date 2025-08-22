import { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AdminLayout from '../layouts/AdminLayout';

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = [
    {
      label: "Employees",
      value: "1,284",
      icon: <Users className="w-5 h-5" />,
      sub: "+12 this month",
    },
    {
      label: "Payroll (BDT)",
      value: "৳ 12.8M",
      icon: <DollarSign className="w-5 h-5" />,
      sub: "Jul 2025",
    },
    {
      label: "Attendance",
      value: "97.4%",
      icon: <CheckCircle className="w-5 h-5" />,
      sub: "Today",
    },
    {
      label: "Growth",
      value: "+8.2%",
      icon: <TrendingUp className="w-5 h-5" />,
      sub: "QoQ",
    },
  ];

  const recent = [
    { id: 1, name: "Sadia Rahman", action: "Approved leave", time: "2h ago" },
    { id: 2, name: "Arif Hossain", action: "Updated profile", time: "5h ago" },
    {
      id: 3,
      name: "Finance Bot",
      action: "Generated payroll draft",
      time: "Yesterday",
    },
  ];

  return (
     <AdminLayout>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
            <div
                key={s.label}
                className="bg-white rounded-2xl border p-4 shadow-sm"
            >
                <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{s.label}</div>
                <div className="p-2 rounded-xl bg-gray-50 border">
                    {s.icon}
                </div>
                </div>
                <div className="mt-3 text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
            ))}
        </div>

        {/* Content grid */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Simple Sparkline/Chart Placeholder */}
            <section className="xl:col-span-2 bg-white rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Headcount Trend</h3>
                <button className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50">
                This Year
                </button>
            </div>
            <div className="h-56 rounded-xl bg-gradient-to-br from-amber-50 to-gray-50 border flex items-center justify-center text-gray-500">
                {/* Replace with a real chart lib if needed */}
                <span className="text-sm">(Chart placeholder)</span>
            </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-white rounded-2xl border p-4">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <ul className="space-y-3">
                {recent.map((r) => (
                <li key={r.id} className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-amber-600" />
                    <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-sm text-gray-600">{r.action}</div>
                    <div className="text-xs text-gray-400">{r.time}</div>
                    </div>
                </li>
                ))}
            </ul>
            </section>
        </div>

        {/* Table */}
        <section className="mt-6 bg-white rounded-2xl border">
            <div className="p-4 flex items-center justify-between">
            <h3 className="font-semibold">Top Departments</h3>
            <button className="text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50">
                View all
            </button>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                <tr className="text-left border-t border-b bg-gray-50">
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Headcount</th>
                    <th className="px-4 py-2">Open Roles</th>
                    <th className="px-4 py-2">Attrition</th>
                </tr>
                </thead>
                <tbody>
                {[
                    { dept: "Engineering", head: 520, open: 12, attr: "3.1%" },
                    { dept: "Sales", head: 318, open: 7, attr: "2.4%" },
                    { dept: "Operations", head: 210, open: 3, attr: "1.9%" },
                    { dept: "HR", head: 64, open: 1, attr: "1.2%" },
                ].map((row) => (
                    <tr key={row.dept} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{row.dept}</td>
                    <td className="px-4 py-2">{row.head}</td>
                    <td className="px-4 py-2">{row.open}</td>
                    <td className="px-4 py-2">{row.attr}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </section>
     </AdminLayout>
    
  );
}
