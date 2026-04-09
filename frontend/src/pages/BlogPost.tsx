import { Link } from 'react-router-dom'

const BlogPost = () => {
    return (
        <div className="selection:bg-[#666] selection:text-white">
            <div className="max-w-3xl mx-auto px-6 py-32">
                {/* Back Navigation */}
                <div className="mb-10">
                    <Link to="/blogs" className="inline-flex items-center gap-2.5 text-[#9B9B9B] text-sm tracking-widest hover:text-[#EAEAEA] transition-colors">
                        <span>&larr;</span> RETURN TO BLOG
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-14 border-b border-white/8 pb-8">
                    <div className="flex flex-wrap gap-4 text-[0.65rem] tracking-[0.15em] text-[#666] uppercase mb-6 font-medium">
                        <span className="text-white/40">JAN 10, 2026</span>
                        <span className="text-[#333]">//</span>
                        <span className="text-white/40">BY JESSE BIAS</span>
                        <span className="text-[#333]">//</span>
                        <span className="text-white">DESIGN</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#EAEAEA] leading-tight uppercase tracking-wide">Living Design Systems in 2026</h1>
                </header>

                {/* Article Content */}
                <div className="text-[#d0d0d0] text-base leading-relaxed space-y-8">
                    <p>
                        The era of static component libraries is rapidly fading. As we move deeper into 2026, design systems
                        have evolved into living, breathing organisms that adapt not just to screen sizes, but to user context,
                        behavior, and even ambient intent.
                    </p>
                    <p>
                        In this post, I want to explore the concept of "Adaptive Atomic Design"—a methodology where atoms and
                        molecules aren't just rearranged, but fundamentally alter their properties based on the data stream they
                        are visualizing.
                    </p>

                    <h2 className="text-2xl text-[#EAEAEA] mt-12 mb-6 font-medium">Beyond the Component</h2>
                    <p>
                        We used to treat buttons as static rectangles with text. Now, a button is an intent vector. It changes
                        opacity based on likelihood of interaction. It changes glow intensity based on system urgency.
                    </p>

                    <blockquote className="border-l-2 border-[#666] pl-5 italic text-[#9B9B9B] my-10 py-2">
                        "The interface is no longer a wrapper for content; it is a direct neural link to the system's logic."
                    </blockquote>

                    <p>
                        This shift requires a new kind of collaboration between designers and engineers. We aren't just handing
                        off Figma files anymore; we are co-creating logic gates and behavior trees.
                    </p>
                </div>

                {/* Tags */}
                <div className="mt-20 pt-10 border-t border-white/8 flex gap-2.5 flex-wrap">
                    {['#DesignSystems', '#UI/UX', '#FutureTech', '#Frontend'].map((tag) => (
                        <a key={tag} href="#" className="bg-white/5 border border-white/8 rounded-full px-4 py-1.5 text-xs text-[#9B9B9B] hover:bg-white/10 hover:text-[#EAEAEA] transition-all">
                            {tag}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
