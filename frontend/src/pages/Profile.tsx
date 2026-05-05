import { useAuth } from "../context/AuthProvider.tsx";

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-sm">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-white/80">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-white/50 mb-8">{user.email}</p>
                
                <div className="grid grid-cols-2 gap-4 text-left mb-10">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[0.6rem] text-white/40 tracking-widest uppercase mb-1">Role</span>
                        <span className="text-sm font-medium tracking-wide uppercase">{user.role}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="block text-[0.6rem] text-white/40 tracking-widest uppercase mb-1">Status</span>
                        <span className="text-sm font-medium text-green-500 uppercase">Active</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
