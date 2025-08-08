# 🤖 Slack Connect

A full-stack web application that enables users to **send** and **schedule messages** to their Slack channels using **Slack OAuth 2.0** and real-time token management. Built with **TypeScript**, **React**, **Express**, and **MongoDB**.

---

## 🧩 Table of Contents

- [📦 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🔧 Setup Instructions](#-setup-instructions)
- [🏗 Architectural Overview](#-architectural-overview)
- [🚧 Challenges & Learnings](#-challenges--learnings)
- [📸 Screenshots](#-screenshots)
- [📜 License](#-license)

---

## 📦 Features

- 🔐 Slack OAuth 2.0 user authentication
- 💬 Send messages to channels instantly
- 🕒 Schedule messages for future delivery
- 📡 Auto-refresh expired tokens using refresh token
- 📜 View and manage (cancel/delete) scheduled messages
- 📚 Clean and responsive frontend using React + Tailwind

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Slack Web API (OAuth v2)
- Node-cron (for scheduled task runner)

---

## 🔧 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/TROGER-VU/slack-connect.git
cd slack-connect
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env example
PORT=5000
MONGODB_URI=your_mongo_connection_string
FRONTEND_URL=http://localhost:5173
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_REDIRECT_URI=http://localhost:5000/auth/slack/callback
```

Start the backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env example
VITE_BACKEND_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Now visit: `http://localhost:5173` in your browser.

---

### 4️⃣ Slack App Configuration

1. Go to [Slack API Dashboard](https://api.slack.com/apps)
2. Create a new app from scratch
3. Enable **OAuth & Permissions**
4. Add these **user scopes**:

   ```
   chat:write
   channels:read
   groups:read
   im:write
   mpim:read
   ```
5. Set **redirect URL** to:

   ```
   http://localhost:5000/auth/slack/callback
   ```
6. Save the credentials (Client ID, Secret) in the backend `.env` file

---

## 🏗 Architectural Overview

### 🔐 OAuth Flow

1. On login, user is redirected to Slack for authorization.
2. Slack redirects back to `/auth/slack/callback` with an authorization code.
3. The backend exchanges this code for an access token and refresh token.
4. These tokens, along with `team_id` and `user_id`, are stored in MongoDB.

### 🔁 Token Management

* The app stores Slack tokens in the `UserToken` collection.
* Before any API call (send or schedule), it checks if the token is expired.
* If expired, it uses the **refresh token** to obtain a new access token.

### ⏱ Scheduled Messages

* Messages are saved to a `ScheduledMessage` collection with a timestamp.
* A background `cron` job runs every 10 seconds to check for due messages.
* If due, the message is posted using the user’s valid access token and marked as sent.

---

## 🧠 Challenges & Learnings
### 1. OAuth 2.0 & Slack User Scopes
When first integrating Slack OAuth, I noticed that Slack did not return a refresh_token, which blocked token rotation and long-term authentication.

🔍 Learning: I explored the difference between bot scopes and user scopes, and discovered that Slack returns refresh_token only with user scopes and when the app supports token rotation.

✅ Resolution: I updated the user_scope in the Slack app to include necessary permissions (chat:write, channels:read, groups:read, im:write, mpim:read) and enabled token rotation in the Slack dashboard.

### 2. Message Scheduling Logic & Time Zones
While implementing scheduled messages, I faced inconsistencies between local time input from users and Slack's UTC requirement.

🔍 Learning: Slack requires post_at timestamps in UTC, and any deviation would result in incorrect scheduling.

✅ Resolution: I converted all dates using Date.toISOString() and ensured backend parsing with Date.parse() to maintain a consistent UTC-based flow. This helped me deeply understand how to deal with time zone normalization when working with external APIs.

### 3. Access to All Channel Types
Initially, only public channels were visible during channel selection.

🔍 Learning: Slack separates permissions for public and private spaces. Access to private channels, DMs, and multi-person DMs requires additional user scopes.

✅ Resolution: I added groups:read, im:write, and mpim:read to the OAuth scope, allowing users to select from all available conversation types.

### 4. Environment Variables on Render
On first deploy to Render, the app failed due to an undefined MongoDB URI.

🔍 Learning: Render does not use your local .env file and requires manual addition of env vars via its dashboard.

✅ Resolution: I added all critical env vars (MONGO_URI, SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, etc.) in the Render settings panel, ensuring successful deployment.

---


## 📜 License

This project is licensed under the **MIT License**.

---

> ✨ Built with love by [Ayush Gupta](https://github.com/TROGER-VU) for Refold Assignment.
