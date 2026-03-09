import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import CitizenHome from "./pages/citizen/HomePage/CitizenHome";
import MOHHome from "./pages/moh/HomePage/MOHHome";
import ReportSites from "./pages/citizen/ReportBreedingSites/ReportSites";
import ReportCases from "./pages/citizen/ReportCasesPage/reportCases";
import SendAnnouncements from "./pages/moh/SendAnnouncements/SendAnnouncements";
import ManageDengueCases from "./pages/moh/ManageDengueCases/ManageDengueCases";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* The Login Page*/}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Citizen Routes */}
        <Route path="/citizen/home" element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenHome />
          </ProtectedRoute>
        } />
        
        <Route path="/citizen/report-sites" element={
          <ProtectedRoute allowedRole="citizen">
            <ReportSites />
          </ProtectedRoute>
        } />
        
        <Route path="/citizen/report-cases" element={
          <ProtectedRoute allowedRole="citizen">
            <ReportCases />
          </ProtectedRoute>
        } />

        {/* Protected MOH Routes */}
        <Route path="/moh/home" element={
          <ProtectedRoute allowedRole="moh">
            <MOHHome />
          </ProtectedRoute>
        } />
        
        <Route path="/moh/send-announcements" element={
          <ProtectedRoute allowedRole="moh">
            <SendAnnouncements />
          </ProtectedRoute>
        } />

        <Route path="/moh/manage-cases" element={
          <ProtectedRoute allowedRole="moh">
            <ManageDengueCases />
          </ProtectedRoute>
        } />

        {/* Default Redirect: Send unauthenticated users to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
