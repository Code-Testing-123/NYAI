import React, { useState } from 'react';

export default function ChatBox({ onSend, loading }){
  const [text, setText] = useState('');

  const submit = (e) => {
    e?.preventDefault();
    if(!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={submit} className="flex gap-3 items-center">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ask NYAI about a law, bill, or regulation..."
        className="flex-1 bg-slate-800/60 px-4 py-3 rounded-lg focus:outline-none"
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-60" disabled={loading}>
        {loading ? 'Waiting...' : 'Send'}
      </button>
    </form>
  );
}
