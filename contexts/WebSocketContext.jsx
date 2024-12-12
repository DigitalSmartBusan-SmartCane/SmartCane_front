import React, { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [heartbeat, setHeartbeat] = useState(null);
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8080/MMS/heartbeat");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.heartbeat) {
        setHeartbeat(data.heartbeat); // 심박수 업데이트
        console.log("Received heartbeat:", data.heartbeat);
    }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString();
      const newHeartbeat = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
  
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        try {
          websocket.send(JSON.stringify({ heartbeat: newHeartbeat }));
          console.log("Data sent:", newHeartbeat);
        } catch (error) {
          console.error("Error sending data:", error);
        }
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [websocket]);

  return (
    <WebSocketContext.Provider value={{ heartbeat }}>
      {children}
    </WebSocketContext.Provider>
  );
};
