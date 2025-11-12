import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ 1. CORS 헤더 추가 (모든 출처 허용)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ 2. OPTIONS 요청일 경우 미리 응답 후 종료
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ✅ 3. POST 본문 파싱
    const { prompt } = await req.json();

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
