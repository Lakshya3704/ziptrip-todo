import React, { useState } from 'react';

const CATEGORIES = ['personal', 'work', 'shopping', 'health', 'education', 'finance', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const ASSIGNEES = [
  'Unassigned',
  'Lakshya',
  'John Doe',
  'Jane Doe',
];

export default function TodoForm({ onSubmit, onClose, initialData = null }) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || 'personal',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    tags: initialData?.tags?.join(', ') || '',
    assignedTo: initialData?.assignedTo || 'Unassigned',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be under 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || null,
      tags,
      assignedTo: formData.assignedTo,
    });
  };

  return (
    <div className="todo-form-overlay" onClick={onClose}>
      <form className="todo-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-group__label">Assign To</label>
          <select
            name="assignedTo"
            className="form-group__select"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            {ASSIGNEES.map(person => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>
        <h2 className="todo-form__title">
          {isEditing ? '✏️ Edit Todo' : '✨ Create New Todo'}
        </h2>

        <div className="form-group">
          <label className="form-group__label">Title *</label>
          <input
            type="text"
            name="title"
            className="form-group__input"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={handleChange}
            autoFocus
          />
          {errors.title && (
            <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">Description</label>
          <textarea
            name="description"
            className="form-group__textarea"
            placeholder="Add details, notes, or context..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-group__label">Priority</label>
            <select
              name="priority"
              className="form-group__select"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>
                  {p === 'low' ? '🟢 Low' : p === 'medium' ? '🟡 Medium' : p === 'high' ? '🟠 High' : '🔴 Urgent'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Category</label>
            <select
              name="category"
              className="form-group__select"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-group__label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="form-group__input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-group__input"
              placeholder="e.g. urgent, frontend, bug"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="todo-form__actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Update Todo' : 'Create Todo'}
          </button>
        </div>
      </form>
    </div>
  );
}
