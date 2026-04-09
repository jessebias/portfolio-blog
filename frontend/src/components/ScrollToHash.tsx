import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

interface ScrollToHashProps {
    isBooted?: boolean;
}

const ScrollToHash = ({ isBooted = true }: ScrollToHashProps) => {
    const { hash } = useLocation();
    const lenis = useLenis();

    useEffect(() => {
        if (hash && lenis && isBooted) {
            // Remove the '#' to find the element by ID
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Scroll to the element with an offset for the fixed header
                // Small timeout to ensure the DOM has settled after BootScreen removal
                setTimeout(() => {
                    lenis.scrollTo(element, { offset: -100, immediate: false });
                }, 100);
            }
        }
    }, [hash, lenis, isBooted]);

    return null;
};

export default ScrollToHash;
