const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

// อ่านค่าจาก Environment Variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const client = new line.Client(config);

// webhook
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch(() => res.status(500).end());
});

function handleEvent(event) {
  if (event.type !== "message") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "ได้รับสลิปแล้วนะคะ กำลังตรวจสอบให้ค่ะ 💙"
  });
}

// health check (สำคัญมาก)
app.get("/", (req, res) => {
  res.send("LINE Slip Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
