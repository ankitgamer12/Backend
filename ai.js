const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello from Node.js!" }],
  });
  console.log(response.choices[0].message.content);
}
run();

router.post("/suggest", auth, async (req, res) => {
  const { role, experience, existingBullets, jobDescription } = req.body;

  const prompt = `You are an expert resume writer. Produce 4 concise resume bullets for a ${role} with ${experience}. Use action verbs, integrate keywords from the job description if provided, and keep bullets short (<=140 chars). Return bullets line by line. Existing bullets: ${
    existingBullets || "None"
  } Job description: ${jobDescription || "None"}`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",

      messages: [
        { role: "system", content: "You write resume bullets." },

        { role: "user", content: prompt },
      ],

      max_tokens: 250,

      temperature: 0.2,
    });

    const text = completion.data.choices[0].message.content.trim();

    // return as array

    const suggestions = text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((s) => s.replace(/^[\-\d\.\)\s]*/, "").trim());

    res.json({ suggestions });
  } catch (err) {
    console.error(err?.response?.data || err.message || err);

    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;
