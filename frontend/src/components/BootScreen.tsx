import { useEffect, useState } from 'react';

const BOOT_LINES = [
    "INITIALIZING KERNEL...",
    "LOADING ASSETS [||||||||||] 100%",
    "MOUNTING FILE SYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "ACCESS GRANTED.",
    "WELCOME, GUEST."
];

interface BootScreenProps {
    onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Disable scrolling while booting
        document.body.style.overflow = 'hidden';

        const interval = setInterval(() => {
            setLineIndex(prev => {
                if (prev < BOOT_LINES.length) {
                    return prev + 1;
                }
                clearInterval(interval);

                // Boot complete
                setTimeout(() => {
                    setVisible(false);
                    document.body.style.overflow = '';
                    onComplete();
                }, 800);

                return prev;
            });
        }, 350);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 bg-[#050505] z-9999 flex flex-col justify-end p-10 font-['Roboto_Mono',monospace] text-[0.85rem] text-(--muted) pointer-events-auto transition-opacity duration-500 ease-out ${lineIndex >= BOOT_LINES.length ? 'opacity-0 pointer-events-none' : ''}`}>
            <div>
                {BOOT_LINES.slice(0, lineIndex).map((line, idx) => (
                    <div
                        key={idx}
                        className={`mb-1 opacity-0 animate-[fadeIn_0.1s_forwards] ${idx === 1 ? 'text-white!' : ''} ${idx === 4 ? 'text-[#27c93f]' : ''} ${idx === 5 ? 'text-[#eaeaea]' : ''}`}
                    >
                        &gt; {line}
                    </div>
                ))}
            </div>
            <div className="mb-1 opacity-0 animate-[fadeIn_0.1s_forwards]">&gt; <span className="inline-block w-[10px] h-[1.2em] bg-(--text) align-text-bottom animate-[blink_0.8s_step-end_infinite]"></span></div>
        </div>
    );
};

export default BootScreen;

