# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project Overview

A weather web application with a Django REST backend and a React frontend. The project is currently in early scaffolding — the Django project (`mysite`) has no custom apps yet, and the frontend is still the Vite default template.

## Commands

### Frontend (`frontend/`)

```bash
cd frontend
npm run dev      # start Vite dev server (HMR, default port 5173)
npm run build    # production build to frontend/dist/
npm run preview  # preview production build
npm run lint     # run ESLint
```

### Backend (`backend/`)

Activate the virtual environment first (PowerShell):
```powershell
backend\venv\Scripts\Activate.ps1
```

Or in Bash:
```bash
source backend/venv/Scripts/activate
```

Then run Django:
```bash
cd backend
python manage.py runserver          # dev server (default port 8000)
python manage.py migrate            # apply migrations
python manage.py makemigrations     # generate new migrations
python manage.py createsuperuser    # create admin user
```

## Architecture

```
code/
├── backend/          # Django 6 project
│   ├── manage.py
│   ├── mysite/       # Django config package (settings, urls, wsgi, asgi)
│   ├── requirements.txt
│   └── venv/         # Python virtual environment
└── frontend/         # React 19 + Vite 8 SPA
    ├── src/
    │   ├── App.jsx   # root component
    │   └── main.jsx  # entry point
    └── public/       # static assets (favicon, icon sprites)
```

**Backend**: Django project `mysite` with SQLite (`backend/db.sqlite3`). The `requirements.txt` includes `django-cors-headers==4.9.0`, which needs to be wired into `INSTALLED_APPS` and `MIDDLEWARE` in [backend/mysite/settings.py](backend/mysite/settings.py) before the frontend can reach the API.

**Frontend**: Single-page app that will communicate with the Django API. No router or state management library is installed yet.

**CORS**: When adding the first API endpoint, configure `corsheaders` in settings and set `CORS_ALLOWED_ORIGINS` to include `http://localhost:5173`.
