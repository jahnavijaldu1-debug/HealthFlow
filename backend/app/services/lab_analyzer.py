LAB_TESTS = {
    "glucose": {
        "unit": "mg/dL",
        "low": 70,
        "high": 99,
        "range": "70–99 mg/dL",
        "context": "diabetes"
    },
    "fasting glucose": {
        "unit": "mg/dL",
        "low": 70,
        "high": 99,
        "range": "70–99 mg/dL",
        "context": "diabetes"
    },
    "hba1c": {
        "unit": "%",
        "low": 4.0,
        "high": 5.6,
        "range": "4.0–5.6%",
        "context": "diabetes"
    },
    "hemoglobin": {
        "unit": "g/dL",
        "low": 12,
        "high": 16,
        "range": "12–16 g/dL",
        "context": "anemia"
    },
    "creatinine": {
        "unit": "mg/dL",
        "low": 0.6,
        "high": 1.3,
        "range": "0.6–1.3 mg/dL",
        "context": "kidney"
    },
    "urea": {
        "unit": "mg/dL",
        "low": 15,
        "high": 45,
        "range": "15–45 mg/dL",
        "context": "kidney"
    },
    "egfr": {
        "unit": "mL/min/1.73m²",
        "low": 60,
        "high": 120,
        "range": "60–120 mL/min/1.73m²",
        "context": "kidney"
    },
    "wbc": {
        "unit": "×10³/µL",
        "low": 4,
        "high": 11,
        "range": "4–11 ×10³/µL",
        "context": "blood"
    }
}


def analyze_lab_result(test_name: str, value: float):

    key = test_name.strip().lower()
    test = LAB_TESTS.get(key)

    if not test:
        return {
            "test_name": test_name,
            "value": value,
            "unit": "Unknown",
            "status": "UNKNOWN",
            "reference_range": "Not available",
            "health_context": "General",
            "plain_language_explanation": (
                "A reference range is not configured for this test."
            ),
            "doctor_discussion": (
                "Please discuss this laboratory result with "
                "a qualified healthcare professional."
            ),
            "disclaimer": (
                "This information is educational only and does "
                "not provide a medical diagnosis or treatment."
            )
        }

    if value < test["low"]:
        status = "LOW"
    elif value > test["high"]:
        status = "HIGH"
    else:
        status = "NORMAL"

    explanation = build_explanation(
        test["context"],
        key,
        status
    )

    return {
        "test_name": test_name,
        "value": value,
        "unit": test["unit"],
        "status": status,
        "reference_range": test["range"],
        "health_context": test["context"],
        "plain_language_explanation": explanation,
        "doctor_discussion": (
            "Discuss this result with your doctor. Your doctor can "
            "interpret it together with your symptoms, medical history "
            "and other laboratory results."
        ),
        "disclaimer": (
            "This is an educational explanation, not a diagnosis, "
            "disease prediction or treatment recommendation."
        )
    }


def build_explanation(context, test, status):

    if context == "diabetes":

        if test in ["glucose", "fasting glucose"]:

            if status == "HIGH":
                return (
                    "Your blood glucose is above the displayed "
                    "reference range. Glucose is the main sugar "
                    "your body uses for energy. Your doctor can "
                    "interpret this result together with other "
                    "blood-sugar information."
                )

            if status == "LOW":
                return (
                    "Your blood glucose is below the displayed "
                    "reference range. Low glucose can happen for "
                    "different reasons and should be discussed "
                    "with your doctor."
                )

            return (
                "Your blood glucose is within the displayed "
                "reference range."
            )

        if test == "hba1c":

            if status == "HIGH":
                return (
                    "Your HbA1c is above the displayed reference "
                    "range. HbA1c provides information about "
                    "average blood glucose over a period of time."
                )

            if status == "LOW":
                return (
                    "Your HbA1c is below the displayed reference "
                    "range. Your doctor can interpret this result "
                    "using your overall health information."
                )

            return (
                "Your HbA1c is within the displayed reference range. "
                "HbA1c provides information about average blood "
                "glucose over a period of time."
            )

    if context == "anemia":

        if status == "LOW":
            return (
                "Your hemoglobin is below the displayed reference "
                "range. Hemoglobin is a protein in red blood cells "
                "that helps carry oxygen through the body."
            )

        if status == "HIGH":
            return (
                "Your hemoglobin is above the displayed reference "
                "range. Your doctor can interpret this together "
                "with your other blood-test results."
            )

        return (
            "Your hemoglobin is within the displayed reference range."
        )

    if context == "kidney":

        if test == "creatinine":

            if status == "HIGH":
                return (
                    "Your creatinine is above the displayed reference "
                    "range. Creatinine is a waste product measured as "
                    "one part of evaluating kidney function."
                )

            if status == "LOW":
                return (
                    "Your creatinine is below the displayed reference "
                    "range. Your doctor can interpret this together "
                    "with other laboratory information."
                )

            return (
                "Your creatinine is within the displayed reference range."
            )

        if test == "urea":

            if status == "HIGH":
                return (
                    "Your urea is above the displayed reference range. "
                    "Urea is a waste product measured in blood and may "
                    "be considered when evaluating kidney function."
                )

            if status == "LOW":
                return (
                    "Your urea is below the displayed reference range. "
                    "The result should be interpreted together with "
                    "other health information."
                )

            return (
                "Your urea is within the displayed reference range."
            )

        if test == "egfr":

            if status == "LOW":
                return (
                    "Your eGFR is below the displayed reference range. "
                    "eGFR is an estimate related to how efficiently "
                    "the kidneys filter blood."
                )

            if status == "HIGH":
                return (
                    "Your eGFR is above the displayed reference range "
                    "used for this analysis."
                )

            return (
                "Your eGFR is within the displayed reference range."
            )

    if context == "blood":

        if status == "LOW":
            return (
                "Your white blood cell count is below the displayed "
                "reference range. White blood cells are part of the "
                "immune system."
            )

        if status == "HIGH":
            return (
                "Your white blood cell count is above the displayed "
                "reference range. White blood cells are part of the "
                "immune system and help the body respond to different "
                "conditions."
            )

        return (
            "Your white blood cell count is within the displayed "
            "reference range."
        )

    return (
        "Your result has been compared with the configured "
        "reference range."
    )