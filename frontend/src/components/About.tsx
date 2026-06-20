import SocialLinks from './SocialLinks';

const About = () => {
    return (
        <section id="about" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <div className="grid grid-cols-[0.7fr_1.4fr] gap-12 items-center">
                <div className="aspect-square rounded-[18px] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_60%),#080808] border border-(--border) overflow-hidden">
                    <img src="/headshot.jpg" alt="Jesse Bias" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                    <h2 className="tracking-[0.18em] text-[1.2rem] mb-5">ABOUT</h2>
                    <p className="text-(--muted) leading-[1.7] max-w-[560px] m-0">
                        I'm an AI-native full-stack engineer, mobile developer, and Web3 builder
                        with a creative background in film, audio, and digital media. I build
                        products end-to-end — from user experience and frontend applications to
                        AI systems, backend infrastructure, mobile apps, and blockchain integrations.
                    </p>
                    <SocialLinks
                        containerClass="flex gap-5 mt-7"
                        linkClass="inline-block opacity-50 transition-[opacity,transform] duration-200 ease-out hover:opacity-100 hover:-translate-y-0.5"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;

