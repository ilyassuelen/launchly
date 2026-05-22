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


@app.get("/")
def root():
    return {
        "message":
            "Launchly API running"
    }