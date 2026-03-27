import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── 起動時検証: URL と SERVICE_ROLE_KEY のプロジェクト ID が一致しているか確認 ──
// 不一致の場合、本番で無言の認証エラーが起きる（Vercel 赤アイコンの原因）。
if (supabaseUrl && supabaseServiceKey) {
  try {
    const payload = JSON.parse(
      Buffer.from(supabaseServiceKey.split(".")[1], "base64").toString()
    );
    const keyRef: string = payload?.ref ?? "";
    const urlRef = supabaseUrl.replace("https://", "").split(".")[0];
    if (keyRef && urlRef && keyRef !== urlRef) {
      console.error(
        `[supabaseAdmin] ⚠️ PROJECT ID MISMATCH!\n` +
        `  NEXT_PUBLIC_SUPABASE_URL → ${urlRef}\n` +
        `  SUPABASE_SERVICE_ROLE_KEY → ${keyRef}\n` +
        `  Vercel 環境変数を確認してください。`
      );
    }
  } catch {
    // JWT 解析失敗は無視
  }
}

// RLSをバイパスする特権クライアント
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
