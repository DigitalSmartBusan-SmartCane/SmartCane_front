import React, { useState, useEffect } from 'react';
import Logo from './Logo.jsx';
import WelcomeMessage from './WelcomeMessage.jsx';
import LoginForm from './LoginForm.jsx';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // navigate 훅 사용

  // 로그인 처리 함수
  const handleLogin = async (userId, userPassword) => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: userId,
          password: userPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token); // 토큰 저장
        navigate('/main'); // 페이지 이동
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('서버와의 연결에 실패했습니다.');
    }
  };
  
  // useEffect로 body에 클래스 적용
  useEffect(() => {
    // Login 페이지의 body에 'login-page' 클래스 추가
    document.body.classList.add('login-page');

    // 컴포넌트가 언마운트 될 때 클래스 제거
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

  return (
    <div>
      <Logo />
      <WelcomeMessage />
      <LoginForm handleLogin={handleLogin} errorMessage={errorMessage} />
    </div>
  );
}

export default Login;
