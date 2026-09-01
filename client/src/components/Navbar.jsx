import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineClipboardList, HiOutlineViewList } from 'react-icons/hi';
import { RiTodoLine } from 'react-icons/ri';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <a href="/todos" className="navbar__logo">
        <div className="navbar__logo-icon">
          <RiTodoLine />
        </div>
        ZipTrip Todo
      </a>
      <div className="navbar__nav">
        <a
          href="/todos"
          className={`navbar__link ${path === '/' || path === '/todos' ? 'navbar__link--active' : ''}`}
        >
          <HiOutlineViewList />
          All Todos
        </a>
      </div>
    </nav>
  );
}
