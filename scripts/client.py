
from config import  Config
import requests

class SQLiClient:

    # Config 기반 요청 설정
    def __init__(self, config: Config):
        self.config = config

        self.end_url = (
            config.base_url
            + config.endpoint
        )

        self.login_url = (
                config.base_url
                + config.login_point
        )

        self.session = requests.Session()

        self.session.headers.update({
            "X-Request-Id": config.request_id,
            "X-Request-Time": config.request_time,
            "Content-Type": "application/json",
        })

    #어드민 로그인
    def login(self):
        request_body = {
            "username": self.config.username,
            "password": self.config.password
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

        request_body = {
            "apiUrl": payload
        }

        response = self.session.get(
            self.end_url,
            json=request_body)

        try:
            body = response.json()

        except ValueError:
            body = {
                "raw": response.text
            }

        return {"body": body}