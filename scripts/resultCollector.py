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

        self.results = []

    def add(self, result: DiscoveryResult):

        self.results.append(result)

    def save_json(self):

        path = (
            self.output_dir
            / "results.json"
        )

        data = [
            for result in self.results
                asdict(result)
        ]

        with path.open(
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                data,
                f,
                ensure_ascii=False,
                indent=2
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
                    "target",
                    "payload_type",
                    "payload",
                    "values",
                ]
            )

            writer.writeheader()

            for result in self.results:

                row = asdict(result)

                row["values"] = json.dumps(
                    row["values"],
                    ensure_ascii=False
                )

                writer.writerow(row)

        return path
