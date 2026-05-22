from fastapi import APIRouter

from backend.app.schemas.recruiter.recruiter_view import (
    RecruiterViewRequest,
    RecruiterViewResponse,
)

from backend.app.services.recruiter.recruiter_view_service import (
    analyze_recruiter_view,
)

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
)


@router.post(
    "/analyze",
    response_model=RecruiterViewResponse,
)
async def analyze_recruiter(
    payload: RecruiterViewRequest,
):
    return await analyze_recruiter_view(
        payload,
    )
