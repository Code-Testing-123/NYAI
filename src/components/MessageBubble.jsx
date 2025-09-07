import React from 'react';

export default function MessageBubble({ role, text }){
  const isUser = role === 'user';
  return (
    <div className={`max-w-[85%] ${isUser ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
      <div className={`inline-block px-4 py-3 rounded-2xl break-words ${isUser ? 'bg-sky-600/90' : 'bg-slate-800/80'} shadow`}>
        <div className="whitespace-pre-wrap text-sm">{text}</div>
      </div>
      <div className="text-xs text-slate-400 mt-1">{isUser ? 'You' : 'NYAI'}</div>
    </div>
  );
}
