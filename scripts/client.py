
from config import CONFIG
import requests

class SQLiClient:

    # Config 기반 요청 설정
    def __init__(self):
        self.end_url = (
            CONFIG.base_url
            + CONFIG.endpoint
        )

        self.login_url = (
                CONFIG.base_url
                + CONFIG.login_point
        )

        self.session = requests.Session()

        self.session.headers.update({
            "X-Request-Id": CONFIG.request_id,
            "X-Request-Time": CONFIG.request_time,
            "Content-Type": "application/json",
        })

    #어드민 로그인
    def login(self):
        request_body = {
            "username": CONFIG.username,
            "password": CONFIG.password
        }

        response = self.session.post(
            self.login_url,
            json=request_body)

        try:
            body = response.json()

        except ValueError:
            body = {
                "raw": response.text
            }

        return body

    # 요청 전송
    def send(self, payload: str) -> dict:

        request_params = {
            "apiUrl": payload
        }

        response = self.session.get(
            self.end_url,
            params=request_params)

        try:
            body = response.json()

        except ValueError:
            body = {
                "raw": response.text
            }

        return {"body": body}