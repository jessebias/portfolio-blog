import { useCallback, useEffect, useRef, useState } from 'react';
import { useScramble } from '../hooks/useScramble';
import { useI18n } from '../i18n/LanguageProvider';
import type { ProjectId } from '../i18n/translations';
import { chromeEdge } from './ui/chromeEdge';

// Fully-resolved project (language-agnostic data merged with translated copy).
interface Project {
    id: ProjectId;
    category: string;
    title: string;
    description: string;
    tags: string[];
    link?: string;
    image?: string;
    overview: string;
    role: string;
    status: string;
}

// Language-agnostic project data — names, tags, links and assets. The
// translatable copy (category, description, overview, role, status) lives in
// the i18n dictionary and is merged in at render time, keyed by id.
interface BaseProject {
    id: ProjectId;
    title: string;
    tags: string[];
    link?: string;
    image?: string;
}

const BASE_PROJECTS: BaseProject[] = [
    {
        id: 'verta',
        title: 'VERTA',
        tags: ['Flutter', 'Node.js', 'AI', 'Solana'],
        link: 'https://www.verta.xyz',
        image: '/verta-preview.png',
    },
    {
        id: 'sonder',
        title: 'SONDER',
        tags: ['Next.js', 'AI Agents', 'Walrus', 'Sui'],
    },
    {
        id: 'company-os',
        title: 'COMPANY OS',
        tags: ['TypeScript', 'LangGraph', 'Slack', 'Automation'],
    },
];

// Cylinder geometry, tuned per breakpoint so side cards peek elegantly on
// every viewport instead of crowding the centre.
interface Geometry {
    spread: number;
    depth: number;
    rotate: number;
}

const getGeometry = (width: number): Geometry => {
    if (width >= 1024) return { spread: 384, depth: 280, rotate: 34 };
    if (width >= 768) return { spread: 312, depth: 220, rotate: 30 };
    return { spread: 188, depth: 150, rotate: 24 };
};

