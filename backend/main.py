from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import shutil
import uuid
import os

from inference import run_inference

# Create FastAPI app
app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://spinesight-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder paths
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

# Create folders automatically if missing
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "SpineSight AI Running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Create unique filename
    filename = f"{uuid.uuid4()}.jpg"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    # Save uploaded image
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Run AI model prediction
    results = run_inference(file_path)

    return JSONResponse(
        content={
            "message": "Prediction successful",
            "results": results
        }
    )


# Serve generated output images
app.mount(
    "/outputs",
    StaticFiles(directory="outputs"),
    name="outputs"
)