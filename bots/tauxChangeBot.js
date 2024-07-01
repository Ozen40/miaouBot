const HOST_API_FRANKFURTER = "api.frankfurter.app";
export const TAUX_CHANGE_BOT = "tauxChangeBot";

export async function getEuroRate() {
  try {
    const reponse = await fetch(`https://${HOST_API_FRANKFURTER}/latest`);
    if (!reponse.ok) {
      throw new Error(reponse.statusText);
    }
    const taux = await reponse.json();
    return formatTauxDeChange(taux);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOtherRate(currency) {
  try {
    const reponse = await fetch(`https://${HOST_API_FRANKFURTER}/latest?from=${currency}`);
    if (!reponse.ok) {
      throw new Error(reponse.statusText);
    }
    const taux = await reponse.json();
    return formatTauxDeChange(taux);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function convert(amount, baseCurrency, futureCurrency) {
  try {
    const reponse = await fetch(`https://${HOST_API_FRANKFURTER}/latest?amount=${amount}&from=${baseCurrency}&to=${futureCurrency}`);
    if (!reponse.ok) {
      throw new Error(reponse.statusText);
    }
    const taux = await reponse.json();
    return `${amount} ${baseCurrency} = ${taux.rates[futureCurrency]} ${futureCurrency}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function formatTauxDeChange(taux) {
  const { base, rates } = taux;
  const formattedRates = Object.entries(rates).map(([currency, rate]) => {
    return `${currency}: ${rate}`;
  });
  return `1 ${base} équivaut à\n${formattedRates.join("\n")}`;
}
