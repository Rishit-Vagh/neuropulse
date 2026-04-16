"""
FastAPI Backend — PulseCore Medical Image Analysis API

Endpoints:
  POST /api/scan          — Upload an image for CNN analysis
  GET  /api/report/{id}   — Get full report JSON for a previous scan
  GET  /api/report/{id}/pdf — Download PDF diagnostic report
  POST /api/login         — Authenticate user
  GET  /api/scans         — Get all scan history
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
import io
from datetime import datetime

from model import run_inference, preload_model
from report_generator import generate_pdf_report

app = FastAPI(
    title="PulseCore Neural Diagnostics API",
    description="CNN-powered medical image analysis backend",
    version="4.2.0",
)

import os

# CORS — dynamic origins for production
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for scan results (demo; use a DB in production)
scan_store: dict[str, dict] = {}

# Demo users database
USERS = {
    "admin": {"password": "admin", "name": "Dr. Admin", "role": "Radiologist", "department": "Radiology"},
    "doctor": {"password": "doctor123", "name": "Dr. Sarah Chen", "role": "Senior Radiologist", "department": "Radiology"},
    "demo": {"password": "demo", "name": "Demo User", "role": "Resident", "department": "Internal Medicine"},
}


class LoginRequest(BaseModel):
    username: str
    password: str


@app.on_event("startup")
async def startup_event():
    """Preload the CNN model at server startup for fast first inference."""
    preload_model()


@app.get("/")
async def root():
    return {
        "service": "PulseCore Neural Diagnostics API",
        "version": "4.2.0",
        "status": "online",
        "endpoints": [
            "POST /api/scan",
            "GET /api/report/{scan_id}",
            "GET /api/report/{scan_id}/pdf",
            "POST /api/login",
            "GET /api/scans",
        ],
    }


@app.post("/api/login")
async def login(request: LoginRequest):
    """Authenticate a user and return their profile."""
    user = USERS.get(request.username)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    return {
        "success": True,
        "user": {
            "username": request.username,
            "name": user["name"],
            "role": user["role"],
            "department": user["department"],
        },
        "token": f"demo-token-{uuid.uuid4().hex[:16]}",
    }


@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    """
    Upload a medical image for CNN analysis.
    Accepts: JPEG, PNG, DICOM-adjacent formats.
    Returns: JSON with predictions, diagnosis, confidence, and recommendations.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
    content_type = file.content_type or ""
    if content_type not in allowed_types and not file.filename.lower().endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".dcm")
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}. Please upload a JPEG, PNG, or TIFF image.",
        )

    # Read file bytes
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file received.")

    # Run CNN inference
    try:
        result = run_inference(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    # Generate scan ID and store result
    scan_id = str(uuid.uuid4())[:8]
    result["scan_id"] = scan_id
    result["filename"] = file.filename
    result["timestamp"] = datetime.now().isoformat()
    result["patient_id"] = f"P-{uuid.uuid4().hex[:6].upper()}"
    scan_store[scan_id] = result

    return result


@app.get("/api/scans")
async def get_all_scans():
    """Get all scan history (most recent first)."""
    scans = list(scan_store.values())
    scans.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    # Return a simplified list for the dashboard
    return [
        {
            "scan_id": s["scan_id"],
            "filename": s.get("filename", "Unknown"),
            "primary_diagnosis": s["primary_diagnosis"],
            "confidence_score": s["confidence_score"],
            "severity": s["severity"],
            "processing_time": s["processing_time"],
            "model_version": s["model_version"],
            "timestamp": s.get("timestamp", ""),
            "patient_id": s.get("patient_id", ""),
        }
        for s in scans
    ]


@app.get("/api/report/{scan_id}")
async def get_report(scan_id: str):
    """Get the full JSON report for a previous scan."""
    if scan_id not in scan_store:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found.")
    return scan_store[scan_id]


@app.get("/api/report/{scan_id}/pdf")
async def get_pdf_report(scan_id: str):
    """Generate and download a PDF diagnostic report."""
    if scan_id not in scan_store:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found.")

    scan_result = scan_store[scan_id]

    try:
        pdf_bytes = generate_pdf_report(scan_result, scan_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="PulseCore_Report_{scan_id}.pdf"'
        },
    )


if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  PulseCore Neural Diagnostics API")
    print("  Starting on http://localhost:8000")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
