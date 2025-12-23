# TeamSync 🚀

**The Minimalist, High-Performance Task Manager for Modern Teams.**

TeamSync is a cross-platform mobile application designed to eliminate "Status Ambiguity." Built with a React Native frontend and a NestJS backend, it focuses on real-time collaboration, quality-controlled workflows, and a clutter-free mobile experience.

---

## 🌟 Key Features

- **Real-Time Sync:** Instant task updates across all team devices using WebSockets.
- **Quality Workflows:** Integrated "Under Review" and "Recheck" statuses to ensure work meets standards before completion.
- **Focus Mode:** A distraction-free UI designed for deep work and ADHD-friendly task management.
- **Offline Support:** View and manage tasks even without an internet connection; syncs automatically when back online.
- **Smart Notifications:** No more notification spam. Updates are bundled into meaningful digests.

---

## 🏗️ Technical Stack

### Frontend (Mobile)

- **Framework:** React Native (Expo/CLI)
- **State Management:** Zustand (Lightweight & Fast)
- **UI Components:** Tamagui (Optimized for performance)
- **Navigation:** React Navigation

### Backend (Server)

- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL with TypeORM
- **Real-time:** Socket.io (Gateways)
- **Auth:** JWT with Refresh Token rotation

---

## 📂 Project Structure

```text
TeamSync/
├── mobile/             # React Native App (Frontend)
│   ├── src/
│   │   ├── components/ # Reusable UI atoms
│   │   ├── screens/    # App pages (Home, Project, Task)
│   │   ├── store/      # Zustand state management
│   │   └── services/   # API & WebSocket clients
├── backend/            # NestJS API (Backend)
│   ├── src/
│   │   ├── auth/       # Authentication logic
│   │   ├── tasks/      # Task & Status management
│   │   ├── projects/   # Workspace & Project logic
│   │   └── gateaway/   # WebSocket implementation for real-time
└── docs/               # Requirement documents & UI Assets
```
