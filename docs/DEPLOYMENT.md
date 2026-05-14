# Deployment Guide

This project is designed to run on Minikube with Helm.

## 1. Start Minikube

```bash
minikube start
minikube addons enable ingress
```

Check the Ingress controller:

```bash
kubectl get pods -n ingress-nginx
```

## 2. Create Database Secret

The Bitnami MySQL chart expects these keys when `auth.existingSecret` is used:

```text
mysql-root-password
mysql-password
```

Create the secret:

```bash
kubectl create secret generic mysql-secret \
  --from-literal=mysql-root-password='mysql' \
  --from-literal=mysql-password='mysql' \
  -n default
```

If the secret already exists during local testing:

```bash
kubectl delete secret mysql-secret -n default
```

Then create it again.

## 3. Install MySQL

```bash
helm upgrade --install mysql oci://registry-1.docker.io/bitnamicharts/mysql \
  -f helm/mysql-chart/values.yaml \
  -n default \
  --reset-values
```

Check MySQL:

```bash
kubectl get pod mysql-0 -n default
kubectl logs mysql-0 -n default
```

If MySQL fails with volume permission errors on Minikube, keep this setting enabled:

```yaml
volumePermissions:
  enabled: true
```

If the PVC is already corrupted during local testing and data can be deleted:

```bash
kubectl delete pvc data-mysql-0 -n default
```

## 4. Deploy Application Services

```bash
helm upgrade --install user-service ./helm/user-service-chart -n default
helm upgrade --install product-service ./helm/product-service-chart -n default
helm upgrade --install order-service ./helm/order-service-chart -n default
helm upgrade --install frontend ./helm/frontend-chart -n default
```

Check resources:

```bash
kubectl get pods,svc,ingress -n default
```

## 5. Access the Application

Run tunnel:

```bash
minikube tunnel
```

Keep this terminal open.

Add this entry to Windows hosts file:

```text
127.0.0.1 shopnow.local
```

Open:

```text
http://shopnow.local
```

If Ingress is not working, test through port-forward:

```bash
kubectl port-forward svc/frontend 3000:80 -n default
```

Open:

```text
http://localhost:3000
```

## 6. CI/CD Notes

GitHub Actions workflow:

```text
.github/workflows/build-push-deploy.yml
```

The pipeline uses:

- GitHub-hosted runner for detecting changes and building Docker images.
- Self-hosted Linux runner for Helm deployment to the local Kubernetes cluster.
- Docker Hub for Docker image registry and Helm OCI chart registry.

The application pipeline handles these charts:

```text
frontend-chart
user-service-chart
product-service-chart
order-service-chart
```

MySQL is installed separately from the Bitnami OCI chart by using:

```text
helm/mysql-chart/values.yaml
```

Required GitHub repository secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

## 7. Troubleshooting

View backend logs:

```bash
kubectl logs deploy/user-service -n default
kubectl logs deploy/product-service -n default
kubectl logs deploy/order-service -n default
```

Check environment variables inside a backend pod:

```bash
kubectl exec deploy/user-service -n default -- printenv | grep SPRING
```

Check Ingress:

```bash
kubectl get ingress frontend -n default -o wide
kubectl describe ingress frontend -n default
```

Check service endpoints:

```bash
kubectl get endpoints frontend -n default
kubectl get endpoints user-service -n default
kubectl get endpoints product-service -n default
kubectl get endpoints order-service -n default
```
