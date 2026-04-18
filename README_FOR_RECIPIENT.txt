WELCOME TO THE LUXE E-COMMERCE PROJECT! 🚀

If you have just received this project zip file, follow these steps to get it running:

-------------------------------------------------------
STEP 1: INSTALL PRE-REQUISITES
-------------------------------------------------------
1.  Open the "install-jdk.bat" file (Double click it).
    - This will check if you have Java. If NOT, it will help you install it.
    - (If on a corporate network, please ensure you have any Java 17+ installed and set in your PATH).
2.  Ensure you have Node.js installed.
    - Download it from: https://nodejs.org/ (Download the LTS version).

-------------------------------------------------------
STEP 2: SETUP FRONTEND (One Time Only)
-------------------------------------------------------
1.  Open the "ecommerce-frontend" folder.
2.  Right-click inside the folder > "Open Terminal here" (or PowerShell).
3.  Type the following command and press Enter:
    npm install
    
    (Note: If you see errors, try: npm install --legacy-peer-deps)
    
    This will download all the necessary libraries (node_modules) which were skipped in the zip to save space.

-------------------------------------------------------
STEP 3: RUN THE PROJECT
-------------------------------------------------------
1.  **Run Backend:** 
    - Go back to the main folder.
    - Double-click "run-backend.bat".
    - Wait until you see "Started EcommerceApplication".

2.  **Run Frontend:**
    - Inside the "ecommerce-frontend" terminal (from Step 2).
    - Type: ng serve
    - Wait until it says "Active on http://localhost:4200".

-------------------------------------------------------
STEP 4: USE THE APP
-------------------------------------------------------
- Open your browser and go to: http://localhost:4200
- See "USER_MANUAL.doc" for login details and features!

Happy Coding!
