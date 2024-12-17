// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({ handleLogin, errorMessage }) {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  const handleJoinRedirect = () => {
    navigate('/join'); // '/join' 경로로 이동
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    handleLogin(userId, userPassword); // 로그인 처리
  };

  return (
    <div className="container2">
      <div className="login_form" onSubmit={handleSubmit}>
        <div className="input_group">
          
          {/*ID 입력칸*/}
          <label htmlFor="user_id">ID</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        {/*PW 입력칸*/}
        <div className="input_group">
          <label htmlFor="user_password">PW</label>
          <input
            type="password"
            id="user_password"
            name="user_password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>

        {/*로그인 버튼*/}
        <div className="login">
        <button onClick={() => handleLogin(userId, userPassword)}>login</button>
        </div>
      </div>

      {/* 실패 메시지 표시 */}
      {errorMessage && <p className="error-message">로그인에 실패하였습니다</p>}

      {/* 아이디/비밀번호 찾기 버튼 */}
      <div className="options">
        <button>아이디 찾기</button>
        <button>비밀번호 찾기</button>
      </div>

      {/*회원가입 버튼*/}
      <div className="signup">
        <p>회원이 아니신가요? {' '}
        <a href="#" onClick={handleJoinRedirect}>회원가입하기</a></p>
      </div>
    </div>
  )

}

export default LoginForm;
