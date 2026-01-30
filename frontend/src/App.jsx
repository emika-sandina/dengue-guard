import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CitizenHome from "./components/citizen/Home Page/CitizenHome";
import MOHHome from "./components/moh/Home Page/MOHHome";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/moh/home" />} />
        <Route path="/citizen/home" element={<CitizenHome />} />
        <Route path="/moh/home" element={<MOHHome />}/>
      </Routes>
    </Router>
  );
}

export default App;
