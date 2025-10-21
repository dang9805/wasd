import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout.jsx";
import { WelcomeScreen } from "./pages/WelcomeScreen.jsx";
import { Box } from "./pages/LoginScreen.jsx";
import { DashboardLayout } from "./layouts/DashboardLayout.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
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
              <Box />
            </div>
          }
        />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}
