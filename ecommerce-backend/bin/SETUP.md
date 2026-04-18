# Backend Setup Guide

## Requirements
- **Java Development Kit (JDK) 17 or higher** (NOT JRE)
- Maven 3.6+

## Installation Steps

### 1. Install JDK 17

**Download JDK 17:**
- Visit: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- OR use OpenJDK: https://adoptium.net/temurin/releases/?version=17

**Set JAVA_HOME environment variable:**

Windows PowerShell:
```powershell
# Check if you have JDK (not JRE):
java -version
javac -version

# If javac is not found, you need to install JDK
# After installing JDK, set JAVA_HOME:
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Path\To\JDK17", "User")
```

### 2. Build the Backend

```bash
cd ecommerce-backend
mvn clean install -DskipTests
```

### 3. Run the Backend

```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/ecommerce-backend-1.0.0.jar
```

### 4. Verify Backend is Running

The backend will start on **http://localhost:8080**

You should see:
```
🚀 E-Commerce Backend Server Started!
📊 H2 Console: http://localhost:8080/h2-console
🌐 API Base URL: http://localhost:8080/api
```

### 5. Test the API

Open a browser or use curl/Postman:

**Get all products:**
```
http://localhost:8080/api/products
```

**Get all categories:**
```
http://localhost:8080/api/categories
```

**Access H2 Database Console:**
```
http://localhost:8080/h2-console
```
- JDBC URL: `jdbc:h2:file:./data/ecommerce`
- Username: `sa`
- Password: (leave empty)

## Pre-loaded Data

The application includes:
- **Admin accounts**: 
  - Username: `admin`, Password: `admin123`
  - Username: `superadmin`, Password: `admin123`
- **5 Categories**: Electronics, Fashion, Home & Kitchen, Books, Sports
- **25+ Products**: With real images, prices, and descriptions

## Troubleshooting

### Error: "No compiler is provided in this environment"
- You have JRE installed, not JDK
- Install JDK 17 and set JAVA_HOME correctly

### Port 8080 already in use
```bash
# Windows: Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <process_id> /F
```

### Database locked error
- Close any H2 console connections
- Delete `./data/ecommerce.mv.db` and restart

## Next Steps

Once backend is running:
1. Test API endpoints using Postman or browser
2. Login as admin using POST to `/api/auth/admin/login`
3. Create user account using POST to `/api/auth/register`
4. Browse products at GET `/api/products`
5. Add products to cart (after logging in)
6. Place orders
