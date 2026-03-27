/** @type {import('next').NextConfig} */

const EXPECTED_REF = "vlxniazuvgdxymczlfgf";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const urlRef = supabaseUrl.replace("https://", "").split(".")[0] || "(未設定)";

console.log("==========================================");
console.log(`[next.config] NEXT_PUBLIC_SUPABASE_URL = ${supabaseUrl || "(未設定)"}`);
console.log(`[next.config] Project Ref detected     = ${urlRef}`);
console.log(`[next.config] Expected Ref             = ${EXPECTED_REF}`);

if (!supabaseUrl) {
  // 未設定: ビルドを中断してメッセージを表示
  throw new Error(
    `\n[next.config] ❌ NEXT_PUBLIC_SUPABASE_URL が未設定です。\n` +
    `  Vercel Dashboard → Settings → Environment Variables に以下を追加してください:\n` +
    `  NEXT_PUBLIC_SUPABASE_URL = https://${EXPECTED_REF}.supabase.co\n`
  );
}

if (urlRef !== EXPECTED_REF) {
  // 旧プロジェクト ID が設定されている: ビルドを中断
  throw new Error(
    `\n[next.config] ❌ プロジェクト ID 不一致でビルドを中断します。\n` +
    `  現在の値: ${urlRef}\n` +
    `  期待値:   ${EXPECTED_REF}\n` +
    `  Vercel Dashboard → Settings → Environment Variables で\n` +
    `  NEXT_PUBLIC_SUPABASE_URL を https://${EXPECTED_REF}.supabase.co に更新してください。\n`
  );
}

console.log(`[next.config] ✅ Project ID OK: ${urlRef}`);
console.log("==========================================");

const nextConfig = {
  // ── generateBuildId: デプロイごとに一意な ID を生成し Vercel キャッシュを完全破棄 ──
  generateBuildId: async () => {
    const id = `build-${EXPECTED_REF}-${Date.now()}`;
    console.log(`[next.config] Build ID: ${id}`);
    return id;
  },

  // ── env: ビルド時の Supabase URL をバンドルに焼き込む（DevTools で確認可能） ──
  env: {
    NEXT_PUBLIC_SUPABASE_PROJECT_REF: urlRef,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${EXPECTED_REF}.supabase.co`,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
