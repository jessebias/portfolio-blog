import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.tsx";

const PrivateRoute = () => {
    const { isLoggedIn, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
