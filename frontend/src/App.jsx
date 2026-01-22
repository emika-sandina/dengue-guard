import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CitizenHome from "./components/citizen/Home Page/CitizenHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/citizen/home" />} />
        <Route path="/citizen/home" element={<CitizenHome />} />
      </Routes>
    </Router>
  );
}

export default App;
