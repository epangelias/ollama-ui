import Chat from "./chat.js";
import { getSetting } from "./settings.js";

export const messages = [
  { role: "system", content: getSetting("system-message") },
];

const messagesEl = document.getElementById("messages");
const input = document.querySelector("form input");
const form = document.querySelector("form");
const button = document.querySelector("form button");
const settingsButton = document.querySelector("#settings-button");
const stopButton = document.querySelector("#stop-button");
const deleteButton = document.querySelector("#delete-button");
const scrollable = document.querySelector("#scrollable");

let lastMsgEl;
let running = false;

function showMsg(content, messageId) {
  const li = document.createElement("li");
  li.innerHTML = content;
  li.contentEditable = true;
  li.addEventListener(
    "input",
    () => (messages[messageId].content = li.textContent)
  );
  if (!content) {
    li.classList.add("hide");
    li.style.display = "none";
  }
  messagesEl.appendChild(li);
  lastMsgEl = li;
}

function updater(text) {
  lastMsgEl.textContent = text;
  return running;
}

async function submitQuestion(question) {
  if (question) {
    input.value = "";
    messages.push({ role: "user", content: question });
  }
  showMsg(question, messages.length - 1);
  showMsg("<img src='/loading.svg' height='20'/>", messages.length);
  const content = await Chat(messages, updater);
  messages.push({ role: "assistant", content });
}

form.addEventListener("submit", async (e) => {
  scrollable.scrollTo(0, document.body.scrollHeight);
  e.preventDefault();
  button.disabled = true;
  deleteButton.disabled = true;
  stopButton.disabled = false;
  running = true;
  await submitQuestion(input.value);
  button.disabled = false;
  deleteButton.disabled = false;
  stopButton.disabled = true;
  running = false;
});

stopButton.addEventListener("click", (e) => {
  running = false;
  stopButton.disabled = true;
  input.focus();
});

settingsButton.addEventListener("click", () =>
  document.querySelector("dialog").showModal()
);

deleteButton.addEventListener("click", () => {
  messages.splice(-1, 1);
  const els = document.querySelectorAll("#messages li:not(.hide)");
  const el = els[els.length - 1];
  if (!el) return;
  el.style.display = "none";
  el.classList.add("hide");
});

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
console.log(navigator.userAgent.toLowerCase());

if (!isFirefox) {
  const d = confirm(
    "Your browser sucks because its not firefox. Download Firefox?"
  );
  if (d) window.location.href = "https://www.mozilla.org/en-US/firefox/new/";
}
