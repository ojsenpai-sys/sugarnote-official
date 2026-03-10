import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Extract variables for debugging
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log("Admin Dashboard Supabase URL:", url);

  const [
    newsRes,
    goodsRes,
    discoRes
  ] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("goods").select("*", { count: "exact", head: true }),
    supabase.from("discography").select("*", { count: "exact", head: true }),
  ]);

  console.log("News Res:", newsRes.error || `Count: ${newsRes.count}`);
  console.log("Goods Res:", goodsRes.error || `Count: ${goodsRes.count}`);
  console.log("Disco Res:", discoRes.error || `Count: ${discoRes.count}`);

  const stats = [
    { label: "公開ニュース数", value: newsRes.count || 0, error: newsRes.error?.message },
    { label: "グッズ登録数", value: goodsRes.count || 0, error: goodsRes.error?.message },
    { label: "ディスコグラフィ", value: discoRes.count || 0, error: discoRes.error?.message },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-800">ダッシュボード</h1>
      <p className="text-slate-500 mt-2">SugarNote 公式サイトの管理画面へようこそ！左側のメニューから各コンテンツを編集できます。</p>

      {/* Debug Info */}
      <div className="mt-4 p-4 bg-slate-100 rounded-xl text-sm font-mono text-slate-700">
        <div>Supabase URL configured: {url ? "Yes" : "No"}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-slate-500 font-medium">{stat.label}</h3>
            <p className="text-5xl font-bold text-pink-500 mt-4">{stat.value}</p>
            {stat.error && (
              <p className="text-xs text-red-500 mt-2 font-mono text-center break-all">{stat.error}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
