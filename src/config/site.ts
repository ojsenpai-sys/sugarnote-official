export const siteConfig = {
  name: "SugarNote",
  description: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループSugarNote（シュガーノート）のオフィシャルサイト。",
  keywords: ["SugarNote", "シュガーノート", "アイドル", "オフィシャルサイト", "坂東ひなた", "西条藍里", "白咲里莉穂", "櫻井那奈子", "坂東楓夏"],
  url: "https://sugarnote.jp",
  
  // Theme Configuration
  themeColor: {
    primary: "#F76894",    // Used for prominent buttons, links, icons (Equivalent to text-pink-500)
    secondary: "#FA92AE",  // Used for softer highlights (Equivalent to text-pink-400)
    accent: "#EE3A71",     // Used for active states, hovers (Equivalent to text-pink-600)
    background: "#FFF5F9", // Used for very light backgrounds (Equivalent to bg-pink-50)
    surface: "#ffffff",
    surfaceMuted: "#FCE7F3", // (Equivalent to bg-pink-100)
    text: "#171717",
    textMuted: "#475569",  // (Equivalent to text-slate-600)
  },

  // Typography Settings
  fonts: {
    heading: "var(--font-montserrat)",
    body: "var(--font-noto-sans-jp)",
  },

  // Social Links
  links: {
    twitter: "https://twitter.com/SugarNote_Info", // Placeholder
    instagram: "https://instagram.com/sugarnote_official", 
    youtube: "https://youtube.com/@sugarnote",
    tiktok: "https://tiktok.com/@sugarnote",
  },
  
  // Production Credits
  credits: {
    management: "SugarNote Management",
    music: ["ANCHOR", "中村泰輔"],
    visual: "LINDO",
  }
};

export type SiteConfig = typeof siteConfig;
