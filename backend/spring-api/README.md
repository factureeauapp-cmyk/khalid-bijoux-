# Spring Backend

Ce dossier contient une base Spring Boot pour brancher le frontend Next.js du projet.

## Endpoints

- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `GET /api/v1/categories`
- `POST /api/v1/orders`
- `POST /api/v1/contact-requests`
- `POST /api/v1/chat/recommendations`
- `GET /actuator/health`

## Lancer le backend

Il faut Maven installé localement, puis:

```bash
cd backend/spring-api
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`.

## CORS

Le frontend Next.js en local (`http://localhost:3000`) est déjà autorisé.

## Remarque importante

Le frontend actuel mélange deux modèles produits:

- `lib/data.ts`
- `data/products.ts`

Pour une intégration complète, il faudra choisir une seule source métier et faire pointer toutes les pages dessus.
