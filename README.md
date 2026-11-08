# Z-trade Frontend

Адаптивный дашборд для `crypto_allert_api` (FastAPI).
Без авторизации. Без собственной БД. Только данные из вашего API.

## Стек
- React 18 + Vite 5 + TypeScript
- lightweight-charts v5 (TradingView)
- Чистый CSS

## Локальный запуск

    npm install
    npm run dev
    # → http://localhost:5173

Vite проксирует /api → http://127.0.0.1:8000.

## Production

    npm run build
    # → dist/

Деплой — статика в nginx, /api/ проксируется на 127.0.0.1:8000.
