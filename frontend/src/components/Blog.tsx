import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, type Blog } from '../api/blogs';
import Button from './ui/Button';

const PLACEHOLDERS = ['ENTRY_001_NULL', 'ENTRY_002_NULL', 'ENTRY_003_NULL', 'ENTRY_004_NULL'];

const cardClass = "h-[160px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden flex flex-col justify-end p-6 no-underline transition-all duration-200 ease-out hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5";
const glowClass = "absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.03)_0%,transparent_60%)]";

const Blog = () => {
    const [posts, setPosts] = useState<Blog[]>([]);

    useEffect(() => {
        getBlogs()
            .then(data => setPosts(data.slice(0, 4)))
            .catch(() => {});
    }, []);

    const formatPrefix = (post: Blog) => {
        if (post.category) return `/// ${post.category.toUpperCase()}`;
        if (post.createdAt) {
            return `/// ${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}`;
        }
        return '/// PUBLISHED';
    };

    const cards = Array.from({ length: 4 }, (_, i) => {
        const post = posts[i];
        if (post) {
            return (
                <Link key={post.id} to={`/blogs/${post.id}`} className={cardClass}>
                    <div className={glowClass}></div>
                    <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">{formatPrefix(post)}</div>
                    <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10 line-clamp-2">{post.title.toUpperCase()}</h3>
                </Link>
            );
        }
        return (
            <a key={i} href="#" className={cardClass}>
                <div className={glowClass}></div>
                <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">/// PENDING</div>
                <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10">{PLACEHOLDERS[i]}</h3>
            </a>
        );
    });

    return (
        <section id="blog" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[22px] text-[1.05rem]">BLOG</h2>
            <div className="grid grid-cols-2 gap-[22px] mb-9">
                {cards}
            </div>
            <div className="flex justify-center">
                <Button to="/blogs">READ MORE</Button>
            </div>
        </section>
    );
};

export default Blog;
