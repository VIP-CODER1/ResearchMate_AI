import React, { useMemo, useState } from 'react';
import './index.css';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import AskAnything from './components/AskAnything';
import HistoryDisplay from './components/HistoryDisplay';
import axios from './axios';

function App() {
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState('');
  const [mode, setMode] = useState('upload');
  const [challengeActive, setChallengeActive] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState([]); // array of questions
  const [history, setHistory] = useState([]);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  const handleUpload = (doc, sum) => {
    setDocument(doc);
    setSummary(sum);
    setMode('summary');
    setHistory([]);
    setPendingChallenges([]);
    setChallengeActive(false);
  };

  const addToHistory = (interaction) => {
    setHistory((prev) => [...prev, interaction]);
  };

  const docStats = useMemo(() => {
    if (!document) return null;
    const words = document.split(/\s+/).filter(Boolean).length;
    return {
      words,
      chars: document.length,
    };
  }, [document]);

  // Handle Challenge Me button
  const handleChallengeClick = async () => {
    if (pendingChallenges.length > 0) {
      // If already pending challenges, close them
      setPendingChallenges([]);
      setChallengeActive(false);
      return;
    }
    setLoadingChallenge(true);
    try {
      const res = await axios.get('/challenge');
      const questions = Array.isArray(res.data) ? res.data : [res.data];
      setPendingChallenges(questions);
      setChallengeActive(true);
      // Add each challenge question to history
      questions.forEach((question) => {
        addToHistory({ type: 'challenge-question', question });
      });
    } catch (err) {
      addToHistory({ type: 'error', message: err.response?.data?.detail || 'Failed to load challenge questions.' });
    } finally {
      setLoadingChallenge(false);
    }
  };

  // Unified handler for AskAnything
  const handleAskAnything = async (input, setError, setInput) => {
    if (pendingChallenges.length > 0) {
      // Answering the first pending challenge question
      const currentQuestion = pendingChallenges[0];
      if (!input.trim()) {
        setError('Please enter an answer.');
        return;
      }
      try {
        const res = await axios.post('/evaluate', { question: currentQuestion, user_answer: input });
        addToHistory({
          type: 'challenge',
          question: currentQuestion,
          answer: input,
          evaluation: res.data.answer,
          justification: res.data.justification,
        });
        setPendingChallenges((prev) => prev.slice(1));
        if (pendingChallenges.length === 1) {
          setChallengeActive(false);
        }
        setInput('');
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to evaluate answer.');
      }
      return;
    }
    // Normal ask flow
    if (!input.trim()) {
      setError('Please enter a question.');
      return;
    }
    try {
      const res = await axios.post('/ask', { question: input });
      addToHistory({
        type: 'ask',
        question: res.data.question,
        answer: res.data.answer,
        justification: res.data.justification,
      });
      setInput('');
      setError('');
    } catch (err) {
      let detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail = detail.map(e => e.msg).join(', ');
      } else if (typeof detail === 'object' && detail !== null) {
        detail = JSON.stringify(detail);
      }
      if (detail && detail.includes("No document uploaded")) {
        detail = "Please upload a document before asking questions.";
      }
      setError(detail || 'Failed to get answer.');
    }
  };

  if (mode === 'upload') {
    return (
      <div className="neo-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="upload-stage">
          <div className="hero-copy">
            <div className="pill">Gemini + FAISS • v1</div>
            <h1>Smart Research Assistant</h1>
            <p>
              Upload PDFs or TXT, get crisp summaries, ask questions, and stress-test your understanding with
              challenge rounds. Built for researchers who want speed with clarity.
            </p>
          </div>
          <div className="upload-grid">
            <div className="panel3d lift">
              <FileUpload onUpload={handleUpload} />
            </div>
            <div className="panel3d glass feature-grid">
              <div>
                <h4>01 · Upload</h4>
                <p>Drop a PDF/TXT and we extract clean text with guardrails.</p>
              </div>
              <div>
                <h4>02 · Summarize</h4>
                <p>Concise, citation-friendly overviews ready to share.</p>
              </div>
              <div>
                <h4>03 · Ask</h4>
                <p>Cross-question with grounded answers and justifications.</p>
              </div>
              <div>
                <h4>04 · Challenge</h4>
                <p>Self-check with adaptive challenge prompts and scoring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dash-shell">
        <header className="dash-header panel3d glass">
          <div>
            <div className="pill">Session Ready</div>
            <h2>Research Workspace</h2>
            <p>Summaries, Q&A, and challenges in one canvas.</p>
          </div>
          <div className="status-grid">
            <div className="stat-card">
              <span>Doc length</span>
              <strong>{docStats ? `${docStats.words} words` : '—'}</strong>
            </div>
            <div className="stat-card">
              <span>Summary</span>
              <strong>{summary ? 'Ready' : 'Pending'}</strong>
            </div>
            <div className={`stat-card ${challengeActive ? 'accent' : ''}`}>
              <span>Challenge</span>
              <strong>{challengeActive ? 'Live' : 'Off'}</strong>
            </div>
          </div>
        </header>

        <div className="dash-grid">
          <div className="panel3d chat-stack">
            <div className="chat-history-glow">
              <HistoryDisplay history={history} />
            </div>
            <div className="chat-action-bar">
              <AskAnything
                onAskAnything={handleAskAnything}
                challengeActive={challengeActive}
                pendingChallenge={pendingChallenges.length > 0 ? { question: pendingChallenges[0] } : null}
              />
              <button
                className={`btn-ghost ${challengeActive ? 'on' : ''}`}
                onClick={handleChallengeClick}
                disabled={loadingChallenge}
              >
                {challengeActive ? 'Close Challenge' : loadingChallenge ? 'Loading…' : 'Challenge Me'}
              </button>
            </div>
          </div>

          <div className="panel3d summary-panel glass">
            <SummaryDisplay summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;