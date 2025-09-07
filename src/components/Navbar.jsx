import React from 'react';

export default function Navbar(){
  return (
    <header className="bg-gradient-to-r from-sky-700 to-indigo-700 text-white p-4 shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center font-bold">NY</div>
          <div>
            <div className="text-lg font-semibold">NYAI</div>
            <div className="text-xs opacity-90">Legal assistant & news summarizer</div>
          </div>
        </div>
        <div className="text-sm opacity-90">Explain laws • Cite sources • Not legal advice</div>
      </div>
    </header>
  );
}
