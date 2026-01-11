require("dotenv").config();

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const fs = require("fs");
const path = require("path");

const app = Fastify({ logger: true });
app.register(cors);

// JSON database
const DB_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ history: [] }, null, 2));
}

app.get("/", async () => {
  return { message: "Backend running" };
});

app.post("/recommend", async (request, reply) => {
  try {
    const { userInput } = request.body;

    if (!userInput) {
      return reply.status(400).send({ error: "User input required" });
    }

    // 🔥 Node 22 built-in fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Suggest 3 to 5 movies for: ${userInput}` }
        ]
      })
    });

    const data = await response.json();
    const movies = data.choices?.[0]?.message?.content;

    if (!movies) {
      return reply.status(500).send({ error: "AI error" });
    }

    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    db.history.push({
      input: userInput,
      movies,
      time: new Date().toISOString()
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    reply.send({ movies });

  } catch (err) {
    reply.status(500).send({
      error: "Server error",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
