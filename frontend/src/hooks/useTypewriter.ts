import { useEffect, useState } from 'react';

interface TypewriterState {
    displayed: string;
    done: boolean;
}

/**
 * Reveals `text` one character at a time. Returns the current substring and a
 * `done` flag once the full string has been typed.
 */
export const useTypewriter = (text: string, speed = 32, startDelay = 400): TypewriterState => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let charTimeout: ReturnType<typeof setTimeout>;
        let index = 0;

        const type = (): void => {
            index += 1;
            setDisplayed(text.slice(0, index));
            if (index < text.length) {
                charTimeout = setTimeout(type, speed);
            } else {
                setDone(true);
            }
        };

        const startTimeout = setTimeout(() => {
            setDisplayed('');
            setDone(false);
            type();
        }, startDelay);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(charTimeout);
        };
    }, [text, speed, startDelay]);

    return { displayed, done };
};
