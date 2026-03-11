"use server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function submitNewsAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const image_url = formData.get("image_url") as string;
    const published_at = formData.get("published_at") as string;
    const status = formData.get("status") as string;

    if (!title || !published_at) {
      return { success: false, message: "タイトルと公開日時は必須です" };
    }

    const payload = {
      title,
      category: category || "NEWS",
      content: content || "",
      image_url: image_url || "",
      published_on: published_at.split("T")[0],
      published_at: new Date(published_at).toISOString(),
      status: status || "published",
    };

    const id = formData.get("id") as string;
    let error;

    if (id && id !== "new") {
      const res = await supabaseAdmin.from("news").update(payload).eq("id", id);
      error = res.error;
    } else {
      const res = await supabaseAdmin.from("news").insert([payload]);
      error = res.error;
    }

    if (error) {
      console.error("News insert/update error:", error);
      return { success: false, message: `データベースエラー: ${error.message}` };
    }

    return {
      success: true,
      message: "ニュースを保存しました！"
    };
  } catch (err: any) {
    console.error("News action exception:", err);
    return { success: false, message: `システムエラー: ${err.message}` };
  }
}

