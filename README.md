# 🚀 Smart Assistant for Research Summarization

An intelligent **FastAPI + React** platform that ingests research PDFs/TXT, generates concise summaries, answers questions with source-grounded justifications, and tests your understanding with AI-generated challenge questions — powered by **Gemini 1.5 Flash + FAISS vector retrieval**.

<img width="1874" height="825" alt="image" src="https://github.com/user-attachments/assets/6d62390f-cfbb-4657-8e4a-68bb8f5b724a" />

---

## ✨ Key Features

- 📄 **Research Paper Summarization**  
  Upload PDF/TXT files to extract text and generate a crisp 150-word summary.

- 🤖 **AI Q&A Chatbot**  
  Ask any question about the uploaded document; responses use FAISS retrieval + Gemini for accuracy.

- 🧠 **Challenge Mode**  
  Automatically generates 3 logic questions and evaluates your answers with detailed justifications.

- ⚡ **FAISS + MiniLM Embeddings**  
  Fast, accurate semantic search over document chunks.

- 🎨 **Modern React UI**  
  Smooth neon/glass UI with drag-and-drop upload, history tracking, and real-time responses.

---

## 📁 Project Structure

```
Smart-Assistant-for-Research-Summarization/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry + routes
│   │   ├── document_processor.py  # Parsing + summary creation
│   │   ├── question_answerer.py   # Q&A using FAISS + Gemini
│   │   ├── question_generator.py  # Challenge question generation
│   │   ├── answer_evaluator.py    # Challenge evaluation logic
│   │   └── models/
│   │       ├── context.py         # In-memory context store
│   │       └── document.py
│   ├── requirements.txt
│   └── .env                       # GOOGLE_API_KEY
└── client/
    ├── src/
    │   ├── App.js
    │   ├── index.css
    │   ├── axios.js               # Backend base URL
    │   └── components/
    │       ├── FileUpload.js
    │       ├── SummaryDisplay.js
    │       ├── AskAnything.js
    │       ├── ChallengeMe.js
    │       └── HistoryDisplay.js
    └── package.json
```

---

## 🛠️ Prerequisites

- **Python 3.12**  
- **Node.js 18+**
- **Google Gemini API key**
- Optional: keep repo in a short path (e.g., `C:\sa\project`) to avoid Windows long-path issues.

---

## ⚙️ Backend Setup (FastAPI)

```powershell
cd backend
py -3.12 -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./.venv/Scripts/Activate.ps1

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create `backend/.env`:

```
GOOGLE_API_KEY=your_google_api_key
```

Run backend:

cd C:\RAI\backend; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```

---

## 🎨 Frontend Setup (React)

```powershell
cd client
npm install
npm start
# UI: http://localhost:3000
```


If backend URL differs, update:

```
client/src/axios.js
```

---

## 🔌 API Endpoints

| Method | Endpoint       | Description |
|--------|----------------|-------------|
| POST   | `/upload`      | Upload PDF/TXT → returns `{ text, summary }` |
| POST   | `/ask`         | Ask a question → returns `{ question, answer, justification }` |
| GET    | `/challenge`   | Generate 3 logic questions |
| POST   | `/evaluate`    | Evaluate user answer → returns score + justification |
| GET    | `/`            | Health check |

---

## 🧩 How It Works (Data Flow)

1. **User uploads file** → text extracted → summary generated  
2. **Document is chunked** → embedded using MiniLM → stored in FAISS  
3. **User asks a question** → relevant chunks retrieved  
4. **Gemini 1.5 Flash** answers the question + provides justification  
5. **Challenge mode** generates logic Qs and evaluates responses  
6. **Client UI** stores history using local context/session

---

## 🛠️ Troubleshooting

- **Long path error (Windows):** move repo to `C:\sa\project`  
- **Missing API key:** ensure `.env` exists and backend restarted  
- **Port conflicts:** edit `uvicorn.run()` in `main.py` and update `axios.js`  
- **No GPU needed:** CPU FAISS + MiniLM is used

---

## 🧾 Development Notes

- Uses Python 3.12 for smooth dependency support on Windows  
- Summaries are capped at ~10k characters due to Gemini limits  
- FAISS index and session context are in-memory  
- Restarting backend resets state

---

## ⭐ Final Thoughts

This project combines **AI reasoning**, **retrieval**, and **modern UI** to create a full research assistant experience — ideal for academic exploration, paper review, or learning.
