import React from "react";
import socketIO from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./components/Join/Join";
import "./app.css"
import Chat from "./components/Chat/Chat"

const ENDPOINT = "http://localhost:3000/";
const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
