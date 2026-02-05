import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

const ScrollToHash = () => {
    const { hash } = useLocation();
    const lenis = useLenis();

    useEffect(() => {
        if (hash && lenis) {
            // Remove the '#' to find the element by ID
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Scroll to the element with an offset for the fixed header
                lenis.scrollTo(element, { offset: -100 });
            }
        }
    }, [hash, lenis]);

    return null;
};

export default ScrollToHash;
