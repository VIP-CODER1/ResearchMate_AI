import React, { useEffect, useRef } from 'react';

function HistoryDisplay({ history }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  if (history.length === 0) return <div className="history-empty">Ask a question to begin.</div>;

  return (
    <div className="history-timeline">
      {history.map((item, index) => {
        if (item.type === 'challenge-question') {
          return (
            <div key={index} className="bubble question">
              <p><strong>Challenge:</strong> {item.question}</p>
            </div>
          );
        }
        if (item.type === 'error') {
          return (
            <div key={index} className="bubble error">
              <p className="text-error"><strong>Error:</strong> {item.message}</p>
            </div>
          );
        }
        return (
          <div key={index} className="bubble-set">
            <div className="bubble question">
              {item.type === 'ask' ? (
                <p><strong>Question:</strong> {item.question}</p>
              ) : (
                <p><strong>Challenge:</strong> {item.question}</p>
              )}
            </div>
            <div className="bubble answer">
              {item.type === 'ask' ? (
                <>
                  <p><strong>Answer:</strong> {item.answer}</p>
                  <p className="muted"><strong>Justification:</strong> {item.justification}</p>
                </>
              ) : (
                <>
                  <p><strong>Your Answer:</strong> {item.answer}</p>
                  <p><strong>Evaluation:</strong> {item.evaluation}</p>
                  <p className="muted"><strong>Justification:</strong> {item.justification}</p>
                </>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default HistoryDisplay;