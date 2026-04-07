import { useState } from 'react';
import { useScramble } from '../hooks/useScramble';
import WorkModal, { type WorkProject } from './WorkModal';

const PROJECTS: WorkProject[] = [
    {
        id: 'mood-todo',
        category: 'web',
        title: 'MOOD BASED TODO',
        description: 'A task management app that adapts to your emotional state.',
        longDescription: 'A unique approach to task management that prioritizes mental well-being. This application suggests tasks based on your current mood tracking, helping you stay productive without burnout. Built with modern web technologies and focused on a calm, adaptive user interface.',
        link: 'https://mood-based-to-do-app.onrender.com/',
        image: '/mood-todo-preview.png',
    },
    // Placeholders for other categories to keep the layout populated if needed, 
    // or we can just filter what we have. For now, let's keep the user's focus on the added one 
    // and maybe a couple generic ones to show the grid.
    {
        id: 'hear-me-out',
        category: 'music',
        title: 'HEAR ME OUT',
        description: 'Motion Graphics & Sound Design Spec.',
        longDescription: 'A kinetic typography and motion graphics study synced to audio. Exploring the relationship between rhythm, text, and visual impact.',
        video: '/hear-me-out-mgfx.mp4',
        image: '/hear-me-out-artwork.png',
    },
    {
        id: 'go',
        category: 'music',
        title: 'GO',
        description: 'Visualizer & Cover Art.',
        longDescription: 'A comprehensive visualizer project featuring custom artwork and motion design synchronized to the track "Go".',
        video: '/go-mgfx.mp4',
        image: '/go-artwork.png',
    },
    {
        id: 'placeholder-1',
        category: 'web',
        title: 'PROJECT_ALPHA',
        description: 'Web application interface design.',
        longDescription: 'A concept study for a high-performance web dashboard focused on data visualization and real-time analytics.',
    },

    {
        id: 'behind-the-mask',
        category: 'film',
        title: 'BEHIND THE MASK',
        description: 'Short Film.',
        longDescription: 'A 15-minute short film exploring identity and perception. Currently in post-production for web release.',
        image: '/behind-the-mask-artwork.png',
    },
    {
        id: 'placeholder-4',
        category: 'photo',
        title: 'STREET_SERIES',
        description: 'Urban street photography.',
        longDescription: 'A collection of black and white street photography capturing candid moments in the city.',
    }
];

const Works = () => {
    const [activeTab, setActiveTab] = useState('web');
    const [isFading, setIsFading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
    const { scramble } = useScramble();

    const filteredProjects = PROJECTS.filter(p => p.category === activeTab);

    // If no projects for a tab (like we just have placeholders mixed in), show placeholders
    // But for this specific request, let's ensure we at least show placeholders if empty so it doesn't look broken
    const displayProjects = filteredProjects.length > 0 ? filteredProjects : [
        { id: 'p1', category: activeTab, title: 'COMING_SOON', description: 'Project in development.' },
        { id: 'p2', category: activeTab, title: 'COMING_SOON', description: 'Project in development.' },
        { id: 'p3', category: activeTab, title: 'COMING_SOON', description: 'Project in development.' },
    ] as WorkProject[];


    const handleTabClick = (tabId: string) => {
        if (activeTab === tabId) return;

        setIsFading(true);
        setTimeout(() => {
            setActiveTab(tabId);
            setIsFading(false);
        }, 200);
    };

    const handleScramble = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.currentTarget;
        if (!target.dataset.originalText) {
            target.dataset.originalText = target.textContent || "";
        }
        const originalText = target.dataset.originalText;
        scramble(target, originalText);
    };

    return (
        <section id="works" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[22px] text-[1.05rem]">WORK</h2>

            {/* TABS */}
            <div className="flex gap-[30px] mb-8 border-b border-(--border) pb-3 relative">
                {['web', 'music', 'film', 'photo'].map((tab) => (
                    <button
                        key={tab}
                        className={`bg-transparent border-none font-[inherit] text-[0.75rem] tracking-[0.14em] uppercase cursor-pointer relative px-1 transition-[color] duration-300 ease-out ${activeTab === tab
                            ? 'text-(--text) after:content-[""] after:absolute after:-bottom-[13px] after:left-0 after:w-full after:h-px after:bg-white after:shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                            : 'text-(--muted) hover:text-(--text)'
                            }`}
                        onClick={() => handleTabClick(tab)}
                        onMouseEnter={handleScramble}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* CONTENT CONTAINER */}
            <div className="relative min-h-[200px]">
                <div
                    id={activeTab}
                    className={`grid gap-[22px] transition-[opacity,transform] duration-400 ease-out ${activeTab === 'music'
                        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                        : 'grid-cols-1 md:grid-cols-3'
                        } ${!isFading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'}`}

                >
                    {displayProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`${activeTab === 'music' ? 'aspect-square' : 'h-[200px]'} rounded-2xl border border-(--border) bg-[#080808] relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:border-[rgba(255,255,255,0.15)]`}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)] transition-opacity duration-300 group-hover:opacity-80"></div>
                            {project.image && (
                                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <div className="text-[0.65rem] text-(--prefix) tracking-[0.12em] mb-2 relative z-10 uppercase">
                                    /// {project.category}
                                </div>
                                <h3 className="m-0 text-[0.95rem] tracking-widest font-medium text-(--text) relative z-10 truncate">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <WorkModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </section>
    );
};

export default Works;

