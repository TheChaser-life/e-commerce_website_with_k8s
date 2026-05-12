# Dùng base image java 17 .
FROM eclipse-temurin:17-jdk
# Copy file jar đã build vào container
COPY target/*.jar app.jar
# Chạy ứng dụng khi container khởi động
ENTRYPOINT ["java","-jar","/app.jar"]