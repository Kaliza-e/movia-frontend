import React, { useState } from 'react';
import { ussdAPI } from '../../services/api';
import '../../styles/index.css';

const USSDSimulator = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [sessionId] = useState(`mock-session-${Date.now()}`);
  const [phoneNumber] = useState('0780000000');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input && history.length > 0) return;

    let fullInput = input;
    if (history.length > 0) {
      // USSD typically passes the full string like "1*2*1"
      const previousInput = history
        .filter(h => h.type === 'user')
        .map(h => h.text)
        .join('*');
      fullInput = previousInput ? `${previousInput}*${input}` : input;
    }

    try {
      const newHistory = [...history];
      if (input) newHistory.push({ type: 'user', text: input });

      // Build formData because Spring @RequestParam expects query parameters or form data
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('phoneNumber', phoneNumber);
      formData.append('text', fullInput || '');

      const response = await ussdAPI.process(formData);

      newHistory.push({ type: 'system', text: response.data });
      setHistory(newHistory);
      setInput('');
    } catch (error) {
      console.error('USSD Error', error);
      setHistory([...history, { type: 'system', text: 'Error connecting to USSD service.' }]);
    }
  };

  const resetSession = () => {
    setHistory([]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Movia USSD Simulator</h2>
      <div style={{
        width: '300px',
        height: '400px',
        backgroundColor: '#222',
        color: '#0f0',
        padding: '15px',
        fontFamily: 'monospace',
        overflowY: 'auto',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        {history.length === 0 ? (
          <div>Press 'Dial *122#' to start</div>
        ) : (
          history.map((h, i) => (
            <div key={i} style={{ textAlign: h.type === 'user' ? 'right' : 'left', margin: '10px 0' }}>
              <span style={{ color: h.type === 'user' ? '#fff' : '#0f0' }}>
                {h.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        {history.length === 0 ? (
          <button type="button" onClick={() => handleSend({ preventDefault: () => {} })}>
            Dial *122#
          </button>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit">Send</button>
            <button type="button" onClick={resetSession} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
              End Call
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default USSDSimulator;
