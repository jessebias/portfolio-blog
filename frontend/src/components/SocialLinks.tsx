
interface SocialLinksProps {
    containerClass?: string;
    linkClass?: string;
    iconClass?: string;
}

const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/thejessebias',
        icon: 'https://cdn.simpleicons.org/instagram/ffffff'
    },
    {
        name: 'X',
        url: 'https://x.com/0xJbias',
        icon: 'https://cdn.simpleicons.org/x/ffffff'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/jessebias/',
        icon: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M19%200h-14c-2.761%200-5%202.239-5%205v14c0%202.761%202.239%205%205%205h14c2.762%200%205-2.239%205-5v-14c0-2.761-2.238-5-5-5zm-11%2019h-3v-11h3v11zm-1.5-12.268c-.966%200-1.75-.79-1.75-1.764s.784-1.764%201.75-1.764%201.75.79%201.75%201.764-.783%201.764-1.75%201.764zm13.5%2012.268h-3v-5.604c0-3.368-4-3.113-4%200v5.604h-3v-11h3v1.765c1.396-2.586%207-2.777%207%202.476v6.759z%22%2F%3E%3C%2Fsvg%3E'
    },
    {
        name: 'GitHub',
        url: 'https://github.com/jessebias',
        icon: 'https://cdn.simpleicons.org/github/ffffff'
    }
];

const SocialLinks = ({ containerClass = "flex gap-5", linkClass = "", iconClass = "w-5 h-5 block" }: SocialLinksProps) => {
    return (
        <div className={containerClass}>
            {SOCIAL_LINKS.map(({ name, url, icon }) => (
                <a
                    key={name}
                    href={url}
                    className={linkClass}
                    target="_blank"
                    aria-label={name}
                >
                    <img src={icon} alt={name} className={iconClass} />
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;
