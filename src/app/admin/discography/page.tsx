"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Toaster, toast } from "react-hot-toast";

export default function DiscographyAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [description, setDescription] = useState("");
  const [linksJson, setLinksJson] = useState("{}");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("discography").select("*").order("release_date", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setReleaseDate(item.release_date);
      setCoverUrl(item.cover_url || "");
      setDescription(item.description || "");
      setLinksJson(JSON.stringify(item.links || {}, null, 2));
    } else {
      setEditingId("new");
      setTitle("");
      setReleaseDate(new Date().toISOString().split("T")[0]);
      setCoverUrl("");
      setDescription("");
      setLinksJson("{\n  \"spotify\": \"\",\n  \"apple_music\": \"\"\n}");
    }
  };

  const closeForm = () => setEditingId(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    let parsedLinks = {};
    try {
      parsedLinks = JSON.parse(linksJson);
    } catch (e) {
      toast.error("リンク情報のJSONフォーマットが正しくありません");
      setSaving(false);
      return;
    }

    const payload = { title, release_date: releaseDate, cover_url: coverUrl, description, links: parsedLinks };

    const res = editingId === "new" 
      ? await supabase.from("discography").insert([payload])
      : await supabase.from("discography").update(payload).eq("id", editingId);

    if (res.error) {
      toast.error("保存失敗：" + res.error.message);
    } else {
      toast.success("保存しました！");
      closeForm();
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("discography").delete().eq("id", id);
    if (!error) { toast.success("削除しました"); fetchData(); }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">ディスコグラフィ管理</h1>
        {editingId === null && (
          <button onClick={() => openForm()} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all"><Plus className="w-5 h-5" />新規追加</button>
        )}
      </div>

      {editingId !== null ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">{editingId === "new" ? "新規作成" : "編集"}</h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">タイトル</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">発売日</label><input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ジャケ写</label>
              <ImageUpload value={coverUrl} onChange={setCoverUrl} folder="discography" />
            </div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">説明・キャッチコピー</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">配信リンク (JSON)</label><textarea value={linksJson} onChange={e => setLinksJson(e.target.value)} rows={4} className="w-full font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
            <div className="flex justify-end gap-4 pt-6 text-slate-800"><button type="button" onClick={closeForm} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">キャンセル</button><button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl disabled:opacity-50"><Check className="w-5 h-5" />{saving ? "保存中..." : "保存する"}</button></div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500">読み込み中...</div> : items.length === 0 ? <div className="p-8 text-center text-slate-500">データがありません。</div> : (
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="p-4 text-sm font-bold text-slate-500">発売日</th><th className="p-4 text-sm font-bold text-slate-500">タイトル</th><th className="p-4 text-sm font-bold text-slate-500 text-right">操作</th></tr></thead>
              <tbody>{items.map(item => (
                <tr key={item.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50"><td className="p-4 text-slate-600 font-medium">{item.release_date}</td><td className="p-4 flex items-center gap-3">{item.cover_url && <img src={item.cover_url} className="w-10 h-10 rounded object-cover" alt="" />}<span className="font-bold text-slate-800">{item.title}</span></td><td className="p-4 text-right"><button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-pink-500"><Edit2 className="w-4 h-4 inline" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4 inline" /></button></td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
