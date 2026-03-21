"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Toaster, toast } from "react-hot-toast";

export default function GoodsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => { fetchData(); }, [supabase]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("sn_goods").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setPrice(item.price.toString());
      setImageUrl(item.image_url || "");
      setStoreUrl(item.store_url || "");
      setIsSoldOut(item.is_sold_out || false);
      setStatus(item.status ?? "published");
      setSortOrder((item.sort_order ?? 0).toString());
    } else {
      setEditingId("new");
      setName(""); setPrice("0"); setImageUrl(""); setStoreUrl(""); setIsSoldOut(false); setStatus("published"); setSortOrder("0");
    }
  };

  const closeForm = () => setEditingId(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name, price: parseInt(price), image_url: imageUrl, store_url: storeUrl, is_sold_out: isSoldOut, status, sort_order: parseInt(sortOrder) };
    const res = editingId === "new" ? await supabase.from("sn_goods").insert([payload]) : await supabase.from("sn_goods").update(payload).eq("id", editingId);
    if (res.error) toast.error("保存失敗：" + res.error.message);
    else { toast.success("保存しました！"); closeForm(); fetchData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("sn_goods").delete().eq("id", id);
    if (!error) { toast.success("削除しました"); fetchData(); }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-bold text-slate-800">グッズ管理</h1>{editingId === null && <button onClick={() => openForm()} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all"><Plus className="w-5 h-5" />新規追加</button>}</div>
      {editingId !== null ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4"><h2 className="text-xl font-bold text-slate-800">{editingId === "new" ? "新規作成" : "編集"}</h2><button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button></div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">商品名</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">価格 (円)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">表示順 <span className="text-slate-400 font-normal">(小さい順に表示)</span></label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800" /></div>
            </div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">商品画像</label><ImageUpload value={imageUrl} onChange={setImageUrl} folder="goods" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">ECサイトURL</label><input type="url" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800" placeholder="https://..." /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">ステータス</label><select value={status} onChange={e => setStatus(e.target.value as "published" | "draft")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"><option value="published">公開</option><option value="draft">非公開</option></select></div>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isSoldOut} onChange={e => setIsSoldOut(e.target.checked)} className="w-5 h-5 text-pink-500 rounded border-slate-300 focus:ring-pink-500" /><span className="font-bold text-slate-700">SOLD OUT にする</span></label>
            <div className="flex justify-end gap-4 pt-6"><button type="button" onClick={closeForm} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">キャンセル</button><button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl disabled:opacity-50"><Check className="w-5 h-5" />{saving ? "保存中..." : "保存する"}</button></div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500">読み込み中...</div> : items.length === 0 ? <div className="p-8 text-center text-slate-500">データがありません。</div> : (
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="p-4 text-sm font-bold text-slate-500 w-16 text-center">順</th><th className="p-4 text-sm font-bold text-slate-500">商品</th><th className="p-4 text-sm font-bold text-slate-500">価格</th><th className="p-4 text-sm font-bold text-slate-500">公開状態</th><th className="p-4 text-sm font-bold text-slate-500">販売状態</th><th className="p-4 text-sm font-bold text-slate-500 text-right">操作</th></tr></thead>
              <tbody>{items.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="p-4 text-center text-slate-400 font-bold text-sm">{item.sort_order ?? 0}</td><td className="p-4 flex items-center gap-3">{item.image_url && <img src={item.image_url} className="w-10 h-10 rounded object-cover" alt="" />}<span className="font-bold text-slate-800">{item.name}</span></td><td className="p-4 text-slate-600 font-medium">¥{item.price.toLocaleString()}</td><td className="p-4">{(item.status ?? "published") === "published" ? <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">公開中</span> : <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded">非公開</span>}</td><td className="p-4">{item.is_sold_out ? <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">SOLD OUT</span> : <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded">販売中</span>}</td><td className="p-4 text-right"><button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-pink-500"><Edit2 className="w-4 h-4 inline" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4 inline" /></button></td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
