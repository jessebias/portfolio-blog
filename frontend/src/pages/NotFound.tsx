import { ReactLenis } from 'lenis/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
        <ReactLenis root>
            <div className="font-mono bg-bg text-text min-h-screen flex flex-col">
                <Navbar />
                <main className="grow flex items-center justify-center p-6">
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
                </main>
                <Footer />
            </div>
        </ReactLenis>
    );
};

export default NotFound;
