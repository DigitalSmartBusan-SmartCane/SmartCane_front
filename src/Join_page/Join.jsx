import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Join.css';

function Join() {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: ''
    });

    const [verification, setVerification] = useState({
        codeSent: false,
        verificationCode: '',
        isVerified: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // 아이디 중복 관련 메시지
    const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(""); // 비밀번호 확인 메시지
    const [verificationSuccessMessage, setVerificationSuccessMessage] = useState(""); // 인증번호 확인 메시지
    const [message, setMessage] = useState({ text: "", isError: false }); // 메시지 상태

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
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    {/*아이디 중복확인*/ }
    const handleCheckDuplicate = async () => {
        const regex = /^[a-z0-9]+$/; // 아이디 조건
        if (!userInfo.id) {
            setErrors({ id: '아이디를 입력하세요.' });
            setSuccessMessage(""); // 성공 메시지 초기화
            return;
        }

        if (!regex.test(userInfo.id)) {
            setErrors({ id: '아이디는 소문자 영어와 숫자만 포함해야 합니다.' });
            setSuccessMessage(""); // 성공 메시지 초기화
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/user/check-id/${encodeURIComponent(userInfo.id)}`);
            setSuccessMessage(response.data.detail); // 성공 메시지 설정
            setErrors({ id: "" }); // 에러 메시지 초기화
        } catch (error) {
            setSuccessMessage(""); // 성공 메시지 초기화
            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    // 백엔드에서 내려준 detail을 그대로 화면에 표시
                    setErrors({ id: data.detail });
                } else if (status === 409) {
                    setErrors({ id: data.detail });
                } else {
                    setErrors({ id: '아이디 중복 확인 중 오류가 발생했습니다.' });
                }
            } else {
                console.error("Unhandled error:", error);
                setErrors({ id: '서버와의 연결에 실패했습니다.' });
            }
        }
    };

    {/*비밀번호 조건*/ }
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setUserInfo((prev) => ({ ...prev, password: value }));

        // 검증 로직을 바로 수행
        let errorMsg = "";
        if (value.length < 8) {
            errorMsg = "비밀번호는 8자리 이상이어야 합니다.";
        } else if (!/\d/.test(value)) {
            errorMsg = "비밀번호에는 숫자가 포함되어야 합니다.";
        } else if (!/[a-zA-Z]/.test(value)) {
            errorMsg = "비밀번호에는 영문자가 포함되어야 합니다.";
        } else if (!/[!@#$%^&*()_+\[\]{}|;:,.<>?/~]/.test(value)) {
            errorMsg = "비밀번호에는 특수문자가 포함되어야 합니다.";
        }
        setErrors((prev) => ({ ...prev, password: errorMsg }));

        // 비밀번호 변경 시 비밀번호 확인 필드와 일치 여부 체크
        setConfirmPasswordSuccess("");
        if (userInfo.confirmPassword) {
            if (value !== userInfo.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }));
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                // 비밀번호가 일치할 때
                if (!errorMsg) {
                    setConfirmPasswordSuccess("비밀번호가 일치합니다.");
                }
            }
        }
    };

    {/*비밀번호 일치 여부*/ }
    const handlePasswordconfirm = (e) => {
        const value = e.target.value;
        setUserInfo((prev) => {
            const newUserInfo = { ...prev, confirmPassword: value };

            // 일단 에러와 성공 메시지 초기화
            setConfirmPasswordSuccess("");
            let confirmError = "";

            // 비밀번호와 일치 여부 체크
            if (newUserInfo.password && newUserInfo.confirmPassword && newUserInfo.password !== newUserInfo.confirmPassword) {
                confirmError = "비밀번호가 일치하지 않습니다.";
            } else if (newUserInfo.password && newUserInfo.confirmPassword && newUserInfo.password === newUserInfo.confirmPassword) {
                // 비밀번호 일치 시
                // 이미 password 쪽에서 에러가 없는지 확인 후 성공 메시지 출력
                if (!errors.password) {
                    setConfirmPasswordSuccess("비밀번호가 일치합니다.");
                }
            }

            setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
            return newUserInfo;
        });
    };


    {/*인증번호 발송*/ }
    const handleSendVerificationCode = async () => {
        if (!userInfo.email) {
            setErrors({ email: '이메일을 입력하세요.' });
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/send-verification-code', {
                email: userInfo.email,
            });
            // 인증번호 발송 성공 시 상태 업데이트
            setVerification({ ...verification, codeSent: true });
            setErrors({ email: '' }); // 기존 에러 초기화
            alert(response.data.detail); // 발송 메시지 출력: "인증번호가 발송되었습니다."
        } catch (error) {
            // 인증번호 발송 실패 시 에러 처리
            setVerification({ ...verification, codeSent: false });
            setErrors({ email: '인증번호 발송 중 오류가 발생했습니다.' });
            console.error("Error sending verification code:", error);
        }
    };

    {/*인증번호 확인*/ }
    const handleVerifyCode = async () => {
        if (!verification.verificationCode) {
            setErrors({ verificationCode: '인증번호를 입력하세요.' });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/verify-code', {
                email: userInfo.email,
                code: parseInt(verification.verificationCode, 10),
            });

            setVerification({ ...verification, isVerified: true }); // 인증 성공 상태 업데이트
            setVerificationSuccessMessage('인증이 완료되었습니다.'); // 인증 성공 메시지 업데이트
            setErrors({ verificationCode: "" }); // 에러 메시지 초기화
        } catch (error) {
            setVerificationSuccessMessage(""); // 인증 성공 메시지 초기화
            setErrors({ verificationCode: '인증번호가 올바르지 않습니다.' });
            console.error("Error verifying code:", error);
        }
    };


    {/*가입하기*/ }
    const handleSave = async () => {
        if (!validateInputs()) return;

        if (!verification.isVerified) {
            setErrors({ general: '이메일 인증을 완료하세요.' });
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/user/signup', {
                id: userInfo.id,
                username: userInfo.name,
                password1: userInfo.password,
                password2: userInfo.confirmPassword,
                email: userInfo.email,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            

            setSuccessMessage('가입이 성공적으로 완료되었습니다.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrors({ general: '이미 존재하는 사용자입니다.' });
            }
            else {
                setErrors({ general: '회원가입 중 오류가 발생했습니다.' });
            }
        }
    };


    return (
        <div>
            <header>
                <div className="logo">로고</div>
            </header>
            <div className="join-container">
                <h2>회원가입</h2>
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
                    {/* 에러 메시지 또는 성공 메시지 출력 */}
                    {errors.id && <p className="error-text">{errors.id}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>

                <div className="join-form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handlePasswordChange}
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
                        onChange={handlePasswordconfirm}
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
                            {verificationSuccessMessage && 
                            <p className="success-message"> {verificationSuccessMessage}</p>}

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
