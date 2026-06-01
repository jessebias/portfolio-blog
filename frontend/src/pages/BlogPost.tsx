import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, type Blog } from '../api/blogs';

const BlogPost = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const data = await getBlogById(id);
                if (data && typeof data === 'object') {
                    setBlog(data);
                } else {
                    throw new Error("POST_NOT_FOUND");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog post:", err);
                setError("POST_NOT_FOUND or SUBSYSTEM_FAILURE.");
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

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

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-32 text-center text-[#666] tracking-widest text-sm uppercase">
                RETRIEVING DATA FROM SECTOR {id}...
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-32 text-center">
                <div className="text-[#ff4d4d] tracking-widest text-sm uppercase mb-8">{error || "BLOG POST NOT FOUND"}</div>
                <Link to="/blogs" className="text-[#EAEAEA] text-xs tracking-widest hover:underline uppercase selection:bg-[#666]">
                    &larr; Return to Blog Subsystem
                </Link>
            </div>
        );
    }

    return (
        <div className="selection:bg-[#666] selection:text-white pb-32">
            <div className="max-w-3xl mx-auto px-6 py-32">
                {/* Back Navigation */}
                <div className="mb-10">
                    <Link to="/blogs" className="inline-flex items-center gap-2.5 text-[#9B9B9B] text-sm tracking-widest hover:text-[#EAEAEA] transition-colors uppercase">
                        <span>&larr;</span> RETURN TO BLOG
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-14 border-b border-white/8 pb-8">
                    <div className="flex flex-wrap gap-4 text-[0.65rem] tracking-[0.15em] text-[#666] uppercase mb-6 font-medium">
                        <span className="text-white/40">{formatDate(blog.createdAt)}</span>
                        <span className="text-[#333]">//</span>
                        <span className="text-white/40">BY {blog.author?.name || "JESSE BIAS"}</span>
                        <span className="text-[#333]">//</span>
                        <span className="text-white">{blog.category}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#EAEAEA] leading-tight uppercase tracking-wide">{blog.title}</h1>
                </header>

                {/* Article Content */}
                <div className="text-[#d0d0d0] text-base leading-relaxed space-y-8 whitespace-pre-wrap">
                    {blog.content}
                </div>

                {/* Tags Placeholder */}
                <div className="mt-20 pt-10 border-t border-white/8 flex gap-2.5 flex-wrap">
                    {['#Substrate', '#Portfolio', '#2026', '#System'].map((tag) => (
                        <span key={tag} className="bg-white/5 border border-white/8 rounded-full px-4 py-1.5 text-xs text-[#9B9B9B] tracking-wider uppercase">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
