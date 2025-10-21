import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

// --- Imports ---
import logo from "../images/company-s-logo.png";
import iconTrangChu from "../images/inactive.svg";
import iconDanCu from "../images/dash_resident_icon.svg";
import iconDichVu from "../images/dash_user_icon.svg";
import iconThanhToan from "../images/dash_payment_icon.svg";
import iconThongBao from "../images/dash_message_icon.svg";
import support from "../images/support.png";
import iconLogout from "../images/logout.svg";

// --- Nav Items ---
const navItems = [
  { name: "Trang chủ", to: "/dashboard", icon: iconTrangChu },
  { name: "Dân cư", to: "/dashboard/residents", icon: iconDanCu },
  { name: "Dịch vụ", to: "/dashboard/services", icon: iconDichVu },
  { name: "Thanh toán", to: "/dashboard/payment", icon: iconThanhToan },
  { name: "Thông báo", to: "/dashboard/notifications", icon: iconThongBao },
];

// --- Search Icon ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export const SharedLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // === SỬA TẠI ĐÂY: Thanh active bên TRÁI ===
  const getNavLinkClass = ({ isActive }) => {
    // Class cơ sở: luôn có viền trái 4px và padding trái 3 (pl-3)
    const baseClasses =
      "flex items-center space-x-4 pl-3 pr-4 py-3 rounded-lg transition-colors duration-200 border-l-4";

    if (isActive) {
      // Active: Nền xanh nhạt, chữ xanh đậm, viền trái xanh đậm
      return `${baseClasses} bg-blue-50 text-blue-600 font-bold border-blue-600`;
    } else {
      // Inactive: Viền trái trong suốt, chữ xám
      return `${baseClasses} border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium`;
    }
  };
  // === KẾT THÚC SỬA ===

  return (
    <div className="flex h-screen bg-white">
      {/* === SIDEBAR === */}
      <aside className="w-72 flex flex-col border-r border-gray-200 flex-shrink-0">
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>
        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/dashboard"}
              className={getNavLinkClass} // Sử dụng hàm đã sửa
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        {/* Logout Section */}
        <div className="p-4 mt-auto border-t border-gray-200">
          <div className="w-full h-36 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img
              src={support}
              alt="illustration"
              className="h-full w-full object-contain"
            />
          </div>
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 font-medium">
            <img src={iconLogout} alt="" className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* === KHUNG NỘI DUNG CHÍNH === */}
      <main className="flex-1 bg-blue-700 overflow-y-auto flex flex-col">
        {/* Thanh tìm kiếm */}
        <div className="p-6 sticky top-0 bg-blue-700 z-10">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Nội dung trang con */}
        <div className="p-8 pt-0 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};