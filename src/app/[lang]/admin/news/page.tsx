"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Check, Sparkles } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Toaster, toast } from "react-hot-toast";

type LangTab = "ja" | "en" | "th";

const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: "ja", label: "🇯🇵 日本語" },
  { key: "en", label: "🇬🇧 English" },
  { key: "th", label: "🇹🇭 ภาษาไทย" },
];

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LangTab>("ja");
  const [translating, setTranslating] = useState(false);

  // ── Japanese (canonical) ──────────────────────────────────────
  const [title, setTitle]           = useState("");
  const [content, setContent]       = useState("");
  // ── English translation ───────────────────────────────────────
  const [titleEn, setTitleEn]       = useState("");
  const [contentEn, setContentEn]   = useState("");
  // ── Thai translation ──────────────────────────────────────────
  const [titleTh, setTitleTh]       = useState("");
  const [contentTh, setContentTh]   = useState("");
  // ── Common fields ─────────────────────────────────────────────
  const [category, setCategory]     = useState("NEWS");
  const [imageUrl, setImageUrl]     = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [status, setStatus]         = useState("published");
  const [publishedAt, setPublishedAt] = useState("");
  const [saving, setSaving]         = useState(false);

  const supabase = createClient();

  useEffect(() => { fetchNews(); }, [supabase]);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sn_news")
      .select("*, title_i18n, content_i18n")
      .order("published_on", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  const toLocalISO = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const openForm = (item?: any) => {
    setActiveTab("ja");
    if (item) {
      setEditingId(item.id);
      setTitle(item.title ?? "");
      setCategory(item.category ?? "NEWS");
      setContent(item.content ?? "");
      setImageUrl(item.image_url ?? "");
      setPublishedOn(item.published_on ?? "");
      setStatus(item.status ?? "published");
      setPublishedAt(
        toLocalISO(new Date(item.published_at ?? item.published_on ?? new Date()))
      );
      // Load i18n translations if they exist
      setTitleEn(item.title_i18n?.en   ?? "");
      setContentEn(item.content_i18n?.en ?? "");
      setTitleTh(item.title_i18n?.th   ?? "");
      setContentTh(item.content_i18n?.th ?? "");
    } else {
      setEditingId("new");
      setTitle(""); setContent(""); setImageUrl(""); setStatus("draft");
      setTitleEn(""); setContentEn(""); setTitleTh(""); setContentTh("");
      const now = toLocalISO(new Date());
      setPublishedAt(now);
      setPublishedOn(now.split("T")[0]);
    }
  };

  const closeForm = () => setEditingId(null);

  // ── AI translation ────────────────────────────────────────────
  const handleAiTranslate = async () => {
    if (!title.trim()) {
      toast.error("先に日本語タイトルを入力してください");
      return;
    }
    setTranslating(true);
    try {
      const { translateWithAI } = await import("@/app/actions/translate");
      const result = await translateWithAI(title, content);
      if (result.success && result.data) {
        setTitleEn(result.data.en.title);
        setContentEn(result.data.en.content);
        setTitleTh(result.data.th.title);
        setContentTh(result.data.th.content);
        setActiveTab("en");
        toast.success("英語・タイ語への翻訳が完了しました！");
      } else {
        toast.error("翻訳エラー：" + (result.error ?? "不明なエラー"));
      }
    } catch (err: any) {
      toast.error("翻訳に失敗しました：" + err.message);
    } finally {
      setTranslating(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    if (editingId && editingId !== "new") formData.append("id", editingId);
    formData.append("title",        title);
    formData.append("category",     category);
    formData.append("content",      content);
    formData.append("image_url",    imageUrl);
    formData.append("published_at", new Date(publishedAt).toISOString());
    formData.append("status",       status);
    // i18n fields
    formData.append("title_en",    titleEn);
    formData.append("content_en",  contentEn);
    formData.append("title_th",    titleTh);
    formData.append("content_th",  contentTh);

    try {
      const { submitNewsAction } = await import("@/app/actions/news");
      const result = await submitNewsAction(formData);
      if (result.success) {
        toast.success(result.message);
        closeForm();
        fetchNews();
      } else {
        toast.error("保存に失敗しました：" + result.message);
      }
    } catch (err: any) {
      toast.error("予期せぬエラーが発生しました：" + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("sn_news").delete().eq("id", id);
    if (error) {
      toast.error("削除に失敗しました：" + error.message);
    } else {
      toast.success("削除しました。");
      fetchNews();
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-center" />

      {/* Header row */}
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
        /* ── Edit / Create form ───────────────────────────────── */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Form header */}
          <div className="flex items-center justify-between mb-6 border-b border-pink-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {editingId === "new" ? "新規ニュース作成" : "ニュース編集"}
            </h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">

            {/* ── Common fields (language-independent) ── */}
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

            {/* ── Language tabs ── */}
            <div>
              {/* Tab bar */}
              <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
                {LANG_TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-colors border border-b-0 ${
                      activeTab === key
                        ? "bg-white border-slate-200 text-pink-500 -mb-px relative z-10"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {label}
                    {/* Translation status badge */}
                    {key === "en" && titleEn && (
                      <span className="ml-1.5 inline-block w-2 h-2 bg-green-400 rounded-full" />
                    )}
                    {key === "th" && titleTh && (
                      <span className="ml-1.5 inline-block w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </button>
                ))}

                {/* AI translate button — visible on Japanese tab only */}
                {activeTab === "ja" && (
                  <button
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={translating || !title.trim()}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {translating ? "翻訳中..." : "AIで一括翻訳"}
                  </button>
                )}
              </div>

              {/* ── Japanese tab ── */}
              {activeTab === "ja" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      タイトル <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="日本語タイトルを入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">本文</label>
                    <RichTextEditor key="editor-ja" value={content} onChange={setContent} />
                  </div>
                </div>
              )}

              {/* ── English tab ── */}
              {activeTab === "en" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      {titleEn ? "✅ 翻訳済み" : "⬜ 未翻訳 — 日本語タブの「AIで一括翻訳」で自動生成できます"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title (English)</label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={e => setTitleEn(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="English title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Content (English)</label>
                    <RichTextEditor key="editor-en" value={contentEn} onChange={setContentEn} />
                  </div>
                </div>
              )}

              {/* ── Thai tab ── */}
              {activeTab === "th" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      {titleTh ? "✅ 翻訳済み" : "⬜ 未翻訳 — 日本語タブの「AIで一括翻訳」で自動生成できます"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อ (ภาษาไทย)</label>
                    <input
                      type="text"
                      value={titleTh}
                      onChange={e => setTitleTh(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="หัวข้อภาษาไทย"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">เนื้อหา (ภาษาไทย)</label>
                    <RichTextEditor key="editor-th" value={contentTh} onChange={setContentTh} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={closeForm} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                キャンセル
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                <Check className="w-5 h-5" />
                {saving ? "保存中..." : "保存する"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── News list ───────────────────────────────────────── */
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
                    <th className="p-4 text-sm font-bold text-slate-500 w-36">公開日</th>
                    <th className="p-4 text-sm font-bold text-slate-500 w-40">カテゴリ</th>
                    <th className="p-4 text-sm font-bold text-slate-500">タイトル</th>
                    <th className="p-4 text-sm font-bold text-slate-500 text-center w-24">翻訳</th>
                    <th className="p-4 text-sm font-bold text-slate-500 text-right w-28">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
                          : item.published_on}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center">
                          <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">{item.category}</span>
                          {item.status === "draft" && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">下書き</span>}
                        </div>
                      </td>
                      <td className="p-4 text-slate-800 font-bold">{item.title}</td>
                      <td className="p-4 text-center">
                        <span className="text-sm" title="English">
                          {item.title_i18n?.en ? "🇬🇧" : "・"}
                        </span>
                        <span className="text-sm ml-1" title="Thai">
                          {item.title_i18n?.th ? "🇹🇭" : "・"}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => openForm(item)} className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
