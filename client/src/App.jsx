import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ServicesPage from "./pages/ServicesPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutPage";
import Location from "./pages/LocationPage";
import Home from "./pages/patient/home";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function PrivateLayout({ children }) {
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES  */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <ServicesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutUs />
            </PublicLayout>
          }
        />
        <Route
          path="/location"
          element={
            <PublicLayout>
              <Location />
            </PublicLayout>
          }
        />

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginForm />
            </PublicLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicLayout>
              <SignupForm />
            </PublicLayout>
          }
        />

        {/* PROTECTED ROUTE */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <Home />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
