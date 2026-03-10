"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Toaster, toast } from "react-hot-toast";
import { translateContent } from "@/app/actions/translate";

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ja" | "en" | "th">("ja");
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleTh, setTitleTh] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTh, setContentTh] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [status, setStatus] = useState("published");
  const [publishedAt, setPublishedAt] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchNews();
  }, [supabase]);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_on", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  const openForm = (item?: any) => {
    setActiveTab("ja");
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setTitleEn(item.title_en || "");
      setTitleTh(item.title_th || "");
      setCategory(item.category || "NEWS");
      setContent(item.content || "");
      setContentEn(item.content_en || "");
      setContentTh(item.content_th || "");
      setImageUrl(item.image_url || "");
      setPublishedOn(item.published_on || "");
      setStatus(item.status || "published");
      
      let dateObj = new Date();
      if (item.published_at) {
        dateObj = new Date(item.published_at);
      } else if (item.published_on) {
        dateObj = new Date(item.published_on);
      }
      const offset = dateObj.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(dateObj.getTime() - offset)).toISOString().slice(0, 16);
      setPublishedAt(localISOTime);
    } else {
      setEditingId("new");
      setTitle("");
      setTitleEn("");
      setTitleTh("");
      setCategory("NEWS");
      setContent("");
      setContentEn("");
      setContentTh("");
      setImageUrl("");
      setStatus("draft");
      
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
      setPublishedAt(localISOTime);
      setPublishedOn(localISOTime.split("T")[0]);
    }
  };

  const closeForm = () => {
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const utcDate = new Date(publishedAt).toISOString();
    const payload = {
      title,
      title_en: titleEn,
      title_th: titleTh,
      category,
      content,
      content_en: contentEn,
      content_th: contentTh,
      image_url: imageUrl,
      published_on: publishedAt.split("T")[0],
      published_at: utcDate,
      status,
    };

    let error;
    if (editingId === "new") {
      const res = await supabase.from("news").insert([payload]);
      error = res.error;
    } else {
      const res = await supabase.from("news").update(payload).eq("id", editingId);
      error = res.error;
    }

    if (error) {
      toast.error("保存に失敗しました：" + error.message);
    } else {
      toast.success("ニュースを保存しました！");
      closeForm();
      fetchNews();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
      toast.error("削除に失敗しました：" + error.message);
    } else {
      toast.success("削除しました。");
      fetchNews();
    }
  };

  const handleTranslate = async () => {
    if (!title || !content || content === "<p></p>") {
      toast.error("翻訳を実行するには、まず日本語の「タイトル」と「本文」を入力してください。");
      return;
    }
    
    setIsTranslating(true);
    toast.loading("AIで翻訳中...", { id: "translate" });
    try {
      const res = await translateContent(title, content);
      if (res.title_en) setTitleEn(res.title_en);
      if (res.title_th) setTitleTh(res.title_th);
      if (res.content_en) setContentEn(res.content_en);
      if (res.content_th) setContentTh(res.content_th);
      toast.success("翻訳が完了しました！タブを切り替えて確認してください。", { id: "translate" });
    } catch (error: any) {
      toast.error(error.message || "翻訳に失敗しました。", { id: "translate" });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">ニュース管理</h1>
        {editingId === null && (
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            新規追加
          </button>
        )}
      </div>

      {editingId !== null ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">{editingId === "new" ? "新規ニュース作成" : "ニュース編集"}</h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            {/* Language Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 mb-4 pb-2 overflow-x-auto whitespace-nowrap">
               <button type="button" onClick={() => setActiveTab("ja")} className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === "ja" ? "bg-pink-50 text-pink-600 border-b-2 border-pink-500" : "text-slate-500 hover:bg-slate-50"}`}>日本語 (JA)</button>
               <button type="button" onClick={() => setActiveTab("en")} className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === "en" ? "bg-pink-50 text-pink-600 border-b-2 border-pink-500" : "text-slate-500 hover:bg-slate-50"}`}>English (EN)</button>
               <button type="button" onClick={() => setActiveTab("th")} className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === "th" ? "bg-pink-50 text-pink-600 border-b-2 border-pink-500" : "text-slate-500 hover:bg-slate-50"}`}>ภาษาไทย (TH)</button>
               <div className="ml-auto flex items-center">
                 <button type="button" onClick={handleTranslate} disabled={isTranslating} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-slate-800/20">
                    {isTranslating ? "翻訳中..." : "AIで自動翻訳 (EN/TH)"}
                 </button>
               </div>
            </div>

            <div className={`space-y-6 ${activeTab !== "ja" ? "hidden" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">タイトル (日本語) <span className="text-pink-500">*</span></label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required={activeTab === 'ja'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              </div>
            </div>

            <div className={`space-y-6 ${activeTab !== "en" ? "hidden" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title (English)</label>
                  <input type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              </div>
            </div>

            <div className={`space-y-6 ${activeTab !== "th" ? "hidden" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อ (Thai)</label>
                  <input type="text" value={titleTh} onChange={e => setTitleTh(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">カテゴリ</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="NEWS">NEWS</option>
                  <option value="RELEASE">RELEASE</option>
                  <option value="LIVE">LIVE</option>
                  <option value="MEDIA">MEDIA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ステータス</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="published">公開</option>
                  <option value="draft">下書き</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">公開日時</label>
                <input type="datetime-local" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">アイキャッチ画像（任意）</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} folder="news" />
            </div>

            <div className={activeTab !== "ja" ? "hidden" : ""}>
              <label className="block text-sm font-bold text-slate-700 mb-2">本文 (日本語)</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className={activeTab !== "en" ? "hidden" : ""}>
              <label className="block text-sm font-bold text-slate-700 mb-2">Content (English)</label>
              <RichTextEditor value={contentEn} onChange={setContentEn} />
            </div>

            <div className={activeTab !== "th" ? "hidden" : ""}>
              <label className="block text-sm font-bold text-slate-700 mb-2">เนื้อหา (Thai)</label>
              <RichTextEditor value={contentTh} onChange={setContentTh} />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={closeForm} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">キャンセル</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                <Check className="w-5 h-5" />
                {saving ? "保存中..." : "保存する"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">読み込み中...</div>
          ) : news.length === 0 ? (
            <div className="p-8 text-center text-slate-500">ニュースがありません。</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-sm font-bold text-slate-500 w-32">公開日</th>
                    <th className="p-4 text-sm font-bold text-slate-500 w-32">カテゴリ</th>
                    <th className="p-4 text-sm font-bold text-slate-500">タイトル</th>
                    <th className="p-4 text-sm font-bold text-slate-500 text-right w-32">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                        {item.published_at ? new Date(item.published_at).toLocaleString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : item.published_on}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center">
                          <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">{item.category}</span>
                          {item.status === 'draft' && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">下書き</span>}
                        </div>
                      </td>
                      <td className="p-4 text-slate-800 font-bold">{item.title}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