// ── Card face ──────────────────────────────────────────────────────────────
const ProjectCard = ({
    project,
    isCenter,
}: {
    project: Project;
    isCenter: boolean;
}) => {
    const { scramble } = useScramble();
    const [imgFailed, setImgFailed] = useState(false);
    const showImage = project.image && !imgFailed;

    const handleScramble = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget.querySelector<HTMLElement>('[data-scramble]');
        if (!target) return;
        if (!target.dataset.originalText) {
            target.dataset.originalText = target.textContent || '';
        }
        scramble(target, target.dataset.originalText);
    };

    return (
        <div
            onMouseEnter={isCenter ? handleScramble : undefined}
            className={`flex h-full flex-col rounded-2xl bg-[#080808] relative overflow-hidden transition-shadow duration-300 ${
                isCenter ? 'shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)]' : ''
            }`}
        >
            {/* Metallic chrome bevel around the edge */}
            <div
                aria-hidden
                className="absolute inset-0 rounded-2xl pointer-events-none z-30"
                style={chromeEdge(isCenter ? 0.58 : 0.26)}
            ></div>

            {/* Ambient radial wash — the site's signature spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none z-10"></div>

            {/* Preview surface — the focal point */}
            <div className="aspect-[16/10] w-full relative overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_70%),#060606]">
                {showImage ? (
                    <img
                        src={project.image}
                        alt={`${project.title} platform`}
                        loading="lazy"
                        onError={() => setImgFailed(true)}
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                            isCenter ? 'opacity-100' : 'opacity-80'
                        }`}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-(--prefix) text-[0.7rem] tracking-[0.3em] uppercase">
                            {project.title} // preview
                        </span>
                    </div>
                )}
                {/* Bottom fade into the info bar */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent pointer-events-none z-20"></div>
            </div>

            {/* Info bar */}
            <div className="relative z-20 px-7 pb-8 -mt-8 flex-1">
                <div className="text-[0.6rem] text-(--prefix) tracking-[0.14em] mb-2.5 uppercase">
                    /// {project.category}
                </div>
                <h3
                    data-scramble
                    className="m-0 text-[1.05rem] tracking-[0.12em] font-medium text-(--text)"
                >
                    {project.title}
                </h3>
                <p className="text-(--muted) text-[0.82rem] leading-[1.6] mt-3">
                    {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-5 text-[0.62rem] tracking-[0.1em] text-(--muted) uppercase">
                    {project.tags.map((tech, i) => (
                        <span key={tech} className="flex items-center gap-2.5">
                            {i > 0 && <span className="text-(--prefix)">•</span>}
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Detail modal ─────────────────────────────────────────────────────────────
const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="border-t border-(--border) pt-4">
        <div className="text-[0.55rem] text-(--prefix) tracking-[0.22em] uppercase mb-2">
            {label}
        </div>
        <div className="text-(--muted) text-[0.82rem] leading-[1.6]">{children}</div>
    </div>
);

const ProjectModal = ({
    project,
    show,
    onClose,
    onPrev,
    onNext,
}: {
    project: Project;
    show: boolean;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) => {
    const { t } = useI18n();
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            onClick={onClose}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-5 transition-opacity duration-200 ${
                show ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Translucent backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative z-10 w-full max-w-[640px] max-h-[88vh] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#080808] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] transition-all duration-200 ${
                    show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
                }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.05)_0%,transparent_55%)] pointer-events-none"></div>

                {/* Close */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)] hover:text-(--text)"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                </button>

                <div className="relative z-10 p-8 sm:p-10">
                    <h3 className="m-0 text-[1.6rem] tracking-[0.1em] font-medium text-(--text)">
                        {project.title}
                    </h3>
                    <p className="text-(--muted) text-[0.9rem] leading-[1.6] mt-3">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-5 text-[0.62rem] tracking-[0.1em] text-(--muted) uppercase">
                        {project.tags.map((tech, i) => (
                            <span key={tech} className="flex items-center gap-2.5">
                                {i > 0 && <span className="text-(--prefix)">•</span>}
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 space-y-5">
                        <DetailRow label={t.works.overview}>{project.overview}</DetailRow>
                        <DetailRow label={t.works.role}>{project.role}</DetailRow>
                        <DetailRow label={t.works.stack}>{project.tags.join(' · ')}</DetailRow>
                        <DetailRow label={t.works.status}>
                            <span className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.5)]"></span>
                                {project.status}
                            </span>
                        </DetailRow>
                        {project.link && (
                            <DetailRow label={t.works.website}>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-(--text) no-underline border-b border-[rgba(255,255,255,0.2)] pb-0.5 transition-colors duration-200 hover:border-[rgba(255,255,255,0.5)]"
                                >
                                    {project.link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="7" y1="17" x2="17" y2="7" />
                                        <polyline points="7 7 17 7 17 17" />
                                    </svg>
                                </a>
                            </DetailRow>
                        )}
                    </div>

                    {/* In-modal navigation across all projects */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-(--border)">
                        <button
                            onClick={onPrev}
                            className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-(--muted) transition-colors duration-200 hover:text-(--text)"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Prev
                        </button>
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-(--muted) transition-colors duration-200 hover:text-(--text)"
                        >
                            Next
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── 3D cylindrical carousel ──────────────────────────────────────────────────
const Works = () => {
    const { t } = useI18n();
    // Merge language-agnostic data with the active language's copy.
    const projects: Project[] = BASE_PROJECTS.map((p) => ({ ...p, ...t.projects[p.id] }));
    const total = projects.length;
    const [active, setActive] = useState(0);
    const [geometry, setGeometry] = useState<Geometry>(() =>
        getGeometry(typeof window !== 'undefined' ? window.innerWidth : 1280),
    );
    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const [modalShown, setModalShown] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const goTo = useCallback(
        (index: number) => setActive(((index % total) + total) % total),
        [total],
    );
    const prev = useCallback(() => goTo(active - 1), [active, goTo]);
    const next = useCallback(() => goTo(active + 1), [active, goTo]);

    // Relative, wrap-aware offset of a card from the active index (−1, 0, +1 for 3 cards).
    const offsetOf = (index: number) => {
        let diff = index - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    // Track viewport to retune the cylinder geometry.
    useEffect(() => {
        const onResize = () => setGeometry(getGeometry(window.innerWidth));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Modal open/close lifecycle: lock scroll + drive the enter transition.
    const openModal = (index: number) => setModalIndex(index);
    const closeModal = useCallback(() => {
        setModalShown(false);
        window.setTimeout(() => setModalIndex(null), 200);
    }, [setModalShown, setModalIndex]);

    useEffect(() => {
        if (modalIndex === null) return;
        document.body.style.overflow = 'hidden';
        const id = requestAnimationFrame(() => setModalShown(true));
        return () => {
            document.body.style.overflow = '';
            cancelAnimationFrame(id);
        };
    }, [modalIndex]);

    // Keyboard: arrows move the carousel (or the modal when open); Escape closes.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (modalIndex !== null) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') setModalIndex((i) => (i === null ? i : (i - 1 + total) % total));
                if (e.key === 'ArrowRight') setModalIndex((i) => (i === null ? i : (i + 1) % total));
                return;
            }
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalIndex, total, prev, next, closeModal]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 44) (delta < 0 ? next : prev)();
        touchStartX.current = null;
    };

    const cardStyle = (offset: number): React.CSSProperties => {
        const abs = Math.abs(offset);
        const isCenter = offset === 0;
        return {
            transform: `translate(calc(-50% + ${offset * geometry.spread}px), -50%) translateZ(${
                isCenter ? 0 : -geometry.depth
            }px) rotateY(${offset * -geometry.rotate}deg) scale(${
                isCenter ? 1 : Math.max(0.7, 1 - abs * 0.15)
            })`,
            opacity: isCenter ? 1 : Math.max(0.22, 1 - abs * 0.55),
            zIndex: 30 - abs,
            filter: isCenter ? 'none' : `blur(${abs * 0.7}px)`,
            pointerEvents: abs > 1 ? 'none' : 'auto',
        };
    };

    return (
        <section id="works" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <div className="flex items-end justify-between gap-6 mb-[40px]">
                <div>
                    <h2 className="tracking-[0.2em] mb-[14px] text-[1.05rem]">{t.works.heading}</h2>
                    <p className="text-(--muted) text-[0.85rem] tracking-[0.04em] leading-[1.6] max-w-[480px]">
                        {t.works.subtitle}
                    </p>
                </div>

                {/* Carousel controls — round, restrained, top-right (per reference) */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <button
                        onClick={prev}
                        aria-label="Previous project"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)] hover:text-(--text)"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next project"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)] hover:text-(--text)"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Stage */}
            <div
                className="relative h-[440px] sm:h-[500px] w-full [perspective:1600px]"
                style={{ transformStyle: 'preserve-3d' }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {projects.map((project, index) => {
                    const offset = offsetOf(index);
                    const isCenter = offset === 0;
                    return (
                        <div
                            key={project.id}
                            className="absolute left-1/2 top-1/2 w-[min(86vw,420px)] [transform-style:preserve-3d] transition-[transform,opacity,filter] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={cardStyle(offset)}
                        >
                            <button
                                type="button"
                                aria-label={isCenter ? `Open ${project.title} details` : `Focus ${project.title}`}
                                onClick={() => (isCenter ? openModal(index) : goTo(index))}
                                className="block w-full cursor-pointer text-left [transform-style:preserve-3d]"
                            >
                                <ProjectCard project={project} isCenter={isCenter} />
                                {isCenter && (
                                    <span className="block text-center mt-5 text-[0.55rem] tracking-[0.22em] uppercase text-(--prefix)">
                                        {t.works.clickToExpand}
                                    </span>
                                )}
                            </button>

                            {/* External-link indicator — visits the project site without opening the modal */}
                            {isCenter && project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Visit ${project.title}`}
                                    className="group/visit absolute top-5 right-5 z-40 flex items-center gap-1.5 text-(--muted) no-underline transition-colors duration-300 hover:text-(--text)"
                                >
                                    <span className="text-[0.55rem] tracking-[0.2em] uppercase opacity-0 -translate-x-1 transition-all duration-300 group-hover/visit:opacity-100 group-hover/visit:translate-x-0">
                                        {t.works.visit}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Position indicators */}
            <div className="flex items-center justify-center gap-2.5 mt-2">
                {projects.map((project, index) => (
                    <button
                        key={project.id}
                        onClick={() => goTo(index)}
                        aria-label={`Go to ${project.title}`}
                        aria-current={index === active}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === active
                                ? 'w-6 bg-[rgba(255,255,255,0.6)]'
                                : 'w-1.5 bg-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.35)]'
                        }`}
                    />
                ))}
            </div>

            {modalIndex !== null && (
                <ProjectModal
                    project={projects[modalIndex]}
                    show={modalShown}
                    onClose={closeModal}
                    onPrev={() => setModalIndex((i) => (i === null ? i : (i - 1 + total) % total))}
                    onNext={() => setModalIndex((i) => (i === null ? i : (i + 1) % total))}
                />
            )}
        </section>
    );
};

export default Works;
