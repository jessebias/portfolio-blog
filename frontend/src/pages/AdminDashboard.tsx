import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getBlogs, createBlog, updateBlog, deleteBlog, type Blog } from '../api/blogs';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthProvider.tsx';

const Icons = {
    Bold: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h8a4 4 0 0 0 0-8H6v8Z" /><path d="M6 12h9a4 4 0 0 1 0 8H6v-8Z" /></svg>,
    Italic: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>,
    Underline: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" /></svg>,
    List: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    ListOrdered: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>,
    Quote: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z" /></svg>,
    Link: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
    Image: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
};

const EMPTY_CONTENT = '<p>Start writing your story...</p>';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const contentRef = useRef<HTMLDivElement>(null);

    // Form state
    const [title, setTitle]       = useState('');
    const [category, setCategory] = useState('');
    const [editingPost, setEditingPost] = useState<Blog | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError]   = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Data state
    const [posts, setPosts]       = useState<Blog[]>([]);
    const [users, setUsers]       = useState<any[]>([]);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [usersError, setUsersError] = useState<string | null>(null);

    useEffect(() => {
        if (contentRef.current) contentRef.current.innerHTML = EMPTY_CONTENT;

        getBlogs()
            .then(setPosts)
            .catch(() => setPostsError('Failed to load posts'));

        axios.get('/api/meta/users')
            .then(res => setUsers(res.data))
            .catch(() => setUsersError('Failed to load users'));
    }, []);

    const formatDoc = (cmd: string, value: string | null = null) => {
        document.execCommand(cmd, false, value ?? undefined);
        contentRef.current?.focus();
    };

    const resetForm = () => {
        setTitle('');
        setCategory('');
        setEditingPost(null);
        setSubmitError(null);
        setSubmitSuccess(false);
        if (contentRef.current) contentRef.current.innerHTML = EMPTY_CONTENT;
    };

    const handleEdit = (post: Blog) => {
        setEditingPost(post);
        setTitle(post.title);
        setCategory(post.category || '');
        setSubmitError(null);
        setSubmitSuccess(false);
        if (contentRef.current) contentRef.current.innerHTML = post.content;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this post? This cannot be undone.')) return;
        try {
            await deleteBlog(id);
            setPosts(prev => prev.filter(p => p.id !== id));
            if (editingPost?.id === id) resetForm();
        } catch {
            setPostsError('Failed to delete post');
        }
    };

    const handleSubmit = async () => {
        const content = contentRef.current?.innerHTML || '';
        if (!title.trim()) { setSubmitError('Title is required'); return; }
        if (!content.trim() || content === EMPTY_CONTENT) { setSubmitError('Content is required'); return; }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            if (editingPost) {
                const updated = await updateBlog(editingPost.id, { title, category, content });
                setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
            } else {
                const created = await createBlog({ title, category, content });
                setPosts(prev => [created, ...prev]);
            }
            setSubmitSuccess(true);
            resetForm();
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Failed to save post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#EAEAEA] selection:bg-[#666] selection:text-white"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03), transparent 70%)' }}>

            {/* Navigation */}
            <nav className="border-b border-white/8 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-[0.85rem] tracking-[0.14em] font-medium select-none bg-[linear-gradient(120deg,#ffffff,#e8ecf2,#c7d2df,#7a838f,#c7d2df,#e8ecf2,#ffffff)] bg-size-[200%_200%] bg-repeat bg-clip-text text-transparent animate-[liquid_4.5s_ease-in-out_infinite]">JB</div>
                        <div className="text-xs tracking-widest text-[#666] font-medium">// ADMIN</div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="/" className="flex items-center gap-2 text-xs tracking-widest text-[#9B9B9B] hover:text-white transition-colors group">
                            <span className="text-[#666] group-hover:text-white transition-colors">&lt;</span>
                            <span>BACK TO SITE</span>
                        </a>
                        <button onClick={logout} className="text-xs tracking-widest text-[#ff4d4d] hover:text-[#ff3333] transition-colors font-medium border border-[#ff4d4d]/30 hover:border-[#ff4d4d] px-3 py-1.5 rounded-md">
                            SIGN OUT
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-16">

                {/* Create / Edit Post */}
                <section>
                    <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/8 rounded-2xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-center items-center mb-10">
                            <h2 className="text-[1.4rem] tracking-widest font-medium text-[#EAEAEA]">
                                {editingPost ? 'EDIT POST' : 'CREATE NEW POST'}
                            </h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Title and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2.5 text-xs text-[#9B9B9B] tracking-[0.12em] uppercase">Post Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-white/3 border border-white/8 text-[#EAEAEA] px-4 py-3.5 rounded-lg outline-none focus:border-[#666] focus:bg-white/5 transition-all text-sm placeholder:text-[#666]"
                                        placeholder="Enter title..."
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2.5 text-xs text-[#9B9B9B] tracking-[0.12em] uppercase">Category</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-white/3 border border-white/8 text-[#EAEAEA] px-4 py-3.5 rounded-lg outline-none focus:border-[#666] focus:bg-white/5 transition-all text-sm placeholder:text-[#666]"
                                        placeholder="e.g. Technology"
                                    />
                                </div>
                            </div>

                            {/* Cover Media */}
                            <div>
                                <label className="block mb-2.5 text-xs text-[#9B9B9B] tracking-[0.12em] uppercase">Cover Media</label>
                                <div className="relative w-full overflow-hidden">
                                    <input type="file" className="w-full text-[#9B9B9B] text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-white/5 file:text-[#EAEAEA] file:border-white/8 file:border-solid hover:file:bg-white/10 cursor-pointer" accept="image/*,video/*" />
                                </div>
                            </div>

                            {/* Editor */}
                            <div>
                                <label className="block mb-2.5 text-xs text-[#9B9B9B] tracking-[0.12em] uppercase">Content</label>
                                <div className="bg-white/3 border border-white/8 rounded-lg overflow-hidden flex flex-col focus-within:border-[#666] transition-colors">
                                    <div className="flex flex-wrap gap-2 p-2.5 bg-white/2 border-b border-white/8">
                                        <button onClick={() => formatDoc('bold')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Bold"><Icons.Bold /></button>
                                        <button onClick={() => formatDoc('italic')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Italic"><Icons.Italic /></button>
                                        <button onClick={() => formatDoc('underline')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Underline"><Icons.Underline /></button>
                                        <div className="w-px h-6 bg-white/8 mx-1 self-center"></div>
                                        <button onClick={() => formatDoc('insertUnorderedList')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Bullet List"><Icons.List /></button>
                                        <button onClick={() => formatDoc('insertOrderedList')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Numbered List"><Icons.ListOrdered /></button>
                                        <div className="w-px h-6 bg-white/8 mx-1 self-center"></div>
                                        <button onClick={() => formatDoc('formatBlock', 'blockquote')} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Quote"><Icons.Quote /></button>
                                        <button onClick={() => { const url = prompt('Enter Link URL:'); if (url) formatDoc('createLink', url); }} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Link"><Icons.Link /></button>
                                        <button onClick={() => { const url = prompt('Enter Image URL:'); if (url) formatDoc('insertImage', url); }} className="p-1.5 text-[#9B9B9B] hover:text-white hover:bg-white/5 rounded transition-colors" title="Image"><Icons.Image /></button>
                                    </div>
                                    <div
                                        ref={contentRef}
                                        className="min-h-[200px] p-5 text-[#EAEAEA] outline-none overflow-y-auto leading-relaxed [&>p]:mb-4"
                                        contentEditable
                                        suppressContentEditableWarning
                                    />
                                </div>
                            </div>

                            {submitError && <p className="text-[#ff4d4d] text-xs tracking-wide">{submitError}</p>}
                            {submitSuccess && <p className="text-green-400 text-xs tracking-wide">{editingPost ? 'POST UPDATED' : 'POST PUBLISHED'}</p>}

                            <div className="pt-4 flex gap-3">
                                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? 'SAVING...' : editingPost ? 'UPDATE POST' : 'PUBLISH POST'}
                                </Button>
                                {editingPost && (
                                    <button onClick={resetForm} className="px-6 py-3 text-xs tracking-widest text-[#9B9B9B] border border-white/8 rounded-xl hover:border-white/20 transition-colors">
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Manage Posts */}
                <section>
                    <div className="flex items-center mb-8">
                        <h2 className="text-[1.1rem] tracking-widest font-medium text-[#EAEAEA]">MANAGE POSTS</h2>
                    </div>

                    {postsError && <p className="text-[#ff4d4d] text-xs tracking-wide mb-4">{postsError}</p>}

                    <div className="flex flex-col gap-4">
                        {posts.length === 0 && !postsError && (
                            <p className="text-[#666] text-xs tracking-widest uppercase">No posts yet.</p>
                        )}
                        {posts.map(post => (
                            <div key={post.id} className="bg-white/3 border border-white/8 rounded-xl p-6 flex justify-between items-center hover:bg-white/5 transition-colors group">
                                <div>
                                    <h3 className="text-[0.95rem] font-normal tracking-[0.05em] mb-1.5">{post.title}</h3>
                                    <span className="text-[0.7rem] text-[#9B9B9B] tracking-widest uppercase">
                                        Published: {formatDate(post.createdAt)}
                                        {post.category && <span className="ml-3 text-[#666]">· {post.category}</span>}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleEdit(post)} className="bg-transparent text-[#9B9B9B] border border-white/8 rounded-md px-4 py-2 text-[0.7rem] hover:border-[#EAEAEA] hover:text-[#EAEAEA] transition-colors tracking-widest">EDIT</button>
                                    <button onClick={() => handleDelete(post.id)} className="bg-transparent text-[#ff4d4d] border border-[#ff4d4d]/30 rounded-md px-4 py-2 text-[0.7rem] hover:border-[#ff4d4d] hover:bg-[#ff4d4d]/10 transition-colors tracking-widest">DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* User Management */}
                <section>
                    <div className="flex items-center mb-8">
                        <h2 className="text-[1.1rem] tracking-widest font-medium text-[#EAEAEA]">USER MANAGEMENT</h2>
                    </div>

                    {usersError && <p className="text-[#ff4d4d] text-xs tracking-wide mb-4">{usersError}</p>}

                    <div className="flex flex-col gap-4">
                        {users.map(user => (
                            <div key={user.id} className="bg-white/3 border border-white/8 rounded-xl p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <h3 className="text-[0.95rem] font-normal tracking-[0.05em] mb-1.5">{user.name}</h3>
                                    <span className="text-[0.7rem] text-[#9B9B9B] tracking-widest uppercase">{user.role} · {user.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
