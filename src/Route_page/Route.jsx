import React from 'react';
import Menubar from '../component/Menu_component';
import MapComponent from '../component/MAP';
import './Route.css';
function RoutePage() {


  return (
    <div>
      <div><Menubar /></div>
      <div className="route-container">
        <div className="map-box">
          <div><MapComponent /></div>
        </div>
      </div>
    </div>
  );
}

export default RoutePage;
