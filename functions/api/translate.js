export async function onRequest(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin");

  const ALLOWED_ORIGINS = [
    "https://leadwaypeace.pages.dev",
    "http://localhost:8080"
  ];

  function withCORSHeaders(response, origin) {
    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      response.headers.set("Access-Control-Allow-Origin", "https://leadwaypeace.pages.dev");
    }
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }

  if (request.method === "OPTIONS") {
    return withCORSHeaders(new Response(null, { status: 204 }), origin);
  }

  const WORKER_API_KEY = request.headers.get("x-api-key");
  if (WORKER_API_KEY !== env.API_AUTH_KEY) {
    const response = new Response(
      JSON.stringify({ error: true, message: "Invalid API Key" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
    return withCORSHeaders(response, origin);
  }

  const contentType = request.headers.get("content-type") || "";
  if (request.method !== "POST" || !contentType.includes("application/json")) {
    const response = new Response(
      JSON.stringify({ error: true, message: "Invalid Request Method or Content-Type" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
    return withCORSHeaders(response, origin);
  }

  try {
    const { text, targetLang } = await request.json();
    const OPENROUTER_API_KEY = env.TRANSLATE_API_KEY2;

    if (!text || !targetLang) {
      const response = new Response(
        JSON.stringify({
          error: true,
          message: "Required parameters 'text' or 'targetLang' are missing."
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
      return withCORSHeaders(response, origin);
    }

    let safeText = text.length > 5000 ? text.substring(0, 5000) : text;

    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://leadwaypeace.pages.dev",
        "X-Title": "TauraronWasa"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text into ${targetLang}. Maintain the original formatting, including line breaks and gaps. If the target language is not supported, do not translate and respond with the original text.`
          },
          { role: "user", content: safeText }
        ]
      })
    });

    const rawText = await apiResponse.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("Invalid JSON from OpenRouter:", rawText);
      throw new Error("OpenRouter did not return valid JSON.");
    }

    if (!apiResponse.ok) {
      const errorResponse = new Response(
        JSON.stringify({
          error: true,
          message: "OpenRouter API error.",
          details: data.error || data
        }),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
      );
      return withCORSHeaders(errorResponse, origin);
    }

    const translatedText = data?.choices?.[0]?.message?.content?.trim() || text;
    
    const finalResponse = new Response(
      JSON.stringify({ 
        translation: translatedText,
        translatedText: translatedText,
        translated: translatedText,
        text: translatedText,
        result: translatedText
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

    return withCORSHeaders(finalResponse, origin);

  } catch (e) {
    console.error("Server error in translate.js:", e.message);
    const errorResponse = new Response(
      JSON.stringify({
        error: true,
        message: "Translation failed.",
        details: e.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
    return withCORSHeaders(errorResponse, origin);
  }
}
