import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ title, user, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="p-2 rounded-xl border hover:bg-gray-50 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="font-semibold text-green-600">Smart HR • {title}</div>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
            <Search className="w-4 h-4" />
            <input
              className="outline-none text-sm w-48"
              placeholder="Search people, teams..."
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-xl border hover:bg-gray-50">
            <Bell className="w-5 h-5" />
          </button>

          <span>{user?.name}</span>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
            >
              <img
                alt="avatar"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                className="w-8 h-8 rounded-xl border"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("isAuthenticated");
                    navigate("/login");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
