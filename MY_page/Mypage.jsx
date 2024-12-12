import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';

function MyPage() {
  {/*const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
      try {
          const response = await fetch('http://your-backend-api/user-info?userId=smart');
          if (response.ok) {
              const data = await response.json();
              setUserInfo(data); // 사용자 정보 업데이트
          } else {
              console.error('사용자 정보를 불러오는데 실패했습니다.');
          }
      } catch (err) {
          console.error('서버 통신 오류:', err);
      }
  };

  useEffect(() => {
      fetchUserInfo(); // 마운트 시 사용자 정보 가져오기
      document.body.classList.add('mypage');
      return () => {
          document.body.classList.remove('mypage');
      };
  }, []);*/}

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/Main');
  };

  const handleEdit = () => {
    navigate('/Edit');
  };

  const [userInfo, setuserInfo] = useState({
    id: 'smart',
    password: '1234',
    email: 'smart@example.com',
    name: '홍길동',
  });

  useEffect(() => {
    document.body.classList.add('mypage');
    return () => {
      document.body.classList.remove('mypage');
    };
  }, []);

  return (
    <div>
      {/* 헤더 */}
      <header>
        <div className="logo">로고</div>
      </header>

      {/* 사용자 정보 영역 */}
      <div className="content">
        <div className="user-info">
          <h2>사용자 정보</h2>
          <div className="info">
            <div className="info-item">
              <span>아이디:</span> <span>{userInfo.id}</span>
            </div>
            <div className="info-item">
              <span>비밀번호:</span> <span>{userInfo.password}</span>
            </div>
            <div className="info-item">
              <span>이름:</span> <span>{userInfo.name}</span>
            </div>
            <div className="info-item">
              <span>이메일:</span> <span>{userInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 돌아가기와 저장 버튼 */}
      <div className="buttonss">
        <button onClick={handleBack} className="back-button">돌아가기</button>
        <button onClick={handleEdit} className="edit-button">비밀번호 변경</button>
      </div>
    </div>
  );
}

export default MyPage;
