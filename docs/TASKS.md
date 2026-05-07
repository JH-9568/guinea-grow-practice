# TASKS.md

## Owner Rules

Since this is a solo practice project, one developer may complete all tasks.  
However, tasks are still tagged by area to keep Codex focused.

- [DOCS] Documentation
- [FE] Frontend
- [BE] Backend
- [INT] Integration
- [AI] AI quiz generation
- [POLISH] UI/UX polish

---

## Phase 0. Setup

- [x] [DOCS] Create project folder structure
- [x] [DOCS] Add DESIGN.md from getdesign.md
- [ ] [DOCS] Complete AGENTS.md
- [ ] [DOCS] Complete PRODUCT.md
- [ ] [DOCS] Complete SCREEN_FLOW.md
- [ ] [DOCS] Complete API_CONTRACT.md
- [ ] [DOCS] Complete TASKS.md
- [ ] [DOCS] Complete PROMPTS.md

---

## Phase 1. Frontend Mock MVP

- [ ] [FE] Create React Vite TypeScript app in /frontend
- [ ] [FE] Implement start screen with nickname input
- [ ] [FE] Implement dashboard screen
- [ ] [FE] Implement create guinea pig screen
- [ ] [FE] Implement guinea pig detail screen
- [ ] [FE] Implement quiz list panel
- [ ] [FE] Implement quiz solving modal
- [ ] [FE] Implement guinea pig XP bar and level display
- [ ] [FE] Implement guinea pig visual states: idle, happy, sad, levelup
- [ ] [FE] Implement generate more quizzes button
- [ ] [FE] Use mock data before backend integration
- [ ] [FE] Add loading, error, and empty states

---

## Phase 2. Backend Mock API

- [ ] [BE] Create Express TypeScript app in /backend
- [ ] [BE] Implement GET /api/health
- [ ] [BE] Implement POST /api/users
- [ ] [BE] Implement GET /api/guinea-pigs
- [ ] [BE] Implement POST /api/guinea-pigs
- [ ] [BE] Implement GET /api/guinea-pigs/:id
- [ ] [BE] Implement GET /api/guinea-pigs/:id/quizzes
- [ ] [BE] Implement POST /api/guinea-pigs/:id/quizzes/generate
- [ ] [BE] Implement POST /api/quizzes/:id/answer
- [ ] [BE] Add random guinea pig attribute generator
- [ ] [BE] Add mock quiz generator
- [ ] [BE] Add XP and level calculation
- [ ] [BE] Add request validation
- [ ] [BE] Use in-memory storage

---

## Phase 3. Integration

- [ ] [INT] Connect frontend API client to backend
- [ ] [INT] Create user from frontend
- [ ] [INT] Create guinea pig from frontend
- [ ] [INT] Show generated quizzes after guinea pig creation
- [ ] [INT] Submit quiz answer from frontend
- [ ] [INT] Update guinea pig XP and mood after answer
- [ ] [INT] Generate more quizzes from frontend
- [ ] [INT] Test full demo flow in browser

---

## Phase 4. AI Quiz Generation

- [ ] [AI] Add AI quiz generation service
- [ ] [AI] Create prompt for lecture-note-based quiz generation
- [ ] [AI] Parse AI JSON response safely
- [ ] [AI] Add fallback mock quiz generation when AI fails
- [ ] [AI] Keep API response shape identical to API_CONTRACT.md

---

## Phase 5. Polish

- [ ] [POLISH] Improve guinea pig visual design
- [ ] [POLISH] Add simple eating/happy animation
- [ ] [POLISH] Add level-up animation
- [ ] [POLISH] Improve empty states
- [ ] [POLISH] Improve mobile layout
- [ ] [POLISH] Update README with run instructions