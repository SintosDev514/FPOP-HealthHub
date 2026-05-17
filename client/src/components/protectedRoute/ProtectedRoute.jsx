import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
