import { useState } from "react";

function AccountPage() {
    const [isEditing, setIsEditing] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: "홍길동",
        email: "honggildong@example.com",
        phone: "010-1234-5678",
        bank: "국민은행",
        accountNumber: "123456-01-123456"
    });

    const [editInfo, setEditInfo] = useState(userInfo);

    const handleEdit = () => {
        setEditInfo({ ...userInfo });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditInfo({ ...userInfo });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setUserInfo({ ...editInfo });
        setIsEditing(false);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <style>{`
                .account-page {
                    width: 100%;
                    box-sizing: border-box;

                    display: flex;
                    justify-content: center;

                    padding: 20px 0;
                }

                /* 전체 회원정보 카드 */

                .account-container {
                    width: 88%;
                    max-width: 900px;

                    box-sizing: border-box;

                    padding: 32px 34px 28px;

                    background: #ffffff;

                    border: 1px solid #dfe7f0;
                    border-radius: 16px;

                    box-shadow: 0 4px 14px rgba(40, 70, 100, 0.06);
                }

                /* 제목 + 돌아가기 */

                .account-title-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    margin-bottom: 8px;
                }

                .account-title {
                    margin: 0;

                    color: #111827;

                    font-size: 27px;
                    font-weight: 700;
                }

                .account-subtitle {
                    margin: 8px 0 28px;

                    color: #8491a3;

                    font-size: 14px;
                }

                /* 돌아가기 버튼 */

                .back-button {
                    height: 38px;

                    padding: 0 15px;

                    border: 1px solid #d7e0ea;
                    border-radius: 7px;

                    background: #ffffff;
                    color: #64748b;

                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.15s;
                }

                .back-button:hover {
                    background: #f4f8fd;
                    border-color: #c5d4e5;
                    color: #0066cc;
                }

                /* 내부 섹션 */

                .account-section {
                    margin-bottom: 20px;

                    border: 1px solid #dfe7f0;
                    border-radius: 10px;

                    overflow: hidden;
                }

                /* 섹션 헤더 */

                .section-header {
                    display: flex;
                    align-items: center;

                    min-height: 55px;

                    padding: 0 20px;

                    background: #f4f8fd;

                    border-bottom: 1px solid #dfe7f0;
                }

                .section-icon {
                    width: 32px;
                    height: 32px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    margin-right: 10px;

                    border-radius: 8px;

                    background: #e5efff;

                    color: #0066cc;

                    font-size: 15px;
                }

                .section-title {
                    margin: 0;

                    color: #26384d;

                    font-size: 16px;
                    font-weight: 700;
                }

                .editing-badge {
                    margin-left: auto;

                    padding: 5px 10px;

                    border-radius: 20px;

                    background: #fff3dc;
                    color: #c27a00;

                    font-size: 12px;
                    font-weight: 600;
                }

                /* 정보 행 */

                .info-row {
                    display: grid;

                    grid-template-columns: 135px 1fr;

                    min-height: 60px;

                    align-items: center;

                    border-bottom: 1px solid #edf1f5;
                }

                .info-row:last-child {
                    border-bottom: none;
                }

                .info-label {
                    padding-left: 20px;

                    color: #718096;

                    font-size: 14px;
                    font-weight: 600;
                }

                .info-value {
                    padding: 0 20px;

                    color: #26384d;

                    font-size: 15px;
                }

                /* 수정 입력창 */

                .info-input {
                    width: 100%;
                    height: 39px;

                    box-sizing: border-box;

                    padding: 0 11px;

                    background-color: #ffffff !important;
                    color: #26384d !important;

                    border: 1px solid #cbd5e1 !important;
                    border-radius: 6px;

                    outline: none;

                    font-family: inherit;
                    font-size: 14px;
                }

                .info-input:focus {
                    background-color: #ffffff !important;
                    color: #26384d !important;

                    border-color: #4d94ff !important;

                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.08);
                }

                /* 계좌 안내 */

                .account-notice {
                    display: flex;
                    align-items: center;
                    gap: 7px;

                    margin: 14px 0 0;
                    padding: 11px 13px;

                    border-radius: 7px;

                    background: #f7faff;

                    color: #718096;

                    font-size: 12px;
                }

                .notice-icon {
                    color: #4d94ff;

                    font-weight: 700;
                }

                /* 하단 버튼 */

                .account-footer {
                    display: flex;

                    justify-content: flex-end;

                    margin-top: 20px;
                }

                .edit-button,
                .save-button,
                .cancel-button {
                    height: 42px;

                    padding: 0 20px;

                    border-radius: 7px;

                    font-family: inherit;

                    font-size: 14px;
                    font-weight: 600;

                    cursor: pointer;
                }

                .edit-button,
                .save-button {
                    border: none;

                    background: #0066cc;
                    color: #ffffff;
                }

                .edit-button:hover,
                .save-button:hover {
                    background: #0055aa;
                }

                .cancel-button {
                    margin-right: 8px;

                    border: 1px solid #d5dde7;

                    background: #ffffff;
                    color: #64748b;
                }

                .cancel-button:hover {
                    background: #f7f9fc;
                }

                /* 반응형 */

                @media (max-width: 800px) {
                    .account-page {
                        padding: 10px 0;
                    }

                    .account-container {
                        width: 94%;
                        padding: 26px 22px;
                    }
                }

                @media (max-width: 600px) {
                    .account-container {
                        width: 96%;
                        padding: 22px 16px;
                    }

                    .account-title {
                        font-size: 24px;
                    }

                    .back-button {
                        height: 35px;
                        padding: 0 11px;
                    }

                    .info-row {
                        grid-template-columns: 100px 1fr;
                    }

                    .info-label {
                        padding-left: 14px;
                    }

                    .info-value {
                        padding: 0 14px;
                    }
                }
            `}</style>


            <div className="account-page">

                <div className="account-container">

                    {/* 제목 + 돌아가기 */}
                    <div className="account-title-row">

                        <h1 className="account-title">
                            회원정보
                        </h1>

                        <button
                            className="back-button"
                            onClick={handleBack}
                        >
                            ← 돌아가기
                        </button>

                    </div>

                    <p className="account-subtitle">
                        회원정보와 지원금 수령 계좌를 확인하고 관리할 수 있습니다.
                    </p>


                    {/* =========================
                        기본 회원정보
                    ========================= */}

                    <div className="account-section">

                        <div className="section-header">

                            <div className="section-icon">
                                👤
                            </div>

                            <h2 className="section-title">
                                기본 회원정보
                            </h2>

                            {isEditing && (
                                <span className="editing-badge">
                                    수정 중
                                </span>
                            )}

                        </div>


                        {/* 이름 */}
                        <div className="info-row">

                            <div className="info-label">
                                이름
                            </div>

                            <div className="info-value">

                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="text"
                                        name="name"
                                        value={editInfo.name}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.name
                                )}

                            </div>

                        </div>


                        {/* 이메일 */}
                        <div className="info-row">

                            <div className="info-label">
                                이메일
                            </div>

                            <div className="info-value">

                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="email"
                                        name="email"
                                        value={editInfo.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.email
                                )}

                            </div>

                        </div>


                        {/* 휴대전화 */}
                        <div className="info-row">

                            <div className="info-label">
                                휴대전화
                            </div>

                            <div className="info-value">

                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="tel"
                                        name="phone"
                                        value={editInfo.phone}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.phone
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        지원금 수령 계좌
                    ========================= */}

                    <div className="account-section">

                        <div className="section-header">

                            <div
                                className="section-icon"
                                style={{
                                    background: "#e8f8f0",
                                    color: "#16a66a"
                                }}
                            >
                                ₩
                            </div>

                            <h2 className="section-title">
                                지원금 수령 계좌
                            </h2>

                        </div>


                        {/* 은행명 */}
                        <div className="info-row">

                            <div className="info-label">
                                은행명
                            </div>

                            <div className="info-value">

                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="text"
                                        name="bank"
                                        value={editInfo.bank}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.bank
                                )}

                            </div>

                        </div>


                        {/* 계좌번호 */}
                        <div className="info-row">

                            <div className="info-label">
                                계좌번호
                            </div>

                            <div className="info-value">

                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="text"
                                        name="accountNumber"
                                        value={editInfo.accountNumber}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.accountNumber
                                )}

                            </div>

                        </div>

                    </div>


                    {/* 계좌 안내 */}
                    <div className="account-notice">

                        <span className="notice-icon">
                            ⓘ
                        </span>

                        <span>
                            등록된 계좌로 지원금이 지급됩니다.
                            계좌정보를 변경할 경우 정확한 정보를 입력해주세요.
                        </span>

                    </div>


                    {/* 하단 버튼 */}
                    <div className="account-footer">

                        {!isEditing ? (

                            <button
                                className="edit-button"
                                onClick={handleEdit}
                            >
                                정보 수정
                            </button>

                        ) : (

                            <>
                                <button
                                    className="cancel-button"
                                    onClick={handleCancel}
                                >
                                    취소
                                </button>

                                <button
                                    className="save-button"
                                    onClick={handleSave}
                                >
                                    저장
                                </button>
                            </>

                        )}

                    </div>

                </div>

            </div>
        </>
    );
}

export default AccountPage;