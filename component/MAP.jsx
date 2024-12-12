import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent() {
  const [locations] = useState([]);

  // FastAPI에서 위치 데이터를 가져옴
 // useEffect(() => {
    //fetch("http://localhost:8000/locations")
      //.then((response) => response.json())
      //.then((data) => setLocations(data))
      //.catch((error) => console.error("Error fetching locations:", error));
 // }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[37.5665, 126.978]} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* 지도 타일 */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 위치 데이터로 마커 표시 */}
       {/*locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lon]}>
            <Popup>
              <b>{location.name}</b>
             <br />
              {location.description}
           </Popup>
          </Marker>
        ))*/}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
