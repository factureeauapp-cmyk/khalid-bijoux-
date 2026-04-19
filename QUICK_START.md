# Quick Start Guide - Khalid Bijoux Full-Stack

## 🚀 Start PostgreSQL
```bash
cd backend/spring-api
docker-compose up -d
```

## 🔧 Start Backend (Spring Boot)
```bash
cd backend/spring-api
mvn clean spring-boot:run
```
Backend runs on: **http://localhost:8080**

## 💻 Start Frontend (Next.js)
In a new terminal:
```bash
npm install
npm run dev
```
Frontend runs on: **http://localhost:3000**

## 🔐 Test Login
- Email: `admin@khalid-bijoux.com`
- Password: `admin123`

## 📁 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_LANGUAGE=fr
NODE_ENV=development
```

### Backend (backend/spring-api/.env)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/khalidbijoux_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
APP_JWT_SECRET=khalid-bijoux-secret-key-change-in-production-2024
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🔍 Test API Endpoints

### Get Products
```bash
curl http://localhost:8080/api/v1/products
```

### Get Categories
```bash
curl http://localhost:8080/api/v1/categories
```

### Login (Get JWT)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khalid-bijoux.com","password":"admin123"}'
```

### Get Single Product
```bash
curl http://localhost:8080/api/v1/products/1
```

## 📚 Full Documentation
See `INTEGRATION_GUIDE.md` for comprehensive documentation.

## 🐛 Troubleshooting

### PostgreSQL not starting?
- Ensure Docker is running
- Check if port 5432 is available
- Run: `docker-compose ps`

### Backend won't start?
- Ensure PostgreSQL is running first
- Check Java 17+ is installed: `java -version`
- Check Maven is installed: `mvn -version`

### Frontend can't connect to backend?
- Verify backend is running: `curl http://localhost:8080/api/v1/products`
- Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
- Check browser console for CORS errors

### Login fails?
- Verify PostgreSQL has data: Connect and check `admin` table
- Check credentials are correct
- Check JWT secret in `application.yml` matches `JwtService`

## ✨ What's Implemented

✅ PostgreSQL database with proper schema
✅ Spring Boot backend with JWT authentication
✅ Next.js frontend with API service layer
✅ i18n support (English, French, Arabic)
✅ Error handling with error codes
✅ CORS properly configured
✅ Product catalog with filtering
✅ Order management
✅ Admin authentication
✅ Clean architecture and best practices
