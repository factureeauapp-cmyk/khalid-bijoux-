# Integration Spring + Next.js

## Ce qui a été préparé

- Une API Spring Boot dans `backend/spring-api`
- Un endpoint de recommandations chat: `POST /api/chat/recommendations`
- Un proxy Next.js configurable vers Spring pour le chat

## Variable d'environnement



## Mapping conseillé côté frontend

- `app/shop/page.tsx` -> `GET /api/products`
- `app/product/[id]/page.tsx` -> `GET /api/products/{id}`
- `app/checkout/page.tsx` -> `POST /api/orders`
- `app/contact/page.tsx` -> `POST /api/contact-requests`
- `app/api/chat/route.ts` -> `POST /api/chat/recommendations`

## Étape suivante recommandée

Remplacer progressivement les imports statiques `PRODUCTS` par des appels API centralisés dans `lib/`.
