import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptoData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
};
