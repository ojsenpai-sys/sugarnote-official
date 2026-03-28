/**
 * supabase.ts — 環境変数の検証と定数エクスポート
 * ビルド・起動を止めず、空でもフォールバックで動作させる。
 */

const EXPECTED_PROJECT_REF = "vlxniazuvgdxymczlfgf";
const FALLBACK_URL = `https://${EXPECTED_PROJECT_REF}.supabase.co`;
const FALLBACK_KEY = "fallback-key-check-vercel-env";

function resolveEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    console.error(
      `[supabase] ❌ 環境変数 ${key} が未定義です。\n` +
      `  Vercel Dashboard → Settings → Environment Variables を確認してください。\n` +
      `  期待するプロジェクト: ${EXPECTED_PROJECT_REF}`
    );
    return key === "NEXT_PUBLIC_SUPABASE_URL" ? FALLBACK_URL : FALLBACK_KEY;
  }

  if (key === "NEXT_PUBLIC_SUPABASE_URL") {
    const ref = value.replace("https://", "").split(".")[0];
    if (ref !== EXPECTED_PROJECT_REF) {
      console.error(
        `[supabase] ⚠️  プロジェクト ID 不一致\n` +
        `  ${key} の ref: ${ref}\n` +
        `  期待値: ${EXPECTED_PROJECT_REF}\n` +
        `  → Vercel の環境変数を更新してください`
      );
    }
  }

  return value;
}

export const SUPABASE_URL = resolveEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = resolveEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
