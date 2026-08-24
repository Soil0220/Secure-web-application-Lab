
from dataclasses import dataclass, field

@dataclass
class ColumnData:
    values: list[str] = field(default_factory=list)

@dataclass
class TableData:
    columns: dict[str, ColumnData] = field(default_factory=dict)

@dataclass
class SchemaData:
    tables: dict[str, TableData] = field(default_factory=dict)


"""
테이블명 : { 
    컬럼명A : {
        [데이터A, 데이터B, 데이터 C...]
    },
    컬럼명B : {
        [데이터A, 데이터B, 데이터 C...]
    }
    ...
}
"""
