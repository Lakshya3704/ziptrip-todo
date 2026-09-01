import React from 'react';

export default function TodoStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats">
      <div className="stat-card stat-card--accent">
        <div className="stat-card__value">{stats.total}</div>
        <div className="stat-card__label">Total Todos</div>
      </div>
      <div className="stat-card stat-card--success">
        <div className="stat-card__value">{stats.completed}</div>
        <div className="stat-card__label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{stats.active}</div>
        <div className="stat-card__label">Active</div>
      </div>
      <div className="stat-card stat-card--danger">
        <div className="stat-card__value">{stats.overdue}</div>
        <div className="stat-card__label">Overdue</div>
      </div>
      <div className="stat-card stat-card--warning">
        <div className="stat-card__value">{stats.dueToday}</div>
        <div className="stat-card__label">Due Today</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{stats.completionRate}%</div>
        <div className="stat-card__label">Done Rate</div>
      </div>
    </div>
  );
}
