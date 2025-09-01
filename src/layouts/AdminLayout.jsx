import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AdminLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header title={title} user={user} setSidebarOpen={setSidebarOpen} />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 py-6 lg:pl-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
