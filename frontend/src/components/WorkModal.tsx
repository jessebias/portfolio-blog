import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './ui/Button';

export interface WorkProject {
    id: string;
    category: string;
    title: string;
    description: string;
    longDescription?: string;
    link?: string;
    image?: string;
    video?: string;
}

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: WorkProject | null;
}

const WorkModal = ({ isOpen, onClose, project }: WorkModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                ref={modalRef}
                className="relative z-10 w-full max-w-2xl bg-[#080808] border border-(--border) rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]"
            >
                {/* Image/Video Placeholder / Banner */}
                <div className="aspect-video w-full relative overflow-hidden bg-[#111]">
                    {project.video ? (
                        <video
                            src={project.video}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : project.image ? (
                        <>
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]">
                            <div className="absolute inset-0 flex items-center justify-center text-(--muted) tracking-widest text-sm uppercase">
                                {project.category} // PREVIEW
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[0.7rem] text-(--prefix) tracking-[0.14em] mb-3 uppercase">
                                /// {project.category}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-medium tracking-wide text-(--text) mb-2">
                                {project.title}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-(--muted) hover:text-(--text) transition-colors p-2"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="prose prose-invert max-w-none text-(--muted) text-sm leading-relaxed mb-8">
                        <p>{project.longDescription || project.description}</p>
                    </div>

                    {project.link && (
                        <div className="flex justify-end">
                            <Button to={project.link} target="_blank" rel="noopener noreferrer">
                                VIEW PROJECT
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WorkModal;
