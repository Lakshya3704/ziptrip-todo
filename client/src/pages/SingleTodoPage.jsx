import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineFlag,
  HiOutlineCollection,
} from 'react-icons/hi';
import SubtaskList from '../components/SubtaskList';
import TodoForm from '../components/TodoForm';
import ConfirmDialog from '../components/ConfirmDialog';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API = `${API_BASE}/api/todos`;

const formatDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const priorityConfig = {
  low: { emoji: '🟢', label: 'Low' },
  medium: { emoji: '🟡', label: 'Medium' },
  high: { emoji: '🟠', label: 'High' },
  urgent: { emoji: '🔴', label: 'Urgent' },
};

export default function SingleTodoPage() {
  const [searchParams] = useSearchParams();
  const todoId = searchParams.get('id');

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Fetch todo
  const fetchTodo = async () => {
    if (!todoId) {
      setError('No todo ID provided');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API}/${todoId}`);
      setTodo(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Todo not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [todoId]);

  // Toggle completion
  const handleToggle = async () => {
    try {
      await axios.patch(`${API}/${todoId}/toggle`);
      toast.success(todo.completed ? 'Marked as active' : 'Marked as complete ✅');
      fetchTodo();
    } catch (err) {
      toast.error('Failed to toggle');
    }
  };

  // Update todo
  const handleUpdate = async (data) => {
    try {
      await axios.put(`${API}/${todoId}`, data);
      toast.success('Todo updated! ✏️');
      setShowEditForm(false);
      fetchTodo();
    } catch (err) {
      toast.error('Failed to update todo');
    }
  };

  // Delete todo
  const handleDelete = () => {
    setConfirmDialog({
      title: 'Delete Todo',
      message: 'Are you sure? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/${todoId}`);
          toast.success('Todo deleted');
          // Navigate back using full page reload (multi-page behavior)
          window.location.href = '/todos';
        } catch (err) {
          toast.error('Failed to delete');
        }
      },
    });
  };

  // Subtask operations
  const handleAddSubtask = async (id, title) => {
    try {
      await axios.post(`${API}/${id}/subtasks`, { title });
      toast.success('Subtask added');
      fetchTodo();
    } catch (err) {
      toast.error('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (todoId, subtaskId, completed) => {
    try {
      await axios.put(`${API}/${todoId}/subtasks/${subtaskId}`, { completed });
      fetchTodo();
    } catch (err) {
      toast.error('Failed to toggle subtask');
    }
  };

  const handleDeleteSubtask = async (todoId, subtaskId) => {
    try {
      await axios.delete(`${API}/${todoId}/subtasks/${subtaskId}`);
      toast.success('Subtask deleted');
      fetchTodo();
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  if (loading) {
    return (
      <div className="page single-todo">
        <div className="skeleton skeleton--card" style={{ height: '400px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page single-todo">
        <a href="/todos" className="back-link">
          <HiOutlineArrowLeft /> Back to All Todos
        </a>
        <div className="empty-state">
          <div className="empty-state__icon">😕</div>
          <h3 className="empty-state__title">{error}</h3>
          <p className="empty-state__text">
            The todo you're looking for doesn't exist or the ID is invalid.
          </p>
        </div>
      </div>
    );
  }

  const isOverdue = todo.dueDate && !todo.completed && new Date() > new Date(todo.dueDate);
  const pConfig = priorityConfig[todo.priority] || priorityConfig.medium;

  return (
    <div className="page single-todo">
      <a href="/todos" className="back-link">
        <HiOutlineArrowLeft /> Back to All Todos
      </a>

      <div className="single-todo__card">
        {/* Header */}
        <div className="single-todo__header">
          <h1 className={`single-todo__title ${todo.completed ? 'single-todo__title--completed' : ''}`}>
            {todo.title}
          </h1>
          <button
            className={`btn ${todo.completed ? 'btn--secondary' : 'btn--primary'} btn--sm single-todo__status-btn`}
            onClick={handleToggle}
          >
            <HiCheck />
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="single-todo__description">{todo.description}</p>
        )}

        {/* Info Grid */}
        <div className="single-todo__info-grid">
          <div className="info-item">
            <div className="info-item__label">Status</div>
            <div className="info-item__value">
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: todo.completed ? 'var(--success)' : 'var(--accent)',
                display: 'inline-block'
              }} />
              {todo.completed ? 'Completed' : 'Active'}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item__label">Priority</div>
            <div className="info-item__value">
              {pConfig.emoji} {pConfig.label}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item__label">Category</div>
            <div className="info-item__value">
              <HiOutlineCollection style={{ color: 'var(--accent)' }} />
              {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item__label">Due Date</div>
            <div className="info-item__value" style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>
              <HiOutlineCalendar style={{ color: isOverdue ? 'var(--danger)' : 'var(--info)' }} />
              {todo.dueDate ? formatDate(todo.dueDate) : 'Not set'}
              {isOverdue && <span className="todo-item__badge badge--overdue" style={{ marginLeft: '8px' }}>OVERDUE</span>}
            </div>
          </div>
        </div>

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div>
            <div className="single-todo__section-title">
              <HiOutlineTag /> Tags
            </div>
            <div className="single-todo__tags">
              {todo.tags.map((tag, i) => (
                <span key={i} className="todo-item__badge badge--tag" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subtasks */}
        <SubtaskList
          subtasks={todo.subtasks || []}
          todoId={todo._id}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />

        {/* Timestamps */}
        <div className="single-todo__dates">
          <span>
            <HiOutlineClock style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Created: {formatDateTime(todo.createdAt)}
          </span>
          <span>Updated: {formatDateTime(todo.updatedAt)}</span>
          {todo.completedAt && <span>Completed: {formatDateTime(todo.completedAt)}</span>}
        </div>

        {/* Action Buttons */}
        <div className="single-todo__actions">
          <button className="btn btn--secondary" onClick={() => setShowEditForm(true)}>
            <HiOutlinePencil /> Edit Todo
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            <HiOutlineTrash /> Delete
          </button>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <TodoForm
          initialData={todo}
          onSubmit={handleUpdate}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
