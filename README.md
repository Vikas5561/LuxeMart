# LuxeMart E-Commerce Platform

A full-stack e-commerce application built with Spring Boot (Backend) and Angular (Frontend).

## 📋 Prerequisites for New Device

Before running this project on a new computer, ensure you have:
1.  **Java JDK 17** or higher installed.
2.  **Node.js (LTS version)** installed (v18 or v20 recommended).
3.  **Maven** (Optional, the project includes a wrapper).

---

## 🚀 How to Run the Project

### 1. Backend Setup (Spring Boot)
The backend handles the API, database, and business logic.

1.  Open a terminal (Command Prompt/PowerShell) in the **`ecommerce-backend`** folder.
2.  Run the following command to build and start the server:
    ```bash
    ./mvnw spring-boot:run
    ```
    *(If using Windows Command Prompt, just type `mvnw spring-boot:run`)*

    **Note:** The server will start on `http://localhost:8080`.
    **Database:** Uses H2 (File-based). Data is stored in `ecommerce-backend/data`.

### 2. Frontend Setup (Angular)
The user interface.

1.  Open a **new** terminal in the **`ecommerce-frontend`** folder.
2.  Install dependencies (only need to do this once per device):
    ```bash
    npm install
    ```
    *(If you get errors, try: `npm install --legacy-peer-deps`)*
3.  Start the frontend server:
    ```bash
    ng serve
    ```
    *(If `ng` is not recognized, run: `npm start`)*

    **Note:** The application will be available at `http://localhost:4200`.

---

## 📦 How to Transfer to Another Device

To move this project to another web, copy the entire `giant-nebula` folder, **BUT** you can skip these large/auto-generated folders to save time and space:

*   **SKIP/DELETE:** `ecommerce-frontend/node_modules` (This is huge! You will reinstall it with `npm install`).
*   **SKIP/DELETE:** `ecommerce-backend/target` (These are build files, they will regenerate).
*   **SKIP/DELETE:** `.git` (If you are not using git history).

**Do NOT delete:**
*   `ecommerce-backend/data` (If you want to keep your existing products/orders database).

---

## 👤 Admin Credentials
*   **Login URL:** http://localhost:4200/login (or Admin Dashboard link)
*   **Default Admin:** `admin` / `admin123` (or as configured in your database).

---

## 🛠️ Troubleshooting

*   **Port 8080 already in use?**
    *   Stop any other Java or web services running on port 8080.
*   **Frontend connection refused?**
    *   Ensure the Backend terminal is running and shows "Started EcommerceApplication".
