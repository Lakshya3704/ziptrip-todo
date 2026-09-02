# ZipTrip Todo Application

A full-stack, feature-rich Todo application built with **React** (multi-page), **Node.js/Express**, and **MongoDB**.

## 🌐 Live Deployment

- 🚀 **Frontend / Client Live App:** [https://client-one-swart-72.vercel.app/todos](https://client-one-swart-72.vercel.app/todos)
- ⚙️ **Backend API Server:** [https://server-eta-orcin-90.vercel.app/](https://server-eta-orcin-90.vercel.app/)
- 🩺 **API Health Check:** [https://server-eta-orcin-90.vercel.app/api/health](https://server-eta-orcin-90.vercel.app/api/health)


## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Styling** | Vanilla CSS (Dark Theme, Glassmorphism) |
| **Routing** | React Router v6 (Multi-page with full page reloads) |

## 📁 Project Structure

```
ZipTRip/
├── server/                     # Backend Express API
│   ├── config/db.js            # MongoDB connection
│   ├── models/Todo.js          # Mongoose Todo schema
│   ├── routes/todos.js         # CRUD + Bulk API routes
│   ├── middleware/errorHandler.js # Error handling middleware
│   ├── server.js               # Express entry point
│   └── .env                    # Environment variables
├── client/                     # Frontend React App
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   ├── TodoStats.jsx
│   │   │   ├── SubtaskList.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── TodosListPage.jsx
│   │   │   └── SingleTodoPage.jsx
│   │   ├── App.jsx             # Root with routing
│   │   ├── main.jsx            # React entry
│   │   └── index.css           # Complete design system
│   ├── vite.config.js          # Vite + proxy config
│   └── index.html              # HTML template
├── README.md                   # This file
├── FEATURES.md                 # Detailed feature documentation
├── API.md                      # API endpoint documentation
└── .gitignore
```

## 🏃 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **MongoDB Atlas** connection (or local MongoDB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lakshya3704/ziptrip-todo.git
   cd ziptrip-todo
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables:**
   Create a `server/.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Start the backend server:**
```bash
cd server
npm run dev
```
The API server runs on `http://localhost:5000`.

**Start the frontend (in a separate terminal):**
```bash
cd client
npm run dev
```
The React app runs on `http://localhost:3000` and proxies API requests to the backend.

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** — Comprehensive feature documentation
- **[API.md](./API.md)** — REST API endpoint reference

## ✨ Key Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Priority levels (Low, Medium, High, Urgent) with color coding
- ✅ Categories (Personal, Work, Shopping, Health, Education, Finance, Other)
- ✅ Due dates with overdue detection
- ✅ Subtasks with progress tracking
- ✅ Tags for flexible labeling
- ✅ Full-text search across titles, descriptions, tags
- ✅ Advanced filters (status, priority, category)
- ✅ Multiple sort options (8 sort modes)
- ✅ Bulk actions (Mark all complete, Delete completed)
- ✅ Statistics dashboard
- ✅ Keyboard shortcuts (Ctrl+N, Esc)
- ✅ Multi-page architecture (not SPA)
- ✅ Premium dark UI with glassmorphism
- ✅ Responsive design (mobile + desktop)
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Loading skeletons
- ✅ Empty state displays

## 🎨 Design

The application features a premium dark theme with:
- Glassmorphism effects (frosted glass backgrounds)
- Animated gradient backgrounds
- Smooth micro-animations and transitions
- Color-coded priority indicators
- Inter font family (Google Fonts)
- Custom scrollbar styling
- Responsive grid layouts

## 📝 License

This project was built as part of the ZipTrip Tech Challenge.
