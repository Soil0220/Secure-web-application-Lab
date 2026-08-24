import csv
import json
from discoveryResult import  SchemaData
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from config import CONFIG

class ResultCollector:

    def __init__(self):

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        self.output_dir = (
            Path(CONFIG.output_dir)
            / timestamp
        )

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        self.schemadatas = []

    def add(self, result: SchemaData):

        self.results.append(result)


    def save_json(self):

        path = (
            self.output_dir
            / "results.json"
        )

        with path.open(
            "w",
            encoding="utf-8"
        ) as f:
            json.dump(
                [asdict(s) for s in self.schemadatas],
                f,
                ensure_ascii=False,
                indent=2 #2칸 들여쓰기
            )

        return path

    def save_csv(self):

        path = (
            self.output_dir
            / "results.csv"
        )

        with path.open(
            "w",
            encoding="utf-8-sig",
            newline=""
        ) as f:

            writer = csv.DictWriter(
                f,
                fieldnames=[
                    "result"
                ]
            )

            writer.writeheader()

            for schemadata in self.schemadatas:

                #배열 및 객체 주입이 안되기에 values를 json화 시켜서 주입
                row = {
                    "result" : json.dumps(
                        asdict(schemadata),
                        ensure_ascii=False
                    )
                }

                writer.writerow(row)

        return path
