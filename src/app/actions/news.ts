"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// "use client" の adminSiteContext からはインポートしない（サーバー境界の安全のため）。
// SugarNote は常に "sugarnote" → "sn_news" に解決される。
const NEWS_TABLE: Record<string, string> = {
  flap:      "news",
  sugarnote: "sn_news",
  lollipop:  "lp_news",
  septem:    "sept_news",
  kimipare:  "kp_news",
  hamaya:    "hm_news",
};

export async function submitNewsAction(formData: FormData) {
  try {
    const siteKey = (formData.get("site") as string | null)?.trim() ?? "sugarnote";
    const table   = NEWS_TABLE[siteKey] ?? "sn_news";

    const title        = formData.get("title")        as string;
    const category     = formData.get("category")     as string;
    const content      = formData.get("content")      as string;
    const image_url    = formData.get("image_url")    as string;
    const published_at = formData.get("published_at") as string;
    const status       = formData.get("status")       as string;

    // i18n fields (may be empty when no translation has been entered yet)
    const titleEn   = formData.get("title_en")   as string | null;
    const contentEn = formData.get("content_en") as string | null;
    const titleTh   = formData.get("title_th")   as string | null;
    const contentTh = formData.get("content_th") as string | null;

    if (!title || !published_at) {
      return { success: false, message: "タイトルと公開日時は必須です" };
    }

    // Build JSONB objects — only include non-empty translations
    const EMPTY_EDITOR = "<p></p>";
    const title_i18n: Record<string, string> = {};
    const content_i18n: Record<string, string> = {};

    if (titleEn?.trim())                                 title_i18n.en   = titleEn;
    if (titleTh?.trim())                                 title_i18n.th   = titleTh;
    if (contentEn?.trim() && contentEn !== EMPTY_EDITOR) content_i18n.en = contentEn;
    if (contentTh?.trim() && contentTh !== EMPTY_EDITOR) content_i18n.th = contentTh;

    const payload = {
      title,
      category:     category    || "NEWS",
      content:      content     || "",
      image_url:    image_url   || "",
      published_on: published_at.split("T")[0],
      published_at: new Date(published_at).toISOString(),
      status:       status      || "published",
      title_i18n,
      content_i18n,
    };

    const id = formData.get("id") as string;
    let error;

    if (id && id !== "new") {
      const res = await supabaseAdmin.from(table).update(payload).eq("id", id);
      error = res.error;
    } else {
      const res = await supabaseAdmin.from(table).insert([payload]);
      error = res.error;
    }

    if (error) {
      console.error("News insert/update error:", error);
      return { success: false, message: `データベースエラー: ${error.message}` };
    }

    return { success: true, message: "ニュースを保存しました！" };
  } catch (err: any) {
    console.error("News action exception:", err);
    return { success: false, message: `システムエラー: ${err.message}` };
  }
}

export async function deleteNewsAction(id: string, siteKey: string = "sugarnote") {
  try {
    const table = NEWS_TABLE[siteKey?.trim()] ?? "sn_news";
    const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
    if (error) {
      console.error("News delete error:", error);
      return { success: false, message: error.message };
    }
    revalidatePath("/admin/news");
    return { success: true };
  } catch (err: any) {
    console.error("News delete exception:", err);
    return { success: false, message: `システムエラー: ${err.message}` };
  }
}
