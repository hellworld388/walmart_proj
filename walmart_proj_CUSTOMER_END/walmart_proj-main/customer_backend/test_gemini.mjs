import fetch from "node-fetch";

const API_KEY = "AIzaSyAvt9PTkuZQnEd8R_kihUsCHEpLFNpOm8M"; // Replace with your actual Gemini API key
const MODEL = "gemini-1.5-flash"; // Use one of the available models

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: "Say hello in a friendly way." }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      console.log(
        "Gemini API Response:",
        data.candidates[0].content.parts[0].text
      );
    } else {
      console.error("Gemini API Error:", data);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testGemini();
