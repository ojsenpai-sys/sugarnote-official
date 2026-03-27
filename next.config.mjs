/** @type {import('next').NextConfig} */

// ── ビルド時デバッグ出力（Vercel ビルドログで目視確認用） ──
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(未設定)";
const urlRef = supabaseUrl.replace("https://", "").split(".")[0];
console.log("==========================================");
console.log(`[next.config] NEXT_PUBLIC_SUPABASE_URL = ${supabaseUrl}`);
console.log(`[next.config] Supabase Project Ref     = ${urlRef}`);
console.log(`[next.config] Expected Ref             = vlxniazuvgdxymczlfgf`);
console.log(`[next.config] Match: ${urlRef === "vlxniazuvgdxymczlfgf" ? "✅ OK" : "❌ MISMATCH - Vercel の環境変数を確認"}`);
console.log("==========================================");

const nextConfig = {
  // デプロイごとにユニークな Build ID を生成し、Vercel のビルドキャッシュを強制的に無効化する。
  generateBuildId: async () => {
    const id = `build-${Date.now()}`;
    console.log(`[next.config] Build ID: ${id}`);
    return id;
  },

  // ビルド時刻を NEXT_PUBLIC_ 変数として焼き込む（Vercel キャッシュバスター）。
  // ブラウザの DevTools → Sources で確認可能。
  env: {
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlxniazuvgdxymczlfgf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
