# Features Documentation

This document provides a comprehensive description of all features and functionalities of the ZipTrip Todo Application.

---

## Table of Contents

1. [Core CRUD Operations](#1-core-crud-operations)
2. [Multi-Page Architecture](#2-multi-page-architecture)
3. [Priority System](#3-priority-system)
4. [Category System](#4-category-system)
5. [Due Date & Overdue Detection](#5-due-date--overdue-detection)
6. [Subtasks](#6-subtasks)
7. [Tags](#7-tags)
8. [Search](#8-search)
9. [Filters](#9-filters)
10. [Sorting](#10-sorting)
11. [Bulk Actions](#11-bulk-actions)
12. [Statistics Dashboard](#12-statistics-dashboard)
13. [Keyboard Shortcuts](#13-keyboard-shortcuts)
14. [Toast Notifications](#14-toast-notifications)
15. [Confirmation Dialogs](#15-confirmation-dialogs)
16. [Responsive Design](#16-responsive-design)
17. [Loading States](#17-loading-states)
18. [Empty States](#18-empty-states)
19. [Error Handling](#19-error-handling)
20. [Form Validation](#20-form-validation)

---

## 1. Core CRUD Operations

### Create Todo
- Click the **"New Todo"** button or press **Ctrl+N** to open the create form.
- Fill in the title (required), description, priority, category, due date, and tags.
- Submit the form to create a new todo.

### Read Todos
- **List View**: All todos are displayed on the `/todos` page with metadata badges showing priority, category, due date, subtask progress, and tags.
- **Detail View**: Click the external link icon on any todo or navigate to `/todo?id=<todoId>` to see full details including description, subtasks, timestamps, and all metadata.

### Update Todo
- Click the **pencil icon** on any todo in the list to open the edit form.
- On the single todo page, click **"Edit Todo"** to modify all fields.
- Changes are saved immediately to MongoDB.

### Delete Todo
- Click the **trash icon** on any todo to delete it.
- A confirmation dialog appears before deletion to prevent accidental data loss.

---

## 2. Multi-Page Architecture

The application is built with a multi-page architecture instead of a Single Page Application (SPA):

| Page | URL | Description |
|------|-----|-------------|
| **Todos List** | `/todos` | Main page listing all todos with search, filters, and actions |
| **Single Todo** | `/todo?id=<todoId>` | Detailed view of a single todo with subtask management |

- Navigation between pages uses standard `<a>` tags (full page reloads), not client-side SPA navigation.
- The root URL `/` redirects to `/todos`.
- The single todo page receives the todo ID as a **query parameter** (`?id=...`).

---

## 3. Priority System

Each todo has a priority level with distinct visual indicators:

| Priority | Color | Visual |
|----------|-------|--------|
| **Low** | 🟢 Green (#34d399) | Green priority bar and badge |
| **Medium** | 🟡 Yellow (#fbbf24) | Yellow priority bar and badge |
| **High** | 🟠 Orange (#f97316) | Orange priority bar and badge |
| **Urgent** | 🔴 Red (#ef4444) | Red priority bar and badge |

- A colored vertical bar appears on the left side of each todo item.
- Priority badges are displayed in the todo metadata.
- Todos can be filtered by priority level.
- Default priority is **Medium**.

---

## 4. Category System

Todos can be organized into 7 predefined categories:

| Category | Use Case |
|----------|----------|
| **Personal** | Personal tasks, hobbies, lifestyle |
| **Work** | Professional tasks, meetings, deadlines |
| **Shopping** | Shopping lists, purchases |
| **Health** | Exercise, medical, wellness |
| **Education** | Learning, courses, reading |
| **Finance** | Bills, budgeting, investments |
| **Other** | Miscellaneous tasks |

- Category badges appear on each todo item.
- Todos can be filtered by category.
- Default category is **Personal**.

---

## 5. Due Date & Overdue Detection

- Each todo can have an optional **due date**.
- The due date is displayed with a clock icon in the todo metadata.
- **Overdue Detection**: If a todo is not completed and its due date has passed, it is marked as overdue with:
  - A red "OVERDUE" badge
  - A red left border on the todo item
  - Red-colored date display on the detail page
- The statistics dashboard shows the count of overdue todos and todos due today.

---

## 6. Subtasks

Each todo can have multiple subtasks for breaking down complex tasks:

- **Add Subtasks**: On the single todo detail page, type a subtask title and click "Add".
- **Toggle Completion**: Click the circular checkbox next to a subtask to toggle it.
- **Delete Subtask**: Hover over a subtask and click the trash icon to remove it.
- **Progress Bar**: A visual progress bar shows completion percentage.
- **Progress Badge**: The todo list shows a "X/Y subtasks" badge for todos with subtasks.

---

## 7. Tags

Flexible labeling system using tags:

- **Add Tags**: In the create/edit form, enter comma-separated tags (e.g., "urgent, frontend, bug").
- **Display**: Tags appear as small badges with a tag icon on both list and detail views.
- **Searchable**: Tags are included in the full-text search.
- **List Limit**: The todo list shows up to 3 tags, with a "+N" indicator for additional tags.

---

## 8. Search

Full-text search across multiple fields:

- **Search Bar**: Located at the top of the toolbar on the todos list page.
- **Fields Searched**: Title, description, and tags.
- **Debounced Input**: Search is debounced (300ms) to avoid excessive API calls.
- **Case Insensitive**: All searches are case-insensitive.
- **Combined with Filters**: Search works alongside status, priority, and category filters.

---

## 9. Filters

Multiple filter dimensions available simultaneously:

| Filter | Options |
|--------|---------|
| **Status** | All, Active, Completed |
| **Priority** | All, Low, Medium, High, Urgent |
| **Category** | All, Personal, Work, Shopping, Health, Education, Finance, Other |

- Filters are applied server-side for efficiency.
- All filters can be combined together with search.
- Changing any filter immediately updates the results.

---

## 10. Sorting

8 sort modes available:

| Sort Mode | Description |
|-----------|-------------|
| **Newest First** | Most recently created todos first (default) |
| **Oldest First** | Oldest created todos first |
| **Due Date ↑** | Earliest due date first |
| **Due Date ↓** | Latest due date first |
| **Priority ↑** | Highest priority first |
| **Priority ↓** | Lowest priority first |
| **Title A→Z** | Alphabetical ascending |
| **Title Z→A** | Alphabetical descending |

---

## 11. Bulk Actions

Two bulk operations available:

### Mark All Complete
- Marks all currently active todos as completed.
- Confirmation dialog required before execution.
- Displays the count of modified todos in a success toast.

### Clear Done (Delete Completed)
- Permanently deletes all completed todos.
- Confirmation dialog required before execution.
- Displays the count of deleted todos in a success toast.

---

## 12. Statistics Dashboard

A real-time statistics dashboard at the top of the todos list page:

| Stat | Description |
|------|-------------|
| **Total Todos** | Total count of all todos |
| **Completed** | Number of completed todos |
| **Active** | Number of active (incomplete) todos |
| **Overdue** | Number of overdue todos |
| **Due Today** | Todos due within today |
| **Done Rate** | Completion percentage |

- Stats update in real-time after any CRUD operation.
- Hover effects with glow animation on stat cards.

---

## 13. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+N** | Open the "New Todo" creation form |
| **Esc** | Close any open modal (create/edit form) |

---

## 14. Toast Notifications

Non-intrusive toast notifications appear for:
- ✅ Todo created successfully
- ✏️ Todo updated successfully
- 🗑️ Todo deleted successfully
- ✅ Todo marked as complete/active
- 📋 Subtask added/deleted
- ⚠️ Error messages for failed operations

Toasts appear in the top-right corner with a dark-themed design matching the application.

---

## 15. Confirmation Dialogs

Destructive actions require user confirmation:
- **Delete Todo**: "Are you sure you want to delete this todo?"
- **Mark All Complete**: "This will mark all active todos as completed."
- **Delete Completed**: "This will permanently delete all completed todos."

Each dialog includes:
- A warning icon
- A descriptive message
- Cancel and Confirm buttons
- Click-outside-to-dismiss behavior

---

## 16. Responsive Design

The application is fully responsive:

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (>768px)** | Full layout with side-by-side filters, hover actions |
| **Tablet (768px)** | Stacked filters, visible action buttons |
| **Mobile (<480px)** | Compact stat cards, full-width elements |

---

## 17. Loading States

- **Skeleton loaders** appear while data is being fetched.
- Skeletons mimic the shape of todo items for a polished loading experience.
- Animated pulse effect on skeleton elements.

---

## 18. Empty States

Custom empty states display when:
- **No todos exist**: "No todos yet. Click New Todo or press Ctrl+N to create your first todo!"
- **No matching results**: "No matching todos. Try adjusting your filters or search query."
- **Todo not found**: "The todo you're looking for doesn't exist or the ID is invalid."

---

## 19. Error Handling

### Backend
- **Validation errors**: Returns detailed field-level error messages.
- **Not found**: Returns 404 with descriptive message.
- **Invalid ID**: Catches Mongoose CastError for malformed ObjectIds.
- **Server errors**: Generic 500 error handler.

### Frontend
- **API errors**: Displayed as toast error messages.
- **Form validation**: Inline error messages below form fields.
- **Network errors**: Graceful degradation with error states.

---

## 20. Form Validation

### Client-side
- **Title**: Required, max 200 characters.
- Inline error messages displayed below invalid fields.
- Errors clear when the user starts typing.

### Server-side (Mongoose)
- **Title**: Required, trimmed, max 200 characters.
- **Description**: Max 2000 characters.
- **Priority**: Must be one of: low, medium, high, urgent.
- **Category**: Must be one of: personal, work, shopping, health, education, finance, other.
- **Tags**: Each tag max 50 characters.
- **Subtask title**: Required, max 200 characters.
