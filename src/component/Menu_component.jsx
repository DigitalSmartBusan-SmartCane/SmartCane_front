import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu_component.css';

function Menubar() {

  const username = "@@@";
  const navigate = useNavigate();

  const goToMyPage = () => {
    navigate('/MYpage');
  };

  const logout = () => {
    navigate('/Login');
  };

  const goToBMS = () => {
    navigate('/BMS1');
  };

  const goToMMS = () => {
    navigate('/MMS');
  };

  const goToRoute = () => {
    navigate('/Route');
  };

  const goToMain = () => {
    navigate('/Main');
  }

  return (
    <div>
      <header>
        <div className="logo">로고</div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* 메뉴바 */}
        <nav className="menu">
          <a onClick={goToMain} style={{ cursor: 'pointer' }}>메인으로</a>
          <span className="separator">|</span>
          <a onClick={goToBMS} style={{ cursor: 'pointer' }}>배터리 상태</a>
          <span className="separator">|</span>
          <a onClick={goToMMS} style={{ cursor: 'pointer' }}>전화번호 등록</a>
          <span className="separator">|</span>
          <a onClick={goToRoute} style={{ cursor: 'pointer' }}>경로안내</a>
        </nav>
      </div>

      <div className="welcome">
        환영합니다,
        <span
          id="username"
          onClick={goToMyPage}
          style={{ cursor: 'pointer', color: '#4a90e2' }}
        >
          {username}님
        </span>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}

export default Menubar;
