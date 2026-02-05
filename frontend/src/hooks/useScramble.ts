import { useRef } from 'react';

const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const useScramble = () => {
    const intervalsRef = useRef<Map<HTMLElement, number>>(new Map());

    const scramble = (element: HTMLElement, originalText: string) => {
        let pos = 0;
        let iteration = 0;

        // Clear any existing interval for this element
        const existingInterval = intervalsRef.current.get(element);
        if (existingInterval) {
            clearInterval(existingInterval);
        }

        const interval = setInterval(() => {
            element.textContent = originalText.split("").map((char, idx) => {
                if (idx < pos) return char;
                return GLITCH[Math.floor(Math.random() * GLITCH.length)];
            }).join("");

            if (iteration > 15) {
                pos += 0.6;
            }

            iteration++;

            if (pos >= originalText.length) {
                clearInterval(interval);
                intervalsRef.current.delete(element);
                element.textContent = originalText;
            }
        }, 20);

        intervalsRef.current.set(element, interval);
    };

    return { scramble };
};
