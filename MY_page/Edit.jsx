import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Edit.css';

function Edit() {
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    const handleSave = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://your-backend-api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'smart', // 로그인된 사용자 ID
                    newPassword: passwords.newPassword,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('비밀번호 변경 성공:', result);
                navigate('/MYpage'); // 성공 시 마이페이지로 이동
            } else {
                setError('비밀번호 변경에 실패했습니다.');
            }
        } catch (err) {
            console.error('비밀번호 변경 에러:', err);
            setError('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate('/MYpage'); // 취소 시 마이페이지로 돌아감
    };

    useEffect(() => {
        document.body.classList.add('edit-page');
        return () => {
            document.body.classList.remove('edit-page');
        };
    }, []);

    return (
        <div>
            <header>
                <div className="logo">로고</div>
            </header>
            <div className="edit-container">
                <h2>비밀번호 변경하기</h2>
                <div className="edit-form-group">
                    <label>새로운 비밀번호</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="edit-form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <div className="buttons">
                    <button className="cancel-button" onClick={handleCancel}>
                        취소
                    </button>
                    <button className="save-button" onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Edit;
