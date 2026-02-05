import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Navbar = () => {
    const intervalsRef = useRef<Map<HTMLElement, number>>(new Map());

    const scramble = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const label = target.querySelector('.label') as HTMLElement;
        const originalText = label.dataset.text || "";

        let pos = 0;
        let iteration = 0;

        // Clear any existing interval for this label
        const existingInterval = intervalsRef.current.get(label);
        if (existingInterval) {
            clearInterval(existingInterval);
        }

        const interval = setInterval(() => {
            label.textContent = originalText.split("").map((char, idx) => {
                if (idx < pos) return char;
                return GLITCH[Math.floor(Math.random() * GLITCH.length)];
            }).join("");

            if (iteration > 15) {
                pos += 0.6;
            }

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

    return (
        <nav className="fixed top-0 w-full z-10 backdrop-blur-[3px] bg-[rgba(5,5,5,0.9)] border-b border-[rgba(255,255,255,0.08)]">
            <div className="max-w-[1200px] mx-auto py-[18px] px-[24px] flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4">
                    <div className="text-[0.85rem] tracking-[0.14em] font-medium select-none bg-[linear-gradient(120deg,#ffffff,#e8ecf2,#c7d2df,#7a838f,#c7d2df,#e8ecf2,#ffffff)] bg-size-[200%_200%] bg-repeat bg-clip-text text-transparent animate-[liquid_4.5s_ease-in-out_infinite]">JB</div>
                    <div className="text-xs tracking-widest text-[#666] font-medium">// JESSE BIAS</div>
                </Link>
                <div className="flex gap-[22px]">
                    {[
                        { id: 'about', label: 'ABOUT' },
                        { id: 'works', label: 'WORK' },
                        { id: 'blog', label: 'BLOG' },
                        { id: 'contact', label: 'CONTACT' }
                    ].map(({ id, label }) => (
                        <Link
                            key={id}
                            className="relative inline-flex gap-[6px] text-[0.8rem] tracking-[0.08em] text-[#EAEAEA] no-underline cursor-pointer py-[10px] px-[6px] transition-transform duration-150 ease-out hover:-translate-y-px"
                            to={id === 'blog' ? '/blogs' : `/#${id}`}
                            onMouseEnter={scramble}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className="text-[#666666]">&lt;/A&gt;</span>
                            <span className="label relative z-10" data-text={label}>{label}</span>
                            <span className="glow absolute w-[120px] h-[120px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,rgba(180,180,180,0.08)_35%,rgba(120,120,120,0.04)_70%,transparent_100%)] rounded-full blur-[25px] opacity-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-160 ease-out mix-blend-screen"></span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
