import Button from './ui/Button';

const Blog = () => {
    return (
        <section id="blog" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[22px] text-[1.05rem]">BLOG</h2>
            <div className="grid grid-cols-2 gap-[22px] mb-9">
                <a href="#" className="h-[160px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden flex flex-col justify-end p-6 no-underline transition-all duration-200 ease-out hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>
                    <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">/// PENDING</div>
                    <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10">ENTRY_001_NULL</h3>
                </a>
                <a href="#" className="h-[160px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden flex flex-col justify-end p-6 no-underline transition-all duration-200 ease-out hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>
                    <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">/// PENDING</div>
                    <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10">ENTRY_002_NULL</h3>
                </a>
                <a href="#" className="h-[160px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden flex flex-col justify-end p-6 no-underline transition-all duration-200 ease-out hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>
                    <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">/// PENDING</div>
                    <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10">ENTRY_003_NULL</h3>
                </a>
                <a href="#" className="h-[160px] rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden flex flex-col justify-end p-6 no-underline transition-all duration-200 ease-out hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>
                    <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10">/// PENDING</div>
                    <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10">ENTRY_004_NULL</h3>
                </a>
            </div>
            <div className="flex justify-center">
                <Button to="/blogs">READ MORE</Button>
            </div>
        </section>
    );
};

export default Blog;
