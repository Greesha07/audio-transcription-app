from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import tempfile
import os

app = FastAPI()

# CORS (very important)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        # save temp audio file
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name

        # transcribe
        result = model.transcribe(temp_path)

        # cleanup
        os.remove(temp_path)

        # IMPORTANT: return JSON
        return {"text": result["text"]}

    except Exception as e:
        return {"error": str(e)}
