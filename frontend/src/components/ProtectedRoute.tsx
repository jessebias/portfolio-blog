import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.tsx";

const ProtectedRoute = () => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
