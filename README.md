# MitraSpeak

> **Enterprise-Grade Accessible English Language Learning Platform**  
> *Engineered for Universal Accessibility, Adult & Senior Learners, and Daily Conversational Fluency.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.21-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🚀 Key Modules & Capabilities

### 1. Interactive Lesson Engine (Spaced Repetition)
- **Accessible Flashcards:** Phonetic pronunciation guides, contextual example dialogues, and slow/clear TTS audio playback.
- **Multi-Format Exercises:** Fill-in-the-blank with large touch targets, interactive drag/click matching pairs, and sentence builder blocks.
- **Immediate Affirmative Feedback:** Contextual AI evaluation providing supportive reinforcement and practical grammar coaching.

### 2. Conversational Voice & Text Roleplay Simulator
- **Scenario Simulator:**
  - *Clinic Visit: Describing Symptoms*: Practice communicating with medical professionals, describing pain levels, and timeline of symptoms.
  - *Supermarket Checkout*: Asking for printed receipts, specifying card or cash.
  - *Building Manager Greeting*: Daily courteous morning and evening pleasantries.
- **Web Audio API Engine:** Real-time HTML5 Canvas visual waveform generator tracking audio frequency dynamics during voice practice.
- **Speech Synthesis:** Built-in `window.speechSynthesis` with variable playback speed controls (0.85x gentle pace for seniors).

### 3. Everyday Practical Curriculum Modules
- **Everyday Greetings & Courtesies:** Morning, afternoon, and evening pleasantries; polite clarifications.
- **At the Supermarket & Grocery Store:** Aisle inquiries, price confirmation, payment types, itemized receipts.
- **Visiting the Doctor & Describing Health:** Common ailments, pain scales, symptom timelines, prescription terms.
- **Dining Out & Ordering at a Restaurant:** Menus, appetizers, dietary preferences, requesting the bill.

### 4. Enterprise Admin & Telemetry Hub
- **Learner Telemetry:** Platform accuracy rates, active learning streaks, and completion analytics.
- **Error Frequency Analytics:** Diagnostic charts tracking top curriculum stumbling blocks.
- **Live Audit Trail:** Centralized logging of authentication events (`USER_LOGIN`, `USER_REGISTER`, `LESSON_COMPLETED`).

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Learner** | `learner@mitraspeak.com` | `LearnerPass123!` | Dashboard, Lessons, Voice Roleplay |
| **Admin** | `admin@mitraspeak.com` | `AdminPass123!` | Full Access + Admin Analytics & Audit Logs |

*(One-click demo buttons are available on the `/login` page for instant testing.)*

---

## 🛠️ Quick Start & Setup

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### Installation & Initialization
```bash
# 1. Install dependencies
npm install

# 2. Sync database schema & seed initial courses
npx prisma generate
npx prisma db push
node prisma/seed.js

# 3. Start the application
npm run build
npm run start
```
The application will be live at: **`http://localhost:3000`**

---

## 🧪 Verification & Automated Testing

Execute the automated end-to-end integration test suite:
```bash
node scripts/test-e2e.js
```
The test suite validates:
- Public curriculum delivery
- Lesson and exercise schema integrity
- JWT authentication, bcrypt validation, and cookie persistence
- Protected session extraction (`/api/auth/me`)
- AI evaluation logic across all exercise formats
- Conversational doctor consultation roleplay
- Learner streak and points tracking
- Role-based authorization guards on `/api/admin/*`

---

## 🛡️ Security & Hardening Architecture

1. **Authentication:** Salted bcrypt password hashing (10 rounds) and HTTP-only, secure, `SameSite: Lax` JWT cookies.
2. **Rate Limiting:** Sliding-window token bucket rate limiter on `/api/auth/*` and `/api/roleplay/*`.
3. **Security Headers (Next.js & Middleware):**
   - `Content-Security-Policy`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(self)`
4. **Input Sanitization:** Recursive XSS mitigation and Zod payload schema validation.
5. **Audit Trail:** Automatic logging of sensitive events to the `AuditLog` database table.

---

## ♿ Universal Accessibility (WCAG 2.2 AA)

- **High-Contrast Theme:** Toggleable via the navigation bar (`Sun`/`Moon` button) offering dark backgrounds with high-visibility gold typography and strong focus borders.
- **Font Scaling:** Instant cycler (`1x`, `1.5x`, `2x`) for enhanced readability for senior users.
- **Large Touch Targets:** Minimum 48px to 56px height on all interactive buttons.
- **Keyboard Navigation:** Full focus ring support with visible indicators (`focus-visible`).
