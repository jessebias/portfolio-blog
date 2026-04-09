import { useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout Component
 * Provides the global site shell including:
 * - Smooth scrolling (Lenis)
 * - Global CSS classes (Font, Colors, Selection)
 * - Shared Navigation (Navbar and Footer)
 * - Scroll-to-Top restoration on route changes
 */
const Layout = () => {
    const { pathname, hash } = useLocation();

    // Scroll to top on route change only if there's no hash
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return (
        <ReactLenis root>
            <div 
                className="min-h-screen bg-[#050505] text-[#EAEAEA] font-mono selection:bg-[#666] selection:text-white"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03), transparent 70%)'
                }}
            >
                <Navbar />
                
                {/* Main Content Area */}
                <main>
                    <Outlet />
                </main>
                
                <Footer />
            </div>
        </ReactLenis>
    );
};

export default Layout;
