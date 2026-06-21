import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { translations, type Lang } from './translations';

interface I18nValue {
    lang: Lang;
    t: (typeof translations)['en'];
    /** Prefix an internal app path with the active language (`/ja`). */
    localize: (path: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = (): I18nValue => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
    return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export const langFromPath = (pathname: string): Lang =>
    pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en';

// Build the equivalent path in the target language, preserving search + hash so
// switching keeps the user on the same page (e.g. /ja/blogs -> /blogs).
// eslint-disable-next-line react-refresh/only-export-components
export const swapLangPath = (
    target: Lang,
    pathname: string,
    search: string,
    hash: string,
): string => {
    const bare =
        pathname === '/ja' ? '/' : pathname.startsWith('/ja/') ? pathname.slice(3) : pathname;
    const base = target === 'ja' ? (bare === '/' ? '/ja' : `/ja${bare}`) : bare;
    return `${base}${search}${hash}`;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const { pathname } = useLocation();
    const lang = langFromPath(pathname);
    const t = translations[lang];

    const localize = useMemo(
        () =>
            (path: string): string => {
                if (lang === 'en') return path;
                if (path === '/') return '/ja';
                return path.startsWith('/ja') ? path : `/ja${path}`;
            },
        [lang],
    );

    // Keep the document language + metadata in sync with the active language.
    useEffect(() => {
        document.documentElement.lang = lang;
        document.title = t.meta.title;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', t.meta.description);
    }, [lang, t]);

    const value = useMemo<I18nValue>(() => ({ lang, t, localize }), [lang, t, localize]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
