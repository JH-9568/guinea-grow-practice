# PROMPTS.md

## General Codex Instruction

Read AGENTS.md first and follow it strictly.

Always check:
- docs/PRODUCT.md
- docs/SCREEN_FLOW.md
- docs/API_CONTRACT.md
- docs/TASKS.md
- DESIGN.md

Make surgical changes only.  
Do not rewrite unrelated files.

---

## Frontend Mock MVP Prompt

Read AGENTS.md first and follow it strictly.

Read:
- DESIGN.md
- docs/PRODUCT.md
- docs/SCREEN_FLOW.md
- docs/API_CONTRACT.md
- docs/TASKS.md

Goal:
Build the frontend mock MVP for GuineaGrow.

Success Criteria:
1. User can enter a nickname.
2. User can see a dashboard.
3. User can create a guinea pig from a source file name and lecture text.
4. User can see a guinea pig detail screen.
5. Left side shows guinea pig visual, level, XP, mood, and source file.
6. Right side shows quiz list.
7. User can open and answer quizzes one by one.
8. Correct answers increase XP and update guinea pig mood.
9. Wrong answers show explanation but do not increase XP.
10. User can generate more mock quizzes.
11. Loading, error, and empty states exist.
12. Frontend build/typecheck passes.

Constraints:
- Work only in /frontend.
- Do not modify /backend.
- Use mock data first.
- Match the API shapes in docs/API_CONTRACT.md so backend integration is easy later.
- Follow DESIGN.md, but adapt it to a cute study pet game.
- Keep the implementation simple.
- Make surgical changes only.

Before finishing:
- Run build/typecheck if available.
- Summarize changed files.
- Mention integration risks.

---

## Backend Mock API Prompt

Read AGENTS.md first and follow it strictly.

Read:
- docs/PRODUCT.md
- docs/SCREEN_FLOW.md
- docs/API_CONTRACT.md
- docs/TASKS.md

Goal:
Build the backend mock API for GuineaGrow.

Success Criteria:
1. Express server starts successfully.
2. GET /api/health works.
3. POST /api/users creates a nickname-based user.
4. POST /api/guinea-pigs creates a random baby guinea pig and 5 mock quizzes.
5. GET /api/guinea-pigs returns the user's guinea pigs.
6. GET /api/guinea-pigs/:id returns one guinea pig.
7. GET /api/guinea-pigs/:id/quizzes returns quizzes.
8. POST /api/guinea-pigs/:id/quizzes/generate adds more mock quizzes.
9. POST /api/quizzes/:id/answer checks the answer, updates quiz status, and updates guinea pig XP/mood.
10. API responses match docs/API_CONTRACT.md exactly.
11. Invalid requests return success:false and message.
12. Backend build/typecheck passes if available.

Constraints:
- Work only in /backend.
- Do not modify /frontend.
- Use in-memory storage.
- Do not add database yet.
- Do not add real authentication.
- Keep implementation simple.
- Make surgical changes only.

Before finishing:
- Run server/build/test command if available.
- Summarize endpoints implemented.
- Mention integration risks.

---

## Integration Prompt

Read AGENTS.md first and follow it strictly.

Read:
- docs/API_CONTRACT.md
- docs/SCREEN_FLOW.md
- docs/TASKS.md
- frontend/AGENTS.md
- backend/AGENTS.md

Goal:
Connect frontend and backend for the GuineaGrow MVP.

Success Criteria:
1. Frontend uses real backend endpoints.
2. Nickname user creation works.
3. Guinea pig creation works.
4. Generated quizzes appear in the detail screen.
5. Quiz answer submission updates XP, level, mood, and quiz status.
6. Generate more quizzes works.
7. Full demo flow works in the browser.

Constraints:
- Fix integration issues only.
- Do not redesign the app.
- Do not rewrite frontend or backend architecture.
- Keep API response shapes consistent with docs/API_CONTRACT.md.
- Make minimal changes.

Before finishing:
- Run frontend and backend.
- Test the main browser flow.
- Summarize remaining risks.

---

## AI Quiz Generation Prompt

Read AGENTS.md first and follow it strictly.

Goal:
Add real AI quiz generation while keeping mock fallback.

Success Criteria:
1. Backend can generate quizzes from lectureText using an AI model.
2. AI output is parsed into the exact Quiz type from docs/API_CONTRACT.md.
3. If AI generation fails, backend returns mock quizzes instead.
4. API response shape does not change.
5. No frontend changes are required.

Constraints:
- Work only in /backend unless explicitly needed.
- Do not remove mock fallback.
- Do not expose API keys in code.
- Use .env for secrets.
- Keep implementation simple.
