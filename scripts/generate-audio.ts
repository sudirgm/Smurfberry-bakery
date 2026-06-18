import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const ai = new GoogleGenAI({});

async function run() {
  try {
    console.log("Generating audio...");
    const response = await ai.models.generateContentStream({
      model: "lyria-3-pro-preview",
      contents: "A seamless, 60-second loop of high-quality ambient sound designed for a website background. The Core Wind: A soft, low-frequency, muffled winter wind blowing gently through thick pine trees. It should feel cozy and distant, not harsh, cold, or howling. The Magic Layer: Delicate, magical fairy-dust chimes and soft, crystalline wind chimes twinkling randomly in the background (using high-register, warm-toned bell sounds). The Bakery Atmosphere: Beneath the winter elements, add a very subtle, warm undertone of a crackling hearth or woodfire to represent the bakery's ovens. Mixing & Tone: The overall mix must be low-volume, deeply relaxing, therapeutic, and magical. There should be no sudden loud peaks or jarring transitions at the loop point.",
    });

    let audioBase64 = "";
    
    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          audioBase64 += part.inlineData.data;
        }
      }
    }

    if (!fs.existsSync("public")) fs.mkdirSync("public");
    if (!fs.existsSync("public/audio")) fs.mkdirSync("public/audio");
    
    fs.writeFileSync("public/audio/ambient_loop.wav", Buffer.from(audioBase64, "base64"));
    console.log("Successfully generated audio!");
  } catch (err) {
    console.error("Error generating audio:", err.message);
    process.exit(1);
  }
}

run();
