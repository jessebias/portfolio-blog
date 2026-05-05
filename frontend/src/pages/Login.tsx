import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.ts";
import { useAuth } from "../context/AuthProvider.tsx";

const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("WELCOME BACK");
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const intervalRef = useRef<number | null>(null);

    const scramble = () => {
        const originalText = "WELCOME BACK";
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTitle(originalText.split("").map((_, index) => {
                if (index < iteration) return originalText[index];
                return GLITCH[Math.floor(Math.random() * 26)];
            }).join(""));
            if (iteration >= originalText.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            iteration += 1 / 3;
        }, 30) as unknown as number;
    };

    useEffect(() => {
        scramble();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await loginApi(email, password);
            login(data.token, data.user);
            navigate("/admin");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Ambient Background Blobs */}
            <div className="ambient-blob top-1/4 -left-20" />
            <div className="ambient-blob bottom-1/4 -right-20 delay-700" />
            
            <div className="relative w-full max-w-md group" onMouseEnter={scramble}>
                {/* Outer Glow Overlay */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-white/10 to-white/5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="login-card group-hover:-translate-y-2 group-hover:border-white/20">
                    <div className="text-center mb-10">
                        <h1 className="login-title">{title}</h1>
                        <div className="h-px w-10 bg-white/10 mx-auto mb-6" />
                        <p className="login-subtitle">SYSTEM AUTHENTICATION REQUIRED</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 text-red-500/80 p-4 rounded-xl mb-8 text-[0.7rem] tracking-widest text-center">
                            {error.toUpperCase()}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="login-input-group">
                            <label className="login-label">IDENTIFIER</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                placeholder="USER@PORTFOLIO.SYS"
                                required
                            />
                        </div>
                        
                        <div className="login-input-group">
                            <label className="login-label">ACCESS_KEY</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="relative w-full overflow-hidden group/btn">
                            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <div className="login-button group-hover/btn:text-black">
                                {loading ? "INITIALIZING..." : "ACCESS SYSTEM"}
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
