import Link from "next/link";
import { Star, ChevronLeft } from "lucide-react";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-slate-900 border-b-4 border-pink-500 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors text-sm font-bold tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK
          </Link>
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
            <span className="font-extrabold text-xl tracking-tighter text-white">SugarNote</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-slate-900 py-16 px-4 text-center border-b-4 border-pink-500">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
          PRIVACY POLICY
        </h1>
        <p className="text-pink-300 font-medium tracking-widest text-sm">プライバシーポリシー</p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8 md:p-12 space-y-10">

          <p className="text-slate-600 leading-relaxed">
            FLAP entertainment（以下「当社」）は、SugarNote 公式ウェブサイト（以下「本サイト」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。本サイトをご利用いただく場合、本ポリシーに同意いただいたものとみなします。
          </p>

          <Section title="第1条（個人情報の定義）">
            <p>
              本ポリシーにおいて「個人情報」とは、個人情報の保護に関する法律（以下「個人情報保護法」）に定める個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名・メールアドレス・その他の記述等により特定の個人を識別できる情報を指します。
            </p>
          </Section>

          <Section title="第2条（個人情報の収集方法）">
            <p>当社は以下の方法により個人情報を収集することがあります。</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
              <li>お問い合わせフォームへの入力（氏名・メールアドレス・お問い合わせ内容等）</li>
              <li>メールマガジン・ファンクラブ等への登録</li>
              <li>イベント・キャンペーンへの応募</li>
              <li>Cookie その他のトラッキング技術による閲覧情報の取得</li>
            </ul>
          </Section>

          <Section title="第3条（個人情報の利用目的）">
            <p>当社は、収集した個人情報を以下の目的のために利用します。</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
              <li>お問い合わせへの回答・対応</li>
              <li>SugarNote に関するイベント・リリース情報等のご案内</li>
              <li>ファンクラブ・各種サービスの提供・運営</li>
              <li>サービスの改善・新サービスの開発</li>
              <li>利用規約違反等への対応</li>
              <li>上記に付随する業務</li>
            </ul>
          </Section>

          <Section title="第4条（個人情報の第三者提供）">
            <p>
              当社は、個人情報保護法その他の法令に基づく場合を除き、あらかじめご本人の同意を得ることなく第三者に個人情報を提供しません。ただし、以下の場合はこの限りではありません。
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            </ul>
          </Section>

          <Section title="第5条（個人情報の安全管理）">
            <p>
              当社は、収集した個人情報について、不正アクセス・漏洩・改ざん・紛失等のリスクに対し、合理的な安全対策を実施します。個人情報を取り扱う業務を外部に委託する場合は、適切な委託先の選定および監督を行います。
            </p>
          </Section>

          <Section title="第6条（Cookie・アクセス解析ツールの利用）">
            <p>
              本サイトでは、サービスの改善・利用状況の把握を目的として Cookie およびアクセス解析ツール（Google Analytics 等）を使用することがあります。これらのツールは Cookie を利用して個人を特定しない形式でデータを収集します。ブラウザの設定により Cookie を無効化することが可能ですが、一部機能がご利用いただけなくなる場合があります。
            </p>
          </Section>

          <Section title="第7条（個人情報の開示・訂正・利用停止）">
            <p>
              ご本人から個人情報の開示・訂正・追加・削除・利用停止のご請求があった場合、当社は合理的な期間内に対応いたします。ご請求の際は、下記お問い合わせ先までご連絡ください。なお、ご本人確認ができない場合や法令の規定により開示等を行わないことが認められる場合は、これに応じないことがあります。
            </p>
          </Section>

          <Section title="第8条（プライバシーポリシーの変更）">
            <p>
              当社は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは本サイトに掲載した時点から効力を生じるものとします。重要な変更がある場合は、本サイト上での告知等、適切な方法でお知らせいたします。
            </p>
          </Section>

          <Section title="第9条（お問い合わせ）">
            <p>本ポリシーに関するお問い合わせは、以下の窓口までご連絡ください。</p>
            <div className="mt-4 p-5 bg-pink-50 rounded-2xl border border-pink-100 space-y-1 text-slate-700">
              <p className="font-bold text-pink-600">FLAP entertainment</p>
              <p>SugarNote 公式サイト　個人情報担当</p>
              <p>
                お問い合わせ：
                <Link
                  href={`/${lang}#contact`}
                  className="text-pink-500 hover:text-pink-600 underline underline-offset-2 transition-colors"
                >
                  お問い合わせフォーム
                </Link>
              </p>
            </div>
          </Section>

          <p className="text-right text-sm text-slate-400 pt-4 border-t border-slate-100">
            制定日：2024年1月1日<br />
            最終改訂：2026年3月27日
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-sm tracking-widest transition-all transform hover:scale-105 shadow-lg shadow-pink-500/30"
          >
            <ChevronLeft className="w-4 h-4" />
            トップページへ戻る
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-slate-500 text-xs text-center border-t-4 border-pink-500 mt-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4">
            <Link href={`/${lang}/privacy`} className="hover:text-pink-400 transition-colors">プライバシーポリシー</Link>
            <span>|</span>
            <Link href={`/${lang}/terms`} className="hover:text-pink-400 transition-colors">利用規約</Link>
          </div>
          <p>© 2026 SugarNote Official. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-black text-slate-900 tracking-tight border-l-4 border-pink-500 pl-4">
        {title}
      </h2>
      <div className="text-slate-600 leading-relaxed pl-4">{children}</div>
    </section>
  );
}
