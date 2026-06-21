// Centralized i18n dictionary. English is the source of truth; the Japanese
// object is type-checked against it so the two can never drift out of shape.
// Japanese intentionally keeps English tech terms (AI, Web3, full-stack,
// agentic, blockchain, product, startup) where that reads more naturally.

export type Lang = 'en' | 'ja';
export const LANGS: Lang[] = ['en', 'ja'];

const en = {
    meta: {
        title: 'Jesse Bias — Full-Stack AI Engineer',
        description:
            'AI-native full-stack engineer, mobile developer, and Web3 builder. Building agentic AI systems, Web3 integrations, and production AI applications.',
    },
    nav: {
        about: 'ABOUT',
        work: 'WORK',
        blog: 'BLOG',
        contact: 'CONTACT',
    },
    hero: {
        role: 'Full-Stack AI Engineer | Creative',
        tagline:
            'Specialized in agentic AI systems, Web3 integrations, and production AI applications.',
    },
    about: {
        heading: 'ABOUT',
        bio: "I'm an AI-native full-stack engineer, mobile developer, and Web3 builder with a creative background in film, audio, and digital media. I build products end-to-end — from user experience and frontend applications to AI systems, backend infrastructure, mobile apps, and blockchain integrations.",
    },
    works: {
        heading: 'WORK',
        subtitle: 'Building products from concept to production.',
        clickToExpand: 'Click to expand',
        visit: 'Visit',
        overview: 'Overview',
        role: 'Role',
        stack: 'Stack',
        status: 'Status',
        website: 'Website',
    },
    projects: {
        verta: {
            category: 'MOBILE',
            description: 'Mobile-first streaming platform for premium vertical series.',
            overview:
                'A mobile-first streaming platform built around premium vertical series — short-form cinematic storytelling engineered for the way people actually watch.',
            role: 'Founder & Engineering',
            status: 'In production',
        },
        'portfolio-blog': {
            category: 'WEB',
            description: 'Full-stack portfolio and blog platform with an admin CMS.',
            overview:
                'The site you are looking at — a full-stack portfolio and blog platform. A React 19 SPA backed by an Express 5 + PostgreSQL REST API, with JWT auth and an admin dashboard for publishing posts.',
            role: 'Designer & Engineer',
            status: 'Live',
        },
        'cto-agent': {
            category: 'AGENT',
            description: 'AI technical advisor that analyzes codebases and produces CTO-level insights.',
            overview:
                'An AI-powered technical advisor that autonomously analyzes a GitHub repository — mapping architecture, surfacing technical debt, evaluating security and scalability risks, and generating prioritized engineering roadmaps. An engineering leadership layer, not a coding assistant.',
            role: 'Creator & Engineering',
            status: 'In development',
        },
    },
    blog: {
        heading: 'BLOG',
        subtitle: 'Updated when I feel like it.',
        readMore: 'READ MORE',
        samples: [
            { title: 'Building an AI-Native Company OS', meta: 'AI Systems • June 2026' },
            { title: 'What Vertical Streaming Gets Right', meta: 'Startups • June 2026' },
            { title: 'Memory, Agents, and Context', meta: 'AI Systems • June 2026' },
            { title: 'The Future of Creator-Owned Media', meta: 'Web3 • June 2026' },
        ],
    },
    tools: {
        heading: 'TECH STACK',
        subtitle: 'Building AI-native products across web, mobile, and Web3.',
        engineering: 'Engineering',
        aiSystems: 'AI Systems',
        mobile: 'Mobile',
        web3: 'Web3',
    },
    contact: {
        heading: 'CONTACT',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        placeholderName: 'YOUR NAME',
        placeholderEmail: 'YOUR EMAIL',
        placeholderMessage: "WHAT'S ON YOUR MIND?",
        success: "MESSAGE SENT — I'll be in touch.",
        error: 'Failed to send message. Please try again.',
        send: 'SEND MESSAGE',
        sending: 'SENDING...',
    },
};

type Dict = typeof en;

