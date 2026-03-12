"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function SettingsAdmin() {
  const [heroImage, setHeroImage] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [shopifyUrl, setShopifyUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (!error && data) {
        setHeroImage(data.hero_image_url || "");
        setCalendarId(data.calendar_id || "");
        setShopifyUrl(data.shopify_url || "");
      }
      setLoading(false);
    }
    loadSettings();
  }, [supabase]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, hero_image_url: heroImage, calendar_id: calendarId, shopify_url: shopifyUrl, updated_at: new Date().toISOString() });
    
    if (error) {
      toast.error("保存に失敗しました：" + error.message);
    } else {
      toast.success("設定を保存しました。");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-slate-500">読み込み中...</div>;

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">サイト設定</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-10">
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-pink-100 pb-2">トップ画像（Hero Visual）</h2>
          <p className="text-sm text-slate-500 mb-6">サイトのトップページに全画面で表示されるメインビジュアルです。推奨サイズは横長（1920x1080など）です。</p>
          <ImageUpload value={heroImage} onChange={setHeroImage} folder="settings" />
        </div>

        <div>
           <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-pink-100 pb-2">Google カレンダー ID</h2>
           <p className="text-sm text-slate-500 mb-4">SCHEDULE セクションの埋め込みに使用する Google カレンダー専用の ID です。（例: <code>your-id@group.calendar.google.com</code>）</p>
           <input
             type="text"
             value={calendarId}
             onChange={(e) => setCalendarId(e.target.value)}
             className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
             placeholder="xxx@group.calendar.google.com"
           />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-pink-100 pb-2">Shopify ストア URL</h2>
          <p className="text-sm text-slate-500 mb-4">GOODS セクションの「OFFICIAL STORE」ボタンのリンク先 URL です。</p>
          <input
            type="url"
            value={shopifyUrl}
            onChange={(e) => setShopifyUrl(e.target.value)}
            className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="https://your-store.myshopify.com"
          />
        </div>
      </div>
    </>
  );
}
