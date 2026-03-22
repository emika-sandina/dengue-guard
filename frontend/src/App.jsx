import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage.jsx";
import CitizenHome from "./pages/citizen/Home Page/CitizenHome";
import MOHHome from "./pages/moh/Home Page/MOHHome";
import ReportSites from "./pages/citizen/Report Breeding Sites/ReportSites";
import ReportCases from "./pages/citizen/Report Cases Page/reportCases";
import SendAnnouncements from "./pages/moh/Send Announcements/SendAnnouncements";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import ManageReport from "./pages/moh/Manage Report Sites/ManageSiteReport.jsx";
import ManageReportedDengueCases from "./pages/moh/Manage Reported Dengue Cases/ManageReportedDengueCases";
import ViewAnnouncements from './pages/citizen/View Announcements/ViewAnnouncements';
import HeatmapCommonPage from "./components/common/Heatmap/heatmapCommonpage.jsx";


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

        <Route path="/citizen/alerts" element={
          <ProtectedRoute allowedRole="citizen">
            <ViewAnnouncements />
          </ProtectedRoute>
        } />

        <Route path="/citizen/risk-map" element={
          <ProtectedRoute allowedRole="citizen">
            <HeatmapCommonPage role="Citizen" />
          </ProtectedRoute>
        } />


        {/* Protected MOH Routes */}
        <Route path="/moh/home" element={
          <ProtectedRoute allowedRole="moh">
            <MOHHome />
          </ProtectedRoute>
        } />
        <Route path="/moh/case-reports" element={
          <ProtectedRoute allowedRole="moh">
            <ManageReportedDengueCases />
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

        <Route path="/moh/risk-map" element={
          <ProtectedRoute allowedRole="moh">
            <HeatmapCommonPage role="MOH" />
          </ProtectedRoute>
        } />


        {/* Default Redirect: Send unauthenticated users to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
