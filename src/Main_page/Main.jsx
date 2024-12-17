import React from 'react';
import VideoStream from './Video.jsx';
import Heartbeat from '../component/Heartbeat.jsx';
import Menubar from '../component/Menu_component';
import './Main.css';
import './Video.css';

function MainPage() {

  return (
    <div>
      <Menubar />
      <div className="main-container">
        <div className="video-stream">
          <VideoStream />
        </div>
        <div className="heartbeat">
          <Heartbeat />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
