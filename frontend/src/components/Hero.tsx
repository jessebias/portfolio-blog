import { useEffect, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const SENSITIVITY = 0.8;

const TAGLINE = 'Specialized in agentic AI systems, Web3 integrations, and production AI applications.';

const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const prevXRef = useRef<number | null>(null);
    const targetTimeRef = useRef(0);
    const seekingRef = useRef(false);
    const { displayed } = useTypewriter(TAGLINE);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure muted for autoplay-free, scrub-only playback.
        video.muted = true;

        const seek = () => {
            if (!video.duration) return;
            seekingRef.current = true;
            video.currentTime = targetTimeRef.current;
        };

        // Shared scrub logic for both pointer types: convert horizontal travel into a time offset.
        const scrubTo = (currentX: number) => {
            const duration = video.duration;
            if (!duration) return;

            if (prevXRef.current === null) {
                prevXRef.current = currentX;
                return;
            }

            const delta = currentX - prevXRef.current;
            prevXRef.current = currentX;

            const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
            targetTimeRef.current = Math.min(Math.max(targetTimeRef.current + offset, 0), duration);

            // Only issue a seek if one isn't already in flight (prevents seek-flooding).
            if (!seekingRef.current) seek();
        };

        const handleMouseMove = (e: MouseEvent) => scrubTo(e.clientX);
        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) scrubTo(touch.clientX);
        };
        // Reset the baseline on each new touch so the first move doesn't jump.
        const handleTouchStart = (e: TouchEvent) => {
            prevXRef.current = e.touches[0]?.clientX ?? null;
        };
        const handleTouchEnd = () => {
            prevXRef.current = null;
        };

        // When a seek finishes, queue the next one if the target has since moved.
        const handleSeeked = () => {
            seekingRef.current = false;
            if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) seek();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);
        video.addEventListener('seeked', handleSeeked);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            video.removeEventListener('seeked', handleSeeked);
        };
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-(--bg) selection:bg-[#666] selection:text-white">
            {/* Content Layer */}
            <div className="relative z-10 order-1 w-full max-w-[1200px] mx-auto px-6 pt-28 pb-10 md:py-[120px] text-left">
                <h1 className="text-[clamp(2.2rem,3.4vw,3rem)] tracking-[0.04em] font-medium leading-[1.05] m-0 mb-[18px]">JESSE BIAS</h1>
                <p className="text-[0.78rem] tracking-[0.16em] text-[#9B9B9B] m-0 uppercase">
                    Full-Stack AI Engineer | Creative
                </p>
                <p className="mt-6 max-w-[440px] text-[0.82rem] leading-[1.7] text-(--muted) min-h-[2.5em]">
                    {displayed}
                    <span className="inline-block w-[7px] h-[1.05em] ml-1 bg-(--text) align-text-bottom animate-[blink_0.8s_step-end_infinite]"></span>
                </p>
            </div>

            {/* Video Background Layer — full-bleed behind content on desktop, stacked below on mobile.
                Scrubbed by horizontal mouse or touch movement. */}
            <div className="relative order-2 w-full bg-(--bg) md:absolute md:inset-0 md:z-0 md:order-none">
                <video
                    ref={videoRef}
                    src="/hero-bg.mp4"
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    className="w-full h-auto md:h-full object-contain object-center md:translate-x-[16%]"
                />
                {/* Gradient overlay for text readability — desktop only (mobile doesn't overlap text) */}
                <div
                    className="hidden md:block absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 65%, var(--bg))' }}
                />
            </div>
        </section>
    );
};

export default Hero;
