import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center p-6 min-h-[60vh]">
            <div className="text-center max-w-md">
                <div className="text-6xl font-bold mb-6 text-(--prefix) opacity-50">404</div>
                <h1 className="text-2xl tracking-[0.2em] mb-4 uppercase">Route Not Found</h1>
                <p className="text-(--muted) mb-8 leading-relaxed">
                    The page you are looking for does not exist or has been moved to a different substrate.
                </p>
                <Link 
                    to="/" 
                    className="inline-block border border-(--border) px-8 py-3 rounded-xl transition-all hover:bg-white/5 hover:border-white/20 tracking-widest text-sm uppercase"
                >
                    Return to Safe Zone
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
