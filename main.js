import "./style.css";
import { getAllHolidays, getNextHoliday, JOURS_FERIES_BOT } from "./bots/joursFeriesBot";
import { getEuroRate, getOtherRate, convert, TAUX_CHANGE_BOT } from "./bots/tauxChangeBot";
import { getGame, getHallOfFame, getUpcomingGame, OPENCRITIC_BOT } from "./bots/openCriticBot";
import { loadMessagesFromLocalStorage, renderMessages, renderMessage, saveMessages, highlightActiveBot, RESPONSE, QUESTION, getTime } from "./utils";

const botActions = {
  "tous": { func: getAllHolidays, bot: JOURS_FERIES_BOT },
  "prochain jour": { func: getNextHoliday, bot: JOURS_FERIES_BOT },
  "taux": { func: getEuroRate, bot: TAUX_CHANGE_BOT },
  "conversion": async (message) => {
    const parts = message.split(" ");
    const amount = parts[1];
    const from = parts[2];
    const to = parts[3];
    return { rep: await convert(amount, from, to), bot: TAUX_CHANGE_BOT };
  },
  "change": async (message) => {
    const parts = message.split(" ");
    const currency = parts[1];
    return { rep: await getOtherRate(currency), bot: TAUX_CHANGE_BOT };
  },
  "upcoming": { func: getUpcomingGame, bot: OPENCRITIC_BOT },
  "top": async (message) => {
    const parts = message.split(" ");
    const category = parts[1];
    return { rep: await getHallOfFame(category), bot: OPENCRITIC_BOT };
  },
  "game": async (message) => {
    const gameName = message.substring(message.indexOf(" ") + 1);
    return { rep: await getGame(gameName), bot: OPENCRITIC_BOT };
  },
  "help": async () => {
    const helpMessages = [
      { rep: "Pour obtenir tous les jours fériés de l'année écrivez : 'tous'. \n Pour obtenir le prochain jour écrivez : 'prochain jour'.", bot: JOURS_FERIES_BOT },
      { rep: "Pour obtenir le taux de change de l'euro écrivez : 'taux'. \n Pour convertir une monnaie en une autre écrivez : 'conversion' MONTANT A CONVERTIR MONNAIE DE DEPART MONNAIE D'ARRIVE. (ex: conversion 100 EUR JPY)\n Pour obtenir le taux de change d'une monnaie écrivez : 'change' MONNAIE A CHANGER. (ex: change JPY)", bot: TAUX_CHANGE_BOT },
      { rep: "Pour obtenir la liste des prochaines sorties de jeux écrivez : 'upcoming'. \n Pour connaitre les meilleurs jeux d'une année écrivez : 'top' ANNEE. (ex: top 2023)\n Pour obtenir des informations sur un jeu écrivez : 'game' NOM DU JEU. (ex: game Minecraft)", bot: OPENCRITIC_BOT }
    ];
    for (const { rep, bot } of helpMessages) {
      renderMessage(rep, RESPONSE, bot, getTime());
      saveMessages(rep, RESPONSE, bot, getTime());
    }
    return { rep: "", bot: null };
  }
};

async function handleMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  if (message !== "") {
    const time = getTime();
    renderMessage(message, QUESTION, "Moi", time);
    saveMessages(message, QUESTION, "Moi", time);

    let response, bot;
    for (const key in botActions) {
      if (message.includes(key)) {
        const action = botActions[key];
        if (typeof action === "function") {
          ({ rep: response, bot } = await action(message));
        } else {
          response = await action.func();
          bot = action.bot;
        }
        break;
      }
    }

    if (response) {
      highlightActiveBot(bot);
      renderMessage(response, RESPONSE, bot, time);
      saveMessages(response, RESPONSE, bot, time);
    }
    messageInput.value = "";
  }
}

document.getElementById("send-button").addEventListener("click", handleMessage);
document.getElementById("message-input").addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    await handleMessage();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const messages = loadMessagesFromLocalStorage();
  renderMessages(messages);
});
