# Match Reminder (working name)

A lightweight football reminder platform that notifies users before their selected teams play.

No accounts. No noise. Just match reminders.

---

## 🚀 Core Idea

Users:
1. Enter email
2. Verify via magic link
3. Select up to 5 teams
4. Receive match reminders before kickoff

---

## ⚡ Key Features (MVP)

- Email-based authentication (magic link)
- Team selection (max 5)
- Match dashboard (next fixtures)
- Email reminders:
  - 24 hours before match
  - 1 hour before match
  - Kickoff reminder
- Simple settings page

---

## 🧭 User Flow

1. `/email` → Enter email
2. Verify via magic link
3. `/teams` → Select favorite teams (if first time)
4. `/dashboard` → View upcoming matches
5. `/settings` → Manage notifications

---

## 🖥️ Screens

- Email Onboarding
- Team Selection
- Dashboard
- Settings
- Empty State (no teams selected)

---

## 🏗️ Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + DB)
- Resend (Email service)
- Football API (fixtures data)

---

## 🧪 Development Phases

### Phase 1: UI (NO backend)
- Static screens
- Dummy data
- Fully responsive UI

### Phase 2: Auth
- Supabase magic link login
- Session handling

### Phase 3: Core Logic
- Team selection persistence
- Dashboard data mapping

### Phase 4: Notifications
- Scheduled email reminders
- Fixture-based triggers

---

## 📦 Project Structure

- `/app` → routes
- `/components` → reusable UI
- `/lib` → helpers + dummy data
- `/services` → API + Supabase logic

---
