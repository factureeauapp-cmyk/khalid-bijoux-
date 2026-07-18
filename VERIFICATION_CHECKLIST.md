# Integration Verification Checklist

Use this checklist to verify the complete integration is working correctly.

## Prerequisites
- [ ] Java 17+ installed
- [ ] Maven 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Port 5432 available (PostgreSQL)
- [ ] Port 8080 available (Backend)
- [ ] Port 3000 available (Frontend)

## Database Setup
- [ ] PostgreSQL container started: `docker-compose up -d`
- [ ] Check container running: `docker ps | grep postgres`
- [ ] Can connect to DB: `psql -U postgres -d khalidbijoux_db -h localhost`
- [ ] Check initial data loaded: `SELECT COUNT(*) FROM products;` (should be 20+)
- [ ] Admin user exists: `SELECT * FROM admin WHERE email='admin@khalid-bijoux.com';`

## Backend Verification

### Build & Start
- [ ] Maven build succeeds: `mvn clean package`
- [ ] Backend starts: `mvn spring-boot:run`
- [ ] Backend logs show: "Started KhalidBijouxApiApplication"
- [ ] No connection errors to PostgreSQL

### API Endpoints - Test with curl

#### Products (Public - No Auth Required)
```bash
# Get all products
curl http://localhost:8080/api/products
# Response: 200 OK with product list
- [ ] GET /api/products returns 200

# Get single product
curl http://localhost:8080/api/products/1
# Response: 200 OK with product details
- [ ] GET /api/products/1 returns 200

# Get categories
curl http://localhost:8080/api/categories
# Response: 200 OK with category list
- [ ] GET /api/categories returns 200

# Filter products
curl "http://localhost:8080/api/products?category=Rings&maxPrice=1000"
# Response: 200 OK with filtered products
- [ ] GET /api/products with filters returns 200
```

#### Authentication
```bash
# Login - Valid credentials
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khalid-bijoux.com","password":"admin123"}'
# Response: 200 OK with token
- [ ] Login with valid credentials returns 200 with token

# Login - Invalid credentials
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khalid-bijoux.com","password":"wrong"}'
# Response: 401 Unauthorized with error code
- [ ] Login with invalid credentials returns 401

# Login - Missing fields
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khalid-bijoux.com"}'
# Response: 400 Bad Request with validation error
- [ ] Login with missing fields returns 400
```

### Response Format Verification
- [ ] Product response includes: id, name, category, price, etc.
- [ ] Authentication response includes: token, email, expiresIn
- [ ] Error response includes: error code and message
- [ ] All responses are valid JSON

### CORS Verification
```bash
# Check CORS headers
curl -i -X OPTIONS http://localhost:8080/api/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
# Response should include CORS headers
- [ ] CORS headers present for localhost:3000
- [ ] Response includes: Access-Control-Allow-Origin
- [ ] Response includes: Access-Control-Allow-Methods
```

## Frontend Verification

### Build & Start
- [ ] npm install succeeds
- [ ] Frontend starts: `npm run dev`
- [ ] Frontend logs show: "ready - started server on 0.0.0.0:3000"
- [ ] No TypeScript errors

### Environment Configuration
- [ ] .env.local exists
- [ ] NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
- [ ] NEXT_PUBLIC_DEFAULT_LANGUAGE=fr (or en/ar)

### Pages Load
- [ ] Homepage loads: http://localhost:3000
- [ ] Shop page loads: http://localhost:3000/shop
- [ ] Products display correctly
- [ ] No console errors

### Login Flow
- [ ] Admin login page loads: http://localhost:3000/admin
- [ ] Form accepts email and password
- [ ] Submit button present and clickable

### Login Test (Browser)
1. [ ] Navigate to http://localhost:3000/admin
2. [ ] Enter email: admin@khalid-bijoux.com
3. [ ] Enter password: admin123
4. [ ] Click Login
5. [ ] Check for success message (no error)
6. [ ] Verify redirect to admin dashboard or success page
7. [ ] Open DevTools > Application > Cookies
8. [ ] Verify `kb-admin-token` cookie exists
9. [ ] Verify cookie is httpOnly (no access from JavaScript)
10. [ ] Verify cookie secure flag set (if HTTPS)

### API Integration Test
1. [ ] Open browser DevTools > Network tab
2. [ ] Perform login
3. [ ] Check POST /api/admin/login request sent
4. [ ] Verify request headers include Content-Type: application/json
5. [ ] Verify Accept-Language header sent
6. [ ] Verify response status 200
7. [ ] Verify response body includes success

### Error Handling Test
1. [ ] Go to login page
2. [ ] Try wrong password
3. [ ] Verify error message displayed
4. [ ] Check error message is in correct language
5. [ ] Verify error code handled properly

## Network Connectivity

