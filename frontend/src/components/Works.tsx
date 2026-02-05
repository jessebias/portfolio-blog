import { useState } from 'react';
import { useScramble } from '../hooks/useScramble';

const Works = () => {
    const [activeTab, setActiveTab] = useState('web');
    const [isFading, setIsFading] = useState(false);
    const { scramble } = useScramble();

    // Helper to handle tab switching with fade effect
    const handleTabClick = (tabId: string) => {
        if (activeTab === tabId) return;

        setIsFading(true);
        setTimeout(() => {
            setActiveTab(tabId);
            setIsFading(false);
        }, 200); // Match CSS transition time
    };

    const handleScramble = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.currentTarget;
        // Store original text on first hover, then always use that
        if (!target.dataset.originalText) {
            target.dataset.originalText = target.textContent || "";
        }
        const originalText = target.dataset.originalText;
        scramble(target, originalText);
    };

    return (
        <section id="works" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[22px] text-[1.05rem]">WORK</h2>

            {/* TABS */}
            <div className="flex gap-[30px] mb-8 border-b border-(--border) pb-3 relative">
                {['web', 'music', 'film', 'photo'].map((tab) => (
                    <button
                        key={tab}
                        className={`bg-transparent border-none font-[inherit] text-[0.75rem] tracking-[0.14em] uppercase cursor-pointer relative px-1 transition-[color] duration-300 ease-out ${activeTab === tab
                            ? 'text-(--text) after:content-[""] after:absolute after:-bottom-[13px] after:left-0 after:w-full after:h-px after:bg-white after:shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                            : 'text-(--muted) hover:text-(--text)'
                            }`}
                        onClick={() => handleTabClick(tab)}
                        onMouseEnter={handleScramble}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* CONTENT CONTAINER */}
            <div className="relative min-h-[200px]">
                <div
                    id={activeTab}
                    className={`grid grid-cols-3 gap-[22px] transition-[opacity,transform] duration-400 ease-out max-md:grid-cols-1 ${!isFading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
                        }`}
                >
                    <div className="h-[200px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>
                    </div>
                    <div className="h-[200px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>
                    </div>
                    <div className="h-[200px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Works;

