import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

interface ScrollToHashProps {
    isBooted?: boolean;
}

/**
 * ScrollToHash Component
 * Overhauled with 'Deferred Targeting' to overcome dynamic layout shifts.
 * Handles both same-page and cross-page navigation with multi-phase alignment.
 */
const ScrollToHash = ({ isBooted = true }: ScrollToHashProps) => {
    const { pathname, hash } = useLocation();
    const lenis = useLenis();
    const lastHashRef = useRef(hash);
    const lastPathRef = useRef(pathname);

    useEffect(() => {
        if (!lenis || !hash) return;

        // Stage 1: Initial Attempt
        // We find the element and scroll to it. 
        // If we're coming from another page, the position might be wrong due to layout shifts.
        const scrollTo = (immediate = false) => {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                lenis.scrollTo(element, {
                    offset: -100,
                    duration: immediate ? 0 : 1.5,
                    immediate: immediate
                });
            }
        };

        const isNewPage = lastPathRef.current !== pathname;
        
        // Initial Stage 1: 
        // If it's a new page, we wait for a frame to ensure the DOM is partially there.
        // If it's same page, we scroll immediately.
        const initialDelay = isNewPage ? 100 : 0;
        const initialTimeout = setTimeout(scrollTo, initialDelay);

        // Stage 2: Final Alignment
        // Once the 'isBooted' state is true (meaning BootScreen is gone)
        // AND a safety timeout has passed, we re-verify the position.
        let correctionTimeout: ReturnType<typeof setTimeout>;
        if (isBooted) {
            correctionTimeout = setTimeout(() => {
                scrollTo(false); // Second smooth glide to the final resting position
            }, 600); // 600ms is usually enough for Hero Video and layout shifts to stabilize
        }

        lastHashRef.current = hash;
        lastPathRef.current = pathname;

        return () => {
            clearTimeout(initialTimeout);
            if (correctionTimeout) clearTimeout(correctionTimeout);
        };

    }, [pathname, hash, lenis, isBooted]);

    return null;
};

export default ScrollToHash;
