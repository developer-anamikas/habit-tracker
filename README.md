# Habit-Tracker

A minimal web app to track daily habits and build consistency

## Contents

- [Installation](#installation--setup)
- [How to run](#how-to-run)
- [How to contribute](CONTRIBUTING.md)

---

## Tech Stack

- Frontend: `React`
- Server: `Express`
- Database: `MongoDB`
- Auth: `JWT` + `Google OAuth 2.0`

## ✅ Feature TODOs\*

Features planned for the app are listed below; check boxes track progress.

### 🔐 Authentication

- [x] User signup
- [x] User login
- [x] JWT authentication
- [x] Protected routes
- [x] Google OAuth 2.0 login

### 📝 Habit Management

- [x] Create habit
- [x] View all habits
- [x] Edit habit
- [x] Delete habit

### ✅ Daily Tracking

- [x] Mark habit as completed
- [x] Prevent multiple completions per day
- [x] Store completion history

### 📊 Progress Tracking

- [x] Show current streak
- [x] Show last completed date
- [x] Calculate completion percentage

### 🎨 Optional Enhancements

- [x] Dark / Light mode
- [x] Filter habits
- [x] Sort habits
- [x] Dashboard summary
- [x] Calendar view
- [x] Notifications / reminders

## Installation & Setup

### Requirements

- Node.js: `^22.14.0`
- Google OAuth 2.0 Credentials (for Google login feature)

### Environment Variables Setup

#### Backend (`server/.env`)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
# ... other env variables
```

#### Frontend (`web/.env`)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3000
```

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5173`
5. Copy your **Client ID** and add it to both `.env` files

```bash
# 1. Clone the repo
git clone https://github.com/quantum2code/habit-tracker

cd habit-tracker

# 2. Install dependencies
npm install
```

## How to Run

```bash
# Dev mode
# 1. web client
npm run dev:web

# 2. server
npm run dev:server
```

## Project structure

```text
habit-tracker/
├── web/
├── server/
├── package.json
└── README.md
```

#### _For any query ask us on our discord channel_
