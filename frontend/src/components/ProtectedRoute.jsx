import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

  const token = localStorage.getItem("token");

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {

    // Optional: basic JWT validation
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check expiration
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

  } catch (err) {

    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;

  }

  return <Outlet />;
};

export default ProtectedRoute;