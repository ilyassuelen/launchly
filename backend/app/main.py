from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.routers import health


app = FastAPI(
    title="Launchly API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "Launchly API running"}
