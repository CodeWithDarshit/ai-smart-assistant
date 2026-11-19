// Small Express server.
// The React app sends chat messages here. This file calls Gemini.
// The API key stays in server/.env and is never sent to the browser.

const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

app.use(express.json());

// The React dev server runs on a different port, so the browser
// needs permission to call this API. This is the CORS check.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    const history = Array.isArray(req.body.history) ? req.body.history : [];

    if (!message) {
      return res.status(400).json({ error: "Please type a message first." });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: "That message is too long. Try a shorter one." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return res.status(500).json({
        error: "Add your Gemini API key to server/.env, then restart the server.",
      });
    }

    const contents = buildContents(history, message);
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are AI Smart Assistant, a friendly tutor for beginners learning AI engineering and full-stack development. Answer clearly, keep explanations short, and use simple words.",
              },
            ],
          },
          contents,
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const apiMessage = data?.error?.message || "Gemini could not answer right now.";
      return res.status(502).json({ error: apiMessage });
    }

    const reply = readReply(data);
    if (!reply) {
      return res.status(502).json({ error: "Gemini returned an empty reply. Please try again." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Turn the chat on screen into the list Gemini expects.
// Gemini wants roles named "user" and "model", starting with "user".
function buildContents(history, message) {
  const contents = [];

  const recentHistory = history.slice(-10);
  for (const item of recentHistory) {
    if (!item || typeof item.text !== "string") {
      continue;
    }

    const text = item.text.trim();
    if (!text) {
      continue;
    }

    const role = item.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];

    // Gemini wants the roles to take turns. If two user messages
    // are in a row, join them into one turn.
    if (last && last.role === role) {
      last.parts[0].text += `\n${text}`;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  while (contents.length > 0 && contents[0].role === "model") {
    contents.shift();
  }

  const last = contents[contents.length - 1];
  if (last && last.role === "user") {
    last.parts[0].text += `\n${message}`;
  } else {
    contents.push({ role: "user", parts: [{ text: message }] });
  }

  return contents;
}

// Gemini can return more than one text part. Join the visible ones.
function readReply(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];

  return parts
    .filter((part) => part && typeof part.text === "string" && !part.thought)
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

// A bad JSON body should return a message, not crash the server.
app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ error: "Invalid request." });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`AI Smart Assistant server running at http://localhost:${PORT}`);
});
