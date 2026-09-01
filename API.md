# API Documentation

Base URL: `http://localhost:5000/api`

---

## Table of Contents

1. [Health Check](#health-check)
2. [List Todos](#list-todos)
3. [Get Todo Statistics](#get-todo-statistics)
4. [Get Single Todo](#get-single-todo)
5. [Create Todo](#create-todo)
6. [Update Todo](#update-todo)
7. [Delete Todo](#delete-todo)
8. [Toggle Todo Completion](#toggle-todo-completion)
9. [Add Subtask](#add-subtask)
10. [Update Subtask](#update-subtask)
11. [Delete Subtask](#delete-subtask)
12. [Bulk: Mark All Complete](#bulk-mark-all-complete)
13. [Bulk: Delete Completed](#bulk-delete-completed)

---

## Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## List Todos

```
GET /api/todos
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | - | Search in title, description, tags (case-insensitive) |
| `status` | string | `all` | Filter by status: `all`, `active`, `completed` |
| `priority` | string | `all` | Filter by priority: `all`, `low`, `medium`, `high`, `urgent` |
| `category` | string | `all` | Filter by category: `all`, `personal`, `work`, etc. |
| `sort` | string | `newest` | Sort mode: `newest`, `oldest`, `dueDateAsc`, `dueDateDesc`, `priorityHigh`, `priorityLow`, `titleAsc`, `titleDesc` |
| `page` | number | `1` | Page number for pagination |
| `limit` | number | `50` | Items per page |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "priority": "medium",
      "category": "shopping",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "tags": ["errands", "weekly"],
      "subtasks": [
        {
          "_id": "64f...",
          "title": "Get milk",
          "completed": false,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "completedAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isOverdue": false,
      "subtaskProgress": {
        "total": 1,
        "completed": 0,
        "percentage": 0
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

---

## Get Todo Statistics

```
GET /api/todos/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "completed": 10,
    "active": 15,
    "overdue": 3,
    "dueToday": 2,
    "recentlyCompleted": 5,
    "completionRate": 40,
    "byPriority": {
      "low": 5,
      "medium": 10,
      "high": 7,
      "urgent": 3
    },
    "byCategory": {
      "personal": 8,
      "work": 12,
      "shopping": 5
    }
  }
}
```

---

## Get Single Todo

```
GET /api/todos/:id
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the todo |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "medium",
    "category": "shopping",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "tags": ["errands"],
    "subtasks": [],
    "completedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "isOverdue": false,
    "subtaskProgress": null
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

## Create Todo

```
POST /api/todos
```

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "category": "shopping",
  "dueDate": "2024-12-31",
  "tags": ["errands", "weekly"],
  "subtasks": [
    { "title": "Get milk" },
    { "title": "Get eggs" }
  ]
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ Yes | - | Todo title (max 200 chars) |
| `description` | string | No | `""` | Detailed description (max 2000 chars) |
| `priority` | string | No | `"medium"` | `low`, `medium`, `high`, `urgent` |
| `category` | string | No | `"personal"` | `personal`, `work`, `shopping`, `health`, `education`, `finance`, `other` |
| `dueDate` | string | No | `null` | ISO date string |
| `tags` | string[] | No | `[]` | Array of tag strings |
| `subtasks` | object[] | No | `[]` | Array of `{ title: string }` |

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Update Todo

```
PUT /api/todos/:id
```

**Request Body:** Same fields as Create (all optional).

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Delete Todo

```
DELETE /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Todo deleted successfully"
}
```

---

## Toggle Todo Completion

```
PATCH /api/todos/:id/toggle
```

Toggles the `completed` field between `true` and `false`. Automatically sets/clears `completedAt`.

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Add Subtask

```
POST /api/todos/:id/subtasks
```

**Request Body:**
```json
{
  "title": "Get milk"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Update Subtask

```
PUT /api/todos/:id/subtasks/:subtaskId
```

**Request Body:**
```json
{
  "completed": true,
  "title": "Updated subtask title"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Delete Subtask

```
DELETE /api/todos/:id/subtasks/:subtaskId
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Bulk: Mark All Complete

```
PATCH /api/todos/bulk/complete
```

Marks all active (incomplete) todos as completed.

**Response:**
```json
{
  "success": true,
  "message": "Marked 5 todos as complete",
  "modifiedCount": 5
}
```

---

## Bulk: Delete Completed

```
DELETE /api/todos/bulk/completed
```

Permanently deletes all completed todos.

**Response:**
```json
{
  "success": true,
  "message": "Deleted 3 completed todos",
  "deletedCount": 3
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error description",
  "messages": ["Field-specific error message"]
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error / Bad request |
| `404` | Resource not found |
| `500` | Internal server error |
