# Adloom — Creator-Business Promotion Marketplace

Adloom is a full-stack web marketplace connecting **Content Creators & Influencers** with **Businesses & Brands** for targeted promotional deals and marketing campaigns, featuring milestone-based escrow protection and real-time chat.

---

## ⚡ Quick Start (Run in Root Directory)

```bash
# 1. Install all dependencies (root, server, client)
npm run install:all

# 2. Seed database with realistic demo data (creators, campaigns, deals, reviews)
npm run seed

# 3. Start both backend (port 5000) & frontend (port 5173) concurrently
npm run dev
```

---

## 📁 Project Structure

```
/
├── package.json              → Root runner scripts (concurrently client + server)
├── client/                   → React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── components/       → Navbar, Footer, Modals, CreatorCards, Badges
│   │   ├── context/          → AuthContext, SocketContext, NotificationContext
│   │   ├── pages/            → Home, BrowseCreators, CreatorDetail, Deals, Admin...
│   │   └── utils/            → Axios instance with JWT interceptors
│   └── package.json
└── server/                   → Node.js + Express + MongoDB Atlas + Socket.io
    ├── config/               → Database connection
    ├── models/               → Mongoose schemas (User, CreatorProfile, Requirement, Deal...)
    ├── controllers/          → Auth, creators, requirements, deals, chat, admin
    ├── middleware/           → JWT auth, roles guard, Multer upload
    ├── routes/               → Express REST API routes
    ├── utils/                → Realistic database seeder
    └── server.js             → HTTP + Socket.io Server
```

---

## 🔑 Demo Logins (1-Click Switcher Available in Top Navbar)

| Persona | Email | Password | Role / Details |
| :--- | :--- | :--- | :--- |
| **Creator** | `creator@adloom.com` | `password123` | **Alex Vance** (Tech Reviewer & AI Creator, 385k Reach) |
| **Business** | `business@adloom.com` | `password123` | **Apex Audio Gear** (Audio Brand, Headphone Launch Campaigns) |
| **Admin** | `admin@adloom.com` | `password123` | **Platform Administrator** (Analytics, Moderation, User Directory) |

---

## 🚀 Available Scripts in Root

- `npm run dev` — Starts both frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) concurrently.
- `npm run dev:client` — Runs only the Vite frontend dev server.
- `npm run dev:server` — Runs only the Express backend server with nodemon.
- `npm run seed` — Populates MongoDB Atlas with realistic demo creators, campaigns, deals, and ratings.
- `npm run build` — Builds the optimized frontend bundle for production.
