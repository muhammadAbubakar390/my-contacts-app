# My Contacts App

A full-stack contacts management application built with **React** (frontend) and **Node.js/Express + MongoDB** (backend).

## 🗂️ Project Structure

```
my-contacts-app/
├── src/                  # React frontend
│   ├── Contacts.js       # Main contacts component
│   ├── Contacts.css      # Styles
│   ├── App.js
│   └── index.js
├── backend/              # Express backend
│   ├── server.js         # API server
│   ├── package.json
│   └── .env.example      # Environment variable template
├── public/
├── package.json          # Frontend dependencies
└── vercel.json           # Vercel deployment config
```

## ✨ Features

- 📇 View all contacts in a card grid layout
- ➕ Add new contacts (saved to localStorage)
- 💾 Save contacts to MongoDB via REST API
- ✏️ Edit contacts (local or API)
- 🗑️ Delete contacts (local or API)
- 🔄 Three contact types: Initial (read-only), Local, API

## 🚀 Getting Started (Local Development)

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start frontend (runs on http://localhost:3000)
npm start
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Then edit .env with your MongoDB URI

# Start backend (runs on http://localhost:5000)
npm start
```

## 🌐 Deploying to Vercel

### Prerequisites
- A [Vercel](https://vercel.com) account
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster

### Steps

1. **Push your code to GitHub**
2. **Import the repository on Vercel**
3. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI` → Your MongoDB Atlas connection string
4. **Deploy!**

> ⚠️ **Important:** Never commit your `.env` file. Use `.env.example` as a template.

## 🛠️ Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | React 19, CSS                |
| Backend   | Node.js, Express             |
| Database  | MongoDB (Mongoose)           |
| Hosting   | Vercel                       |

## 📡 API Endpoints

| Method | Route               | Description         |
|--------|---------------------|---------------------|
| GET    | `/api/contacts`     | Get all contacts    |
| POST   | `/api/contacts`     | Create new contact  |
| PUT    | `/api/contacts/:id` | Update a contact    |
| DELETE | `/api/contacts/:id` | Delete a contact    |
| GET    | `/api/health`       | Server health check |
