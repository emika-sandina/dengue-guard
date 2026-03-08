import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import CitizenHome from "./pages/citizen/Home Page/CitizenHome";
import MOHHome from "./pages/moh/Home Page/MOHHome";
import ReportSites from "./pages/citizen/Report Breeding Sites/ReportSites";
import ReportCases from "./pages/citizen/Report Cases Page/reportCases";
import SendAnnouncements from "./pages/moh/Send Announcements/SendAnnouncements";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import ManageReport from "./pages/moh/Manage Report Sites/ManageSiteReport.jsx";
import SiteDetails from "./pages/moh/Manage Report Sites/SiteDetails.jsx";

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

        <Route path="/moh/site-reports" element={
          <ProtectedRoute allowedRole="moh">
            <ManageReport />
          </ProtectedRoute>
        } />

        <Route path="/moh/site-reports/:id" element={
          <ProtectedRoute allowedRole="moh">
            <SiteDetails/>
          </ProtectedRoute>
        } />

        {/* Default Redirect: Send unauthenticated users to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
