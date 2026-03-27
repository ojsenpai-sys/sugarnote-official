/** @type {import('next').NextConfig} */
const nextConfig = {
  // デプロイごとにユニークな Build ID を生成し、Vercel のビルドキャッシュを強制的に無効化する。
  // 旧 Supabase プロジェクト (twkwdgqgkzxlmvcqtrto) の fetch-cache が再利用されるのを防ぐ。
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vlxniazuvgdxymczlfgf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
