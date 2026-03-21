/**
 * DB Audit Script — SugarNote × FLAP 統合確認
 * 実行: node scripts/audit_db.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// .env.local を手動パース
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#") && l.trim() !== "")
    .map(l => { const idx = l.indexOf("="); return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]; })
);

const url     = env["NEXT_PUBLIC_SUPABASE_URL"];
const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const svcKey  = env["SUPABASE_SERVICE_ROLE_KEY"];
const smtpHost = env["SMTP_HOST"];
const smtpUser = env["SMTP_USER"];
const smtpPass = env["SMTP_PASS"];

const GREEN = "\x1b[32m"; const RED = "\x1b[31m"; const YELLOW = "\x1b[33m";
const BOLD  = "\x1b[1m";  const RESET = "\x1b[0m";
const ok   = (msg) => console.log(`${GREEN}  ✓ ${msg}${RESET}`);
const ng   = (msg) => console.log(`${RED}  ✗ ${msg}${RESET}`);
const warn = (msg) => console.log(`${YELLOW}  ⚠ ${msg}${RESET}`);

let issues = 0;

console.log(`\n${BOLD}━━━━━━ SugarNote DB 統合監査 (最終) ━━━━━━${RESET}\n`);

// ── 1. 環境変数チェック ─────────────────────────────
console.log(`${BOLD}[1] 環境変数${RESET}`);
if (url)     ok(`NEXT_PUBLIC_SUPABASE_URL     = ${url}`);
else       { ng("NEXT_PUBLIC_SUPABASE_URL が未設定"); issues++; }
if (anonKey) ok("NEXT_PUBLIC_SUPABASE_ANON_KEY = 設定済み");
else       { ng("NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定"); issues++; }
if (svcKey)  ok("SUPABASE_SERVICE_ROLE_KEY     = 設定済み");
else       { ng("SUPABASE_SERVICE_ROLE_KEY が未設定"); issues++; }

// ── 2. SMTP 環境変数チェック ────────────────────────
console.log(`\n${BOLD}[2] SMTP 環境変数${RESET}`);
if (smtpHost) ok(`SMTP_HOST = ${smtpHost}`);
else        { ng("SMTP_HOST が未設定 → メール送信不可"); issues++; }
if (smtpUser) ok(`SMTP_USER = ${smtpUser}`);
else        { ng("SMTP_USER が未設定 → メール送信不可"); issues++; }
if (smtpPass) ok("SMTP_PASS = 設定済み");
else        { ng("SMTP_PASS が未設定 → メール送信不可"); issues++; }

if (!url || !anonKey || !svcKey) {
  ng("Supabase 接続情報不足のため以降のテストを中止");
  process.exit(1);
}

const admin = createClient(url, svcKey);

// ── 3. sn_contacts テーブル確認 ─────────────────────
console.log(`\n${BOLD}[3] sn_contacts テーブル${RESET}`);
const { data: snData, error: snErr } = await admin.from("sn_contacts").select("*").limit(1);
if (snErr) {
  if (snErr.code === "42P01" || snErr.code === "PGRST205") {
    ng(`sn_contacts テーブルが存在しません (migration 009 を実行してください)`);
  } else {
    ng(`クエリエラー: ${snErr.message} (code: ${snErr.code})`);
  }
  issues++;
} else {
  ok(`sn_contacts テーブル存在 ✓ (取得件数: ${snData.length} 件)`);
}

// ── 4. 旧 contacts テーブル確認 ─────────────────────
console.log(`\n${BOLD}[4] 旧 contacts テーブル${RESET}`);
const { error: oldErr } = await admin.from("contacts").select("id").limit(1);
if (oldErr && (oldErr.code === "42P01" || oldErr.code === "PGRST205")) {
  ok("旧 contacts テーブルは存在しない（クリーン）");
} else if (!oldErr) {
  warn("旧 contacts テーブルがまだ存在します（不要なら DROP TABLE contacts; で削除可）");
} else {
  warn(`確認エラー: ${oldErr.message}`);
}

// ── 5. 主要テーブル疎通 ──────────────────────────────
console.log(`\n${BOLD}[5] 主要テーブル疎通${RESET}`);
const tables = ["sn_news", "sn_goods", "discography", "videos", "sn_site_settings"];
for (const t of tables) {
  const { error } = await admin.from(t).select("*", { count: "exact", head: true });
  if (error) { ng(`${t}: ${error.message}`); issues++; }
  else         ok(`${t}: OK`);
}

// ── 6. mailer.ts 実装確認 ────────────────────────────
console.log(`\n${BOLD}[6] mailer.ts 実装${RESET}`);
import { existsSync } from "fs";
if (existsSync("src/lib/mailer.ts")) ok("src/lib/mailer.ts 存在 ✓");
else { ng("src/lib/mailer.ts が存在しません"); issues++; }

const contactSrc = readFileSync("src/app/actions/contact.ts", "utf8");
if (contactSrc.includes("sendMail")) ok("contact.ts に sendMail 呼び出し ✓");
else { ng("contact.ts に sendMail が実装されていません"); issues++; }
if (contactSrc.includes("sn_contacts")) ok("contact.ts のテーブル名 = sn_contacts ✓");
else { ng("contact.ts に sn_contacts が見当たりません"); issues++; }

// ── GO/NO-GO 判定 ────────────────────────────────────
console.log(`\n${BOLD}━━━━━━ 判定 ━━━━━━${RESET}`);
if (issues === 0) {
  console.log(`${GREEN}${BOLD}  ✅ GO — 本番デプロイ可能${RESET}\n`);
} else {
  console.log(`${RED}${BOLD}  ❌ NO-GO — ${issues} 件の問題があります（上記を確認）${RESET}\n`);
}
