import { useState } from "react";
import { FaChartLine, FaHome, FaSignInAlt,  FaBars, FaTimes, FaCoins, FaSyncAlt } from "react-icons/fa";
import { useAuthStore } from "../../../lib/store/authstore";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/nexatrade-high-resolution-logo.png";


export const SideBar = () => {
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <FaHome /> },
    { label: "Earn", to: "/dashboard/earn", icon: <FaCoins /> },
    { label: "Market", to: "/dashboard/market", icon: <FaChartLine /> },
    { label: "Transactions", to: "/dashboard/transactions", icon: <FaSyncAlt /> },
  ];

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3 text-white top-0 sticky z-50">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white text-blue-500 flex flex-col
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:h-screen lg:overflow-y-auto lg:flex
          lg:flex-col
        `}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-4">
              <img src={logo} alt="nexatradelogo" className="mix-blend-multiply" />
            </div>
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map(({ label, to, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)} // close sidebar on nav click (mobile)
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-[#1b2c7a] ${
                      isActive ? "" : ""
                    }`
                  }
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-[#993A8B]">
            
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 text-sm px-3 py-2 hover:text-red-300 w-full"
            >
              <FaSignInAlt />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
