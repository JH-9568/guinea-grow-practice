# AGENTS.md

## Project Context

This project is GuineaGrow, a web-based study game.

GuineaGrow turns each lecture file or lecture note into a virtual guinea pig.  
The user grows the guinea pig by solving AI-generated quizzes based on that lecture material.

This is a practice project for AI-agent-based development.  
Prioritize a working MVP, clear UX, and simple maintainable code.

## Core Documents

Before implementation, read these files:

- docs/PRODUCT.md
- docs/SCREEN_FLOW.md
- docs/API_CONTRACT.md
- docs/TASKS.md
- DESIGN.md

## Agent Principles

### 1. Think Before Coding

- Understand the task before editing files.
- Check the relevant docs before making changes.
- Do not silently invent requirements.
- If there are multiple possible implementations, choose the smallest MVP-safe one.

### 2. Simplicity First

- Build the minimum working solution.
- Do not add unnecessary libraries.
- Do not over-engineer architecture.
- Do not create abstractions for one-time use.
- Prefer readable code over clever code.

### 3. Surgical Changes

- Modify only files required for the task.
- Do not refactor unrelated code.
- Do not rename routes, folders, or components unless explicitly requested.
- Keep frontend code in /frontend.
- Keep backend code in /backend.
- If API changes are needed, update docs/API_CONTRACT.md first.

### 4. Goal-Driven Execution

Before finishing any task:

- Run the relevant build, test, or typecheck command if available.
- Verify implementation against docs/API_CONTRACT.md.
- Summarize changed files.
- Mention remaining risks or missing pieces.

## Tech Direction

Frontend:
- React
- TypeScript
- Vite
- CSS or Tailwind if already configured

Backend:
- Node.js
- Express
- TypeScript preferred
- In-memory storage for MVP

AI:
- Start with mock quiz generation.
- Add real AI quiz generation later.
- Always keep a fallback mock generator so the demo does not break.

## Forbidden

- Do not add payment.
- Do not add complex authentication.
- Do not add OAuth unless explicitly requested.
- Do not add a database before the in-memory MVP works.
- Do not rewrite the entire project.
- Do not copy brand logos or exact proprietary UI from reference designs.
