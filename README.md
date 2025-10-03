# FastBuy — E-commerce Project

# Project Overview

FastBuy is a full-stack e-commerce web application. It allows users to browse products, add items to a shopping cart, and place orders. The admin dashboard provides functionality to manage products, orders, and users.

# Tech Stack

Backend: Spring Boot (Java)

Frontend: React / HTML-CSS-JS

Database: MySQL

Build Tools: Maven (backend), npm/yarn (frontend)

# Features

User

User registration and login

Browse products and categories

Add products to cart and checkout

# Admin

Admin login dashboard

Manage products (add/edit/delete)

Manage orders and users

View statistics and sales

# Admin Credentials (Local/Dev)

Username: admin

Password: Admin@123

# ⚠️ For development/testing only. Change credentials for production.

Folder Structure
FastBuy_EcommerceProject/
├─ backend/           # Spring Boot backend project
│   ├─ src/
│   ├─ pom.xml
│   └─ .gitignore
└─ frontend/          # Frontend project
    └─ FastBuy/
README.md

# Screenshots area available in a folder named screenshots

How to Run
Backend

Navigate to the backend folder:

cd backend

# Build and run:

mvn clean package
mvn spring-boot:run

Backend server will run at: http://localhost:9090

# Frontend

Navigate to the frontend folder:

cd frontend/FastBuy
Install dependencies and run the dev server:

npm install
npm run dev   # or npm start

Frontend will run at: http://localhost:5174

Environment / DB Configuration

application.properties (backend)

spring.datasource.url=jdbc:mysql://localhost:3306/fastbuy_db
spring.datasource.username=fastbuy_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
server.port=9090


# MySQL Setup

CREATE DATABASE fastbuy_db;
CREATE USER 'fastbuy_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON fastbuy_db.* TO 'fastbuy_user'@'localhost';
FLUSH PRIVILEGES;

.gitignore Recommendations

Backend

/target/
/*.log
/.idea/
/.vscode/
/*.iml
/.mvn/
/.settings/


Frontend

/node_modules/
/dist/
/build/
/.vscode/
/.env

# Notes

Make sure the backend is running before starting the frontend.

If frontend cannot access backend, configure CORS:

@CrossOrigin(origins = "http://localhost:5174")

Admin credentials should be secured for production environments.

Use .gitignore to avoid pushing unnecessary files like node_modules and target/.

# Deployment Hints

Backend: Deploy the Spring Boot jar to any JVM hosting service (Heroku, AWS, DigitalOcean, etc.). Make sure the database is reachable.

Frontend: Build static files and deploy to Netlify, Vercel, or GitHub Pages, or serve via a static host.

Configure environment variables for database URLs and secrets in production.

Use HTTPS and secure credentials in live environments.

# Contact

For issues, questions, or guidance on running, testing, or deploying FastBuy, you can contact the developer.