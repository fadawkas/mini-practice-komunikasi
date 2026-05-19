# Mini Practice Komunikasi Internal

Aplikasi mini practice untuk melatih komunikasi internal yang baik, menggunakan OpenRouter AI untuk generate soal dan scoring.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **AI**: OpenRouter (deepseek/deepseek-v4-flash)

## Cara Menjalankan

### Prasyarat

- Docker & Docker Compose installed

### Setup

1. Copy `.env.example` ke `.env` dan isi `OPENROUTER_API_KEY`:
   ```bash
   cp .env.example .env
   # Edit .env, isi OPENROUTER_API_KEY dengan key kamu
   ```

2. Jalankan Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Buka di browser:
   - **Practice**: http://localhost:5173/practice/komunikasi-internal-2026
   - **Admin**: http://localhost:5173/admin
   - **Backend API**: http://localhost:8000
   - **Swagger Docs**: http://localhost:8000/docs

## Endpoints API

### Practice
- `POST /api/practice/start` — Mulai practice (generate contoh komunikasi buruk)
- `POST /api/practice/submit` — Submit jawaban dan dapatkan skor

### Admin
- `GET /api/admin/submissions` — Semua submission
- `GET /api/admin/ranking` — Ranking peserta
- `GET /api/admin/top-three` — Top 3 peserta
- `DELETE /api/admin/submissions` — Hapus semua submission

## Struktur Project

```
mini-practice-komunikasi/
├── docker-compose.yml
├── .env / .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── routers/
│       │   ├── practice.py
│       │   └── admin.py
│       └── services/
│           └── openrouter_service.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── pages/
        ├── components/
        └── lib/