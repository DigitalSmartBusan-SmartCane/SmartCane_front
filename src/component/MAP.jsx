import React from "react";

function MapComponent() {
  return (
    <iframe 
      src="https://7129-14-44-120-104.ngrok-free.app/get-map" 
      width="100%" 
      height="600px" 
      style={{ border: "none" }}
      title="Map"
    ></iframe>
  );
}

export default MapComponent;