### Frontend to Backend Communication
- [ ] Open DevTools > Network tab
- [ ] Load any page that fetches data
- [ ] Check requests to http://localhost:8080
- [ ] Verify no 404 or 500 errors
- [ ] Verify CORS headers in responses

### Check Accept-Language Header
- [ ] Open DevTools > Network tab
- [ ] Click any API request
- [ ] Verify Accept-Language header is present
- [ ] Verify value matches HTML lang attribute

## Database Integrity

### Product Data
```sql
SELECT COUNT(*) as total_products FROM products;
-- Should be 20+
- [ ] Database has products loaded

SELECT DISTINCT category FROM products ORDER BY category;
-- Should show: Bracelets, Earrings, Necklaces, Rings, Sets
- [ ] All categories present

SELECT * FROM products WHERE external_id='ring_1';
-- Should show first ring
- [ ] Can query by external_id
```

### Admin Data
```sql
SELECT * FROM admin;
-- Should show admin@khalid-bijoux.com
- [ ] Admin user exists
```

### Order Data (After creating order)
```sql
SELECT COUNT(*) FROM orders;
-- Should increase after order creation
- [ ] Orders table working

SELECT COUNT(*) FROM order_items;
-- Should match total items across orders
- [ ] Order items table working
```

## Security Verification

### Password Hashing
```sql
SELECT password FROM admin WHERE email='admin@khalid-bijoux.com';
-- Should start with $2a$ (bcrypt format)
- [ ] Passwords are bcrypt hashed
```

### JWT Token
1. [ ] Visit https://jwt.io
2. [ ] Decode the JWT token from cookie
3. [ ] Verify payload contains email as subject
4. [ ] Verify exp claim is in future
5. [ ] Verify iat claim is recent

### HTTPS Security Headers (Production)
- [ ] Secure flag on cookies (production only)
- [ ] SameSite=Lax on cookies
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY

## i18n Verification

### Language Support
1. [ ] Change browser language to French
2. [ ] Reload page
3. [ ] Verify error messages appear in French
4. [ ] Check Accept-Language header is fr

### Message Keys
```
- [ ] INVALID_CREDENTIALS translates properly
- [ ] MISSING_FIELDS translates properly
- [ ] VALIDATION_ERROR translates properly
```

## Performance Verification

### Response Times
- [ ] GET /api/products responds in < 500ms
- [ ] GET /api/categories responds in < 200ms
- [ ] POST /api/auth/login responds in < 1000ms

### Database Queries
- [ ] Check backend logs for SQL query times
- [ ] Verify no N+1 query problems
- [ ] Check for missing database indexes

## Production Readiness

### Configuration
- [ ] JWT secret is different from default
- [ ] Database password is not 'postgres'
- [ ] CORS only allows production domain
- [ ] HTTPS enabled
- [ ] Environment variables used for secrets

### Logging
- [ ] Backend logs are structured
- [ ] Error stack traces logged
- [ ] Request/response logged (without sensitive data)
- [ ] Database queries logged (development only)

### Error Handling
- [ ] No stack traces in error responses
- [ ] Error codes used instead of messages
- [ ] Sensitive information not exposed
- [ ] Consistent error response format

## Additional Tests

### Load Testing (Optional)
```bash
# Use Apache Bench or wrk
ab -n 100 -c 10 http://localhost:8080/api/products
- [ ] Server handles concurrent requests
```

### Database Connection Pool
- [ ] Check connection pool is configured
- [ ] Monitor connection pool size
- [ ] No connection leaks

### Error Scenarios
- [ ] Database offline → proper error message
- [ ] Backend offline → frontend shows error
- [ ] Network timeout → proper error handling
- [ ] Invalid token → redirect to login
- [ ] Expired token → prompt to re-login

## Sign-Off

- [ ] All checks completed
- [ ] No critical issues found
- [ ] System ready for testing
- [ ] System ready for deployment (with production config)

**Date Verified**: _______________
**Verified By**: _______________
**Notes**: _______________

---

## Troubleshooting Checklist

If any check fails:

### Backend Issues
- [ ] Check PostgreSQL is running: `docker ps`
- [ ] Check backend logs for errors
- [ ] Verify application.yml configuration
- [ ] Check database credentials
- [ ] Restart backend: `mvn spring-boot:run`

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests
- [ ] Verify .env.local configuration
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Restart frontend: `npm run dev`

### Database Issues
- [ ] Check container logs: `docker logs khalidbijoux-postgres`
- [ ] Check available disk space
- [ ] Verify database didn't run out of connections
- [ ] Restart container: `docker-compose restart postgres`

### Network Issues
- [ ] Check firewall allows port 5432, 8080, 3000
- [ ] Verify VPN not blocking connections
- [ ] Test connection: `curl http://localhost:8080/api/categories`
- [ ] Check for proxy interfering with requests
