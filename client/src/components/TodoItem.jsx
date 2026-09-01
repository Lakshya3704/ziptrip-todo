import React from 'react';
import { HiCheck, HiOutlineTrash, HiOutlinePencil, HiOutlineExternalLink, HiOutlineClock, HiOutlineTag } from 'react-icons/hi';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dateStr, completed) => {
  if (!dateStr || completed) return false;
  return new Date() > new Date(dateStr);
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const overdue = isOverdue(todo.dueDate, todo.completed);

  return (
    <div className={`todo-item ${todo.completed ? 'todo-item--completed' : ''} ${overdue ? 'todo-item--overdue' : ''}`}>
      {/* Priority indicator bar */}
      <div className={`todo-item__priority-bar todo-item__priority-bar--${todo.priority}`} />

      {/* Checkbox */}
      <button
        className={`todo-item__checkbox ${todo.completed ? 'todo-item__checkbox--checked' : ''}`}
        onClick={() => onToggle(todo._id)}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && <HiCheck />}
      </button>

      {/* Content */}
      <div className="todo-item__content">
        <div className="todo-item__title">{todo.title}</div>
        <div className="todo-item__meta">
          {/* Priority badge */}
          <span className={`todo-item__badge badge--priority-${todo.priority}`}>
            {todo.priority}
          </span>

          {/* Category badge */}
          <span className="todo-item__badge badge--category">
            {todo.category}
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span className={`todo-item__badge ${overdue ? 'badge--overdue' : 'badge--due'}`}>
              <HiOutlineClock style={{ fontSize: '0.75rem' }} />
              {overdue ? 'Overdue: ' : ''}{formatDate(todo.dueDate)}
            </span>
          )}

          {/* Subtasks progress */}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <span className="todo-item__badge badge--subtasks">
              {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length} subtasks
            </span>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="todo-item__badge badge--tag">
              <HiOutlineTag style={{ fontSize: '0.65rem' }} />
              {tag}
            </span>
          ))}
          {todo.tags && todo.tags.length > 3 && (
            <span className="todo-item__badge badge--tag">+{todo.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="todo-item__actions">
        <a
          href={`/todo?id=${todo._id}`}
          className="todo-item__action-btn todo-item__action-btn--view"
          title="View details"
        >
          <HiOutlineExternalLink />
        </a>
        <button
          className="todo-item__action-btn"
          onClick={() => onEdit(todo)}
          title="Edit"
        >
          <HiOutlinePencil />
        </button>
        <button
          className="todo-item__action-btn todo-item__action-btn--danger"
          onClick={() => onDelete(todo._id)}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
}
