import { ReactLenis } from 'lenis/react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blogs = () => {
    return (
        <ReactLenis root>
            <div className="min-h-screen bg-[#050505] text-[#EAEAEA] font-mono selection:bg-[#666] selection:text-white"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03), transparent 70%)'
                }}>

                <Navbar />

                <div className="pt-32 pb-20 text-center">
                    <h1 className="text-[2.5rem] tracking-[0.2em] mb-2.5 font-medium text-[#EAEAEA]">BLOG</h1>
                    <p className="text-[#9B9B9B] text-sm tracking-widest">UPDATED WHEN I FEEL LIKE IT</p>
                </div>

                <div className="max-w-[1200px] mx-auto px-6 mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Article 1 */}
                    <Link to="/blog/living-design-systems-in-2026" className="bg-white/2 border border-white/8 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#666] flex flex-col h-full group">
                        <div className="w-full h-[200px] bg-[#111] flex items-center justify-center text-[#9B9B9B] text-xs border-b border-white/8">
                            [ IMG_PLACEHOLDER ]
                        </div>
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between text-xs text-[#666] tracking-widest mb-3 uppercase">
                                <span>JAN 10, 2026</span>
                                <span>DESIGN</span>
                            </div>
                            <h3 className="text-lg text-[#EAEAEA] mb-3 font-medium leading-snug uppercase tracking-wide line-clamp-2">Living Design Systems in 2026</h3>
                            <p className="text-[#9B9B9B] text-sm leading-relaxed mb-5 grow">
                                Exploring how design systems have evolved from static component libraries to living, breathing organisms that adapt to user behavior...
                            </p>
                            <div className="text-xs text-[#EAEAEA] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                READ POST <span>-&gt;</span>
                            </div>
                        </div>
                    </Link>

                    {/* Article 2 */}
                    <Link to="/blog/building-cyber-decks" className="bg-white/2 border border-white/8 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#666] flex flex-col h-full group">
                        <div className="w-full h-[200px] bg-[#111] flex items-center justify-center text-[#9B9B9B] text-xs border-b border-white/8">
                            [ IMG_PLACEHOLDER ]
                        </div>
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between text-xs text-[#666] tracking-widest mb-3 uppercase">
                                <span>JAN 05, 2026</span>
                                <span>HARDWARE</span>
                            </div>
                            <h3 className="text-lg text-[#EAEAEA] mb-3 font-medium leading-snug uppercase tracking-wide line-clamp-2">Building Cyber Decks</h3>
                            <p className="text-[#9B9B9B] text-sm leading-relaxed mb-5 grow">
                                A deep dive into the resurgence of cyber decks. Custom mechanical keyboards, ultra-wide displays to hacking on the go...
                            </p>
                            <div className="text-xs text-[#EAEAEA] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                READ POST <span>-&gt;</span>
                            </div>
                        </div>
                    </Link>

                    {/* Article 3 */}
                    <Link to="/blog/neural-link-integration" className="bg-white/2 border border-white/8 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#666] flex flex-col h-full group">
                        <div className="w-full h-[200px] bg-[#111] flex items-center justify-center text-[#9B9B9B] text-xs border-b border-white/8">
                            [ IMG_PLACEHOLDER ]
                        </div>
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between text-xs text-[#666] tracking-widest mb-3 uppercase">
                                <span>DEC 28, 2025</span>
                                <span>TECH</span>
                            </div>
                            <h3 className="text-lg text-[#EAEAEA] mb-3 font-medium leading-snug uppercase tracking-wide line-clamp-2">Neural Link Integration</h3>
                            <p className="text-[#9B9B9B] text-sm leading-relaxed mb-5 grow">
                                First impressions of the new NLI API. How we can interface directly with web substrates using thought patterns...
                            </p>
                            <div className="text-xs text-[#EAEAEA] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                READ POST <span>-&gt;</span>
                            </div>
                        </div>
                    </Link>

                    {/* Article 4 */}
                    <Link to="/blog/the-agentic-workflow" className="bg-white/2 border border-white/8 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#666] flex flex-col h-full group">
                        <div className="w-full h-[200px] bg-[#111] flex items-center justify-center text-[#9B9B9B] text-xs border-b border-white/8">
                            [ IMG_PLACEHOLDER ]
                        </div>
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between text-xs text-[#666] tracking-widest mb-3 uppercase">
                                <span>DEC 15, 2025</span>
                                <span>AI</span>
                            </div>
                            <h3 className="text-lg text-[#EAEAEA] mb-3 font-medium leading-snug uppercase tracking-wide line-clamp-2">The Agentic Workflow</h3>
                            <p className="text-[#9B9B9B] text-sm leading-relaxed mb-5 grow">
                                Why simple chatbots are dead and why autonomous agents that can plan, execute, and verify are the only way forward...
                            </p>
                            <div className="text-xs text-[#EAEAEA] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                READ POST <span>-&gt;</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <Footer />
            </div>
        </ReactLenis>
    );
};

export default Blogs;
