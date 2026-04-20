import { io } from "socket.io-client";

const socket = io(
  process.env.REACT_APP_SOCKET_URL ||
    "https://rentwise-backend-5ac6.onrender.com",
);

export default socket;
