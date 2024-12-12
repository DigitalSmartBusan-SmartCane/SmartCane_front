import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./Heartbeat.css";

const Heartbeat = () => {
  // 심박수 데이터 저장용 상태
  const [data, setData] = useState({
    time: [], // 시간 데이터
    heartbeat: [], // 심박수 데이터
  });

const [currentHeartbeat, setCurrentHeartbeat] = useState(0); // 현재 심박수 저장
const [websocket, setWebsocket] = useState(null);

useEffect(() => {
  let ws;
  const connectWebSocket = () => {
    ws = new WebSocket("ws://127.0.0.1:8000/MMS/heartbeat");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed. Reconnecting...");
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  connectWebSocket();

  return () => {
    if (ws) ws.close();
  };
}, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString();
      const newHeartbeat = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
  
      setData((prevData) => ({
        time: [...prevData.time.slice(-30), newTime],
        heartbeat: [...prevData.heartbeat.slice(-30), newHeartbeat],
      }));
      setCurrentHeartbeat(newHeartbeat);
  
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
    <div className="heartbeat-container">
      {/* 그래프 */}
      <div className="plot-wrapper">
        <Plot
          data={[
            {
              x: data.time,
              y: data.heartbeat,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
              line: { shape: "spline" }, // 선을 부드럽게
            },
          ]}
          layout={{
            title: "Real-Time Heartbeat",
            xaxis: {
              title: "Time",
              dtick: 10, // 10초 간격으로 틱 생성
              tickangle: 0, // 라벨 가로 정렬
              showline: true, // x축 라인 표시
              showgrid: false,
            },
            yaxis: {
              title: "Heartbeat (bpm)",
              range: [50, 130], // 심박수 범위
              showgrid: true,
            },
            autosize: true,
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
          useResizeHandler={true}
          config={{
            responsive: true,
            staticPlot: true, // 읽기 전용
          }}
        />
      </div>

      {/* 심박수 표시 박스 */}
      <div className="heartbeat-box">
        <h2>Current Heartbeat</h2>
        <p>{currentHeartbeat} bpm</p>
      </div>
    </div>
  );
};

export default Heartbeat;
