import { useState, useEffect } from "react";
import { useAccount } from "../../contexts/accountContext/useAccount";

/*
    계정별 페이지
    1. useAccount를 사용하여 계정정보 조회 및 account 전역 저장
    2. userInfo를 통한 조회 결과로 인해 갱신된 account의 로컬 저장 및 화면표시
    3. editInfo를 통한 수정 정보 관리 및 isEditing을 통한 수정상태별 UI 변경
    4. loading을 통한 수정정보 저장시 버튼 비활성화

*/

export default function AccountPage() {
    const { account, getAccount, updateBankAccount } = useAccount();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // 계좌 수정용 임시 State
    const [editInfo, setEditInfo] = useState({
        bankName: "",
        accountNum: ""
    });

    // 계정정보관리
    const userInfo = {
        name: account?.name || "",
        email: account?.email || "",
        phone: account?.phone || "",
        bankName: account?.bankName || "",
        accountNum: account?.accountNum || ""
    };

    // 수정 모드 핸들러
    const handleEdit = () => {
        setEditInfo({
            bankName: userInfo.bankName,
            accountNum: userInfo.accountNum
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditInfo({
            bankName: userInfo.bankName,
            accountNum: userInfo.accountNum
        });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 저장 핸들러
    const handleSave = async () => {
        try {
            setLoading(true);

            if (updateBankAccount) {
                await updateBankAccount(editInfo.bankName, editInfo.accountNum);
            }

            if (getAccount) {
                await getAccount();
            }

            setIsEditing(false);
            alert("계좌정보가 성공적으로 수정되었습니다.");
        } catch (error) {
            console.error("계좌정보 수정 실패:", error);
            alert("계좌정보 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                if (getAccount) {
                    await getAccount();
                }
            } catch (error) {
                console.error("계정 정보 조회 실패:", error);
            }
        };

        fetchAccountData();
    }, []);

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="account-title-row">
                    <h1 className="account-title">회원정보</h1>
                    <button className="back-button" onClick={handleBack}>
                        ← 돌아가기
                    </button>
                </div>

                <p className="account-subtitle">
                    회원정보와 지원금 수령 계좌를 확인하고 관리할 수 있습니다.
                </p>

                <div className="account-sections-wrapper">
                    {/* 기본 회원정보 */}
                    <div className="account-section">
                        <div className="section-header">
                            <div className="section-icon">👤</div>
                            <h2 className="section-title">기본 회원정보</h2>
                        </div>

                        <div className="info-row">
                            <div className="info-label">이름</div>
                            <div className="info-value">{userInfo.name || "-"}</div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">이메일</div>
                            <div className="info-value">{userInfo.email || "-"}</div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">휴대전화</div>
                            <div className="info-value">{userInfo.phone || "-"}</div>
                        </div>
                    </div>

                    {/* 2. 지원금 수령 계좌 */}
                    <div className="account-section">
                        <div className="section-header">
                            <div
                                className="section-icon"
                                style={{ background: "#e6f4ea", color: "#137333" }}
                            >
                                ₩
                            </div>
                            <h2 className="section-title">지원금 수령 계좌</h2>
                            {isEditing && (
                                <span className="editing-badge">수정 중</span>
                            )}
                        </div>

                        <div className="info-row">
                            <div className="info-label">은행명</div>
                            <div className="info-value">
                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="text"
                                        name="bankName"
                                        placeholder="예: XX은행"
                                        value={editInfo.bankName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.bankName || "미등록"
                                )}
                            </div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">계좌번호</div>
                            <div className="info-value">
                                {isEditing ? (
                                    <input
                                        className="info-input"
                                        type="text"
                                        name="accountNum"
                                        placeholder="계좌번호 입력 (- 제외)"
                                        value={editInfo.accountNum}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    userInfo.accountNum || "미등록"
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="account-notice">
                    <span className="notice-icon">ⓘ</span>
                    <span>
                        등록된 계좌로 지원금이 지급됩니다. 계좌정보를 변경할 경우 정확한 정보를 입력해주세요.
                    </span>
                </div>

                <div className="account-footer">
                    {!isEditing ? (
                        <button className="edit-button" onClick={handleEdit}>
                            계좌 정보 수정
                        </button>
                    ) : (
                        <>
                            <button
                                className="cancel-button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                취소
                            </button>
                            <button
                                className="save-button"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "저장 중..." : "저장"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 스타일 태그를 최하단에 배치 */}
            <style>{accountStyles}</style>
        </div>
    );
}


const accountStyles = `
    .account-page { font-family: 'Noto Sans KR', sans-serif; width: 100%; box-sizing: border-box; display: flex; justify-content: center; padding: 20px; }
    .account-container { width: 100%; max-width: 1100px; box-sizing: border-box; padding: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03); }
    
    .account-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 2px solid #111111; padding-bottom: 12px; }
    .account-title { margin: 0; color: #111111; font-size: 22px; font-weight: bold; }
    .account-subtitle { margin: 12px 0 24px; color: #666666; font-size: 14px; }
    
    .back-button { height: 36px; padding: 0 14px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #333333; font-family: inherit; font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.15s ease; }
    .back-button:hover { background: #f8f9fa; border-color: #0056b3; color: #0056b3; }

    /* 카드 구획 레이아웃 */
    .account-sections-wrapper { display: flex; gap: 20px; width: 100%; }
    .account-section { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff; }
    
    .section-header { display: flex; align-items: center; min-height: 50px; padding: 0 20px; background: #f8f9fa; border-bottom: 1px solid #e2e8f0; }
    .section-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; margin-right: 10px; border-radius: 6px; background: #eef6ff; color: #0056b3; font-size: 14px; font-weight: bold; }
    .section-title { margin: 0; color: #111111; font-size: 15px; font-weight: bold; }
    .editing-badge { margin-left: auto; padding: 4px 10px; border-radius: 4px; background: #fef7e0; color: #b06000; font-size: 12px; font-weight: bold; }

    /* 행 정보 데이터 */
    .info-row { display: grid; grid-template-columns: 120px 1fr; min-height: 52px; align-items: center; border-bottom: 1px solid #edf2f7; }
    .info-row:last-child { border-bottom: none; }
    .info-label { padding-left: 20px; color: #666666; font-size: 14px; font-weight: bold; }
    .info-value { padding: 8px 20px; color: #111111; font-size: 14px; }
    
    /* Input 스타일 */
    .info-input { width: 100%; height: 38px; box-sizing: border-box; padding: 0 12px; background-color: #ffffff !important; color: #111111 !important; border: 1px solid #cbd5e1 !important; border-radius: 6px; outline: none; font-family: inherit; font-size: 14px; transition: all 0.15s ease; }
    .info-input:focus { background-color: #ffffff !important; color: #111111 !important; border-color: #0056b3 !important; box-shadow: inset 0 0 0 1px #0056b3; }

    /* 안내 메시지 및 하단 버튼 */
    .account-notice { display: flex; align-items: center; gap: 8px; margin: 20px 0 0; padding: 12px 16px; border-radius: 6px; background: #f8f9fa; border: 1px solid #e2e8f0; color: #666666; font-size: 13px; }
    .notice-icon { color: #0056b3; font-weight: bold; }
    .account-footer { display: flex; justify-content: flex-end; margin-top: 24px; }

    .edit-button, .save-button, .cancel-button { height: 42px; padding: 0 20px; border-radius: 6px; font-family: inherit; font-size: 14px; font-weight: bold; cursor: pointer; transition: background-color 0.15s ease; }
    .edit-button, .save-button { border: none; background: #0056b3; color: #ffffff; }
    .edit-button:hover, .save-button:hover { background: #004494; }
    .save-button:disabled { background: #94a3b8; cursor: not-allowed; }
    .cancel-button { margin-right: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #333333; }
    .cancel-button:hover { background: #f8f9fa; }

    /* 미디어 쿼리 */
    @media (max-width: 850px) { .account-sections-wrapper { flex-direction: column; gap: 16px; } .account-container { padding: 24px 20px; } }
    @media (max-width: 600px) { .account-container { padding: 20px 16px; } .account-title { font-size: 20px; } .back-button { height: 34px; padding: 0 10px; } .info-row { grid-template-columns: 90px 1fr; } .info-label { padding-left: 14px; } .info-value { padding: 8px 14px; } }
`;