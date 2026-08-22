@dataclass
class Config:
    base_url: str = "http://localhost:8080"
    endpoint: str = "/api/monitoring/admin"

    request_id: str = str(uuid.uuid4())
    request_time: str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    output_dir: str = "sqli_results"

CONFIG = Config()
