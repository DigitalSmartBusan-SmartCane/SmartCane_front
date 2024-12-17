import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "./GraphComponent.css";

const GraphComponent = () => {
  const [data, setData] = useState({
    time: [],
    current: [],
    volt: [],
    Temp: [],
    Humi: [],
    Gas: [],
    percent: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // FastAPI 서버에서 데이터를 주기적으로 가져오는 함수
    const fetchData = async () => {
      try {
        // 첫 번째 포트에서 데이터 가져오기
        const response1 = await axios.get("http://172.20.10.3:8000/api/data");
        const newData1 = response1.data;

        // 두 번째 포트에서 데이터 가져오기
        const response2 = await axios.get("http://172.20.10.3:8080/api/data");
        const newData2 = response2.data;

        // 상태 업데이트
        setData((prevData) => ({
          time: [...prevData.time.slice(-30), new Date().toLocaleTimeString()],
          current: [...prevData.current.slice(-30), newData1.current],
          volt: [...prevData.volt.slice(-30), newData1.volt],
          Temp: [...prevData.Temp.slice(-30), newData2.Temp],
          Humi: [...prevData.Humi.slice(-30), newData2.Humi],
          Gas: [...prevData.Gas.slice(-30), newData2.Gas],
          percent: [...prevData.percent.slice(-30), newData1.percent],
        }));
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      }
    };

    // 2초마다 데이터 요청
    const interval = setInterval(fetchData, 2000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="graph-container">
      {error ? (
        <p style={{ color: "red" }}>데이터를 가져오는데 실패했습니다: {error}</p>
      ) : (
        <>
          {/* 전류 그래프 */}
          <div className="plot-wrapper">
            <h2>Current (A)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.current,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "orange" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Current (A)", range: [-1, 1] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>

          {/* 전압 그래프 */}
          <div className="plot-wrapper">
            <h2>Voltage (V)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.volt,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "green" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Voltage (V)", range: [5.5, 8.6] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>

          {/* 온도 그래프 */}
          <div className="plot-wrapper">
            <h2>Temperature (°C)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.Temp,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Temperature (°C)", range: [0, 40] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>

          {/* 습도 그래프 */}
          <div className="plot-wrapper">
            <h2>Humidity (%)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.Humi,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "blue" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Humidity (%)", range: [0, 100] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>
              {/* 가스 농도 그래프 */}
              <div className="plot-wrapper">
            <h2>Gas (ppm)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.Gas,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "purple" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Gas (ppm)", range: [0, 200] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>

              {/* 용량 그래프 */}
              <div className="plot-wrapper">
            <h2>Charge (%)</h2>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.percent,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "brown" },
                },
              ]}
              layout={{
                xaxis: {
                  title: "Time",
                  tickmode: "linear",
                  dtick: 10,
                  tickangle: 0,
                  showline: true,
                  range: data.time.length > 30 ? [data.time[data.time.length - 30], data.time[data.time.length - 1]] : null,
                },
                yaxis: { title: "Charge (%)", range: [0, 100] },
                autosize: true,
              }}
              useResizeHandler={true}
              className="plot-container"
              config={{ responsive: true,staticPlot: true }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GraphComponent;
