import React, { useEffect, useState } from "react";
import "./Chat.css";
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import sendLogo from "../../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../../images/closeIcon.png"

const ENDPOINT = "http://localhost:3000/";

let socket;

const Chat = () => {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected");
      setId(socket.id);
    });

    // User Joined
    socket.emit("joined", { user });

    // Receing admin message event
    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, " : ", data.message);
    });

    // Recieving the message of new user joined
    socket.on("user-joined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, " - ", data.message);
    });

    // Showing message to everyone when any user left the chat
    socket.on("user-left", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, " - ", data.message);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  console.log(messages)

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data])
      console.log(data.user, data.message, data.id);
    });

    return () => {
      socket.off();
    }
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>V-CHAT</h2>
          <a href="/"><img src={closeIcon} alt="close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((items, i) => (
            <Message key={i} user={items.id === id ? "" : items.user} message={items.message} classs={items.id === id ? "right" : "left"} />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input onKeyPress={(e) => e.key === 'Enter' ? send() : null} type="text" id="chatInput" />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="sendLogo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
