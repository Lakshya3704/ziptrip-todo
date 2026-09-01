const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true,
    maxlength: [200, 'Subtask title cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be low, medium, high, or urgent'
    },
    default: 'medium'
  },
  category: {
    type: String,
    enum: {
      values: ['personal', 'work', 'shopping', 'health', 'education', 'finance', 'other'],
      message: 'Invalid category'
    },
    default: 'personal'
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  subtasks: [subtaskSchema],
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for search functionality
todoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Index for common queries
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ category: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ createdAt: -1 });

// Virtual: check if todo is overdue
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Virtual: subtask progress
todoSchema.virtual('subtaskProgress').get(function() {
  if (this.subtasks.length === 0) return null;
  const completed = this.subtasks.filter(s => s.completed).length;
  return {
    total: this.subtasks.length,
    completed,
    percentage: Math.round((completed / this.subtasks.length) * 100)
  };
});

// Ensure virtuals are included in JSON
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

// Pre-save: set completedAt when marked complete
todoSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
