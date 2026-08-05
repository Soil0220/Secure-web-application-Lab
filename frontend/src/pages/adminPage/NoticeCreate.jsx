import { useState } from "react";
import axios from 'axios';

const NoticeCreate = ({onClose}) => {
    // 폼 상태 관리
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPinned: false
    });

    const [loading, setLoading] = useState(false);

    // 입력값 핸들러
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 폼 제출 (REST API 호출)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/notices', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                alert(response.data.message || '공지사항이 정상적으로 등록되었습니다.');
                // 등록 후 폼 초기화
                setFormData({ title: '', content: '', isPinned: false });
            }
        } catch (error) {
            console.error('공지사항 작성 오류:', error);

            if (error.response) {
                // 백엔드에서 내려준 에러 메시지 (400, 403, 500 등)
                alert(error.response.data.message || '등록 처리에 실패했습니다.');
            } else {
                alert('서버와 통신할 수 없습니다.');
            }
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div style={styles.container}>
            <h2> 공지사항 작성</h2>
            <hr style={{ marginBottom: '20px' }} />

            <form onSubmit={handleSubmit}>
                {/* 제목 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="공지사항 제목을 입력하세요"
                        style={styles.input}
                        required
                    />
                </div>

                {/* 상단 고정 체크박스 */}
                <div style={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="isPinned"
                        name="isPinned"
                        checked={formData.isPinned}
                        onChange={handleChange}
                    />
                    <label htmlFor="isPinned" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        상단 고정 공지로 등록
                    </label>
                </div>

                {/* 내용 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>내용</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="공지사항 내용을 입력하세요"
                        style={styles.textarea}
                        required
                    />
                </div>

                {/* 버튼 */}
                <div style={styles.btnGroup}>
                    <button type="submit" style={styles.btnPrimary} disabled={loading}>
                        {loading ? '등록 중...' : '등록하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// 간단한 인라인 스타일
const styles = {
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '24px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontFamily: 'sans-serif'
    },
    formGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        height: '200px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        resize: 'vertical'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
    },
    btnGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    btnPrimary: {
        padding: '10px 20px',
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default NoticeCreate;