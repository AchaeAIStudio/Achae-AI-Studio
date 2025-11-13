export const config = {
  runtime: "nodejs",
};

// ✅ 깔끔하게 REST로 처리
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ GitHub Pages 요청 허용
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ OPTIONS 미리 요청일 때 (CORS Preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing!");

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt || "cute vegetable character";

    // ✅ OpenAI REST API 호출
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
      console.error("❌ OpenAI API Error:", errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: err.message });
  }
}
