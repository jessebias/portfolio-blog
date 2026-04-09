import { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Blog from '../components/Blog';
import Tools from '../components/Tools';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
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
        <ReactLenis root>
            <ScrollToHash isBooted={isBooted} />
            <div className="font-mono bg-bg text-text min-h-screen">
                {!isBooted && <BootScreen onComplete={handleBootComplete} />}

                <Navbar />
                <main>
                    <Hero />
                    <About />
                    <Works />
                    <Blog />
                    <Tools />
                    <Contact />
                </main>
                <Footer />
            </div>
        </ReactLenis>
    );
}

export default Home;
