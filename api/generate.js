// ✅ Node.js 런타임 강제
export const config = {
  runtime: "nodejs",
};

import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ 1. CORS 허용 (GitHub Pages 포함)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ✅ GitHub Pages는 JSON이 아닌 텍스트를 보낼 수 있어서 안전 처리
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `A cute ${prompt}, cartoon-style, pastel color, simple background, full body, transparent background`,
      size: "512x512",
    });

    const imageUrl = result.data[0].url;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("🔥 Error:", error);
    return res.status(500).json({ error: "AI 요청 실패" });
  }
}
