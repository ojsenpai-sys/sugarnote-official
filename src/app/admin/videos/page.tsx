"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function VideosAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => { fetchData(); }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setYoutubeId(item.youtube_id);
      setIsFeatured(item.is_featured || false);
    } else {
      setEditingId("new");
      setTitle(""); setYoutubeId(""); setIsFeatured(false);
    }
  };

  const closeForm = () => setEditingId(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { title, youtube_id: youtubeId, is_featured: isFeatured };
    const res = editingId === "new" ? await supabase.from("videos").insert([payload]) : await supabase.from("videos").update(payload).eq("id", editingId);
    if (res.error) toast.error("保存失敗：" + res.error.message);
    else { toast.success("保存しました！"); closeForm(); fetchData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (!error) { toast.success("削除しました"); fetchData(); }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-bold text-slate-800">動画管理</h1>{editingId === null && <button onClick={() => openForm()} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all"><Plus className="w-5 h-5" />新規追加</button>}</div>
      {editingId !== null ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6 border-b border-primary-100 pb-4"><h2 className="text-xl font-bold text-slate-800">{editingId === "new" ? "新規作成" : "編集"}</h2><button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button></div>
          <form onSubmit={handleSave} className="space-y-6">
            <div><label className="block text-sm font-bold text-slate-700 mb-2">タイトル</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800" /></div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">YouTube ID</label>
              <p className="text-xs text-slate-500 mb-2">URLの v= に続く文字列です（例: dQw4w9WgXcQ）</p>
              <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} required className="w-full font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800" />
            </div>
            {youtubeId && (
              <div className="aspect-video w-full max-w-sm rounded-xl overflow-hidden bg-slate-100"><iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="w-full h-full" allowFullScreen></iframe></div>
            )}
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-5 h-5 text-primary-500 rounded border-slate-300 focus:ring-primary-500" /><span className="font-bold text-slate-700">トップに表示する（Feature）</span></label>
            <div className="flex justify-end gap-4 pt-6"><button type="button" onClick={closeForm} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">キャンセル</button><button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl disabled:opacity-50"><Check className="w-5 h-5" />{saving ? "保存中..." : "保存する"}</button></div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500">読み込み中...</div> : items.length === 0 ? <div className="p-8 text-center text-slate-500">データがありません。</div> : (
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="p-4 text-sm font-bold text-slate-500">YouTube ID</th><th className="p-4 text-sm font-bold text-slate-500">タイトル</th><th className="p-4 text-sm font-bold text-slate-500">注目</th><th className="p-4 text-sm font-bold text-slate-500 text-right">操作</th></tr></thead>
              <tbody>{items.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="p-4 text-slate-600 font-mono text-sm">{item.youtube_id}</td><td className="p-4 font-bold text-slate-800">{item.title}</td><td className="p-4">{item.is_featured && <span className="text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded">Feature</span>}</td><td className="p-4 text-right"><button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-primary-500"><Edit2 className="w-4 h-4 inline" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4 inline" /></button></td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
