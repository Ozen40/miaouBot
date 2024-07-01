const apiKey = import.meta.env.VITE_API_KEY_OPENCRITIC;
const HOST_API_OPENCRITIC = "https://opencritic-api.p.rapidapi.com";
const OPTIONS_GET = {
  method: "GET",
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "opencritic-api.p.rapidapi.com"
  }
};
export const OPENCRITIC_BOT = "openCriticBot";

export async function getGame(game) {
  const url = `${HOST_API_OPENCRITIC}/game/search?criteria=${game}`;

  try {
    const response = await fetch(url, OPTIONS_GET);
    const result = await response.json();
    let detail = await getGameInfo(result[0].id);
    return detail;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getHallOfFame(year) {
  const url = `${HOST_API_OPENCRITIC}/game/hall-of-fame/${year}`;

  try {
    const response = await fetch(url, OPTIONS_GET);
    const result = await response.json();
    return result.map(({ name, topCriticScore }) => `${name} | Score : ${topCriticScore}`).join("\n");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUpcomingGame() {
  const url = `${HOST_API_OPENCRITIC}/game/upcoming`;

  try {
    const response = await fetch(url, OPTIONS_GET);
    const result = await response.json();
    return result.map(({ name, firstReleaseDate }) => {
      const date = new Date(firstReleaseDate);
      return `${name} | Date de sortie : ${date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}`;
    }).join("\n");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getGameInfo(id) {
  const url = `${HOST_API_OPENCRITIC}/game/${id}`;

  try {
    const response = await fetch(url, OPTIONS_GET);
    const result = await response.json();
    const date = new Date(result.firstReleaseDate);
    return `${result.name}\nDate de sortie : ${date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}\nScore : ${result.medianScore}%\n${result.description}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
