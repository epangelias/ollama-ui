import { messages } from "./main.js";

const modelsField = document.querySelector("#field-model");
const systemMessageField = document.querySelector("#field-system-message");
const systemMsgP = document.querySelector("#system-message");

const defaultSettings = {
    "system-message": "I am a helpful assistant",
    "model": null,
}

export function getSettings(){
    if(window.settings)return window.settings;
    const data = localStorage.getItem("settings");
    return data ? JSON.parse(data) : defaultSettings;
}

export function setSetting(name, value){
    const settings = getSettings();
    settings[name] = value;
    window.settings = settings;
    localStorage.setItem("settings", JSON.stringify(settings))
}

export function getSetting(name){
    const settings = window.settings || (window.settings = getSettings());
    return settings[name];
}

async function getModels(){
    const req = await fetch("http://localhost:11434/api/tags");
    if(!req.ok)throw new Error("Error fetching models");
    const {models} = await req.json();
    defaultSettings.model = models[0].name;
    return models.map(model => model.name);
}

async function setModels(){
    const models = await  getModels();
    models.forEach(model => {
        const option = document.createElement("option");
        option.text = option.value = model;
        modelsField.add(option);
    })
    setModel(getSetting("model"));
}

export function setModel(name){
    modelsField.value = name;
    setSetting("model", name);
}

setModels();

modelsField.addEventListener("change", () => {
    setSetting("model", modelsField.value);
})

systemMessageField.addEventListener("change", () => {
    setSetting("system-message", systemMessageField.value);
    messages[0].content = systemMsgP.textContent = systemMessageField.value;
})

systemMsgP.textContent = systemMessageField.value = getSetting("system-message");

export default {};