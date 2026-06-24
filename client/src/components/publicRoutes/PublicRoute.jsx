import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user) {
    const role = user.role?.toLowerCase();

    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "staff") return <Navigate to="/staff" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PublicRoute;
