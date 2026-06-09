# AGENTS.md

This file defines development rules, architecture decisions, and constraints for building the Match Reminder application.

---

# 🎯 Product Principles

- Keep the product extremely simple
- Optimize for "time to first reminder"
- No unnecessary features before MVP
- Dashboard is the core product
- Email is the only identity system

---

# 🧭 Core User Flow

1. User enters email (/email)
2. Magic link authentication (Supabase)
3. If new user → redirect to /teams
4. If existing user → /dashboard
5. User selects teams (max 5)
6. System generates match reminders

---

# 🧱 Architecture Rules

## Frontend
- Next.js App Router only
- Server components where possible
- Client components only for interactivity

## Backend
- Supabase for:
  - Auth
  - User storage
  - Team selections
- External football API for fixtures

## Email System
- Resend for all outbound emails
- No other communication channels in MVP

---

# 🧪 Development Phases

## Phase 1 — UI First (Fake Data Only)
- Build all screens using dummy data
- No API calls
- No auth
- No DB

## Phase 2 — Auth Layer
- Supabase magic link login
- Session persistence

## Phase 3 — Core Data
- Persist selected teams
- Load fixtures dynamically

## Phase 4 — Notifications
- Cron job or scheduled function
- Email reminders based on match kickoff time

---

# 📁 Folder Structure Rules

---

# 🧩 UI Rules

- Dark mode only
- Card-based layout
- Mobile-first design
- Maximum 5 teams per user
- Dashboard = primary screen
- No sidebars
- Bottom navigation only

---

# 📊 Data Rules

- Users identified ONLY by email
- No usernames
- No passwords
- No social login in MVP

---

# ⏱️ Reminder Logic

- 24h before match → email
- 1h before match → email
- kickoff → email

Each reminder must be idempotent (no duplicates).

---

# 🚫 Anti-Patterns (DO NOT DO)

- Do not add live chat
- Do not add news feeds
- Do not add fantasy features
- Do not add betting integrations
- Do not overbuild dashboard complexity

---

# 🧠 Decision Rule

If a feature does not help:

> "User gets reminded about matches faster or more reliably"

Do not build it.