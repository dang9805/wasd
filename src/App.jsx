import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout.jsx";
import { SharedLayout } from "./layouts/SharedLayout.jsx"; // 1. Import layout mới

// Pages
import { WelcomeScreen } from "./pages/WelcomeScreen.jsx";
import { Box as LoginScreen } from "./pages/LoginScreen.jsx"; // Đổi tên 'Box' cho dễ hiểu
import { PaymentPage } from "./pages/PaymentPage.jsx"; // <<< 1. Import trang mới
import { QRCodePayment } from "./pages/QRCodePayment.jsx"; // <<< 1. Import trang QR
import { NotificationsPage } from "./pages/NotificationsPage.jsx"; // <<< 1. Import trang mới

// --- TẠO CÁC TRANG PLACEHOLDER CHO DASHBOARD ---
const DashboardHome = () => <h1 className="text-3xl font-bold text-white">Trang chủ Dashboard</h1>; // Thêm text-white
const ResidentsPage = () => <h1 className="text-3xl font-bold text-white">Quản lý Dân cư</h1>;
const ServicesPage = () => <h1 className="text-3xl font-bold text-white">Quản lý Dịch vụ</h1>;

// -----------------------------------------------

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route mặc định, chuyển hướng đến /welcome */}
        <Route path="/" element={<Navigate to="/welcome" />} />

        {/* === Các trang không cần Sidebar (Login, Welcome) === */}
        <Route
          path="/welcome"
          element={
            <div className="min-h-screen relative">
              <AuthLayout />
              <WelcomeScreen />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen relative">
              <AuthLayout />
              <LoginScreen />
            </div>
          }
        />

        {/* === CÁC TRANG CẦN SIDEBAR (DASHBOARD) === */}
        {/* 2. Dùng SharedLayout làm route cha */}
        <Route path="/dashboard" element={<SharedLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="services" element={<ServicesPage />} />
          {/* --- 2. SỬ DỤNG COMPONENT THẬT Ở ĐÂY --- */}
          {/* Route cha cho phần thanh toán */}
          <Route path="payment">
            {/* Trang danh sách thanh toán (mặc định) */}
            <Route index element={<PaymentPage />} /> 
            {/* Trang hiển thị QR Code cho một hóa đơn cụ thể */}
            <Route path=":invoiceId/qr" element={<QRCodePayment />} /> {/* <<< 2. Thêm route con */}
          </Route>
          {/* ================================== */}
          {/* ----------------------------------------- */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}