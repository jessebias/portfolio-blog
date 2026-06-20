import type { ReactNode } from "react";
import awsLogo from "../assets/logos/aws.svg";
import openaiLogo from "../assets/logos/openai.svg";

const CARD_BASE =
    "relative rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[radial-gradient(120px_80px_at_30%_20%,rgba(255,255,255,0.06),transparent_70%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] grid place-items-center transition-[transform,border-color] duration-220 ease-out hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)] group";

// On-brand hover label — names each stylized logo for non-technical visitors.
const TOOLTIP =
    "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 px-2.5 py-1 rounded-md whitespace-nowrap text-[0.62rem] tracking-[0.14em] uppercase text-(--text) bg-[rgba(10,10,10,0.92)] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-sm opacity-0 translate-y-1 transition-[opacity,transform] duration-220 ease-out group-hover:opacity-100 group-hover:translate-y-0";

const LOGO_BASE =
    "grayscale brightness-115 transition-[opacity,filter,transform] duration-220 ease-out group-hover:opacity-95 group-hover:grayscale-0 group-hover:brightness-120 group-hover:-translate-y-px";

type Tech = { name: string; slug?: string; src?: string };

const logoSrc = (tech: Tech): string | undefined =>
    tech.src ?? (tech.slug ? `https://cdn.simpleicons.org/${tech.slug}/ffffff` : undefined);

const TechCard = ({
    tech,
    cardClass,
    logoClass,
}: {
    tech: Tech;
    cardClass: string;
    logoClass: string;
}) => {
    const src = logoSrc(tech);
    return (
    <div className={`${CARD_BASE} ${cardClass}`}>
        {src ? (
            <>
                <img
                    src={src}
                    alt={tech.name}
                    className={`${LOGO_BASE} ${logoClass}`}
                />
                <span role="tooltip" className={TOOLTIP}>
                    {tech.name}
                </span>
            </>
        ) : (
            <span className="text-[0.7rem] tracking-[0.12em] text-(--muted) group-hover:text-(--text) cursor-default text-center px-2">
                {tech.name}
            </span>
        )}
    </div>
    );
};

const Divider = ({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) => (
    <div
        className={`flex items-center gap-3 uppercase after:content-[''] after:h-px after:flex-1 ${className}`}
    >
        {children}
    </div>
);

// Primary — full-stack engineering foundation.
const ENGINEERING: Tech[] = [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextdotjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Python", slug: "python" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "Docker", slug: "docker" },
    { name: "AWS", src: awsLogo },
];

// Secondary — AI-native systems, given the strongest emphasis.
const AI_SYSTEMS: Tech[] = [
    { name: "OpenAI", src: openaiLogo },
    { name: "Anthropic", slug: "anthropic" },
    { name: "LangGraph", slug: "langgraph" },
    { name: "n8n", slug: "n8n" },
];

// Supporting — mobile.
const MOBILE: Tech[] = [
    { name: "React Native / Expo", slug: "expo" },
    { name: "Flutter", slug: "flutter" },
];

// Supporting — web3.
const WEB3: Tech[] = [
    { name: "Solana", slug: "solana" },
    { name: "Solidity", slug: "solidity" },
    { name: "Sui", slug: "sui" },
];

const Tools = () => {
    return (
        <section id="tools" className="max-w-[1200px] mx-auto px-6 py-[120px]">
            <div className="border border-(--border) rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                <div className="p-[34px] border-b border-(--border)">
                    <h2 className="m-0 mb-2 tracking-[0.2em] text-[1.2rem]">TECH STACK</h2>
                    <p className="m-0 text-(--muted) text-[0.8rem]">Building AI-native products across web, mobile, and Web3.</p>
                </div>

                <div className="p-[24px_34px_30px]">
                    {/* Engineering — primary */}
                    <Divider className="mt-[12px] mb-[12px] text-[0.72rem] tracking-[0.18em] after:bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]">
                        Engineering
                    </Divider>
                    <div className="grid grid-cols-4 gap-[14px]">
                        {ENGINEERING.map((tech) => (
                            <TechCard
                                key={tech.name}
                                tech={tech}
                                cardClass="h-[60px]"
                                logoClass="opacity-40 max-w-[54px] max-h-[24px]"
                            />
                        ))}
                    </div>

                    {/* AI Systems — secondary, strongest emphasis */}
                    <Divider className="mt-[28px] mb-[14px] text-[0.74rem] tracking-[0.2em] text-(--text) after:bg-[linear-gradient(90deg,rgba(255,255,255,0.3),transparent)]">
                        <span className="inline-block w-[5px] h-[5px] rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
                        AI Systems
                    </Divider>
                    <div className="grid grid-cols-4 gap-[14px]">
                        {AI_SYSTEMS.map((tech) => (
                            <TechCard
                                key={tech.name}
                                tech={tech}
                                cardClass="h-[74px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                                logoClass="opacity-60 max-w-[68px] max-h-[28px]"
                            />
                        ))}
                    </div>

                    {/* Mobile + Web3 — compact supporting columns */}
                    <div className="grid grid-cols-2 gap-[34px] mt-[28px]">
                        <div>
                            <Divider className="mb-[12px] text-[0.68rem] tracking-[0.18em] text-(--muted) after:bg-[linear-gradient(90deg,rgba(255,255,255,0.12),transparent)]">
                                Mobile
                            </Divider>
                            <div className="grid grid-cols-2 gap-[14px]">
                                {MOBILE.map((tech) => (
                                    <TechCard
                                        key={tech.name}
                                        tech={tech}
                                        cardClass="h-[52px]"
                                        logoClass="opacity-40 max-w-[48px] max-h-[22px]"
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <Divider className="mb-[12px] text-[0.68rem] tracking-[0.18em] text-(--muted) after:bg-[linear-gradient(90deg,rgba(255,255,255,0.12),transparent)]">
                                Web3
                            </Divider>
                            <div className="grid grid-cols-3 gap-[14px]">
                                {WEB3.map((tech) => (
                                    <TechCard
                                        key={tech.name}
                                        tech={tech}
                                        cardClass="h-[52px]"
                                        logoClass="opacity-40 max-w-[48px] max-h-[22px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Tools;
