import backgroundVideo from '../background.mp4';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden selection:bg-[#666] selection:text-white">
            {/* Video Background Layer */}
            <div className="absolute inset-0 z-0">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover opacity-40 brightness-[0.7]"
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
                {/* Subtle Gradient Overlay for Text Readability */}
                <div 
                    className="absolute inset-0" 
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent, var(--bg))' }}
                />
            </div>

            {/* Content Layer (Restored to Original Styling) */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-[120px]">
                <h1 className="text-[1.8rem] tracking-[0.06em] font-medium m-0 mb-[10px]">JESSE BIAS</h1>
                <p className="text-[0.74rem] tracking-[0.14em] text-[#9B9B9B] m-0 uppercase">
                    AGENTIC ENGINEER | CREATIVE DIRECTOR
                </p>
            </div>

            {/* Scroll Indicator Hint */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
                <span className="text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
                <div 
                    className="w-px h-8" 
                    style={{ background: 'linear-gradient(to bottom, white, transparent)' }}
                />
            </div>
        </section>
    );
};

export default Hero;
