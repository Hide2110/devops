# Tin Mới 24h - Website tin tức cơ bản

## Chạy trực tiếp
Mở `index.html` bằng trình duyệt.

## Chạy bằng Docker
```bash
docker build -t news-basic .
docker run -d --name news-web -p 3000:80 news-basic
```
Mở: http://localhost:3000

## Chạy bằng Docker Compose
```bash
docker compose up -d --build
```
Mở: http://localhost:3000

## CI/CD
Workflow nằm tại `.github/workflows/deploy.yml`.
Tạo 2 GitHub Secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

Sau khi push vào `main`, GitHub Actions sẽ build và push image lên Docker Hub.
