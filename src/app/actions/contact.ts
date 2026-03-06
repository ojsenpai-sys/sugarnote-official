"use server";

import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !type || !message) {
    return { success: false, message: "すべての項目を入力してください。" };
  }

  try {
    // 1. Supabaseのcontactsテーブルに保存
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([{ name, email, type, message }]);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return { success: false, message: "データベースへの保存に失敗しました。" };
    }

    // 2. Nodemailerでメール送信
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SugarNote Official" <${process.env.EMAIL_USER}>`,
      to: "info@sugarnote.jp",
      subject: `【SugarNote】HPよりお問い合わせ: ${type}`,
      text: `
SugarNote公式サイトから新しいお問い合わせがありました。

【お名前】
${name}

【メールアドレス】
${email}

【お問い合わせ種別】
${type}

【お問い合わせ内容】
${message}
      `,
      html: `
        <h3>SugarNote公式サイトから新しいお問い合わせがありました。</h3>
        <p><strong>【お名前】</strong><br/>${name}</p>
        <p><strong>【メールアドレス】</strong><br/>${email}</p>
        <p><strong>【お問い合わせ種別】</strong><br/>${type}</p>
        <p><strong>【お問い合わせ内容】</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "お問い合わせを送信しました。" };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return { success: false, message: "メールの送信に失敗しました。" };
  }
}
