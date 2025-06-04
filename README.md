
# 🚀 Laravel + React Monolithic Application (Dockerized)

This project is a full-stack monolithic application built using **Laravel** (backend) and **React** (frontend), fully containerized with **Docker** for development and production environments.

---

## 📦 Tech Stack

- **Backend:** Laravel (PHP 8.x)
- **Frontend:** React + Vite
- **Database:** MySQL 8
- **Web Server:** Apache (Laravel), Nginx (React)
- **Containerization:** Docker + Docker Compose

---

## 📁 Project Structure

```
your-project/
├── backend/                      # Laravel app
│   ├── app/
│   ├── config/
│   ├── docker/
│   │   ├── DockerfilePHP         # PHP Dockerfile
│   │   ├── mysqldata/            # MySQL volume
│   │   ├── mysql/
│   │   │   ├── createDevDB.sql
│   │   │   ├── my.cnf
│   ├── public/
│   ├── routes/
│   └── ...
├── frontend/                     # React app
│   ├── public/
│   ├── src/
│   ├── Dockerfile                # Multi-stage React + Nginx
│   ├── nginx.conf                # Custom Nginx config for SPA
│   ├── package.json
├── docker-compose.yml           # Root Docker
└── README.md                    # Project documentation
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://your-repo-url.git
cd scani5
```

### 2. Environment Setup

- Create `.env` in `backend/` for Laravel based on `.env.example`.
- Configure DB settings accordingly:

```env
DB_HOST=db
DB_PORT=3306
DB_DATABASE=test_scani5
DB_USERNAME=root
DB_PASSWORD=some_paasword
```

### 3. Docker Setup

Build and run all containers:

```bash
docker compose up --build
```

---

## 🐳 Setup Instructions

### 🔧 Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### ▶️ Run the Application

```bash
docker-compose up --build
```

- Laravel: `http://localhost:8038`
- React (Production): `http://localhost:3000`
- Adminer (DB Tool): `http://localhost:8039`

---

## ⚙️ Services Overview

| Service    | Description                         | URL                      |
|------------|-------------------------------------|--------------------------|
| `php`      | Laravel app via Apache              | http://localhost:8038    |
| `frontend` | React production build via Nginx    | http://localhost:3000    |
| `db`       | MySQL 8 database                    | Internal only            |
| `adminer`  | Database manager tool               | http://localhost:8039    |

---

## 🔧 Nginx Custom Config (Optional)

If you're using routes like `/dashboard`, add a custom Nginx config (`nginx.conf`) and mount it:

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

In Dockerfile:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## 🔄 Common Docker Commands

### Rebuild All Services

```bash
docker-compose up --build -d
```

### Stop All Containers

```bash
docker-compose down
```

### View Running Containers

```bash
docker ps
```

---

## 🧪 Troubleshooting

- **404 on page refresh (React):** Use `nginx.conf` to fallback all routes to `index.html`.

- **Laravel file permission issues:**

```bash
chmod -R 775 storage bootstrap/cache
```

- **React changes not showing in production:** Run `npm run build` and rebuild the Docker image.

---

## ✅ Summary of Changes Made

- Created **Dockerfile** for Laravel with Apache, PHP, Composer, and proper file permissions.
- Created **Dockerfile** for React with multi-stage build (Node.js → Nginx).
- Configured **Nginx** for handling React SPA route fallback (404 → index.html).
- Created and configured **docker-compose.yml** to orchestrate backend, frontend, MySQL, and Adminer.
- Enabled persistent volumes for MySQL.
- Used a **shared Docker network** to allow cross-container communication.
- Ensured **production-ready builds** for both Laravel and React.

---

## 🛠️ Problems Faced & Solutions

| Issue                           | Solution                                                                       |
|---------------------------------|--------------------------------------------------------------------------------|
| React `404` after refresh       | Added custom `nginx.conf` to fallback to `index.html`                          |
| React initially served dev code | Used Docker multi-stage build to serve production code                         |
| Uploaded image not reflecting   | Ensured image uploads go to Laravel backend and React fetches from correct API |
| No build output seen            | Used `npm run build` and mapped `/app/build` to Nginx root                     |
| Laravel storage permission      | Applied correct ownership and permissions during Docker build                  |
