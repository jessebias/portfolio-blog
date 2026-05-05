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

    // Scramble effect for the title
    const scramble = () => {
        const originalText = "WELCOME BACK";
        let iteration = 0;
        
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            setTitle(prev => 
                originalText.split("").map((char, index) => {
                    if (index < iteration) return originalText[index];
                    return GLITCH[Math.floor(Math.random() * 26)];
                }).join("")
            );
            
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
            navigate("/admin"); // Go straight to admin after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] overflow-hidden pt-20">
            {/* Ambient Background Blobs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse delay-700" />
            
            <div 
                className="relative w-full max-w-md group"
                onMouseEnter={scramble}
            >
                {/* Outer Glow Overlay */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-[#050505]/60 border border-white/10 rounded-2xl p-10 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/20">
                    <div className="text-center mb-10">
                        <h1 className="text-xl font-medium tracking-[0.4em] mb-3 text-[#EAEAEA] font-mono">
                            {title}
                        </h1>
                        <div className="h-px w-10 bg-white/10 mx-auto mb-6" />
                        <p className="text-[#666] text-[0.6rem] tracking-[0.3em] uppercase">SYSTEM AUTHENTICATION REQUIRED</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 text-red-500/80 p-4 rounded-xl mb-8 text-[0.7rem] tracking-widest text-center animate-shake">
                            {error.toUpperCase()}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[0.65rem] tracking-[0.2em] text-[#666] uppercase ml-1">IDENTIFIER</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-[#EAEAEA] outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                                placeholder="USER@PORTFOLIO.SYS"
                                required
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="block text-[0.65rem] tracking-[0.2em] text-[#666] uppercase ml-1">ACCESS_KEY</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-[#EAEAEA] outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <div className="relative border border-white/20 py-4 text-[0.75rem] font-bold tracking-[0.3em] text-white group-hover/btn:text-black transition-colors duration-300">
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
