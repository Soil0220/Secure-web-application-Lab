# SQL Injection 검증 보고서

- Target: `http://localhost:80/api/monitoring/admin`

## 테스트 결과

#### 확인된 반환값



### Table: `application_documents`


| application_document_id | application_id | created_at | deleted_at | doc_type | file_size | origin_file_name | store_file_name | updated_at | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |


### Table: `grants`


| amount | category | content | created_at | cycle | deleted_at | end_date | grant_id | start_date | status | title | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |


### Table: `notices`


| content | created_at | deleted_at | is_pinned | notice_id | title | updated_at |
| --- | --- | --- | --- | --- | --- | --- |


### Table: `request_logs`


| api_url | created_at | log_id | request_id | request_time |
| --- | --- | --- | --- | --- |
| /api/user/login/public | 2026-09-02 11:26:22.108615 | 1 | e4e555f3-f9db-448b-adf3-3f63888b475d | 2026-09-02 11:26:22.095000 |
| /api/user/login/public | 2026-09-02 11:28:17.768254 | 2 | 6ceb38f4-d5cb-43ce-99c9-f04e95bb2e74 | 2026-09-02 11:28:17.671000 |


### Table: `user_applications`


| active_flag | application_id | created_at | deleted_at | grant_id | status | updated_at | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- |


### Table: `user_documents`


| created_at | deleted_at | doc_type | document_id | file_size | origin_file_name | store_file_name | updated_at | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |


### Table: `user_favorites`


| active_flag | created_at | deleted_at | favorite_id | grant_id | updated_at | user_id |
| --- | --- | --- | --- | --- | --- | --- |


### Table: `user_inquiries`


| answer | answered_at | content | created_at | deleted_at | inquiry_id | link | status | title | updated_at | user_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |


### Table: `users`


| account_num | bank_name | created_at | deleted_at | email | name | password | phone | role | updated_at | user_id | username |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | 2026-09-02 11:13:38.354523 |  | Admin@google.com | 관리자 | {bcrypt}$2a$10$Qn4qPkkNEuToCjZ2eFowjeFIIqG5Qc.yFlovUNX4GCh.ALOxMCIR. | 01012345678 | ADMIN | 2026-09-02 11:13:38.354523 | 1 | admin |