import Chat from "./chat.js";
import { getSetting } from "./settings.js";

export const messages = [
    { role: "system", content: getSetting("system-message"), }
];

const messagesEl = document.getElementById("messages");
const input = document.querySelector("form input");
const form = document.querySelector("form");
const button = document.querySelector("form button");
const stopButton = document.querySelector("#stop-button");
const scrollable = document.querySelector("#scrollable");

let lastMsgEl;
let running = false;

function showMsg(content, messageId) {
    const li = document.createElement("li");
    li.textContent = content;
    li.contentEditable = true;  
    li.addEventListener("input", () => messages[messageId].content = li.textContent);
    messagesEl.appendChild(li);
    lastMsgEl = li;
}

function updater(text){
    lastMsgEl.textContent = text;
    return running;
}

async function submitQuestion(question) {
    input.value = "";
    messages.push({ role: "user", question });
    showMsg(question, messages.length-1);
    showMsg("", messages.length);
    const answer = await Chat(messages, updater);
    messages.push({role: "assistant", answer});
}


form.addEventListener("submit", async e => {
    scrollable.scrollTo(0, document.body.scrollHeight);
    e.preventDefault();
    button.disabled = true;
    stopButton.disabled = false;
    running = true;
    await submitQuestion(input.value);
    if(input.value)button.disabled = false;
    stopButton.disabled = true;
    running = false;
});

stopButton.addEventListener("click", e => {
    running = false;
    stopButton.disabled = true;
    input.focus();
})

input.addEventListener("input", () => {
    if(!input.value)button.disabled = true;
    else if(!running)button.disabled = false;
})