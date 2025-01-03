import React from "react";

const CryptoTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Crypto</th>
        <th>Price (USD)</th>
        <th>Change (24h)</th>
      </tr>
    </thead>
    <tbody>
      {data.map((crypto, index) => (
        <tr key={crypto.id}>
          <td>{index + 1}</td>
          <td>{crypto.name}</td>
          <td>${crypto.current_price.toFixed(2)}</td>
          <td
            style={{
              color: crypto.price_change_percentage_24h > 0 ? "green" : "red",
            }}
          >
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CryptoTable;
