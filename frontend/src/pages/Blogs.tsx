import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, type Blog } from '../api/blogs';

const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getBlogs();
                if (Array.isArray(data)) {
                    setBlogs(data);
                } else {
                    throw new Error("Invalid format received from substrate.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Failed to load blog posts substrate. Please try again later.");
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "JAN 01, 2026";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "JAN 01, 2026";
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className="selection:bg-[#666] selection:text-white pb-32">
            <div className="pt-32 pb-20 text-center">
                <h1 className="text-[2.5rem] tracking-[0.2em] mb-2.5 font-medium text-[#EAEAEA]">BLOG</h1>
                <p className="text-[#9B9B9B] text-sm tracking-widest uppercase">
                    {loading ? "INITIALIZING SUBSYSTEMS..." : "UPDATED WHEN I FEEL LIKE IT"}
                </p>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white/2 border border-white/8 rounded-xl h-[400px] animate-pulse"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full py-20 text-center text-[#ff4d4d] tracking-widest text-sm uppercase">
                        {error}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-[#666] tracking-widest text-sm uppercase">
                        No articles found in current sector.
                    </div>
                ) : (
                    blogs.map((item) => (
                        <Link 
                            key={item.id} 
                            to={`/blogs/${item.id}`} 
                            className="bg-white/2 border border-white/8 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#666] flex flex-col h-full group"
                        >
                            <div className="w-full h-[200px] bg-[#111] flex items-center justify-center text-[#9B9B9B] text-xs border-b border-white/8 overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                                ) : (
                                    <span className="opacity-20 translate-y-2 group-hover:translate-y-0 transition-transform tracking-[0.2em]">// IMAGE_NOT_FOUND //</span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col grow">
                                <div className="flex justify-between text-xs text-[#666] tracking-widest mb-3 uppercase">
                                    <span>{formatDate(item.createdAt)}</span>
                                    <span>{item.category}</span>
                                </div>
                                <h3 className="text-lg text-[#EAEAEA] mb-3 font-medium leading-snug uppercase tracking-wide line-clamp-2">{item.title}</h3>
                                <p className="text-[#9B9B9B] text-sm leading-relaxed mb-5 grow line-clamp-3">
                                    {item.content.substring(0, 150)}...
                                </p>
                                <div className="text-xs text-[#EAEAEA] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                    READ POST <span>-&gt;</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Blogs;
