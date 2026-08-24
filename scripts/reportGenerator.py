
from resultCollector import  ResultCollector

class ReportGenerator:

    def __init__(
        self,
        collector: ResultCollector
    ):

        self.collector = collector

    def generate(self):

        path = (
            self.collector.output_dir
            / "report.md"
        )

        lines = []

        lines.append(
            "# SQL Injection 검증 보고서"
        )

        lines.append("")

        lines.append(
            f"- Target: ``"
            if self.collector.schemadatas
            else "- Target: N/A"
        )

        lines.append("")

        lines.append(
            "## 테스트 결과"
        )

        lines.append("")

        for index, result in enumerate(
            self.collector.schemadatas,
            start=1
        ):

            lines.append(
                "#### 확인된 반환값"
            )

            lines.append("")

            lines.append(
                f"- `{result}`"
            )

        with path.open(
            "w",
            encoding="utf-8"
        ) as f:

            f.write(
                "\n".join(lines)
            )

        return path