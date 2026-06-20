import { useState } from 'react';
import { useScramble } from '../hooks/useScramble';

interface Product {
    id: string;
    label: string;
    title: string;
    description: string;
    stack: string[];
    link: string;
    image?: string;
}

// Flagship products & companies. Add new entries here — the grid scales without a redesign.
const PRODUCTS: Product[] = [
    {
        id: 'verta',
        label: 'company',
        title: 'VERTA',
        description: 'Mobile-first streaming platform for premium vertical series.',
        stack: ['Flutter', 'Node.js', 'AI', 'Solana'],
        link: 'https://www.verta.xyz',
        image: '/verta-preview.png',
    },
];

const ProductCard = ({ product }: { product: Product }) => {
    const { scramble } = useScramble();
    const [imgFailed, setImgFailed] = useState(false);
    const showImage = product.image && !imgFailed;

    const handleScramble = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget.querySelector<HTMLElement>('[data-scramble]');
        if (!target) return;
        if (!target.dataset.originalText) {
            target.dataset.originalText = target.textContent || '';
        }
        scramble(target, target.dataset.originalText);
    };

    return (
        <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleScramble}
            className="group flex flex-col rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)]"
        >
            {/* Ambient radial wash — same signature as the rest of the site */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.05)_0%,transparent_60%)] transition-opacity duration-300 group-hover:opacity-90 pointer-events-none z-10"></div>

            {/* External-link indicator — reveals on hover */}
            <div className="absolute top-5 right-5 z-30 flex items-center gap-1.5 text-(--muted) opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="text-[0.55rem] tracking-[0.2em] uppercase">Visit</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </div>

            {/* Product screenshot — the focal point */}
            <div className="aspect-[16/10] w-full relative overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_70%),#060606]">
                {showImage ? (
                    <img
                        src={product.image}
                        alt={`${product.title} platform`}
                        loading="lazy"
                        onError={() => setImgFailed(true)}
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-(--prefix) text-[0.7rem] tracking-[0.3em] uppercase">
                            {product.title} // preview
                        </span>
                    </div>
                )}
                {/* Bottom fade into the info bar */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent pointer-events-none z-20"></div>
            </div>

            {/* Info bar */}
            <div className="relative z-20 px-7 pb-8 -mt-8">
                <div className="text-[0.6rem] text-(--prefix) tracking-[0.14em] mb-2.5 uppercase">
                    /// {product.label}
                </div>
                <h3
                    data-scramble
                    className="m-0 text-[1.05rem] tracking-[0.12em] font-medium text-(--text)"
                >
                    {product.title}
                </h3>
                <p className="text-(--muted) text-[0.82rem] leading-[1.6] mt-3">
                    {product.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-5 text-[0.62rem] tracking-[0.1em] text-(--muted) uppercase">
                    {product.stack.map((tech, i) => (
                        <span key={tech} className="flex items-center gap-2.5">
                            {i > 0 && <span className="text-(--prefix)">•</span>}
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    );
};

const Works = () => {
    return (
        <section id="works" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[14px] text-[1.05rem]">WORK</h2>
            <p className="text-(--muted) text-[0.85rem] tracking-[0.04em] leading-[1.6] mb-[48px] max-w-[480px]">
                Building products from concept to production.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
                {PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default Works;
