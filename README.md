# Smart Assistant for Research Summarization

Modern FastAPI + React assistant for quickly ingesting research PDFs/TXT, generating concise summaries, answering questions with citations, and issuing challenge questions to test understanding. Runs locally with Gemini 1.5 Flash and FAISS-backed retrieval.

---

## Project Structure

```
Smart-Assistant-for-Research-Summarization/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry + routes
│   │   ├── document_processor.py  # PDF/TXT parsing + summarization prompt
│   │   ├── question_answerer.py   # Q&A over FAISS + Gemini
│   │   ├── question_generator.py  # Challenge question generation
│   │   ├── answer_evaluator.py    # Challenge grading
│   │   └── models/
│   │       ├── context.py         # In-memory context store
│   │       └── document.py
│   ├── requirements.txt
│   └── .env                       # GOOGLE_API_KEY
└── client/
    ├── src/
    │   ├── App.js
    │   ├── index.css
    │   ├── axios.js               # Backend base URL (localhost:8000)
    │   └── components/
    │       ├── FileUpload.js
    │       ├── SummaryDisplay.js
    │       ├── AskAnything.js
    │       ├── ChallengeMe.js
    │       └── HistoryDisplay.js
    ├── public/
    └── package.json
```

---

## Prerequisites

- Python 3.12 (Windows tested)
- Node.js 18+ and npm
- Google Gemini API key (Generative Language)
- Optional: shorter path on Windows (e.g., `C:\sa\project`) to avoid long-path issues during pip installs.

---

## Backend Setup (FastAPI)

```powershell
cd C:\sa\project\backend   # or your checkout path
py -3.12 -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./.venv/Scripts/Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create `backend/.env` with your Gemini key:

```
GOOGLE_API_KEY=your_google_api_key
```

Run the API:

```powershell
./.venv/Scripts/Activate.ps1
python -m app.main
# API: http://localhost:8000
```

---

## Frontend Setup (React)

```powershell
cd C:\sa\project\client   # or your checkout path
npm install
npm start
# UI: http://localhost:3000
```

If your backend URL differs, update `client/src/axios.js` `baseURL` accordingly.

---

## Key Features

- Upload PDF/TXT, parse text, and generate a 150-word summary via Gemini.
- Ask-anything Q&A grounded in FAISS retrieval over the uploaded document.
- Challenge mode: auto-generated logic questions and grading of your answers.
- Session history preserved client-side for quick recall.
- Modern neon/glass UI with drag-and-drop upload, ask bar, and status cards.

---

## API Reference

- `POST /upload` — multipart file (`pdf` or `txt`); returns `{ text, summary }`.
- `POST /ask` — JSON `{ "question": "..." }`; returns `{ question, answer, justification }`. Requires prior upload.
- `GET /challenge` — returns `[question, question, question]`. Requires prior upload.
- `POST /evaluate` — JSON `{ "question": "...", "user_answer": "..." }`; returns evaluation + justification. Requires prior upload.
- `GET /` — health check.

All endpoints run at `http://localhost:8000` by default and are CORS-allowed for `http://localhost:3000`.

---

## Troubleshooting

- **Windows long paths**: Place the repo in a short path (e.g., `C:\sa\project`) before installing Python deps.
- **Missing API key**: Ensure `GOOGLE_API_KEY` is set in `backend/.env` and restart the backend.
- **Port conflicts**: Change the `uvicorn` port in `app.main` and update `client/src/axios.js`.
- **GPU not required**: Torch CPU wheels are used by default.

---

## Development Notes

- Target Python 3.12 to avoid wheel/build issues on Windows.
- The summarizer truncates input to ~10k characters to stay within Gemini prompt limits.
- FAISS index and context are in-memory; restart resets state.

