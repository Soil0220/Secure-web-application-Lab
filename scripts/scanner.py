import time
from client import  SQLiClient
from resultCollector import  ResultCollector
from responseParser import  ResponseParser


class SQLiScanner:

    #클라이언트, 컬렉터 할당
    def __init__(
        self,
        client: SQLiClient,
        collector: ResultCollector
    ):

        self.client = client
        self.collector = collector

    #페이로드 기반 요청 전송
    def execute(self, payload_type: str, payload: str):

        print()
        print(
            f"[+] {payload_type}"
        )

        response = self.client.send(
            payload
        )

        #응답 변환
        values = ResponseParser.extract_api_urls(
            response["body"]
        )

        print(
            f"    {values}"
        )

        return values

"""
values, [데이터A, B, C...]
"""