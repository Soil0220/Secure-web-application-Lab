# [DEVNOTES는 시나리오 기반 침투테스트에 이용할 예시 개발자 노트입니다.]

---

# 백엔드 API 개발 및 테스트 노트

**작성자:** 김영진  
**최근 수정일:** 2026-08-24  
**상태:** 진행 중 (이번 주 금요일까지 프론트팀 전달 필수)

---

## 이번 주 TODO
- [x] 어드민 계정 권한 변경 API 프론트 연동 테스트
- [ ] 모니터링 로그 조회 로직 페이징 추가

---

## API 테스트 페이로드 임시 기록 (Bruno 동기화 전)

### 1. 계정 관리 (Admin 전용)
**주의:** 어드민 관련 엔드포인트는 전부 `/admin` 패스 붙여서 필터 거치게 해뒀음. 테스트할 때 토큰 필요하니까 개발 섭에서는 내 로컬 계정으로 로그인하고 세션 쿠키랑 CSRF토큰 물고 쏴야 함.

*   **계정 조회 (전체)**
    *   `GET /api/user/admin`
*   **계정 삭제**
    *   `DELETE /api/user/{userId}/admin`
*   **[테스트 완료] 계정 권한 변경 (권한 상승/강등)**
    *   회원관리 어드민 페이지에서 사용할 API.
    *   `userId` 2번(테스트용 일반계정)에 어드민 권한 부여해봤는데 잘 반영됨.
    ```text
    PATCH /api/user/role/2/admin HTTP/1.1

    {
      "role": "ADMIN" // "USER" 또는 "ADMIN"
    }
    ```

### 2. 지원금 제도 및 신청 관리 (Admin)
*   **지원금 제도 상태 변경**
    *   `PATCH /api/grant/status/1/admin`
    *   Body: `{"status": "CLOSED"}`
*   **지원금 신청 상태 갱신**
    *   `PATCH /api/application/4/admin`
    *   Body: `{"status": "UNDER_REVIEW"}`
*   **[테스트 완료] 지원금 제도 등록**
    *   날짜 포맷 프론트랑 맞췄음 (`ISO 8601`)
    ```text
    POST /api/grant/admin HTTP/1.1

    {
      "category": "YOUTH_EMPLOYMENT",
      "title": "청년지원금정책",
      "content": "청년의 일상을 책임집니다.",
      "amount": 10,
      "cycle": "WEEKLY",
      "startDate": "2026-08-12T17:35:27.123+09:00",
      "endDate": "2026-08-12T17:35:27.123+09:00"
    }
    ```

### 3. 로그 관리 (Admin)
*   **모니터링 로그 조회:**
    *   `GET /api/monitoring/admin?apiUrl=`


---
**[필수] 프론트팀 전달 메모:**
지원금 제도 삭제(`DELETE /api/grant/2/admin`)나 공지사항 삭제(`DELETE /api/notice/1/admin`) 날릴 때는 Path Variable로 ID 값만 넘기면 됩니다. Body는 비워주세요.

