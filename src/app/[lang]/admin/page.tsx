import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 簡易的な統計情報を取得
  const [
    { count: newsCount },
    { count: goodsCount },
    { count: discoCount }
  ] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("goods").select("*", { count: "exact", head: true }),
    supabase.from("discography").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "公開ニュース数", value: newsCount || 0 },
    { label: "グッズ登録数", value: goodsCount || 0 },
    { label: "ディスコグラフィ", value: discoCount || 0 },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-800">ダッシュボード</h1>
      <p className="text-slate-500 mt-2">SugarNote 公式サイトの管理画面へようこそ！左側のメニューから各コンテンツを編集できます。</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-slate-500 font-medium">{stat.label}</h3>
            <p className="text-5xl font-bold text-pink-500 mt-4">{stat.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
