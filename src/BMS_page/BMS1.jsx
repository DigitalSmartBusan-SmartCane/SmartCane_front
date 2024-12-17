import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menubar from '../component/Menu_component';
import GraphComponent from "../component/GraphComponent";
import './BMS1.css';

function BMSPage1() {
  const navigate = useNavigate();

  return (
    <div>
      <div><Menubar /></div>
      <div className="bms1-container">
        <GraphComponent />
        </div>
      </div>
    
  );
}

export default BMSPage1;