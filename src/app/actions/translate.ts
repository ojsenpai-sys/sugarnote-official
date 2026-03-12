"use server";

import Anthropic from "@anthropic-ai/sdk";

interface TranslationResult {
  en: { title: string; content: string };
  th: { title: string; content: string };
}

interface TranslateResponse {
  success: boolean;
  data?: TranslationResult;
  error?: string;
}

export async function translateWithAI(
  title: string,
  content: string
): Promise<TranslateResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: "ANTHROPIC_API_KEY が .env.local に設定されていません",
    };
  }

  if (!title.trim()) {
    return { success: false, error: "日本語タイトルが空です" };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a professional translator for a Japanese idol group website called SugarNote.
Translate the following Japanese news article into English and Thai.

CRITICAL RULES:
- The "content" field contains HTML from a rich-text editor (Tiptap).
- You MUST preserve every HTML tag and attribute exactly as-is.
- Only translate the visible text inside the tags.
- Return ONLY a valid JSON object — no markdown fences, no explanation.

Required output format:
{
  "en": { "title": "English title here", "content": "<p>English HTML content here</p>" },
  "th": { "title": "Thai title here", "content": "<p>Thai HTML content here</p>" }
}

Japanese title:
${title}

Japanese content (HTML):
${content || "<p></p>"}`,
        },
      ],
    });

    const raw =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON even if the model wraps it in markdown
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: "翻訳レスポンスの JSON 解析に失敗しました",
      };
    }

    const parsed: TranslationResult = JSON.parse(jsonMatch[0]);
    return { success: true, data: parsed };
  } catch (err: any) {
    console.error("translateWithAI error:", err);
    return {
      success: false,
      error: err.message ?? "不明なエラーが発生しました",
    };
  }
}
