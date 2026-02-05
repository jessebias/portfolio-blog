import React from 'react';
import { Link } from 'react-router-dom';
import { useScramble } from '../../hooks/useScramble';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    children: React.ReactNode;
    width?: string;
    to?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', width = '', to, ...props }) => {
    const { scramble } = useScramble();

    const handleScramble = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        // If the target has children elements (like spans), we should target the text node or specific span if possible.
        // But for this component, we assume simple text children or that we replace content.
        // To be safer, let's wrap children in a span if not already, but current usage suggests text.
        // A better approach for this specific scramble hook which replaces textContent is to only use it on text-only buttons.

        if (!target.dataset.originalText) {
            target.dataset.originalText = target.textContent || "";
        }
        scramble(target, target.dataset.originalText);
    };

    // Base classes
    const baseClasses = "inline-flex justify-center items-center py-[14px] px-[44px] border border-(--border) rounded-[99px] bg-[rgba(255,255,255,0.02)] text-(--text) text-[0.75rem] tracking-[0.14em] uppercase transition-all duration-200 ease-out hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.14)] cursor-pointer no-underline";

    // Combine classes
    const combinedClasses = `${baseClasses} ${width} ${className}`;

    if (to) {
        return (
            <Link
                to={to}
                className={combinedClasses}
                onMouseEnter={handleScramble}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClasses}
            onMouseEnter={handleScramble}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
};

export default Button;
