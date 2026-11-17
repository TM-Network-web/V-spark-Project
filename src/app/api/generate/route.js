
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt, platform, tone } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Please provide a topic." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const instructions = `
You are an expert social media content creator.

Create exactly 3 unique social media captions.

Topic: ${prompt}
Platform: ${platform}
Tone: ${tone}

Requirements:
- Write engaging and platform-appropriate captions.
- Include relevant hashtags in each caption.
- Avoid repetitive wording.
- Return valid JSON only, without markdown.

Required JSON format:
{
  "captions": [
    {
      "text": "Caption text here",
      "hashtags": "#Example #Hashtags"
    },
    {
      "text": "Caption text here",
      "hashtags": "#Example #Hashtags"
    },
    {
      "text": "Caption text here",
      "hashtags": "#Example #Hashtags"
    }
  ]
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: instructions }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", result);
      return NextResponse.json(
        { error: result.error?.message || "Gemini API request failed." },
        { status: 502 }
      );
    }

    const generatedText =
      result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(generatedText);

    if (!Array.isArray(data.captions) || data.captions.length === 0) {
      throw new Error("Invalid caption response.");
    }

    return NextResponse.json({
      success: true,
      captions: data.captions.slice(0, 3),
    });

  } catch (error) {
    console.error("Caption generation error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to generate captions." },
      { status: 500 }
    );
  }
}
