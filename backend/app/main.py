from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.routers import health
from backend.app.routers.auth import auth
from backend.app.routers.users import users
from backend.app.routers.resume import resume
from backend.app.routers.cover_letter import cover_letter
from backend.app.routers.cover_letter.ai_cover_letter import router as ai_cover_letter_router
from backend.app.routers.cover_letter.cover_letter_analysis import router as cover_letter_analysis_router
from backend.app.routers.resume.resume_analysis import router as resume_analysis_router
from backend.app.routers.recruiter.recruiter import router as recruiter_router
from backend.app.routers.linkedin.linkedin import router as linkedin_router
from backend.app.routers.portfolio.portfolio import router as portfolio_router
from backend.app.routers.applications.applications import router as applications_router
from backend.app.routers.dashboard.dashboard import router as dashboard_router
from backend.app.routers.interview.interview import router as interview_router

app = FastAPI(
    title="Launchly API",
    version="1.0.0",
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    health.router,
    tags=["Health"],
)

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    users.router,
)

app.include_router(
    resume.router,
    tags=["Resumes"],
)

app.include_router(
    cover_letter.router,
    tags=["Cover Letters"],
)

app.include_router(ai_cover_letter_router)

app.include_router(cover_letter_analysis_router)

app.include_router(resume_analysis_router)

app.include_router(recruiter_router)

app.include_router(linkedin_router)

app.include_router(portfolio_router)

app.include_router(applications_router)

app.include_router(dashboard_router)

app.include_router(interview_router)


@app.get("/")
def root():
    return {
        "message":
            "Launchly API running"
    }