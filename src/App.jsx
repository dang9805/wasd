import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout.jsx";
import { SharedLayout } from "./layouts/SharedLayout.jsx";

// Pages
import { WelcomeScreen } from "./pages/WelcomeScreen.jsx";
import { Box as LoginScreen } from "./pages/LoginScreen.jsx";
import { PaymentPage } from "./pages/PaymentPage.jsx";
import { QRCodePayment } from "./pages/QRCodePayment.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx"; // <<< 1. IMPORT YOUR NEW PAGE
import { ResidentsPage } from "./pages/ResidentsPage.jsx";

// --- TẠO CÁC TRANG PLACEHOLDER CHO DASHBOARD ---
// const DashboardHome = () => <h1 className="text-3xl font-bold text-white">Trang chủ Dashboard</h1>; // <<< 2. REMOVE OR COMMENT OUT OLD
// const ResidentsPage = () => (
//   <h1 className="text-3xl font-bold text-white">Quản lý Dân cư</h1>
// );
const ServicesPage = () => (
  <h1 className="text-3xl font-bold text-white">Quản lý Dịch vụ</h1>
);

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
        <Route path="/dashboard" element={<SharedLayout />}>
          {/* 3. USE YOUR NEW PAGE AS THE DASHBOARD INDEX */}
          <Route index element={<ProfilePage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="services" element={<ServicesPage />} />
          
          <Route path="payment">
            <Route index element={<PaymentPage />} />
            <Route path=":invoiceId/qr" element={<QRCodePayment />} />
          </Route>
          
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}