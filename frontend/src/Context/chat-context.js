// frontend/src/context/ChatContext.js
import React, { createContext, useState, useEffect } from 'react';
import {io }from 'socket.io-client';

const ChatContext = createContext();
//const ENDPOINT = process.env.NODE_ENV === 'production' 
  //? "https://textalot.herokuapp.com"
  //: "http://localhost:5000";
  const ENDPOINT = "http://localhost:5000"; // Use only localhost

const socket = io(ENDPOINT, {
  transports: ['websocket'],
   withCredentials: true, // Allow credentials for CORS
});

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connected", () => {
      console.log("Connected to server with Socket.IO");
    });

    socket.on("message received", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  return (
    <ChatContext.Provider value={{ messages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
