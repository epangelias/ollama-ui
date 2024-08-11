import { getSetting } from "./settings.js";

const API_URL = "http://localhost:11434/api/chat";

export default async function Chat(messages, updater) {
  console.log(messages);

  const data = {
    model: getSetting("model"),
    messages: messages,
    stream: true,
    options: {
      seed: Math.floor(Math.random() * 10000),
      // stop: ["\n"],
    },
    // format: "json",
    keep_alive: "3m",
  };

  // if (getSetting("json")) data.format = "json";

  const controller = new AbortController();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal: controller.signal,
  });

  return await readStream(res, updater, controller);
}

async function readStream(res, updater, controller) {
  const reader = res.body.getReader();

  let text = "";

  while (true) {
    try {
      const data = await reader.read();
      const bitRes = new TextDecoder().decode(data.value);
      let json = JSON.parse(bitRes);
      if (data.done || !json || json.error) break;
      const word = json.message.content;
      text += word;
      const keepRunning = updater(text, word);
      if (!keepRunning) {
        controller.abort();
        return text;
      }
    } catch (e) {
      break;
    }
  }

  return text;
}
