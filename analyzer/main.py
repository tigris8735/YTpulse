from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import cv2
import numpy as np
import mediapipe as mp
import requests

app = FastAPI(title="YT Pulse Preview Analyzer")

class AnalyzeRequest(BaseModel):
    videoIds: List[str]

class PreviewResult(BaseModel):
    videoId: str
    faceCloseup: bool
    highContrast: bool
    textArea: bool
    centerObject: bool
    scoreSum: int

def download_thumbnail(video_id: str) -> np.ndarray | None:
    urls = [
        f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
        f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
        f"https://i.ytimg.com/vi/{video_id}/mqdefault.jpg",
    ]
    for url in urls:
        try:
            r = requests.get(url, timeout=8)
            if r.status_code == 200:
                arr = np.frombuffer(r.content, np.uint8)
                img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                if img is not None:
                    return img
        except:
            continue
    return None

def analyze_face(img: np.ndarray) -> tuple[bool, float]:
    mp_face = mp.solutions.face_detection
    face_detection = mp_face.FaceDetection(min_detection_confidence=0.5)
    h, w = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_detection.process(rgb)
    if not results.detections:
        return False, 0.0
    max_area = 0
    for detection in results.detections:
        bbox = detection.location_data.relative_bounding_box
        area = bbox.width * bbox.height
        if area > max_area:
            max_area = area
    return max_area >= 0.12, max_area

def analyze_contrast(img: np.ndarray) -> bool:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    std = np.std(gray)
    return std >= 55

def analyze_text_area(img: np.ndarray) -> bool:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    bottom = gray[int(h*0.7):, :]
    edges = cv2.Canny(bottom, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > (w * h * 0.3 * 0.08):
            return True
    return False

def analyze_center_object(img: np.ndarray, face_detected: bool, face_box=None) -> bool:
    h, w = img.shape[:2]
    cx, cy = w // 2, h // 2
    diagonal = np.sqrt(w**2 + h**2)
    threshold = diagonal * 0.3
    if face_detected and face_box:
        fx = face_box.xmin + face_box.width / 2
        fy = face_box.ymin + face_box.height / 2
        dist = np.sqrt((fx * w - cx)**2 + (fy * h - cy)**2)
        return dist < threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (51, 51), 0)
    diff = cv2.absdiff(gray, blurred)
    _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
    moments = cv2.moments(thresh)
    if moments["m00"] > 0:
        mx = int(moments["m10"] / moments["m00"])
        my = int(moments["m01"] / moments["m00"])
        dist = np.sqrt((mx - cx)**2 + (my - cy)**2)
        return dist < threshold
    return False

@app.post("/analyze", response_model=List[PreviewResult])
async def analyze(req: AnalyzeRequest):
    results = []
    for vid in req.videoIds[:10]:
        img = download_thumbnail(vid)
        if img is None:
            results.append(PreviewResult(videoId=vid, faceCloseup=False, highContrast=False, textArea=False, centerObject=False, scoreSum=0))
            continue
        face_ok, face_area = analyze_face(img)
        contrast_ok = analyze_contrast(img)
        text_ok = analyze_text_area(img)
        center_ok = analyze_center_object(img, face_ok)
        score = sum([face_ok, contrast_ok, text_ok, center_ok])
        results.append(PreviewResult(videoId=vid, faceCloseup=face_ok, highContrast=contrast_ok, textArea=text_ok, centerObject=center_ok, scoreSum=score))
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
