"use server";

import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/config/site";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;
  const message = formData.get("message") as string;

  console.log("--- サーバーアクション: お問い合わせ受信 ---");
  console.log({ name, email, type, hasMessage: !!message });

  if (!name || !email || !type || !message) {
    return { success: false, message: "すべての項目を入力してください。" };
  }

  try {
    // 1. Supabaseのcontactsテーブルに保存 (失敗してもメール送信は継続する)
    if (supabase) {
      const { error: dbError } = await supabase
        .from("contacts")
        .insert([{ name, email, type, message }]);

      if (dbError) {
        console.error("Supabase Error (警告: テーブルが見つかりません等のエラー。メール送信は続行します):", dbError);
      } else {
        console.log("Supabase への保存が成功しました。");
      }
    } else {
      console.warn("Supabase への接続情報が不足しているため、DB保存をスキップします。");
    }

    // 2. Nodemailerでメール送信
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("メールサーバー（SMTP）の環境変数が設定されていません。");
      return { success: false, message: "メールサーバーの設定が不足しているため送信できません。" };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10秒でタイムアウトしてフリーズを防ぐ
    });

    const mailOptions = {
      from: `"${siteConfig.name} Official" <${process.env.EMAIL_USER}>`,
      to: "info@sugarnote.jp",
      subject: `【${siteConfig.name}】HPよりお問い合わせ: ${type}`,
      text: `
${siteConfig.name}公式サイトから新しいお問い合わせがありました。

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
        <h3>{siteConfig.name}公式サイトから新しいお問い合わせがありました。</h3>
        <p><strong>【お名前】</strong><br/>${name}</p>
        <p><strong>【メールアドレス】</strong><br/>${email}</p>
        <p><strong>【お問い合わせ種別】</strong><br/>${type}</p>
        <p><strong>【お問い合わせ内容】</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    console.log("メールを送信します...");
    await transporter.sendMail(mailOptions);
    console.log("メール送信完了！");

    return { success: true, message: "お問い合わせを送信しました。" };
  } catch (error) {
    console.error("サーバーアクション 例外エラー:", error);
    return { success: false, message: "サーバーエラーが発生しました。時間をおいてやり直してください。" };
  }
}
