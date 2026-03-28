/**
 * supabase.ts — 環境変数の検証と定数エクスポート
 * 不整合があれば即座に throw して検知する。
 */

const EXPECTED_PROJECT_REF = "vlxniazuvgdxymczlfgf";

function resolveEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    const msg =
      `[supabase] ❌ 環境変数 ${key} が未定義です。\n` +
      `  Vercel Dashboard → Settings → Environment Variables を確認してください。\n` +
      `  期待するプロジェクト: ${EXPECTED_PROJECT_REF}`;
    if (typeof window === "undefined") {
      throw new Error(msg);
    }
    console.error(msg);
    return key === "NEXT_PUBLIC_SUPABASE_URL"
      ? `https://${EXPECTED_PROJECT_REF}.supabase.co`
      : "invalid-key-check-vercel-env";
  }

  if (key === "NEXT_PUBLIC_SUPABASE_URL") {
    const ref = value.replace("https://", "").split(".")[0];
    if (ref !== EXPECTED_PROJECT_REF) {
      const msg =
        `[supabase] ⚠️  プロジェクト ID 不一致\n` +
        `  ${key} の ref: ${ref}\n` +
        `  期待値: ${EXPECTED_PROJECT_REF}\n` +
        `  → Vercel の環境変数を更新してください`;
      if (typeof window === "undefined") {
        throw new Error(msg);
      }
      console.error(msg);
    }
  }

  return value;
}

export const SUPABASE_URL = resolveEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = resolveEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
