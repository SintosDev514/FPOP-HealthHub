import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicRoute from "./components/publicRoutes/PublicRoute";
import NavBar from "./components/navBar";
import Footer from "./components/footer";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ServicesPage from "./pages/ServicesPage";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutPage";
import Location from "./pages/LocationPage";
import Home from "./pages/patient/home";
import ForgotPass from "./pages/ForgotPasswordForm";
import ResetPass from "./pages/ResetPasswordForm";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AppointmentBooking from "./pages/patient/patientPages/AppointmentBooking";
import DashboardView from "./pages/patient/patientPages/DashboardView";
import MyAppointmentsView from "./pages/patient/patientPages/AppointmentsView";
import MyProfileView from "./pages/patient/patientPages/ProfileView";

function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
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
            <PublicRoute>
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            </PublicRoute>
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
            <PublicRoute>
            <PublicLayout>
              <LoginForm />
            </PublicLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
            <PublicLayout>
              <SignupForm />
            </PublicLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/forgotpass"
          element={
            <PublicLayout>
              <ForgotPass />
            </PublicLayout>
          }
        />

        <Route
          path="/resetpass"
          element={
            <PublicLayout>
              <ResetPass />
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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <DashboardView />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <MyAppointmentsView />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <MyProfileView />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <AppointmentBooking />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
