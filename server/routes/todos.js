const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// ============================================================
// GET /api/todos — List all todos with search, filter, sort, pagination
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      status,     // 'all' | 'active' | 'completed'
      priority,   // 'low' | 'medium' | 'high' | 'urgent'
      category,
      sort = '-createdAt', // Default: newest first
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status === 'active') query.completed = false;
    if (status === 'completed') query.completed = true;

    // Priority filter
    if (priority && priority !== 'all') query.priority = priority;

    // Category filter
    if (category && category !== 'all') query.category = category;

    // Build sort object
    const sortMap = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'dueDateAsc': { dueDate: 1 },
      'dueDateDesc': { dueDate: -1 },
      'priorityHigh': { priority: -1 },
      'priorityLow': { priority: 1 },
      'titleAsc': { title: 1 },
      'titleDesc': { title: -1 }
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [todos, total] = await Promise.all([
      Todo.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Todo.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: todos,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// GET /api/todos/stats — Get aggregated statistics
// ============================================================
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalCount,
      completedCount,
      activeCount,
      overdueCount,
      priorityCounts,
      categoryCounts
    ] = await Promise.all([
      Todo.countDocuments(),
      Todo.countDocuments({ completed: true }),
      Todo.countDocuments({ completed: false }),
      Todo.countDocuments({
        completed: false,
        dueDate: { $lt: new Date(), $ne: null }
      }),
      Todo.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Todo.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    // Recent activity: todos completed in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyCompleted = await Todo.countDocuments({
      completed: true,
      completedAt: { $gte: sevenDaysAgo }
    });

    // Due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueToday = await Todo.countDocuments({
      completed: false,
      dueDate: { $gte: today, $lt: tomorrow }
    });

    res.json({
      success: true,
      data: {
        total: totalCount,
        completed: completedCount,
        active: activeCount,
        overdue: overdueCount,
        dueToday,
        recentlyCompleted,
        completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        byPriority: priorityCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byCategory: categoryCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// GET /api/todos/:id — Get single todo
// ============================================================
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// POST /api/todos — Create a new todo
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, tags, subtasks } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
      tags: tags || [],
      subtasks: subtasks || []
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// PUT /api/todos/:id — Update a todo
// ============================================================
router.put('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    // Update fields
    const allowedFields = ['title', 'description', 'completed', 'priority', 'category', 'dueDate', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        todo[field] = req.body[field];
      }
    });

    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// DELETE /api/todos/:id — Delete a todo
// ============================================================
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    res.json({ success: true, data: {}, message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// PATCH /api/todos/:id/toggle — Toggle completion status
// ============================================================
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// POST /api/todos/:id/subtasks — Add a subtask
// ============================================================
router.post('/:id/subtasks', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    todo.subtasks.push({ title: req.body.title });
    await todo.save();

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// PUT /api/todos/:id/subtasks/:subtaskId — Toggle/update subtask
// ============================================================
router.put('/:id/subtasks/:subtaskId', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    const subtask = todo.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        error: 'Subtask not found'
      });
    }

    if (req.body.title !== undefined) subtask.title = req.body.title;
    if (req.body.completed !== undefined) subtask.completed = req.body.completed;

    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// DELETE /api/todos/:id/subtasks/:subtaskId — Delete a subtask
// ============================================================
router.delete('/:id/subtasks/:subtaskId', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    const subtask = todo.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        error: 'Subtask not found'
      });
    }

    subtask.deleteOne();
    await todo.save();

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// DELETE /api/todos/bulk/completed — Delete all completed todos
// ============================================================
router.delete('/bulk/completed', async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed todos`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// PATCH /api/todos/bulk/complete — Mark all active todos as complete
// ============================================================
router.patch('/bulk/complete', async (req, res, next) => {
  try {
    const result = await Todo.updateMany(
      { completed: false },
      { completed: true, completedAt: new Date() }
    );
    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} todos as complete`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
