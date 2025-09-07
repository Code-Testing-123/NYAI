import React from 'react';
import { NavLink } from 'react-router-dom';

export default function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-sky-800 to-indigo-800 shadow-inner z-50">
      <nav className="flex justify-around py-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-white ${isActive ? 'font-bold text-blue-300' : 'opacity-80'}`
          }
        >
          <span className="material-icons">article</span>
          <span className="text-xs">News</span>
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex flex-col items-center text-white ${isActive ? 'font-bold text-blue-300' : 'opacity-80'}`
          }
        >
          <span className="material-icons">chat</span>
          <span className="text-xs">Chat</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center text-white ${isActive ? 'font-bold text-blue-300' : 'opacity-80'}`
          }
        >
          <span className="material-icons">person</span>
          <span className="text-xs">Profile</span>
        </NavLink>
      </nav>
    </footer>
  );
}