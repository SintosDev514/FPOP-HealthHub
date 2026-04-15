import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ServicesPage from "./pages/ServicesPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutPage";
import Location from "./pages/LocationPage";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/location" element={<Location />} />
      </Routes>
    </Router>
  );
}

export default App;
