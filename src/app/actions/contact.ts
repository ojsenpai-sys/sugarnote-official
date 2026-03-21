"use server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendMail } from "@/lib/mailer";

const ADMIN_EMAIL = "info@flapinc.jp";

export async function submitContactForm(formData: FormData) {
  try {
    const name         = formData.get("name") as string;
    const email        = formData.get("email") as string;
    const message      = formData.get("message") as string;
    const type         = formData.get("type") as string;
    const company_name = (formData.get("company_name") as string) || null;

    if (!name || !email || !message || !type) {
      return { success: false, message: "必須項目が不足しています" };
    }

    // ── 1. Supabase に保存 ─────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin.from("sn_contacts").insert([
      { name, email, message, type, company_name },
    ]);

    if (dbError) {
      console.error("[contact] DB insert error:", dbError);
      return {
        success: false,
        message: "送信に失敗しました。お手数ですがしばらく経ってから再度お試しください。",
      };
    }

    // ── 2. 管理者へメール通知 ──────────────────────────────────────────────
    const subject = `【SugarNote】新しいお問い合わせ（${type}）`;
    const text = [
      "SugarNote のお問い合わせフォームから新しいメッセージが届きました。",
      "",
      `種別　　: ${type}`,
      `お名前　: ${name}`,
      `メール　: ${email}`,
      company_name ? `会社名　: ${company_name}` : null,
      "",
      "【メッセージ】",
      message,
      "",
      "---",
      "このメールは SugarNote お問い合わせフォームから自動送信されています。",
    ]
      .filter((line) => line !== null)
      .join("\n");

    const html = `
      <h2>SugarNote お問い合わせ通知</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">種別</td><td><strong>${type}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">お名前</td><td>${name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">メール</td><td><a href="mailto:${email}">${email}</a></td></tr>
        ${company_name ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">会社名</td><td>${company_name}</td></tr>` : ""}
      </table>
      <h3 style="margin-top:16px;">メッセージ</h3>
      <p style="white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:6px;">${message}</p>
      <hr style="margin-top:24px;border:none;border-top:1px solid #eee;" />
      <p style="color:#999;font-size:12px;">このメールは SugarNote お問い合わせフォームから自動送信されています。</p>
    `;

    try {
      await sendMail({ to: ADMIN_EMAIL, subject, text, html });
    } catch (mailErr: any) {
      // メール失敗は DB 保存成功後なのでユーザーへはエラーを返さない
      console.error("[contact] Mail send error:", mailErr?.message ?? mailErr);
    }

    return {
      success: true,
      message: "お問い合わせを送信しました。運営チームより追ってご連絡いたします。",
    };
  } catch (err: any) {
    console.error("[contact] Unexpected exception:", err);
    return {
      success: false,
      message: "システムエラーにより送信に失敗しました。時間をおいて再実行してください。",
    };
  }
}
