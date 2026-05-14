# E-commerce Website with Kubernetes

Project cá nhân mô phỏng một hệ thống e-commerce dạng microservices. Ứng dụng gồm frontend React, ba backend service Spring Boot, MySQL database, Helm charts để deploy lên Kubernetes/Minikube và GitHub Actions để build, push, deploy tự động.

## Features

- Đăng ký tài khoản và đăng nhập qua `user-service`.
- Xem danh sách sản phẩm qua `product-service`.
- API đơn hàng qua `order-service`.
- Frontend React truy cập qua domain local `shopnow.local`.
- Kubernetes Ingress route request tới frontend/backend theo path.
- CI/CD tự động build Docker image, push Docker Hub và redeploy bằng Helm.

## Tech Stack

- Frontend: React 18, React Router, Axios
- Backend: Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security
- Database: MySQL
- Container: Docker
- Orchestration: Kubernetes, Minikube
- Deployment: Helm, Bitnami MySQL chart
- CI/CD: GitHub Actions, Docker Hub, self-hosted runner

## Architecture

```text
Browser
  |
  | http://shopnow.local
  v
Ingress NGINX
  |
  +-- /             -> frontend:80 -> React pod:3000
  +-- /users        -> user-service:8080
  +-- /products     -> product-service:8081
  +-- /orders       -> order-service:8082
                         |
                         v
                      mysql:3306
```

Backend services connect to MySQL through Kubernetes service DNS:

```text
jdbc:mysql://mysql:3306/ecommerce
```

## Repository Structure

```text
backend/
  user-service/
  product-service/
  order-service/
frontend/
helm/
  frontend-chart/
  user-service-chart/
  product-service-chart/
  order-service-chart/
  mysql-chart/
.github/workflows/
  build-push-deploy.yml
docs/
```

## Prerequisites

- Docker Desktop
- Minikube
- kubectl
- Helm
- Git
- Java 17 and Maven, nếu muốn build backend local
- Node.js 20+, nếu muốn chạy frontend local
- Docker Hub account

## Quick Start on Minikube

Start Minikube and enable Ingress:

```bash
minikube start
minikube addons enable ingress
```

Create the MySQL secret:

```bash
kubectl create secret generic mysql-secret \
  --from-literal=mysql-root-password='mysql' \
  --from-literal=mysql-password='mysql' \
  -n default
```

Install MySQL with Bitnami chart:

```bash
helm upgrade --install mysql oci://registry-1.docker.io/bitnamicharts/mysql \
  -f helm/mysql-chart/values.yaml \
  -n default \
  --reset-values
```

Deploy application charts:

```bash
helm upgrade --install user-service ./helm/user-service-chart -n default
helm upgrade --install product-service ./helm/product-service-chart -n default
helm upgrade --install order-service ./helm/order-service-chart -n default
helm upgrade --install frontend ./helm/frontend-chart -n default
```

For local browser access on Windows/WSL, run:

```bash
minikube tunnel
```

Add this entry to `C:\Windows\System32\drivers\etc\hosts`:

```text
127.0.0.1 shopnow.local
```

Open:

```text
http://shopnow.local
```

## API

Main endpoints are documented in [docs/API.md](docs/API.md).

Quick examples:

```bash
curl -X POST http://shopnow.local/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"123456"}'
```

```bash
curl http://shopnow.local/products
```

## CI/CD Workflow

The GitHub Actions workflow is defined at [.github/workflows/build-push-deploy.yml](.github/workflows/build-push-deploy.yml).

On push to `main`, the pipeline:

1. Detects changed source services under `backend/**` and `frontend/**`.
2. Builds changed Java services with Maven.
3. Builds and pushes Docker images to Docker Hub using tag `${{ github.sha }}`.
4. Detects changed application Helm charts under `helm/frontend-chart`, `helm/user-service-chart`, `helm/product-service-chart`, and `helm/order-service-chart`.
5. Redeploys changed services to the self-hosted Kubernetes runner with Helm.
6. Packages and pushes changed application Helm charts to Docker Hub OCI registry.

MySQL is deployed separately with the Bitnami MySQL chart and `helm/mysql-chart/values.yaml`.

Required GitHub Secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

More deployment notes are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Configuration and Secrets

Real `application.properties` files are intentionally ignored by Git. Use the example files:

```text
backend/*/src/main/resources/application.properties.example
```

Database password is provided through Kubernetes Secret:

```text
mysql-secret
```

Backend deployments read:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
```

## Useful Commands

Check workloads:

```bash
kubectl get pods,svc,ingress -n default
```

View logs:

```bash
kubectl logs deploy/user-service -n default
kubectl logs deploy/product-service -n default
kubectl logs deploy/order-service -n default
kubectl logs deploy/frontend -n default
```

Port-forward frontend if Ingress is not available:

```bash
kubectl port-forward svc/frontend 3000:80 -n default
```

Then open:

```text
http://localhost:3000
```

## Current Limitations

- Authentication is demo-level. Frontend stores login state in `localStorage`; backend does not issue JWT/session tokens.
- Passwords are stored as plain text for simplicity.
- All backend services share one MySQL database.
- No automated tests are included yet.
