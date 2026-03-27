import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?? "https://vlxniazuvgdxymczlfgf.supabase.co";

// 未設定時はプレースホルダーで createClient を成功させる（空文字は Supabase が拒否する）。
// 実際のクエリ時に 401 が返るため、デプロイ全体がクラッシュすることはない。
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  ?? "placeholder-key-not-set-check-vercel-env";

// ── ビルド時デバッグ（Vercel ビルドログで接続先を目視確認） ──
const urlRef = supabaseUrl.replace("https://", "").split(".")[0];
console.log(`[supabaseAdmin] SUPABASE_URL ref: ${urlRef}`);

// ── 起動時検証: KEY の ref と URL の ref が一致しているか ──
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const payload = JSON.parse(
      Buffer.from(supabaseServiceKey.split(".")[1], "base64").toString()
    );
    const keyRef: string = payload?.ref ?? "";
    if (keyRef && urlRef && keyRef !== urlRef) {
      console.error(
        `[supabaseAdmin] ⚠️  PROJECT ID MISMATCH\n` +
        `  URL ref: ${urlRef}\n` +
        `  KEY ref: ${keyRef}\n` +
        `  → Vercel Dashboard > Environment Variables > SUPABASE_SERVICE_ROLE_KEY を更新してください`
      );
    } else {
      console.log(`[supabaseAdmin] ✅ Project ID confirmed: ${urlRef}`);
    }
  } catch {
    // JWT 解析スキップ
  }
} else {
  console.error("[supabaseAdmin] ❌ SUPABASE_SERVICE_ROLE_KEY が未設定です");
}

// RLS バイパス用特権クライアント
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
