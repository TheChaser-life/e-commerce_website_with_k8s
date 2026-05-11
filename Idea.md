### Lộ trình triển khai Project E-commerce (Hướng số 1) với Helm trên Minikube

Dưới đây là các bước thực hiện cho level intern/junior:

#### Bước 0: Thiết kế Kiến trúc và Tạo Source Code

* Backend được tách thành microservices: User Service (port 8080), Product Service (port 8081), Order Service (port 8082).
* Frontend: React app đơn giản.
* Database: MySQL chung cho tất cả services.
* Source code đã được tạo trong thư mục `frontend/`, `backend/`, và Helm charts trong `helm/`.

#### Bước 1: Chuẩn bị Container Images

Trước khi đụng đến K8s hay Helm, mọi thứ phải được đóng gói bằng Docker.

* Kiểm tra và tối ưu lại `Dockerfile` cho Backend (Spring Boot) và Frontend (React).
* Build image và push lên một registry (như Docker Hub) để Minikube có thể kéo (pull) về.

#### Bước 2: Khởi tạo Helm Chart cho Frontend và Backend

Thay vì viết cả chục file YAML rời rạc, bạn sẽ tạo một Helm Chart để quản lý ứng dụng một cách chuyên nghiệp.

* Chạy lệnh `helm create shopnow-chart` để tạo cấu trúc thư mục cơ bản.
* Chỉnh sửa file `values.yaml` để định nghĩa các biến như: tên Docker image, số lượng replicas, port của ứng dụng.
* Viết các file templates (`deployment.yaml`, `service.yaml`) sao cho chúng đọc giá trị động từ `values.yaml`. Điều này giúp bạn dễ dàng tái sử dụng chart cho nhiều môi trường (dev, staging, prod) chỉ bằng cách đổi file values.

#### Bước 3: Triển khai Database (Phần khó nhất của K8s)

Database không nên quản lý chung một cụm với ứng dụng bằng Deployment thông thường vì dữ liệu cần được lưu trữ vĩnh viễn (stateful).

* Sử dụng một Helm chart có sẵn (ví dụ của Bitnami) để cài đặt MySQL hoặc PostgreSQL: `helm install my-db oci://registry-1.docker.io/bitnamicharts/mysql`.
* Cấu hình `PersistentVolumeClaim` (PVC) để yêu cầu Minikube cấp phát ổ cứng ảo, đảm bảo data không bị bay màu khi pod database khởi động lại.
* Dùng `Secret` trong K8s để lưu mật khẩu database, sau đó truyền vào Backend pod dưới dạng biến môi trường (Environment Variables).

#### Bước 4: Cấu hình Mạng lưới & Ingress

Mặc định, các pod trong K8s chỉ giao tiếp được với nhau ở mạng nội bộ. Bạn cần mở đường để truy cập từ trình duyệt trên máy tính của bạn.

* Bật addon Ingress trên Minikube: `minikube addons enable ingress`.
* Định nghĩa file `ingress.yaml` trong Helm chart để trỏ domain ảo (ví dụ: `shopnow.local`) vào Service của Frontend.
* Map domain đó vào IP của Minikube trong file `C:\Windows\System32\drivers\etc\hosts` (hoặc `/etc/hosts` trên Linux/Mac).

---

**Bước tiếp theo:** Bạn đã có sẵn Dockerfile chạy ổn định cho cả hai cục Frontend và Backend chưa, hay chúng ta nên bắt đầu bằng việc thiết kế cấu trúc thư mục cho cái Helm chart trước?