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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} /> 
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/citizen/home" element={<CitizenHome />} />
        <Route path="/moh/home" element={<MOHHome />} />
        <Route path="/citizen/report-sites" element={<ReportSites />} />
        <Route path="/citizen/report-cases" element={<ReportCases />} />
        <Route path="/moh/send-announcements" element={<SendAnnouncements />} />
      </Routes>
    </Router>
  );
}

export default App;
