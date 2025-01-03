import { io } from "socket.io-client";

const SOCKET_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum";

export const connectToSocket = (updatePrices) => {
  const socket = io(SOCKET_URL);
  socket.on("message", (data) => {
    const parsedData = JSON.parse(data);
    updatePrices(parsedData);
  });

  return socket;
};
