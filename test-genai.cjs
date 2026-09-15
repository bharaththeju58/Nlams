const { GoogleGenAI } = require('@google/genai');

async function test() {
  const ai = new GoogleGenAI({});
  console.log("Calling...");
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    console.log("Response:", res.text);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
