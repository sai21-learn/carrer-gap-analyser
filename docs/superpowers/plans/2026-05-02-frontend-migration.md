# Frontend Migration & Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ] syntax for tracking.

**Goal:** Initialize a Next.js frontend, set up authentication with NextAuth.js, and create a dashboard for skill tracking.

**Architecture:** Next.js (App Router), Tailwind CSS for styling, Lucide-React for icons, and NextAuth.js for session management. Communicates with the FastAPI backend.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Shadcn UI (optional/simplified components), NextAuth.js.

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx`

- [ ] **Step 1: Scaffold Next.js app structure**
Create `frontend/` directory and initialize with basic `package.json`.

```json
{
  "name": "career-compass-ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.330.0",
    "next-auth": "^4.24.5",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1"
  }
}
```

- [ ] **Step 2: Setup Tailwind & Layout**
Create `frontend/app/layout.tsx` with a global container and standard font.

- [ ] **Step 3: Create Landing Page**
Create a simple `frontend/app/page.tsx` with a "Get Started" button.

- [ ] **Step 4: Commit**

```bash
git checkout -b feat/frontend-dashboard
git add frontend/
git commit -m "chore: initialize next.js frontend project"
```

---

### Task 2: Authentication with NextAuth.js

**Files:**
- Create: `frontend/app/api/auth/[...nextauth]/route.ts`
- Create: `frontend/components/auth/LoginButton.tsx`

- [ ] **Step 1: Configure Credentials Provider**
Setup NextAuth to send credentials to `http://localhost:8000/auth/token`.

```typescript
// frontend/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:8000/auth/token", {
          method: 'POST',
          body: new URLSearchParams(credentials),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        const user = await res.json()
        if (res.ok && user) return user
        return null
      }
    })
  ]
})
export { handler as GET, handler as POST }
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/api/auth/
git commit -m "feat: set up nextauth credentials provider with backend integration"
```

---

### Task 3: User Dashboard Layout

**Files:**
- Create: `frontend/app/dashboard/layout.tsx`
- Create: `frontend/app/dashboard/page.tsx`
- Create: `frontend/components/dashboard/Sidebar.tsx`

- [ ] **Step 1: Build Sidebar and Topbar**
Create a responsive layout for the dashboard with navigation links (Overview, Skills, Analysis, History).

- [ ] **Step 2: Create Dashboard Overview**
Add summary cards for "Current Match Score", "Analyzed Jobs", and "Top Skill Gaps".

- [ ] **Step 3: Commit**

```bash
git add frontend/app/dashboard/ frontend/components/dashboard/
git commit -m "feat: implement dashboard layout and overview page"
```

---

### Task 4: Skill Visualization Components

**Files:**
- Create: `frontend/components/ui/ProgressBar.tsx`
- Create: `frontend/components/dashboard/SkillCard.tsx`

- [ ] **Step 1: Create a reusable SkillCard**
Displays skill name, proficiency level (matched/partial/gap), and a link to roadmap.sh.

- [ ] **Step 2: Commit**

```bash
git add frontend/components/ui/ frontend/components/dashboard/SkillCard.tsx
git commit -m "feat: add skill visualization components"
```
