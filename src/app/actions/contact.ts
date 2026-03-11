"use server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const type = formData.get("type") as string;
    const company_name = formData.get("company_name") as string || null;

    if (!name || !email || !message || !type) {
      return { success: false, message: "必須項目が不足しています" };
    }

    const { error } = await supabaseAdmin.from("contacts").insert([
      { name, email, message, type, company_name }
    ]);

    if (error) {
      console.error("Contact form error:", error);
      return { 
        success: false, 
        message: "送信に失敗しました。お手数ですがしばらく経ってから再度お試しください。" 
      };
    }

    return {
      success: true,
      message: "お問い合わせを送信しました。運営チームより追ってご連絡いたします。"
    };
  } catch (err: any) {
    console.error("Contact action exception:", err);
    return { 
      success: false, 
      message: "システムエラーにより送信に失敗しました。時間をおいて再実行してください。" 
    };
  }
}
