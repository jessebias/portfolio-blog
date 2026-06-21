import { useState } from 'react';
import SocialLinks from './SocialLinks';
import { useI18n } from '../i18n/LanguageProvider';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const About = () => {
    const { t } = useI18n();
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, on: false });

    const handlePhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion()) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        setTilt({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 12 });
        setGlare({ x: px * 100, y: py * 100, on: true });
    };
    const handlePhotoLeave = () => {
        setTilt({ rx: 0, ry: 0 });
        setGlare((g) => ({ ...g, on: false }));
    };

    return (
        <section id="about" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <div className="grid grid-cols-[0.7fr_1.4fr] gap-12 items-center">
                {/* 3D tilt + glare headshot */}
                <div className="[perspective:900px]">
                    <div
                        onMouseMove={handlePhotoMove}
                        onMouseLeave={handlePhotoLeave}
                        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
                        className="relative aspect-square rounded-[18px] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_60%),#080808] border border-(--border) overflow-hidden transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
                    >
                        <img src="/headshot.jpg" alt="Jesse Bias" className="w-full h-full object-cover object-center" />
                        {/* Vignette — sinks the grey studio backdrop into the site's near-black theme while keeping the face lit */}
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_38%,transparent_28%,rgba(0,0,0,0.55)_62%,rgba(0,0,0,0.92)_100%)]"></div>
                        {/* Glare — light sheen that tracks the cursor */}
                        <div
                            aria-hidden
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                opacity: glare.on ? 1 : 0,
                                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.22), transparent 45%)`,
                                mixBlendMode: 'soft-light',
                            }}
                        ></div>
                    </div>
                </div>

                <div>
                    <h2 className="tracking-[0.18em] text-[1.2rem] mb-5">{t.about.heading}</h2>
                    <p className="text-(--muted) leading-[1.7] max-w-[560px] m-0">
                        {t.about.bio}
                    </p>
                    <SocialLinks
                        containerClass="flex gap-5 mt-7"
                        linkClass="inline-block opacity-50 transition-[opacity,transform] duration-200 ease-out hover:opacity-100 hover:-translate-y-0.5"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
