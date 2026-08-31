from fastapi import APIRouter
from pydantic import BaseModel

from app.services.lab_analyzer import analyze_lab_result

router = APIRouter(
    prefix="/lab",
    tags=["Lab Reports"]
)


class LabAnalysisRequest(BaseModel):
    test_name: str
    value: float


@router.post("/analyze")
def analyze_report(data: LabAnalysisRequest):
    return analyze_lab_result(
        data.test_name,
        data.value
    )