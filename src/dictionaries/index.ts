const dictionaries = {
  ja: () => import("./ja.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  th: () => import("./th.json").then((m) => m.default),
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ja"]>>;

export const locales: Locale[] = ["ja", "en", "th"];
export const defaultLocale: Locale = "ja";

export async function getDictionary(locale: string): Promise<Dictionary> {
  const loader = dictionaries[locale as Locale] ?? dictionaries.ja;
  return loader();
}
