import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Smartphone, Send, X, RotateCcw, Hash, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

const USSDSimulator = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMenu, setCurrentMenu] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = () => {
    setMessages([]);
    setCurrentMenu('main');
    setMessages([{
      type: 'system',
      text: 'Welcome to Movia Transport\n1. Book Ticket\n2. View My Tickets\n3. Check Schedule\n4. Account Balance\n0. Exit',
    }]);
  };

  const processInput = async (value) => {
    setMessages(prev => [...prev, { type: 'user', text: value }]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 400));

    let response = '';

    if (currentMenu === 'main') {
      switch (value) {
        case '1': setCurrentMenu('book'); response = 'Book Ticket\nSelect route:\n1. Kigali → Musanze\n2. Kigali → Huye\n3. Huye → Rubavu\n0. Back'; break;
        case '2': setCurrentMenu('tickets'); response = 'Your Tickets:\n1. RAB 123A — Kigali → Musanze\n   Today 08:00 AM · Seat 1\n0. Back'; break;
        case '3': setCurrentMenu('schedule'); response = "Today's Schedule:\n08:00 AM — Kigali → Musanze\n09:30 AM — Kigali → Huye\n11:00 AM — Huye → Rubavu\n0. Back"; break;
        case '4': setCurrentMenu('balance'); response = 'Account Balance: RWF 5,000\n1. Top Up\n0. Back'; break;
        case '0': response = 'Thank you for using Movia Transport!\nSafe travels.'; setCurrentMenu(''); break;
        default: response = 'Invalid option. Please try again.\n\n1. Book Ticket\n2. View My Tickets\n3. Check Schedule\n4. Account Balance\n0. Exit';
      }
    } else if (currentMenu === 'book') {
      if (value === '0') { setCurrentMenu('main'); response = 'Welcome to Movia Transport\n1. Book Ticket\n2. View My Tickets\n3. Check Schedule\n4. Account Balance\n0. Exit'; }
      else if (['1', '2', '3'].includes(value)) { setCurrentMenu('booking_date'); response = 'Select Date:\n1. Today\n2. Tomorrow\n3. Day After Tomorrow\n0. Back'; }
      else response = 'Invalid option. Please try again.';
    } else if (currentMenu === 'booking_date') {
      if (value === '0') { setCurrentMenu('book'); response = 'Book Ticket\nSelect route:\n1. Kigali → Musanze\n2. Kigali → Huye\n3. Huye → Rubavu\n0. Back'; }
      else if (['1', '2', '3'].includes(value)) { setCurrentMenu('booking_confirm'); response = 'Booking Summary:\nRoute: Kigali → Musanze\nDate: Today\nDeparture: 08:00 AM\nSeat: Auto-assign\nPrice: RWF 3,000\n\n1. Confirm & Pay\n0. Cancel'; }
      else response = 'Invalid option. Please try again.';
    } else if (currentMenu === 'booking_confirm') {
      if (value === '1') {
        const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        response = `SUCCESS!\nBooking confirmed.\n\nTicket ID: ${ticketId}\nRoute: Kigali → Musanze\nAmount: RWF 3,000\n\nThank you for choosing Movia!`;
        setCurrentMenu('');
      } else {
        setCurrentMenu('main');
        response = 'Booking cancelled.\n\nWelcome to Movia Transport\n1. Book Ticket\n2. View My Tickets\n3. Check Schedule\n4. Account Balance\n0. Exit';
      }
    } else if (value === '0') {
      setCurrentMenu('main');
      response = 'Welcome to Movia Transport\n1. Book Ticket\n2. View My Tickets\n3. Check Schedule\n4. Account Balance\n0. Exit';
    } else {
      response = 'Invalid option. Press 0 to go back.';
    }

    setMessages(prev => [...prev, { type: 'system', text: response }]);
    setLoading(false);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) processInput(input.trim());
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          {/* <h1 className="text-2xl font-bold text-[#1A1A2E]">USSD Booking</h1> */}
          <p className="text-sm text-[#6B7280] mt-0.5">Simulate the feature phone booking interface</p>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div
            className="w-72 rounded-[40px] p-3 relative"
            style={{ background: '#1A1A2E', boxShadow: '0 20px 60px rgba(26,26,46,0.4)' }}
          >
            {/* Notch */}
            <div className="flex justify-center mb-3">
              <div className="w-20 h-5 rounded-full" style={{ background: '#0F0F1A' }} />
            </div>

            {/* Screen */}
            <div className="rounded-[28px] overflow-hidden" style={{ background: '#0F1A0F', minHeight: '380px' }}>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-[10px] font-bold" style={{ color: '#22C55E' }}>MTN</span>
                <span className="text-[10px]" style={{ color: '#22C55E' }}>*123#</span>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" style={{ color: '#22C55E' }} />
                  <span className="text-[10px]" style={{ color: '#22C55E' }}>100%</span>
                </div>
              </div>

              {/* USSD header */}
              <div className="px-4 py-2 border-b" style={{ borderColor: '#1A3A1A' }}>
                <p className="text-[11px] font-bold text-center" style={{ color: '#22C55E' }}>MOVIA TRANSPORT</p>
              </div>

              {/* Messages */}
              <div className="px-4 py-3 space-y-3 overflow-y-auto" style={{ maxHeight: '260px' }}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Hash className="w-8 h-8" style={{ color: '#22C55E', opacity: 0.5 }} />
                    <p className="text-xs text-center" style={{ color: '#22C55E', opacity: 0.6 }}>Dial *123# to start</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx}>
                      {msg.type === 'user' ? (
                        <div className="flex justify-end">
                          <span className="text-xs px-2 py-1 rounded" style={{ background: '#1A3A1A', color: '#22C55E' }}>
                            {msg.text}
                          </span>
                        </div>
                      ) : (
                        <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed" style={{ color: '#22C55E' }}>
                          {msg.text}
                        </pre>
                      )}
                    </div>
                  ))
                )}
                {loading && (
                  <p className="text-xs animate-pulse" style={{ color: '#22C55E', opacity: 0.6 }}>Processing...</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              {currentMenu ? (
                <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 border-t flex gap-2" style={{ borderColor: '#1A3A1A' }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter option..."
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                    style={{ background: '#1A3A1A', color: '#22C55E', border: '1px solid #22C55E33' }}
                    autoFocus
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
                    style={{ background: '#22C55E' }}
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              ) : (
                <div className="px-4 pb-4 pt-2">
                  <p className="text-[10px] text-center" style={{ color: '#22C55E', opacity: 0.5 }}>Session ended</p>
                </div>
              )}
            </div>

            {/* Home bar */}
            <div className="flex justify-center mt-3">
              <div className="w-16 h-1 rounded-full" style={{ background: '#6B7280' }} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={startSession}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <Hash className="w-4 h-4" /> Dial *123#
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setCurrentMenu(''); }}
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-all"
            >
              <X className="w-4 h-4" /> End Session
            </button>
          )}
        </div>

        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '1', title: 'Dial *123#', desc: 'Access Movia from any phone, no internet needed' },
            { step: '2', title: 'No Internet', desc: 'Works on all mobile networks across Rwanda' },
            { step: '3', title: 'Book & Travel', desc: 'Complete your booking entirely via USSD' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-[16px] p-5" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-3" style={{ background: '#6C63FF' }}>
                {s.step}
              </div>
              <p className="font-semibold text-[#1A1A2E] text-sm mb-1">{s.title}</p>
              <p className="text-xs text-[#6B7280]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default USSDSimulator;
