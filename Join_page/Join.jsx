import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css';

function Join() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        phoneNumber: ''
    });

    const [verification, setVerification] = useState({
        codeSent: false,
        verificationCode: '',
        isVerified: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const handleVerificationChange = (e) => {
        setVerification({
            ...verification,
            verificationCode: e.target.value
        });
    };

    const validateInputs = () => {
        let formErrors = {};

        if (!userInfo.id) formErrors.id = '아이디를 입력하세요.';
        if (!userInfo.password) formErrors.password = '비밀번호를 입력하세요.';
        if (userInfo.password !== userInfo.confirmPassword) {
            formErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        if (!userInfo.email) formErrors.email = '이메일을 입력하세요.';
        if (!userInfo.name) formErrors.name = '이름을 입력하세요.';
        if (!userInfo.phoneNumber) formErrors.phoneNumber = '전화번호를 입력하세요.';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSendVerificationCode = async () => {
        if (!userInfo.email) {
            setErrors({ email: '이메일을 입력하세요.' });
            return;
        }

        setVerification({ ...verification, codeSent: true });
        setErrors({});
    };

    const handleVerifyCode = () => {
        if (verification.verificationCode === '1234') {
            setVerification({ ...verification, isVerified: true });
            setErrors({});
        } else {
            setErrors({ verificationCode: '인증번호가 올바르지 않습니다.' });
        }
    };

    const handleCheckDuplicate = () => {
        if (!userInfo.id) {
            setErrors({ id: '아이디를 입력하세요.' });
            return;
        }

        alert('아이디 중복 확인이 완료되었습니다.');
    };

    const handleSave = async () => {
        if (!validateInputs()) return;

        if (!verification.isVerified) {
            setErrors({ general: '이메일 인증을 완료하세요.' });
            return;
        }

        setSuccessMessage('가입이 성공적으로 완료되었습니다.');
        setTimeout(() => navigate('/'), 2000);
    };

    return (
        <div>
            <header>
                <div className="logo">로고</div>
            </header>
            <div className="join-container">
                <h2>회원가입</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errors.general && <p className="error-message">{errors.general}</p>}
                <div className="join-form-group">
                    <label>아이디</label>
                    <div className="ID-verification">
                        <input
                            type="text"
                            name="id"
                            value={userInfo.id}
                            onChange={handleInputChange}
                            placeholder="아이디를 입력하세요"
                        />
                        <button onClick={handleCheckDuplicate}>중복확인</button>
                    </div>
                    {errors.id && <p className="error-text">{errors.id}</p>}
                </div>
                <div className="join-form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                <div className="join-form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={userInfo.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 다시 입력하세요"
                    />
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>
                <div className="join-form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        placeholder="이름을 입력하세요"
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="join-form-group">
                    <label>이메일</label>
                    <div className="email-verification">
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            placeholder="이메일을 입력하세요"
                        />
                        <button onClick={handleSendVerificationCode}>인증번호 발송</button>
                    </div>
                    {errors.email && <p className="error-text">{errors.email}</p>}
                    {verification.codeSent && (
                        <div className="verification-group">
                            <input
                                type="text"
                                value={verification.verificationCode}
                                onChange={handleVerificationChange}
                                placeholder="인증번호를 입력하세요"
                            />
                            <button onClick={handleVerifyCode}>인증하기</button>
                            {errors.verificationCode && (
                                <p className="error-text">{errors.verificationCode}</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="join-button-container">
                    <button
                        className="backk-button"
                        onClick={() => navigate('/login')}
                    >
                        돌아가기
                    </button>
                    <button className="join-button" onClick={handleSave}>
                        가입하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Join;
