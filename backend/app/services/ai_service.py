from app.services.lab_analyzer import analyze_lab_value


def analyze_lab_report(test_name: str, value: float):
    return analyze_lab_value(test_name, value)