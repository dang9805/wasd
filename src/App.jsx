// import React from "react";
// // Import thêm Navigate
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthLayout } from "./layouts/AuthLayout.jsx";
// import { WelcomeScreen } from "./pages/WelcomeScreen.jsx";
// import { Box } from "./pages/LoginScreen.jsx";
// import { DashboardLayout } from "./layouts/DashboardLayout.jsx";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* THÊM DÒNG NÀY VÀO */}
//         <Route path="/" element={<Navigate to="/welcome" />} />

//         {/* Các route cũ của bạn */}
//         <Route
//           path="/welcome"
//           element={
//             <div className="min-h-screen relative">
//               <AuthLayout />
//               <WelcomeScreen />
//             </div>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <div className="min-h-screen relative">
//               <AuthLayout />
//               <Box />
//             </div>
//           }
//         />
//         <Route path="/dashboard" element={<DashboardLayout />} />
//       </Routes>
//     </Router>
//   );
// }

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

// --- TẠO CÁC TRANG PLACEHOLDER CHO DASHBOARD ---
// (Bạn sẽ thay thế chúng bằng các file trang thật)
const DashboardHome = () => <h1 className="text-3xl font-bold">Trang chủ Dashboard</h1>;
const ResidentsPage = () => <h1 className="text-3xl font-bold">Quản lý Dân cư</h1>;
const ServicesPage = () => <h1 className="text-3xl font-bold">Quản lý Dịch vụ</h1>;
const PaymentPage = () => <h1 className="text-3xl font-bold">Quản lý Thanh toán</h1>;
const NotificationsPage = () => (
  <h1 className="text-3xl font-bold">Quản lý Thông báo</h1>
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
        {/* 2. Dùng SharedLayout làm route cha */}
        <Route path="/dashboard" element={<SharedLayout />}>
          {/* Các route con sẽ được render bên trong <Outlet> */}
          
          {/* 'index' có nghĩa là trang mặc định của /dashboard */}
          <Route index element={<DashboardHome />} /> 
          
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}