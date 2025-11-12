// ✅ Node 런타임 강제 (Edge에서는 환경변수 접근 불가)
export const config = {
  runtime: "nodejs",
};

import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ CORS 허용 (같은 vercel 도메인 내에서 안전하게)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ✅ 환경 변수 로드 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("🚨 OPENAI_API_KEY not found in environment");
      return res.status(500).json({ error: "API key missing" });
    }

    const openai = new OpenAI({ apiKey });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    // ✅ DALL·E 이미지 생성
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `A cute ${prompt}, cartoon-style, pastel colors, simple background, full body, transparent background`,
      size: "512x512",
    });

    const imageUrl = result.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("🔥 OpenAI Error:", error);
    res.status(500).json({ error: error.message });
  }
}
