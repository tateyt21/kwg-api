
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const KWG_URL =
  "https://kwg.kwggame.club/issue/getcurrentissue";

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "KWG API",
    status: "online",
    endpoints: {
      current: "/api/kwg/current"
    }
  });
});

app.get("/api/kwg/current", async (req, res) => {
  try {
    const response = await fetch(KWG_URL, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Origin": "https://kwg08.com",
        "Referer": "https://kwg08.com/",
        "Content-Type": "application/octet-stream",
        "User-Agent": "Mozilla/5.0"
      },
      body: Buffer.alloc(0),
      signal: AbortSignal.timeout(15000)
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.status(response.status).json({
      success: response.ok,
      source: "KWG",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      source: "KWG",
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`KWG API running on port ${PORT}`);
});
