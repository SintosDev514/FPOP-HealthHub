import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return user ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;