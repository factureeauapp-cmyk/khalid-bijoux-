# Spring Backend

Ce dossier contient une base Spring Boot pour brancher le frontend Next.js du projet.

## Endpoints

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `POST /api/orders`
- `POST /api/contact-requests`
- `POST /api/chat/recommendations`
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
