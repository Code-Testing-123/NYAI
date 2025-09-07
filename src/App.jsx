import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ChatBox from './components/ChatBox';
import MessageBubble from './components/MessageBubble';


export default function App(){
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef();

  // create or reuse session id
  useEffect(() => {
    let sid = localStorage.getItem('nyai_session');
    if(!sid){
      sid = 's_' + Math.random().toString(36).slice(2,10);
      localStorage.setItem('nyai_session', sid);
    }
    setSessionId(sid);

    // load history
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${sid}`);
        if(res.data && res.data.messages){
          setMessages(res.data.messages.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt })));
        }
      } catch (err) {
        console.warn('Could not load history', err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if(!text) return;
    // optimistic user message
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
    // purely client-side clear (server history remains)
    setMessages([]);
    localStorage.removeItem('nyai_session');
    const sid = 's_' + Math.random().toString(36).slice(2,10);
    localStorage.setItem('nyai_session', sid);
    setSessionId(sid);
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'NYAI'}: ${m.content}`).join('\\n\\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `nyai_chat_${sessionId}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <section className="bg-slate-900/50 rounded-3xl shadow-2xl p-6 min-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">NYAI — Legal Assistant</h2>
              <p className="text-sm text-slate-400">Ask about laws, bills, and regulations. Not legal advice.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportChat} className="text-sm px-3 py-1 bg-slate-800/60 rounded-md hover:bg-slate-800/80">Export</button>
              <button onClick={clearChat} className="text-sm px-3 py-1 bg-rose-600/80 rounded-md hover:bg-rose-600">New Session</button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-auto space-y-3 mb-4 pr-2">
            {messages.length === 0 && (
              <div className="text-slate-400">Start the conversation — e.g. "Summarize the new farm bill in plain language".</div>
            )}
            {messages.map((m,i) => <MessageBubble key={i} role={m.role} text={m.content} />)}
          </div>

          <ChatBox onSend={sendMessage} loading={loading} />
        </section>
      </main>

      <footer className="p-4 text-center text-slate-400">NYAI • Informational • Not legal advice</footer>
    </div>
  );
}
