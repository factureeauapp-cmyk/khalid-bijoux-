# Integration Spring + Next.js

## Ce qui a été préparé

- Une API Spring Boot dans `backend/spring-api`
- Un endpoint de recommandations chat: `POST /api/v1/chat/recommendations`
- Un proxy Next.js configurable vers Spring pour le chat

## Variable d'environnement

Dans Next.js, définir:

```env
SPRING_API_BASE_URL=http://localhost:8080
```

## Mapping conseillé côté frontend

- `app/shop/page.tsx` -> `GET /api/v1/products`
- `app/product/[id]/page.tsx` -> `GET /api/v1/products/{id}`
- `app/checkout/page.tsx` -> `POST /api/v1/orders`
- `app/contact/page.tsx` -> `POST /api/v1/contact-requests`
- `app/api/chat/route.ts` -> `POST /api/v1/chat/recommendations`

## Étape suivante recommandée

Remplacer progressivement les imports statiques `PRODUCTS` par des appels API centralisés dans `lib/`.
