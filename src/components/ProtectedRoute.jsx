// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, role }) {
//   const isAuthenticated = localStorage.getItem("isAuthenticated");
//   const userRole = localStorage.getItem("role");

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (role && userRole !== role) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// }

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // 👈 this is REQUIRED for child routes to render
};

export default ProtectedRoute;

