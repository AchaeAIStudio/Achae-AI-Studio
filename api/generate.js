// ✅ Node.js 런타임 강제 선언
export const config = {
  runtime: "nodejs",
};

import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ POST 요청만 허용
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ 환경 변수 OPENAI_API_KEY 없음");
      return res.status(500).json({ error: "Missing API key" });
    }

    const openai = new OpenAI({ apiKey });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    console.log("🟢 요청 프롬프트:", prompt);

    // ✅ DALL·E 호출
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `A cute cartoon-style ${prompt}, simple background, soft pastel color, full body, transparent background`,
      size: "512x512",
    });

    const imageUrl = result.data[0].url;
    console.log("✅ 생성된 이미지 URL:", imageUrl);

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("🔥 서버 내부 오류:", error.message);
    res.status(500).json({ error: error.message });
  }
}
