import Link from "next/link";
import { Star, ChevronLeft } from "lucide-react";

export default async function TermsPage({
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
          TERMS OF USE
        </h1>
        <p className="text-pink-300 font-medium tracking-widest text-sm">利用規約</p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8 md:p-12 space-y-10">

          <p className="text-slate-600 leading-relaxed">
            本利用規約（以下「本規約」）は、FLAP entertainment（以下「当社」）が運営する SugarNote 公式ウェブサイト（以下「本サイト」）の利用条件を定めるものです。本サイトをご利用いただいた時点で、本規約に同意いただいたものとみなします。
          </p>

          <Section title="第1条（適用）">
            <p>
              本規約は、本サイトのすべてのコンテンツ・サービス・機能（以下「本サービス」）のご利用に適用されます。当社は、本規約を予告なく変更できるものとします。変更後の規約は本サイトへの掲載をもって効力を生じます。
            </p>
          </Section>

          <Section title="第2条（知的財産権）">
            <p>
              本サイトに掲載されているテキスト・画像・映像・音楽・ロゴ・デザイン・その他すべてのコンテンツ（以下「コンテンツ」）の著作権・商標権・その他の知的財産権は、当社または正当な権利者に帰属します。
            </p>
            <p className="mt-3">
              ユーザーは、私的使用の範囲を超えたコンテンツの複製・転載・改変・二次利用・販売等を、当社の書面による事前許諾なく行うことはできません。
            </p>
          </Section>

          <Section title="第3条（禁止事項）">
            <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
              <li>法令または本規約に違反する行為</li>
              <li>当社、SugarNote メンバー、他のユーザー、または第三者の権利・名誉・プライバシーを侵害する行為</li>
              <li>本サイトのコンテンツを無断で複製・転載・販売する行為</li>
              <li>本サイトの運営を妨げる行為（過負荷をかける行為、不正アクセス等）</li>
              <li>虚偽の情報を入力・送信する行為</li>
              <li>スパム・迷惑行為、誹謗中傷、差別的表現を含む投稿・送信</li>
              <li>当社または第三者に成りすます行為</li>
              <li>反社会的勢力への利益供与その他の協力行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </Section>

          <Section title="第4条（免責事項）">
            <p>
              当社は、本サイトに掲載する情報の正確性・完全性・有用性について保証しません。本サイトの利用により生じた損害について、当社は一切の責任を負いません。
            </p>
            <p className="mt-3">
              本サイトは予告なく内容の変更・サービスの一時停止・終了を行う場合があります。これにより生じた損害について、当社は責任を負いません。
            </p>
            <p className="mt-3">
              本サイトから他のウェブサイトへリンクしている場合でも、リンク先サイトについて当社は一切の責任を負いません。
            </p>
          </Section>

          <Section title="第5条（個人情報の取り扱い）">
            <p>
              本サービスのご利用にあたって収集する個人情報については、当社の
              <Link
                href={`/${lang}/privacy`}
                className="text-pink-500 hover:text-pink-600 underline underline-offset-2 mx-1 transition-colors"
              >
                プライバシーポリシー
              </Link>
              に従い適切に取り扱います。
            </p>
          </Section>

          <Section title="第6条（リンクについて）">
            <p>
              本サイトへのリンクは、営利目的・誹謗中傷目的・公序良俗に反するものでなければ原則として自由とします。ただし、当社が不適切と判断した場合はリンクの削除を求めることがあります。フレームを使用した本サイトのコンテンツの取り込みは禁止します。
            </p>
          </Section>

          <Section title="第7条（準拠法・裁判管轄）">
            <p>
              本規約の解釈および適用は、日本法に準拠するものとします。本サービスに関して紛争が生じた場合、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </Section>

          <Section title="第8条（お問い合わせ）">
            <p>本規約に関するお問い合わせは、以下の窓口までご連絡ください。</p>
            <div className="mt-4 p-5 bg-pink-50 rounded-2xl border border-pink-100 space-y-1 text-slate-700">
              <p className="font-bold text-pink-600">FLAP entertainment</p>
              <p>SugarNote 公式サイト　運営事務局</p>
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
