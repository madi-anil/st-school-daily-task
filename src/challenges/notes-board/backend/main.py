from datetime import datetime
from typing import Optional
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

notes: list[dict] = []
next_id = 1


class NoteCreate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = ""


@app.get("/api/notes", status_code=status.HTTP_200_OK)
def list_notes():
    return list(reversed(notes))


@app.post("/api/notes", status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate):
    if not payload.title or not payload.title.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Title is required"},
        )

    global next_id
    note = {
        "id": next_id,
        "title": payload.title.strip(),
        "body": payload.body or "",
        "createdAt": datetime.now().isoformat(),
    }
    next_id += 1
    notes.append(note)
    return note


@app.delete("/api/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int):
    for index, note in enumerate(notes):
        if note["id"] == note_id:
            notes.pop(index)
            return
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"error": "Note not found"},
    )