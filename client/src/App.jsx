import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import TodosListPage from './pages/TodosListPage';
import SingleTodoPage from './pages/SingleTodoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#e8e8f0',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#1a1a2e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/todos" element={<TodosListPage />} />
        <Route path="/todo" element={<SingleTodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
