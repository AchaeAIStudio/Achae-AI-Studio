
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // 🔒 숨긴 키 자동 불러오기
    });

    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `A cute ${prompt}, cartoon-style, pastel color, simple background, full body, transparent background`,
      size: "512x512",
    });

    const imageUrl = result.data[0].url;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI 요청 실패" });
  }
}
