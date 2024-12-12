import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menubar from '../component/Menu_component';
import './BMS1.css';

function BMSPage() {
      const navigate = useNavigate();

      const goToBMS2 = () => {
        navigate('/BMS2');
      };

  return (
    <div>
      <div><Menubar /></div>
      <div className="bms-container">
        {/* SOC 예측값 */}
        <div className="bms-box">
          <p>SOC 예측값</p>
        </div>

        {/* SOH 예측값 */}
        <div className="bms-box">
          <p>SOH 예측값</p>
        </div>

        {/* 오른쪽 화살표 버튼 */}
        <button className="arrow-button" onClick={goToBMS2}>
          ➡
        </button>
      </div>
    </div>
  );
}

export default BMSPage;