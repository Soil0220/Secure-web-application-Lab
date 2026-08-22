class SQLiClient:

    # Config 기반 요청 설정
    def __init__(self, config: Config):
        self.config = config

        self.url = (
            config.base_url
            + config.endpoint
        )

        self.session = requests.Session()

        self.session.headers.update({
            "X-Request-Id": config.request_id,
            "X-Request-Time": config.request_time,
            "Content-Type": "application/json",
        })

    # 요청 전송
    def send(self, payload: str) -> dict:

        request_body = {
            "apiUrl": payload
        }

        response = self.session.get(
            self.url,
            json=request_body)

        try:
            body = response.json()

        except ValueError:
            body = {
                "raw": response.text
            }

        return {"body": body}

"""
            {
            "code": "200",
            "data": [
              {
                "requestId": "e1253-e24-5d2-a716-446655440000",
                "requestTime": "2026-08-22T10:04:16Z",
                "apiUrl": "/api/user/login/public"
              },
              {
                "requestId": null,
                "requestTime": null,
                "apiUrl": "관리자"
              },
              {
                "requestId": null,
                "requestTime": null,
                "apiUrl": "Soil"
              },
            ],
            "message": "SUCCESS",
            "success": true,
            "timestamp": "2026-08-22T10:06:46.4925608"
          }

"""