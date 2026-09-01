import React, { useState } from 'react';
import { HiCheck, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function SubtaskList({ subtasks, todoId, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    onAddSubtask(todoId, newSubtask.trim());
    setNewSubtask('');
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const progress = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div>
      <div className="single-todo__section-title">
        📋 Subtasks ({completedCount}/{subtasks.length})
      </div>

      {subtasks.length > 0 && (
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="subtask-list">
        {subtasks.map((subtask) => (
          <div key={subtask._id} className="subtask-item">
            <button
              className={`subtask-item__checkbox ${subtask.completed ? 'subtask-item__checkbox--checked' : ''}`}
              onClick={() => onToggleSubtask(todoId, subtask._id, !subtask.completed)}
            >
              {subtask.completed && <HiCheck />}
            </button>
            <span className={`subtask-item__title ${subtask.completed ? 'subtask-item__title--completed' : ''}`}>
              {subtask.title}
            </span>
            <button
              className="todo-item__action-btn todo-item__action-btn--danger subtask-item__delete"
              onClick={() => onDeleteSubtask(todoId, subtask._id)}
              title="Delete subtask"
            >
              <HiOutlineTrash />
            </button>
          </div>
        ))}
      </div>

      <form className="add-subtask" onSubmit={handleAdd}>
        <input
          type="text"
          className="add-subtask__input"
          placeholder="Add a subtask..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
        />
        <button type="submit" className="btn btn--primary btn--sm">
          <HiOutlinePlus /> Add
        </button>
      </form>
    </div>
  );
}
