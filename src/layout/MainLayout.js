import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  MessageCircle,
  Wrench,
  LogOut,
  Building,
  FileText,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import NotificationBell from "../components/NotificationBell";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // 🌙 THEME LOAD
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: user.role === "landlord" ? "/landlord" : "/tenant",
    },
    { label: "Chat", icon: MessageCircle, path: "/chat" },
    {
      label: "Maintenance",
      icon: Wrench,
      path: "/create-request",
      show: user.role === "tenant",
    },
    {
      label: "Properties",
      icon: Building,
      path: "/add-property",
      show: user.role === "landlord",
    },
    {
      label: "Leases",
      icon: FileText,
      path: "/create-lease",
      show: user.role === "landlord",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0B0F19]">
      {/* 🔥 OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity
      ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 🔥 SIDEBAR */}
      <aside
        className={`fixed md:static z-50 h-full
      bg-white dark:bg-[#0F172A]
      border-r border-gray-200 dark:border-gray-800
      shadow-lg
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* TOP */}
          <div className="p-5">
            {/* LOGO */}
            <div className="flex items-center justify-between mb-10">
              {!collapsed && (
                <h2 className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  RentWise
                </h2>
              )}

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-gray-400 hover:text-blue-600 transition"
              >
                ☰
              </button>
            </div>

            {/* NAV */}
            <nav className="space-y-2">
              {menuItems.map(
                (item) =>
                  (item.show === undefined || item.show) && (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all
                    ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && item.label}
                    </button>
                  ),
              )}
            </nav>
          </div>

          {/* USER + ACTIONS */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            {!collapsed && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            )}

            {/* DARK MODE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-sm mb-2 text-gray-500 hover:text-blue-600 transition"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
            >
              <LogOut size={16} />
              {!collapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 TOPBAR */}
        <header className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-700 dark:text-white"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {user?.role === "landlord"
                  ? "Landlord Dashboard"
                  : "Tenant Dashboard"}
              </h1>

              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* 🔔 NOTIFICATION */}
            <NotificationBell />

            {/* USER */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* 🔥 CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="text-center py-3 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800">
          © 2026 RentWise • SaaS Property Platform
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
