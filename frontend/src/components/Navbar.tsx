import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Navbar = () => {
    const intervalsRef = useRef<Map<HTMLElement, number>>(new Map());
    const lenis = useLenis();
    const { pathname } = useLocation();

    const scramble = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const label = target.querySelector('.label') as HTMLElement;
        const originalText = label.dataset.text || "";
        let pos = 0;
        let iteration = 0;
        const existingInterval = intervalsRef.current.get(label);
        if (existingInterval) clearInterval(existingInterval);

        const interval = setInterval(() => {
            label.textContent = originalText.split("").map((char, idx) => {
                if (idx < pos) return char;
                return GLITCH[Math.floor(Math.random() * GLITCH.length)];
            }).join("");
            if (iteration > 15) pos += 0.6;
            iteration++;
            if (pos >= originalText.length) {
                clearInterval(interval);
                intervalsRef.current.delete(label);
                label.textContent = originalText;
            }
        }, 20);
        intervalsRef.current.set(label, interval);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const glow = target.querySelector('.glow') as HTMLElement;
        const rect = target.getBoundingClientRect();
        glow.style.left = `${e.clientX - rect.left}px`;
        glow.style.top = `${e.clientY - rect.top}px`;
        glow.style.opacity = "1";
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        const glow = e.currentTarget.querySelector('.glow') as HTMLElement;
        glow.style.opacity = "0";
    };

    const handleNavItemClick = (targetId: string) => {
        if (targetId.startsWith('#') && (pathname === '/' || pathname === '')) {
            const id = targetId.replace('#', '');
            const element = document.getElementById(id);
            if (element && lenis) {
                lenis.scrollTo(element, { offset: -100 });
            }
        }
    };

    return (
        <nav className="nav-container">
            <div className="nav-content">
                <Link to="/" className="flex items-center gap-4">
                    <div 
                        className="text-[0.85rem] tracking-[0.14em] font-medium select-none bg-repeat bg-clip-text text-transparent"
                        style={{ 
                            backgroundImage: 'linear-gradient(120deg,#ffffff,#e8ecf2,#c7d2df,#7a838f,#c7d2df,#e8ecf2,#ffffff)',
                            backgroundSize: '200% 200%',
                            animation: 'liquid 4.5s ease-in-out infinite'
                        }}
                    >
                        JB
                    </div>
                    <div className="text-xs tracking-widest text-[#666] font-medium">// JESSE BIAS</div>
                </Link>
                <div className="flex gap-[22px]">
                    {[
                        { id: '#about', label: 'ABOUT' },
                        { id: '#works', label: 'WORK' },
                        { id: 'blog', label: 'BLOG' },
                        { id: '#contact', label: 'CONTACT' }
                    ].map(({ id, label }) => (
                        <Link
                            key={id}
                            className="nav-link"
                            to={id === 'blog' ? '/blogs' : (id.startsWith('#') ? `/${id}` : `/${id}`)}
                            onMouseEnter={scramble}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleNavItemClick(id)}
                        >
                            <span className="text-[#666666]">&lt;/A&gt;</span>
                            <span className="label relative z-10" data-text={label}>{label}</span>
                            <span 
                                className="glow absolute w-[120px] h-[120px] rounded-full blur-[25px] opacity-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-160 ease-out mix-blend-screen"
                                style={{
                                    background: 'radial-gradient(circle at center,rgba(255,255,255,0.22)_0%,rgba(180,180,180,0.08)_35%,rgba(120,120,120,0.04)_70%,transparent_100%)'
                                }}
                            ></span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
