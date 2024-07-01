import { JOURS_FERIES_BOT } from "./bots/joursFeriesBot";
import { OPENCRITIC_BOT } from "./bots/openCriticBot";
import { TAUX_CHANGE_BOT } from "./bots/tauxChangeBot";

export const RESPONSE = "response";
export const QUESTION = "question"

export function saveMessagesToLocalStorage(messages) {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
}

export function loadMessagesFromLocalStorage() {
    const messages = localStorage.getItem("chat-messages");
    return messages ? JSON.parse(messages) : [];
}

export function renderMessages(messages) {
    const messagesDiv = document.getElementById("content");
    messagesDiv.innerHTML = "";
    messages.forEach(message => {
        renderMessage(message.content, message.from, message.bot, message.time);
    });
}

export function renderMessage(message, from, bot, time) {
    const messagesDiv = document.getElementById("content");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", from);

    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar");
    const avatarImg = document.createElement("img");
    if (from === RESPONSE) {
        if (bot === JOURS_FERIES_BOT) {
            avatarImg.src = "holiday.jpg";
        } else if (bot === OPENCRITIC_BOT) {
            avatarImg.src = "opencritic.jpg";
        } else if (bot === TAUX_CHANGE_BOT) {
            avatarImg.src = "exchange.png";
        }
    } else {
        avatarImg.src = "kyougen.jpg";
    }
    avatarImg.alt = `${from} avatar`;
    avatarDiv.appendChild(avatarImg);


    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content", from, bot);
    contentDiv.innerText = message;

    const timeSpan = document.createElement("span");
    timeSpan.innerHTML = time + " " + bot;
    timeSpan.classList.add("time");
    contentDiv.appendChild(timeSpan);

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

export function saveMessages(content, from, bot, time) {
    const messages = loadMessagesFromLocalStorage();
    messages.push({ content, from, bot, time });
    saveMessagesToLocalStorage(messages);
}

export function highlightActiveBot(botName) {
    const botItems = document.querySelectorAll(".bot");
    botItems.forEach(item => {
        if (item.className.includes(botName)) {
            item.classList.add("active-bot");
        } else {
            item.classList.remove("active-bot");
        }
    });
}

export function getTime() {
    const date = new Date();
    function addZero(i) {
        if (i < 10) { i = "0" + i }
        return i;
    }

    return addZero(date.getHours()) + ":" + addZero(date.getMinutes());
}