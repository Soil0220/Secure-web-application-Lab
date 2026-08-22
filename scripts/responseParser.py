class ResponseParser:

    def extract_api_urls(body: dict):

        if not isinstance(body, dict):
            return []

        #data 값 추출
        data = body.get("data", [])

        if not isinstance(data, list):
            return []

        #조회 결과 순회 저장
        values = []

        for item in data:

            if not isinstance(item, dict):
                continue

            value = item.get("apiUrl")

            if value is not None:
                values.append(value)

        return values

"""
테이블 스캔시 : A테이블, B테이블, C테이블
컬럼 스캔시 : A컬럼, B컬럼, C컬럼
데이터 스캔시 : A데이터, B데이터, C데이터
"""