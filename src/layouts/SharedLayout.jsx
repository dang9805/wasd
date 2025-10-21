import React from "react";
import { Outlet, NavLink } from "react-router-dom";

// --- 1. Import tất cả các icon và logo ---
// Logo chính ở góc
import logo from "../images/company-s-logo.png";

// Các icon cho thanh điều hướng
import iconTrangChu from "../images/inactive.svg"; // Bạn đã chỉ định 'inactive.svg'
import iconDanCu from "../images/dash_resident_icon.svg";
import iconDichVu from "../images/dash_user_icon.svg";
import iconThanhToan from "../images/dash_payment_icon.svg";
import iconThongBao from "../images/dash_message_icon.svg";
import support from "../images/support.png";

// Icon cho Logout (lấy từ file của bạn)
import iconLogout from "../images/logout.svg";

// (Bạn có thể import ảnh minh họa ở đây nếu muốn)
// import illustration from '../images/your-illustration.png';

// --- 2. Định nghĩa danh sách menu ---
const navItems = [
  { name: "Trang chủ", to: "/dashboard", icon: iconTrangChu },
  { name: "Dân cư", to: "/dashboard/residents", icon: iconDanCu },
  { name: "Dịch vụ", to: "/dashboard/services", icon: iconDichVu },
  { name: "Thanh toán", to: "/dashboard/payment", icon: iconThanhToan },
  { name: "Thông báo", to: "/dashboard/notifications", icon: iconThongBao },
];

export const SharedLayout = () => {
  // Hàm này sẽ tự động thêm class CSS khi link được active
  const getNavLinkClass = ({ isActive }) => {
    return `flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 font-bold" // Style khi active (giống trong ảnh)
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium" // Style mặc định
    }`;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* === THANH BÊN TRÁI (SIDEBAR) === */}
      <aside className="w-72 flex flex-col border-r border-gray-200">
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Các link điều hướng */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              // 'end' đảm bảo "Trang chủ" không bị active khi ở trang con
              end={item.to === "/dashboard"}
              className={getNavLinkClass}
            >
              {/* Dùng <img> vì chúng ta import file ảnh */}
              <img src={item.icon} alt="" className="w-6 h-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Phần Logout và Hình minh họa */}
        <div className="p-4 mt-auto border-t border-gray-200">
          {/* Hình minh họa (Placeholder) */}
          <div className="w-full h-36 rounded-lg mb-4 flex items-center justify-center text-sm text-gray-500">
            <img src={support} alt="illustration" />
          </div>

          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 font-medium">
            <img src={iconLogout} alt="" className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* === KHUNG NỘI DUNG CHÍNH === */}
      <main className="flex-1 bg-blue-700 overflow-y-auto">
        {/* KHÔNG CÓ THANH SEARCH (theo yêu cầu) */}

        {/* Nội dung trang sẽ được render ở đây */}
        <div className="p-8">
          {/* <Outlet> là nơi React Router sẽ "vẽ" component con */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};