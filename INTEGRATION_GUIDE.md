# Full-Stack Integration Guide - Khalid Bijoux

## Overview

This document provides a comprehensive guide for integrating the Khalid Bijoux system with:
- **Frontend**: Next.js with React (TypeScript)
- **Backend**: Spring Boot (Java 17)
- **Database**: PostgreSQL (Docker)
- **Authentication**: JWT-based

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ├─ Pages & Components                                      │
│  ├─ API Service Layer (/lib/api)                           │
│  └─ i18n Error Handling                                     │
└─────────────┬───────────────────────────────────────────────┘
              │ HTTP/CORS
              ├─ /api/auth/** (Public)
              ├─ /api/products/** (Public)
              ├─ /api/categories (Public)
              └─ /api/orders (Protected with JWT)
              │
┌─────────────┴───────────────────────────────────────────────┐
│                   Backend (Spring Boot)                      │
│  ├─ Controllers                                             │
│  ├─ Services                                                │
│  ├─ Repositories (JPA)                                      │
│  ├─ Entities (JPA)                                          │
│  ├─ Security (JWT + Spring Security)                        │
│  └─ Exception Handling with i18n                            │
└─────────────┬───────────────────────────────────────────────┘
              │ JDBC
┌─────────────┴───────────────────────────────────────────────┐
│         Database (PostgreSQL - Docker)                       │
│  ├─ products table                                          │
│  ├─ admin table                                             │
│  ├─ orders table                                            │
│  └─ order_items table                                       │
└─────────────────────────────────────────────────────────────┘
```

## Database Setup

### Prerequisites
- Docker installed
- Docker Compose installed

### Start PostgreSQL
```bash
cd backend/spring-api
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `khalidbijoux_db`
- User: `postgres`
- Password: `postgres`

### Database Initialization

The backend will automatically:
1. Create tables using Hibernate (ddl-auto: update)
2. Seed initial data from `data.sql`

Initial data includes:
- 20+ products in various categories (Rings, Earrings, Necklaces, Bracelets, Sets)
- Default admin user: `admin@khalid-bijoux.com`
- Default password: `admin123` (bcrypt hashed)

## Backend Setup

### 1. Prerequisites
- Java 17+
- Maven 3.8+

### 2. Configure Environment
Copy and update `.env.example`:
```bash
cp backend/spring-api/.env.example backend/spring-api/.env
```

Key environment variables:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/khalidbijoux_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
APP_JWT_SECRET=khalid-bijoux-secret-key-change-in-production-2024
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Build & Run

**Maven Build:**
```bash
cd backend/spring-api
mvn clean package
mvn spring-boot:run
```

**Using Maven directly:**
```bash
mvn clean spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Configure Environment
Copy and update `.env.example`:
```bash
cp .env.example .env.local
```

Key environment variables:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NODE_ENV=development
NEXT_PUBLIC_DEFAULT_LANGUAGE=fr
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication (Public)
- `POST /api/auth/login` - Login with email/password
  - Request: `{ "email": "admin@khalid-bijoux.com", "password": "admin123" }`
  - Response: `{ "token": "...", "email": "...", "expiresIn": 28800000 }`

### Products (Public)
- `GET /api/products` - List products with filters
  - Query params: `category`, `search`, `maxPrice`, `tag`
- `GET /api/products/:id` - Get product by ID
- `GET /api/categories` - List product categories

### Orders (Protected)
- `POST /api/orders` - Create new order
  - Headers: `Authorization: Bearer {token}`
  - Request body: OrderRequest with customer, address, items

## Authentication Flow

### Login Process
1. User submits email/password in login form
2. Frontend sends `POST /api/auth/login` to backend
3. Backend validates credentials against PostgreSQL (bcrypt)
4. Backend returns JWT token
5. Frontend stores JWT in httpOnly cookie
6. Cookie is automatically sent with all requests

### Protected Requests
```typescript
// Example: Creating an order
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData),
});
```

## Error Handling & i18n

### Backend Error Response Format
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Frontend Error Translation
The frontend translates error codes to user messages based on language:
- English: Generic fallback
- French: `messages_fr.properties`
- Arabic: `messages_ar.properties`

Example:
```typescript
import { getErrorMessage } from '@/lib/error-messages';

const errorMessage = getErrorMessage('INVALID_CREDENTIALS', 'fr');
// Returns: "Email ou mot de passe incorrect"
```

## Environment-Specific Configuration

### Development
- `ddl-auto: update` - Automatically update schema
- `show-sql: true` - Log SQL queries
- CORS allows `http://localhost:3000`
- JWT secret can be default

### Production
- `ddl-auto: validate` - Validate schema exists
- `show-sql: false` - Don't log SQL
- CORS allows production domain only
- Use strong JWT secret from environment
- Use environment variables for all secrets
- Enable HTTPS
- Use separate database credentials

## Testing the Integration

### 1. Start PostgreSQL
```bash
cd backend/spring-api
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend/spring-api
mvn spring-boot:run
```

Test backend: `curl http://localhost:8080/api/categories`

### 3. Start Frontend
```bash
npm run dev
```

Test frontend: `http://localhost:3000`

### 4. Test Login Flow
1. Navigate to admin login page
2. Use credentials:
   - Email: `admin@khalid-bijoux.com`
   - Password: `admin123`
3. Should receive JWT token and redirect
4. Token stored in `kb-admin-token` cookie

### 5. Test API Calls
```bash
# Get products
curl http://localhost:8080/api/products

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khalid-bijoux.com","password":"admin123"}'

# Create order (with token)
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @order-payload.json
```

## Troubleshooting

### Backend Issues

**PostgreSQL Connection Error**
- Ensure Docker container is running: `docker ps`
- Check credentials in `application.yml`
- Verify port 5432 is accessible

**JWT Validation Failed**
- Ensure `APP_JWT_SECRET` is set consistently
- Check token hasn't expired (8 hours default)
- Clear cookies and re-login

**CORS Error**
- Verify `http://localhost:3000` is in `allowed-origins`
- Check `Accept-Language` header is sent from frontend

### Frontend Issues

**API Call Fails with 404**
- Verify backend is running on port 8080
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Test with `curl http://localhost:8080/api/categories`

**Login Not Working**
- Check browser console for errors
- Verify credentials in database
- Check httpOnly cookie is being set

**i18n Messages Not Appearing**
- Check language is set in HTML lang attribute
- Verify `Accept-Language` header is sent
- Fallback to English if message key not found

## Security Considerations

1. **JWT Secret**: Change in production
2. **Password Hashing**: Uses bcrypt with salt
3. **CORS**: Restrict to production domain
4. **HTTPS**: Required for production
5. **Cookie Security**: httpOnly, Secure, SameSite flags
6. **Database Credentials**: Use environment variables
7. **Validation**: All inputs validated server-side

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  external_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  original_price INT,
  material VARCHAR(255),
  tag VARCHAR(255),
  description VARCHAR(1000),
  image VARCHAR(255)
);
```

### Admin Table
```sql
CREATE TABLE admin (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  email VARCHAR(255),
  shipping_street VARCHAR(255),
  shipping_city VARCHAR(255),
  shipping_state VARCHAR(255),
  shipping_postal_code VARCHAR(255),
  shipping_country VARCHAR(255),
  payment_method VARCHAR(255) NOT NULL,
  subtotal INT NOT NULL,
  shipping INT NOT NULL,
  tax INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  selected_size VARCHAR(255),
  price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## Next Steps

1. **Deployment**:
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Deploy backend to cloud (AWS, GCP, etc.)
   - Deploy frontend to Vercel or similar

2. **Additional Features**:
   - Admin dashboard for order management
   - Email notifications
   - Payment gateway integration
   - Product reviews and ratings

3. **Performance Optimization**:
   - Add database indexing
   - Implement caching (Redis)
   - CDN for static assets
   - Database query optimization

4. **Monitoring & Logging**:
   - Implement structured logging
   - Add application monitoring (New Relic, DataDog)
   - Set up error tracking (Sentry)
   - Database monitoring
