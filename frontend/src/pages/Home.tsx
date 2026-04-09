import { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Blog from '../components/Blog';
import Tools from '../components/Tools';
import Contact from '../components/Contact';
import BootScreen from '../components/BootScreen';
import ScrollToHash from '../components/ScrollToHash';

function Home() {
    const [isBooted, setIsBooted] = useState(() => {
        return sessionStorage.getItem('hasBooted') === 'true';
    });

    const handleBootComplete = () => {
        setIsBooted(true);
        sessionStorage.setItem('hasBooted', 'true');
    };

    return (
        <>
            <ScrollToHash isBooted={isBooted} />
            {!isBooted && <BootScreen onComplete={handleBootComplete} />}

            <Hero />
            <About />
            <Works />
            <Blog />
            <Tools />
            <Contact />
        </>
    );
}

export default Home;
