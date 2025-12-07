import React, { useState } from 'react';

function AskAnything({ onAskAnything, challengeActive, pendingChallenge }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAskAnything(input, setError, setInput);
  };

  let placeholder = 'Ask something specific about the paper...';
  let buttonText = 'Send';
  if (challengeActive && pendingChallenge) {
    placeholder = 'Type your answer to the challenge...';
    buttonText = 'Submit Answer';
  }

  return (
    <form onSubmit={handleSubmit} className="ask-bar">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="ask-input"
        autoFocus
      />
      <button type="submit" className="btn-cta" style={{ minWidth: 120 }}>
        {buttonText}
      </button>
      {error && <div className="text-error text-sm" style={{ marginTop: 6 }}>{error}</div>}
    </form>
  );
}

export default AskAnything;