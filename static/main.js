import Chat from "./chat.js";
import { getSetting } from "./settings.js";

const messagesEl = document.getElementById("messages");
const input = document.querySelector("form input");
const form = document.querySelector("form");
const button = document.querySelector("form button");
const settingsButton = document.querySelector("#settings-button");
const stopButton = document.querySelector("#stop-button");
const deleteButton = document.querySelector("#delete-button");
const scrollable = document.querySelector("#scrollable");
const clearChatButton = document.querySelector("#clear-chat-button");

let lastMsgEl;
let running = false;

export let messages = [
  { role: "system", content: getSetting("system-message") },
  ...loadMessages(),
];

function saveMessages() {
  localStorage.setItem("messages", JSON.stringify(messages.slice(1)));
}

function loadMessages() {
  const res = localStorage.getItem("messages");
  if (!res) return [];
  const messages = JSON.parse(res) || [];
  let curUser = true;
  messages.forEach((msg, ID) => {
    const msgUser = msg.role == "user";
    if (msgUser != curUser) {
      showMsg("");
      curUser = !curUser;
    }
    showMsg(msg.content || " ", ID + 1);
    console.log(curUser, msgUser, msg);
    curUser = !curUser;
  });
  if (!curUser) showMsg("");
  return messages;
}

function showMsg(content, messageId, noEdit = false) {
  const li = document.createElement("li");
  li.innerHTML = content?.replaceAll("\n", "<br/>");
  li.contentEditable = true;
  li.spellcheck = false;
  if (content) {
    li.addEventListener("input", () => {
      messages[messageId].content = li.textContent;
      saveMessages();
    });
  } else {
    li.classList.add("hide");
    li.style.display = "none";
  }
  if (noEdit) li.contentEditable = false;
  messagesEl.appendChild(li);
  lastMsgEl = li;
}

function updater(text) {
  lastMsgEl.innerHTML = text.replaceAll("\n", "<br/>");
  return running;
}

async function submitQuestion(question) {
  if (question) {
    input.value = "";
    messages.push({ role: "user", content: question });
  }
  saveMessages();
  showMsg(question, messages.length - 1);
  showMsg(
    "<img src='/loading.svg' height='20' alt='Loading...' />",
    messages.length,
    true
  );
  const content = await Chat(messages, updater);
  messages.push({ role: "assistant", content });
  saveMessages();
}

form.addEventListener("submit", async (e) => {
  scrollable.scrollTo(0, scrollable.scrollHeight + 1000);
  e.preventDefault();
  button.disabled = true;
  deleteButton.disabled = true;
  stopButton.disabled = false;
  running = true;
  await submitQuestion(input.value);
  lastMsgEl.contentEditable = true;
  button.disabled = false;
  if (messages.length > 1) deleteButton.disabled = false;
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
  if (messages.length <= 1) return (deleteButton.disabled = true);
  messages.splice(-1, 1);
  const els = document.querySelectorAll("#messages li:not(.hide)");
  const el = els[els.length - 1];
  if (!el) return;
  el.style.display = "none";
  el.classList.add("hide");
  saveMessages();
});

deleteButton.disabled = messages.length <= 1;

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

if (!isFirefox) {
  const d = confirm(
    "Your browser sucks because its not firefox. Download Firefox?"
  );
  if (d) window.location.href = "https://www.mozilla.org/en-US/firefox/new/";
}

clearChatButton.addEventListener("click", () => {
  document.querySelectorAll("#messages li").forEach((li) => li.remove());
  messages = [messages[0]];
  saveMessages();
});
