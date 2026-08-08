# Mindcare

Accessible, mobile-first mental-wellbeing information site built with React, Vite, and Express.

## Run locally

```bash
npm install
npm run dev       # frontend at http://localhost:5173
npm start         # API at http://localhost:3000
```

Set `VITE_API_URL` for a separately deployed API, and configure `CHATBOT_API_KEY` and `NEWS_API_KEY` on the API host. Never expose those keys in frontend environment variables.

## Performance and deployment

- Vite fingerprinted assets receive one-year immutable cache headers via `public/_headers` and `vercel.json`.
- API GET responses are CDN-cacheable for five minutes with stale-while-revalidate support.
- Images have explicit dimensions, lazy loading, and an eager hero image to limit layout shift and improve LCP.
- Deploy the static build with `npm run build`; configure a CDN for `/assets/*` and point `/api/*` to the Express service.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
