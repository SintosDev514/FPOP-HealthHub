import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;