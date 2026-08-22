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
    def execute(
        self,
        payload_type: str,
        payload: str
    ):

        print()
        print(
            f"[+] {payload_type}"
        )

        response = self.client.send(
            payload
        )

        #응답 변환
        values = ResponseParser.extract_values(
            response["body"]
        )

        #결과 변환 및 반환
        result = DiscoveryResult(
            target=self.client.url,
            payload_type=payload_type,
            payload=payload,
            values=values,
        )

        #컬렉터에 결과 추가
        self.collector.add(result)

        print(
            f"    {values}"
        )

        time.sleep(
            CONFIG.delay
        )

        return result

"""
collector 요소 하나당
{
    target:~
    payload_type:~
    payload:~
    values: A테이블, B테이블, C테이블 ... 흑은 컬럼 혹은 데이터
}
"""