import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    exp: number;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider: Checking token...", token);
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                console.log("AuthProvider: Decoded user:", decoded);
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn("AuthProvider: Token expired");
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                console.error("AuthProvider: Invalid token:", error);
                logout();
            }
        } else {
            console.log("AuthProvider: No token found");
            setUser(null);
        }
        setIsLoading(false);
    }, [token]);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
        token,
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
