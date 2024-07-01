const HOST_API_CALENDRIER = "https://calendrier.api.gouv.fr/jours-feries";
export const JOURS_FERIES_BOT = "joursFeriesBot";

export async function getHolidays() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  try {
    const reponse = await fetch(`${HOST_API_CALENDRIER}/metropole/${year}.json`);
    if (!reponse.ok) {
      throw new Error(reponse.statusText);
    }
    const joursFeries = await reponse.json();
    return joursFeries;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllHolidays() {
  const listeJoursFeries = await getHolidays();
  if (!listeJoursFeries) {
    return "Aucun jour férié trouvé.";
  } else {
    return formatJoursFeries(listeJoursFeries);
  }
}

export async function getNextHoliday() {
  const listeJoursFeries = await getHolidays();
  if (!listeJoursFeries) {
    return "Aucun jour férié trouvé.";
  }

  const currentDay = new Date();
  const holidayDates = Object.keys(listeJoursFeries).sort();

  for (const date of holidayDates) {
    const holidayDate = new Date(date);
    if (holidayDate > currentDay) {
      const nextHoliday = listeJoursFeries[date];
      return `Le prochain jour férié est le ${nextHoliday}`;
    }
  }

  return "Aucun jour férié à venir trouvé.";
}

function formatJoursFeries(joursFeries) {
  const formatted = Object.entries(joursFeries).map(([date, name]) => {
    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return `${formattedDate} : ${name}`;
  });
  return "Voici la liste des jours fériés : \n" + formatted.join("\n");
}
