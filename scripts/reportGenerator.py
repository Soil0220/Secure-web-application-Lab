from resultCollector import ResultCollector
from config import CONFIG
from scripts.discoveryResult import SchemaData

class ReportGenerator:

    def __init__(self, collector: ResultCollector):
        self.collector = collector

    def build_markdown_schema(self, schema_data: SchemaData) -> str:

        output = []
        for table_name, table_data in schema_data.tables.items():
            output.append(f"\n\n### Table: `{table_name}`\n\n")

            data_dict = {col: col_obj.values for col, col_obj in table_data.columns.items()}
            if not data_dict:
                continue

            headers = list(data_dict.keys())
            max_len = max((len(v) for v in data_dict.values()), default=0)

            # Markdown 헤더 작성
            output.append("| " + " | ".join(headers) + " |")
            output.append("| " + " | ".join(["---"] * len(headers)) + " |")

            # 행 데이터 작성 (패딩 처리 포함)
            for i in range(max_len):
                row = []
                for col in headers:
                    val = data_dict[col][i] if i < len(data_dict[col]) else ''

                    # 줄바꿈 및 파이프(|) 문자가 Markdown 표를 깨뜨리지 않도록 이스케이프
                    clean_val = str(val).replace("\n", "<br>").replace("|", "\\|")

                    row.append(clean_val)
                output.append("| " + " | ".join(row) + " |")

        return "\n".join(output)

    def generate(self):
        path = self.collector.output_dir / "report.md"

        # Directory 생성 보장 (디렉터리가 없는 경우 대비)
        path.parent.mkdir(parents=True, exist_ok=True)

        self.end_url = CONFIG.base_url + CONFIG.endpoint

        lines = [
            "# SQL Injection 검증 보고서",
            "",
            f"- Target: `{self.end_url}`" if self.collector.schemadatas else "- Target: N/A",
            "",
            "## 테스트 결과",
            "",
            "#### 확인된 반환값",
            ""
        ]

        if not self.collector.schemadatas:
            lines.append("> 추출된 스키마 데이터가 존재하지 않습니다.")
        else:
            for schemadata in self.collector.schemadatas:
                lines.append(self.build_markdown_schema(schemadata))

        with path.open("w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        return path