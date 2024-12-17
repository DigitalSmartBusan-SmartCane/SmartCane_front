import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "./Heartbeat.css";

const Heartbeat = () => {
  // 심박수 데이터 저장용 상태
  const [data, setData] = useState({
    time: [], // 시간 데이터
    BPM: [], // 심박수 데이터
  });
  const [socket, setSocket] = useState(null);
  const [currentHeartbeat, setCurrentHeartbeat] = useState(0); // 현재 심박수 저장

  useEffect(() => {
    // 웹소켓 연결 설정
    const ws = new WebSocket("ws://127.0.0.1:8000/MMS/heartbeat");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("WebSocket Data:", response);

      const newBPM = response.data.heartbeat;
      setData((prevData) => ({
        time: [...prevData.time.slice(-30), new Date().toLocaleTimeString()],
        BPM: [...prevData.BPM.slice(-30), newBPM],
      }));
      setCurrentHeartbeat(newBPM);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      ws.close();
    };
  }, []);
  
  useEffect(() => {
    // FastAPI 서버에서 데이터를 주기적으로 가져오는 함수
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.20.10.3:8080/api/data");
        const newData = response.data;

        setData((prevData) => {
          const updatedData = {
            time: [...prevData.time.slice(-30), new Date().toLocaleTimeString()],
            BPM: [...prevData.BPM.slice(-30), newData.BPM],
          };

          // 최신 심박수 값 업데이트
          setCurrentHeartbeat(newData.BPM || 0);

          return updatedData;
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    // 1초마다 데이터 요청
    const interval = setInterval(fetchData, 2000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heartbeat-container">
      {/* 심박수 그래프 */}
      <div className="plot-wrapper">
        <Plot
          data={[
            {
              x: data.time,
              y: data.BPM,
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
