import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterNav from './components/FooterNav';
import ChatBox from './components/ChatBox';
import MessageBubble from './components/MessageBubble';
import News from './pages/News';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef();

  // create or reuse session id
  useEffect(() => {
    let sid = localStorage.getItem('nyai_session');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('nyai_session', sid);
    }
    setSessionId(sid);

    // load history
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${sid}`);
        if (res.data && res.data.messages) {
          setMessages(res.data.messages.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt })));
        }
      } catch (err) {
        console.warn('Could not load history', err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', content: text, createdAt: new Date().toISOString() }]);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: text, sessionId });
      const reply = res.data?.reply || 'NYAI: (no response)';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, createdAt: new Date().toISOString() }]);
    } catch (err) {
      console.error('Send failed', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not get response. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    localStorage.removeItem('nyai_session');
    const sid = 's_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('nyai_session', sid);
    setSessionId(sid);
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'NYAI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `nyai_chat_${sessionId}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-2 w-full">
          <Routes>
            <Route path="/" element={<News />} />
            <Route path="/chat" element={
              <section className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 mt-8 mb-8 flex flex-col border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">NYAI — Legal Assistant</h2>
                    <p className="text-sm text-slate-300 mt-1">Ask about laws, bills, and regulations.<br />Not legal advice.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportChat}
                      className="text-sm px-4 py-2 bg-slate-800/80 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Export
                    </button>
                    <button
                      onClick={clearChat}
                      className="text-sm px-4 py-2 bg-rose-600/90 text-white rounded-lg hover:bg-rose-700 transition"
                    >
                      New Session
                    </button>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  className="flex-1 overflow-auto space-y-4 mb-4 pr-2 max-h-[55vh] custom-scrollbar"
                  style={{ minHeight: '300px' }}
                >
                  {messages.length === 0 && (
                    <div className="text-slate-400 text-center mt-10">
                      Start the conversation — <span className="italic">e.g. "Summarize the new farm bill in plain language".</span>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <MessageBubble key={i} role={m.role} text={m.content} />
                  ))}
                </div>

                <ChatBox onSend={sendMessage} loading={loading} />
              </section>
            } />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <FooterNav />
      </div>
    </Router>
  );
}
