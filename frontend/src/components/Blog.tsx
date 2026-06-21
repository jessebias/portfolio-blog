import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, type Blog } from '../api/blogs';
import Button from './ui/Button';
import { useI18n } from '../i18n/LanguageProvider';

interface Entry {
    key: string;
    to: string;
    title: string;
    meta: string;
}

const formatMeta = (post: Blog, locale: string): string => {
    const category = post.category?.trim();
    const date = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
        : null;
    return [category, date].filter(Boolean).join(' • ') || 'Draft';
};

const Blog = () => {
    const { t, localize, lang } = useI18n();
    const [posts, setPosts] = useState<Blog[]>([]);

    useEffect(() => {
        getBlogs()
            .then(data => setPosts(data.slice(0, 4)))
            .catch(() => {});
    }, []);

    const locale = lang === 'ja' ? 'ja-JP' : 'en-US';

    const entries: Entry[] = Array.from({ length: 4 }, (_, i) => {
        const post = posts[i];
        if (post) {
            return { key: `post-${post.id}`, to: localize(`/blogs/${post.id}`), title: post.title, meta: formatMeta(post, locale) };
        }
        // Sample entries fill empty slots so the journal reads as complete before posts exist.
        const sample = t.blog.samples[i];
        return { key: `sample-${i}`, to: localize('/blogs'), title: sample.title, meta: sample.meta };
    });

    return (
        <section id="blog" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[14px] text-[1.05rem]">{t.blog.heading}</h2>
            <p className="text-(--muted) text-[0.85rem] tracking-[0.04em] leading-[1.6] mb-[40px] max-w-[480px]">
                {t.blog.subtitle}
            </p>

            <div className="border-t border-(--border) mb-12">
                {entries.map((entry, i) => (
                    <Link
                        key={entry.key}
                        to={entry.to}
                        className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-10 py-7 border-b border-(--border) no-underline transition-colors duration-300"
                    >
                        <span className="text-[0.8rem] tabular-nums text-(--prefix) tracking-[0.1em] transition-colors duration-300 group-hover:text-(--muted)">
                            {String(i + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0 transition-transform duration-300 ease-out group-hover:translate-x-1">
                            <h3 className="m-0 text-[1.02rem] md:text-[1.12rem] tracking-[0.02em] font-medium text-(--muted) transition-colors duration-300 group-hover:text-(--text) truncate">
                                {entry.title}
                            </h3>
                            <div className="mt-2 text-[0.68rem] tracking-[0.14em] uppercase text-(--prefix)">
                                {entry.meta}
                            </div>
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="self-center text-(--prefix) opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-(--muted)"
                        >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center">
                <Button to={localize('/blogs')}>{t.blog.readMore}</Button>
            </div>
        </section>
    );
};

export default Blog;
