import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"; // For historical data chart
import { Btc, Eth, Xrp } from "react-cryptocoins"; // Import specific coin icons
import "./App.css"; // For dark mode styling

const BASE_URL = "https://api.coingecko.com/api/v3"; // Example API URL

function App() {
  const [currency, setCurrency] = useState("usd"); // Currency selector state
  const [cryptoData, setCryptoData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("1h"); // Time filter for historical data
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  // Fetch the cryptocurrency data
  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 10,
        },
      });
      setCryptoData(response.data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  // Fetch historical data based on time filter
  const fetchHistoricalData = async (coinId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days: timeFilter,
          },
        }
      );
      setHistoricalData(
        response.data.prices.map((price) => ({
          timestamp: new Date(price[0]).toLocaleTimeString(),
          price: price[1],
        }))
      );
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  // Define toggleDarkMode function
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  // Toggle Dark Mode in the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Fetch crypto data on initial load
  useEffect(() => {
    fetchCryptoData();
  }, [currency]);

  // User authentication
  const handleLogin = () => {
    const username = prompt("Enter your username:");
    if (username) {
      setUser(username);
      localStorage.setItem("user", username);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Add coin to watchlist
  const addToWatchlist = (coin) => {
    const updatedWatchlist = [...watchlist, coin];
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  // Remove coin from watchlist
  const removeFromWatchlist = (coin) => {
    const updatedWatchlist = watchlist.filter((item) => item.id !== coin.id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>Crypto Dashboard</h1>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="btc">BTC</option>
        </select>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        {user ? (
          <div>
            <span>Welcome, {user}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </header>

      <div className="currency-selector">
        <h2>Showing prices in {currency.toUpperCase()}</h2>
      </div>

      <div className="crypto-list">
        {cryptoData.map((coin) => (
          <div key={coin.id} className="crypto-card">
            <div className="crypto-header">
              {/* Add coin icon dynamically */}
              {coin.id === "bitcoin" && <Btc size={32} />}
              {coin.id === "ethereum" && <Eth size={32} />}
              {coin.id === "ripple" && <Xrp size={32} />}
              <h3>{coin.name}</h3>
            </div>
            <p>
              Price: {coin.current_price} {currency.toUpperCase()}
            </p>
            <button onClick={() => addToWatchlist(coin)}>
              Add to Watchlist
            </button>
            <button onClick={() => fetchHistoricalData(coin.id)}>
              View Historical Data
            </button>
            {watchlist.some((item) => item.id === coin.id) && (
              <button onClick={() => removeFromWatchlist(coin)}>
                Remove from Watchlist
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <div>
        <h3>Your Watchlist</h3>
        <ul>
          {watchlist.map((coin) => (
            <li key={coin.id}>
              {coin.name} - {coin.current_price}
              <button onClick={() => removeFromWatchlist(coin)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Historical Data Chart */}
      <div>
        <h3>Historical Data (Last {timeFilter})</h3>
        <LineChart width={500} height={300} data={historicalData}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