const ja: Dict = {
    meta: {
        title: 'Jesse Bias — Full-Stack AI エンジニア',
        description:
            'AI-native な full-stack エンジニア、モバイル開発者、Web3 ビルダー。Agentic AI システム、Web3 連携、実運用の AI アプリケーションを構築しています。',
    },
    nav: {
        about: 'プロフィール',
        work: '実績',
        blog: 'ブログ',
        contact: 'お問い合わせ',
    },
    hero: {
        role: 'Full-Stack AI エンジニア｜クリエイティブ',
        tagline:
            'Agentic AI システム、Web3 連携、そして実運用の AI アプリケーション開発を専門としています。',
    },
    about: {
        heading: 'プロフィール',
        bio: 'AI-native な full-stack エンジニア、モバイル開発者、そして Web3 ビルダーです。映像・音響・デジタルメディアといったクリエイティブなバックグラウンドを持ち、UX・フロントエンドから AI システム、バックエンド基盤、モバイルアプリ、ブロックチェーン連携まで、プロダクトを end-to-end で構築しています。',
    },
    works: {
        heading: '実績',
        subtitle: 'コンセプトから本番運用まで、プロダクトを形にします。',
        clickToExpand: 'クリックで詳細を表示',
        visit: 'サイトを見る',
        overview: '概要',
        role: '役割',
        stack: 'スタック',
        status: 'ステータス',
        website: 'ウェブサイト',
    },
    projects: {
        verta: {
            category: 'モバイル',
            description: 'プレミアムな縦型シリーズのための、モバイルファースト型ストリーミングプラットフォーム。',
            overview:
                'プレミアムな縦型シリーズを中心に設計した、モバイルファースト型のストリーミングプラットフォーム。実際の視聴スタイルに合わせて作り込んだ、ショートフォームでシネマティックなストーリーテリングを実現します。',
            role: 'ファウンダー兼エンジニアリング',
            status: '本番稼働中',
        },
        'portfolio-blog': {
            category: 'ウェブ',
            description: '管理画面付きの、フルスタックなポートフォリオ＆ブログプラットフォーム。',
            overview:
                '今ご覧になっているこのサイト —— フルスタックなポートフォリオ＆ブログプラットフォームです。React 19 の SPA を Express 5 + PostgreSQL の REST API が支え、JWT 認証と記事を公開するための管理ダッシュボードを備えています。',
            role: 'デザイナー兼エンジニア',
            status: '公開中',
        },
        'cto-agent': {
            category: 'エージェント',
            description: 'コードベースを解析し、CTO レベルのインサイトを生み出す AI テクニカルアドバイザー。',
            overview:
                'GitHub リポジトリを自律的に解析する AI テクニカルアドバイザー。アーキテクチャをマッピングし、技術的負債を洗い出し、セキュリティとスケーラビリティのリスクを評価して、優先順位付けされたエンジニアリングロードマップを生成します。コーディングアシスタントではなく、エンジニアリングリーダーシップのレイヤーです。',
            role: 'クリエイター兼エンジニアリング',
            status: '開発中',
        },
    },
    blog: {
        heading: 'ブログ',
        subtitle: '気が向いたときに更新しています。',
        readMore: 'もっと見る',
        samples: [
            { title: 'AI-native な Company OS を作る', meta: 'AI システム • 2026年6月' },
            { title: '縦型ストリーミングが正しく捉えていること', meta: 'スタートアップ • 2026年6月' },
            { title: 'メモリ、エージェント、そしてコンテキスト', meta: 'AI システム • 2026年6月' },
            { title: 'クリエイターが所有するメディアの未来', meta: 'Web3 • 2026年6月' },
        ],
    },
    tools: {
        heading: '技術スタック',
        subtitle: 'Web・モバイル・Web3 にわたって、AI-native なプロダクトを構築。',
        engineering: 'エンジニアリング',
        aiSystems: 'AI システム',
        mobile: 'モバイル',
        web3: 'Web3',
    },
    contact: {
        heading: 'お問い合わせ',
        name: 'お名前',
        email: 'メール',
        message: 'メッセージ',
        placeholderName: 'お名前',
        placeholderEmail: 'メールアドレス',
        placeholderMessage: 'ご用件をどうぞ',
        success: '送信しました — 折り返しご連絡します。',
        error: '送信に失敗しました。もう一度お試しください。',
        send: '送信する',
        sending: '送信中...',
    },
};

export const translations: Record<Lang, Dict> = { en, ja };

export type ProjectId = keyof Dict['projects'];
