import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "./component/sidebar";
import { HiUser, HiMenu } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../lib/store/authstore";

const getPageTitle = (pathname: string) => {
  const segments = pathname.split("/");
  return segments[segments.length - 1] || "Dashboard";
};

export const DashBoardLayout = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const { user } = useAuthStore();

  const [showUser, setShowUser] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close user popup on outside click
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUser(false);
      }
    }
    if (showUser) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUser]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - slide in/out on mobile, fixed on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white text-blue-500 transform
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:h-screen  lg:flex lg:flex-col lg:overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SideBar />
      </aside>

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-5 p-4 md:p-6 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <HiMenu className="w-6 h-6 text-yellow-400" />
          </button>

          <h1 className="text-xl md:text-3xl font-extrabold text-[#FDAAAA] capitalize flex-grow ml-2">
            {title}
          </h1>

          {/* User icon and popup */}
          <div
            className="relative"
            onMouseEnter={() => setShowUser(true)}
            onMouseLeave={() => setShowUser(false)}
          >
            <HiUser
              className="w-6 h-6 cursor-pointer text-[#A2574F]"
              onClick={() => setShowUser((prev) => !prev)}
            />
            {showUser && user && (
              <div
                ref={userRef}
                className="absolute right-0 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg text-[#A2574F] z-50"
              >
                <p className="text-red-400 text-sm"> {user.role}</p>
              </div>
            )}
          </div>
        </header>

        <section className="flex-grow bg-white text-blue-400 rounded-2xl shadow-md p-4 md:p-6 overflow-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
