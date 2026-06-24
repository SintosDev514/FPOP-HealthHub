import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

function ProtectedRoute({ children, role }) {
  const { user, loading, initialized } = useAuth();

  if (loading || !initialized) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    // send to correct dashboard based on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "staff") return <Navigate to="/staff" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
