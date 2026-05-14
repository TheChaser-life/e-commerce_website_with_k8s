# API Documentation

Base URL when using Ingress:

```text
http://shopnow.local
```

## User Service

Service port:

```text
user-service:8080
```

### Get Users

```http
GET /users
```

Example:

```bash
curl http://shopnow.local/users
```

### Register

```http
POST /users/register
Content-Type: application/json
```

Body:

```json
{
  "username": "demo",
  "email": "demo@example.com",
  "password": "123456"
}
```

Example:

```bash
curl -X POST http://shopnow.local/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"123456"}'
```

### Login

```http
POST /users/login
Content-Type: application/json
```

Body:

```json
{
  "username": "demo",
  "password": "123456"
}
```

Successful response:

```text
Login successful
```

## Product Service

Service port:

```text
product-service:8081
```

### Get Products

```http
GET /products
```

### Get Product by ID

```http
GET /products/{id}
```

### Create Product

```http
POST /products
Content-Type: application/json
```

Body:

```json
{
  "name": "Laptop",
  "description": "Development laptop",
  "price": 1200.0
}
```

Example:

```bash
curl -X POST http://shopnow.local/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"Development laptop","price":1200.0}'
```

## Order Service

Service port:

```text
order-service:8082
```

### Get Orders

```http
GET /orders
```

### Get Order by ID

```http
GET /orders/{id}
```

### Create Order

```http
POST /orders
Content-Type: application/json
```

Body:

```json
{
  "userId": 1,
  "productIds": "1,2",
  "total": 2400.0
}
```

Example:

```bash
curl -X POST http://shopnow.local/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productIds":"1,2","total":2400.0}'
```

