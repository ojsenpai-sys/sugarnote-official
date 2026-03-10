"use server";

export async function translateContent(titleJa: string, contentJa: string) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw new Error("APIキーが設定されていません。環境変数をご確認ください。");
  }

  const prompt = `
あなたは日本のアイドルグループ「SugarNote」の専属翻訳アシスタントです。
以下の「日本語のニュース記事（HTML付き）」を、【英語】と【タイ語】に翻訳し、JSON形式で返してください。

注意事項：
- 英語はグローバルファン向けの親しみやすく、かつプロフェッショナルなトーン。
- タイ語はアイドルらしい丁寧で可愛いトーン（語尾に「ค่ะ (Ka)」などを適切に使用）。
- HTMLタグ（<p>, <strong>など）はそのまま保持すること。
- 返却フォーマットは純粋なJSONのみ（マークダウンのコードブロックは不要）。

入力内容:
【タイトル】
${titleJa}

【本文】
${contentJa}

期待されるJSONフォーマット:
{
  "title_en": "...",
  "content_en": "...",
  "title_th": "...",
  "content_th": "..."
}
`;

  try {
    if (geminiKey) {
      // Use Gemini API directly via fetch
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        }),
      });

      if (!res.ok) throw new Error("Gemini APIのリクエストに失敗しました。");
      const data = await res.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) throw new Error("APIから予期せぬレスポンスが返却されました。");
      
      return JSON.parse(textResponse);
      
    } else if (openaiKey) {
      // Use OpenAI API directly via fetch
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: "あなたはJSONフォーマットで回答するアシスタントです。" }, { role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!res.ok) throw new Error("OpenAI APIのリクエストに失敗しました。");
      const data = await res.json();
      const textResponse = data.choices?.[0]?.message?.content;
      if (!textResponse) throw new Error("APIから予期せぬレスポンスが返却されました。");

      return JSON.parse(textResponse);
    }
  } catch (error: any) {
    console.error("Translation Error:", error);
    throw new Error(error.message || "翻訳処理中にエラーが発生しました。");
  }
}
