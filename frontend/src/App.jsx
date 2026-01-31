import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CitizenHome from "./pages/citizen/Home Page/CitizenHome";
import MOHHome from "./pages/moh/Home Page/MOHHome";
import ReportSites from "./pages/citizen/Report Breeding Sites/ReportSites";
import ReportCases from "./pages/citizen/Report Cases Page/reportCases"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/moh/home" />} />
        <Route path="/citizen/home" element={<CitizenHome />} />
        <Route path="/moh/home" element={<MOHHome />}/>
        <Route path="/citizen/report-sites" element={<ReportSites/>}/>
        <Route path="/citizen/report-cases" element={<ReportCases/>}/>        
      </Routes>
    </Router>
  );
}

export default App;
