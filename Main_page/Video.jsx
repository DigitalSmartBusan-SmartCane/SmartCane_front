import React from "react";
import './Video.css';

function VideoStream() {
  return (
    <div className="video">
      <div className="video-title">실시간 영상</div>
      <img
        src="http://192.168.0.137:8000/stream.mjpg"
        alt="Camera Stream"
        style={{ width: '700px', height: '550px', border: '2px solid black' }}
      />
    </div>
  );
}

export default VideoStream;
