export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  // ✅ CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OpenAI API Key");
    }

    // ✅ body 파싱
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // ✅ OpenAI DALL·E 2 호출
    const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-2", // ✅ 안정적 모델
        prompt: `A cute cartoon-style ${prompt}, full body, pastel colors, minimal background, transparent background`,
        size: "512x512", // ✅ 허용 크기
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error("OpenAI API Error:", errText);
      return res.status(openaiResponse.status).json({ error: errText });
    }

    const data = await openaiResponse.json();
    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image returned from OpenAI" });
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
