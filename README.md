# Kilimo Logic

Kilimo Logic is a full-stack smart maize crop prediction platform.

## Stack

- Frontend: React + Vite, React Router v6, Tailwind CSS, Axios, Recharts, Lucide React, react-hot-toast
- Backend: Django + Django REST Framework + Simple JWT
- Database: PostgreSQL
- Weather Provider: OpenWeatherMap API (called only from backend)

## Project Structure

- `frontend/` React application
- `backend/` Django project
- `.env` environment variables
- `.env.example` required environment variables template

## Required API Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/weather/?location=`
- `POST /api/predictions/`
- `GET /api/predictions/`
- `GET /api/predictions/stats/`

## Backend Setup

```bash
cd backend
/usr/bin/python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Notes

- All endpoints except register and login require `Authorization: Bearer <token>`.
- Weather API key is read from backend environment and never exposed to the frontend.
- Prediction placeholder logic is in `backend/predictions/predictor.py` and can be replaced with a trained model later.
