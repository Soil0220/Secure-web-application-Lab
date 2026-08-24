import uuid
from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass
class Config:
    base_url: str = "http://localhost:8080"
    endpoint: str = "/api/monitoring/admin"

    request_id: str = str(uuid.uuid4())
    request_time: str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    output_dir: str = "sqli_results"

    login_point: str = "/api/user/login/public"
    username: str = "admin"
    password: str = "admin1234"

CONFIG = Config()
