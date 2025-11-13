// ✅ Vercel에서 Node 런타임 강제
export const config = { runtime: "nodejs" };

// ✅ OpenAI 직접 REST 호출 방식 (SDK 불일치 방지)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt || "cute vegetable character";

    // ✅ OpenAI REST API 직접 호출
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `A cute cartoon-style ${prompt}, full body, pastel colors, minimal background, transparent background`,
        size: "512x512",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenAI API error:", errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
