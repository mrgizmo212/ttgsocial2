Local setup (no cloud services)

This guide gets the frontend and backend running locally on Windows without Google Cloud services. It uses:
- H2 in‑memory DB (no MySQL required)
- Temporary account auth (no Google OAuth required)
- No media uploads (skip image uploads locally)

Prerequisites
- Java 21 (required by the backend)
- Maven (the project includes mvnw.cmd wrapper)
- Node.js 18+ and npm

1) Backend – run with H2 (no MySQL)
We’ll override datasource and JPA at runtime so Spring Boot auto-creates the schema in memory. JWT secret is required.

Option A: Run via Maven (recommended for dev)
PowerShell (from ft\X-Clone-Backend):

1. Set environment overrides for H2 and secrets
   $env:SPRING_DATASOURCE_URL="jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=false";
   $env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="org.h2.Driver";
   $env:SPRING_DATASOURCE_USERNAME="sa";
   $env:SPRING_DATASOURCE_PASSWORD="";
   $env:JWT_SECRET="dev-secret-change-me";
   $env:X_BEARER_TOKEN="dev-token";

2. Start the app with schema auto-create
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--spring.jpa.hibernate.ddl-auto=create-drop"

The backend will listen on http://localhost:8080.

Notes
- Images: the backend saves images using Google Cloud Storage; locally we don’t configure GCS. Avoid attaching images in posts to prevent 500s.
- The feed and all CRUD work with H2; shutting down the app clears data.

Option B: Run the packaged JAR
1. Build: .\mvnw.cmd -q -DskipTests package
2. Run:
   java -jar target\xclone-0.0.1-SNAPSHOT.jar ^
     --spring.datasource.url="jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=false" ^
     --spring.datasource.driver-class-name=org.h2.Driver ^
     --spring.datasource.username=sa ^
     --spring.datasource.password= ^
     --spring.jpa.hibernate.ddl-auto=create-drop ^
     --jwt.secret=dev-secret-change-me ^
     --x.bearer.token=dev-token

2) Frontend – point to the local backend
From ft\X-Clone-Frontend:

1. Create a local env file
   Create .env.local with:
   VITE_API_URL=http://localhost:8080
   VITE_GOOGLE_CLIENT_ID=dummy-local

2. Install deps and run
   npm install
   npm run dev

The dev server runs on http://localhost:5173.

3) CORS during local dev
The backend doesn’t include CORS config. Calling it from http://localhost:5173 may be blocked by the browser.
Use one of these approaches:
- Quickest: enable a CORS browser extension during local dev.
- Alternative (requires code change): add a Vite dev proxy or Spring CORS config. If you prefer this route, request a small PR and we’ll wire it up.

4) Local login (no Google OAuth)
Use the "Use a temporary account" button in the UI to create a temp user and receive a JWT automatically. This calls the backend /api/auth/demo-signup endpoint and stores the token in localStorage. After that you can post, like, follow, etc.

Tips
- Avoid image uploads locally (CloudStorageService depends on GCS).
- Polls, posts, likes, bookmarks, follows, notifications, and feeds work fine without Google Cloud.
- If you need persistent data across restarts, switch to a local MySQL and provide SPRING_DATASOURCE_* plus set spring.jpa.hibernate.ddl-auto to create/update; otherwise H2 will reset on exit.

Troubleshooting
- 401/Authorization issues: make sure you used the temporary account login so the JWT is set in localStorage.
- 403/CORS errors in the browser: see Section 3 above and enable a CORS extension for localhost during dev.
- Port already in use: stop other apps on 8080/5173 or change ports as needed.

Unchanged services (for local run)
- Docker Compose includes an nginx service with volume mounts that aren’t present locally; ignore docker-compose for this local H2 setup.


