import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineCheckCircle, HiOutlineTrash } from 'react-icons/hi';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoStats from '../components/TodoStats';
import ConfirmDialog from '../components/ConfirmDialog';
import { TODOS_API as API } from '../config/api';

export default function TodosListPage() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Keyboard shortcut for new todo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditingTodo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (sortBy) params.append('sort', sortBy);

      const res = await axios.get(`${API}?${params.toString()}`);
      setTodos(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data.data);
    } catch (err) {
      // Stats are optional, no error toast
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [fetchTodos, fetchStats]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Create todo
  const handleCreate = async (data) => {
    try {
      await axios.post(API, data);
      toast.success('Todo created! ✨');
      setShowForm(false);
      fetchTodos();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.messages?.[0] || 'Failed to create todo');
    }
  };

  // Update todo
  const handleUpdate = async (data) => {
    try {
      await axios.put(`${API}/${editingTodo._id}`, data);
      toast.success('Todo updated! ✏️');
      setEditingTodo(null);
      fetchTodos();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.messages?.[0] || 'Failed to update todo');
    }
  };

  // Toggle completion
  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API}/${id}/toggle`);
      fetchTodos();
      fetchStats();
    } catch (err) {
      toast.error('Failed to toggle todo');
    }
  };

  // Delete todo
  const handleDelete = (id) => {
    setConfirmDialog({
      title: 'Delete Todo',
      message: 'Are you sure you want to delete this todo? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/${id}`);
          toast.success('Todo deleted 🗑️');
          setConfirmDialog(null);
          fetchTodos();
          fetchStats();
        } catch (err) {
          toast.error('Failed to delete todo');
        }
      }
    });
  };

  // Edit todo
  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  // Bulk: Mark all complete
  const handleMarkAllComplete = () => {
    setConfirmDialog({
      title: 'Mark All Complete',
      message: 'This will mark all active todos as completed. Continue?',
      confirmText: 'Mark All',
      confirmVariant: 'primary',
      onConfirm: async () => {
        try {
          const res = await axios.patch(`${API}/bulk/complete`);
          toast.success(`${res.data.modifiedCount} todos marked complete ✅`);
          setConfirmDialog(null);
          fetchTodos();
          fetchStats();
        } catch (err) {
          toast.error('Failed to mark all complete');
        }
      }
    });
  };

  // Bulk: Delete completed
  const handleDeleteCompleted = () => {
    setConfirmDialog({
      title: 'Delete Completed',
      message: 'This will permanently delete all completed todos. Continue?',
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API}/bulk/completed`);
          toast.success(`Deleted ${res.data.deletedCount} completed todos 🗑️`);
          setConfirmDialog(null);
          fetchTodos();
          fetchStats();
        } catch (err) {
          toast.error('Failed to delete completed');
        }
      }
    });
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">My Todos</h1>
        <p className="page__subtitle">
          Organize your tasks, boost your productivity • <kbd style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>Ctrl+N</kbd> to add new
        </p>
      </div>

      {/* Stats Dashboard */}
      <TodoStats stats={stats} />

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <HiOutlineSearch className="search-box__icon" />
          <input
            type="text"
            className="search-box__input"
            placeholder="Search todos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🟠 High</option>
          <option value="urgent">🔴 Urgent</option>
        </select>

        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>

        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="dueDateAsc">Due Date ↑</option>
          <option value="dueDateDesc">Due Date ↓</option>
          <option value="priorityHigh">Priority ↑</option>
          <option value="priorityLow">Priority ↓</option>
          <option value="titleAsc">Title A→Z</option>
          <option value="titleDesc">Title Z→A</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="toolbar">
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          <HiOutlinePlus /> New Todo
        </button>
        <div className="bulk-actions">
          <button className="btn btn--secondary btn--sm" onClick={handleMarkAllComplete}>
            <HiOutlineCheckCircle /> Complete All
          </button>
          <button className="btn btn--danger btn--sm" onClick={handleDeleteCompleted}>
            <HiOutlineTrash /> Clear Done
          </button>
        </div>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="todo-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton--card" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <h3 className="empty-state__title">
            {search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'No matching todos'
              : 'No todos yet'
            }
          </h3>
          <p className="empty-state__text">
            {search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Click "New Todo" or press Ctrl+N to create your first todo!'
            }
          </p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <TodoForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
      {editingTodo && (
        <TodoForm
          initialData={editingTodo}
          onSubmit={handleUpdate}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          confirmVariant={confirmDialog.confirmVariant}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
