import React from 'react';

function SummaryDisplay({ summary }) {
  return (
    <div className="summary-card">
      <div className="summary-head">
        <p className="pill subtle">Auto-generated</p>
        <h3>Document Summary</h3>
      </div>
      <div className="summary-body">
        {summary ? summary : 'No summary available yet. Upload a document to get started.'}
      </div>
    </div>
  );
}

export default SummaryDisplay;