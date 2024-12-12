import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menubar from '../component/Menu_component';
import GraphComponent from "../component/GraphComponent";
import './BMS2.css';

function BMSPage2() {
  const navigate = useNavigate();

  const goToBMS1 = () => {
    navigate('/BMS1');
  };


  return (
    <div>
      <div><Menubar /></div>
      <div className="bms2-container">
        <div className="grid-container">
             {/* 왼쪽 화살표 버튼 */}
        <button className="arrow2-button" onClick={goToBMS1}>
          ⬅
        </button>
        <GraphComponent />
        </div>
        </div>
      </div>
    
  );
}

export default BMSPage2;