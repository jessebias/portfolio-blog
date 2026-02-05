import SocialLinks from './SocialLinks';

const Footer = () => {
    return (
        <footer id="footer" className="border-t border-(--border) text-(--muted) text-[0.7rem]">
            <div className="relative max-w-[1200px] mx-auto py-[60px] px-6 flex items-center max-md:flex-col max-md:gap-5 max-md:justify-center">
                <SocialLinks
                    containerClass="flex gap-[30px] mt-0"
                    linkClass="flex opacity-40 transition-opacity duration-200 ease-in-out hover:opacity-100"
                    iconClass="w-[18px] h-[18px]"
                />
                <div className="absolute left-1/2 -translate-x-1/2 max-md:static max-md:transform-none">
                    © 2026 Jesse Bias
                </div>
            </div>
        </footer>
    );
};

export default Footer;
