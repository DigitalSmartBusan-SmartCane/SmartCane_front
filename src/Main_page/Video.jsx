import React from "react";
import './Video.css';

function VideoStream() {
  return (
    <div className="video">
      <div className="video-title">실시간 영상</div>
      <img
        src="http://172.20.10.3:3000/stream.mjpg"
        alt="Camera Stream"
        style={{ width: '800px', height: '550px', border: '2px solid black' }}
      />
    </div>
  );
}

export default VideoStream;
