## Vision, Goals, and Expected Functionality

We will reimplement the existing Spring Boot backend in Python using FastAPI while preserving API contracts, data shapes, and behaviors relied upon by the React frontend. The rewrite will be drop‑in compatible: same endpoints, same request/response payloads, same auth semantics (JWT with userId as subject), and same pagination/query parameters. Where the current backend integrates Google Cloud Storage (GCS) for media, we will initially provide a local development storage strategy (or defer media) and a clear extension seam to plug in cloud storage later.

Code facts to ground the plan:
- Spring Boot 3.5, Java 21 (modern stack today):
```6:9:ft/X-Clone-Backend/pom.xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.0</version>
```
```29:31:ft/X-Clone-Backend/pom.xml
<properties>
    <java.version>21</java.version>
```
- Auth endpoints and JWT semantics:
```30:42:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/auth/AuthController.java
@PostMapping("/google-login")
@GetMapping("/me")
@PostMapping("/demo-signup")
```
```27:33:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/security/JwtService.java
public String createToken(Integer userId) { ... }
```
- Core domain entities (tables/columns to mirror with SQLAlchemy):
```8:63:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/Post.java
@Entity @Table(name = "posts")
```
```7:28:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostMedia.java
@Entity @Table(name = "post_media")
```
```7:46:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/User.java
@Entity @Table(name = "users")
```
```7:20:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/like/Like.java
@Entity @Table(name = "likes")
```
```7:22:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/bookmark/Bookmark.java
@Entity @Table (name = "bookmarks")
```
```7:26:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/retweet/Retweet.java
@Entity @Table (name = "retweets")
```
```6:33:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/notification/Notification.java
@Entity @Table(name = "notifications")
```
- DTO shapes the frontend already consumes:
```7:34:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostDTO.java
id, userId, text, createdAt, likedBy, bookmarkedBy, replies, parentId, retweetedBy, postMedia, pollId, pollExpiryTimeStamp
```
```7:50:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/UserDTO.java
id, username, email, bio, displayName, posts, bookmarkedPosts, likedPosts, followers, following, createdAt, replies, retweets, profilePictureUrl, bannerImageUrl, pinnedPostId, verified
```
- Media upload currently uses CloudStorageService (we’ll add a pluggable storage adapter with a local FS implementation first):
```254:267:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostService.java
String url = cloudStorageService.upload(fileName, file.getInputStream(), mimeType);
postMediaRepository.save(media);
```
- Feed pagination API (and ranking service to port iteratively):
```22:45:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/feed/FeedController.java
@GetMapping("/get-feed-page") ... getPaginatedPostIds(cursor, limit, userId, type)
```
```25:66:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/feed/EdgeRank.java
buildAndGetNewFeed -> computeTotalScore -> sort by totalScore desc
```

### Why we’re doing this
- Python/FastAPI can streamline developer onboarding, offer rich async IO options, and simplify rapid iteration while preserving current product behavior.
- We will keep the same API contract to avoid disrupting the React frontend and reduce migration risk.

### Expected functionality when done
- All existing endpoints behave identically (URLs, methods, query/body shapes, and response DTOs).
- JWT auth works the same (HS256; subject=userId; 24h expiration).
- Pagination params and feed behavior are matched; ranking can be ported in phases.
- Media upload: pluggable storage layer (local filesystem first; GCS/S3 adapter optional).

---

## Step‑by‑Step Blueprint: Creating and Setting Up the New FastAPI Backend

Target path: `C:\Users\Adam\Desktop\9262025\ft\X-Clone-Backend-FastAPI`

1) Initialize project structure
- app/main.py — FastAPI app, router registration, exception handlers
- app/config.py — Pydantic settings (DATABASE_URL, JWT_SECRET, CORS)
- app/db.py — SQLAlchemy engine/session factory (start with sync engine; can move to async later)
- app/models/*.py — SQLAlchemy ORM models mirroring JPA entities above (tables/columns exactly)
- app/schemas/*.py — Pydantic models mirroring PostDTO, UserDTO, and request bodies (NewLike, NewBookmark, NewRetweet, Follow)
- app/security/jwt.py — create_token, verify_token, get_current_user_id dependency (HS256, subject=userId, 24h)
- app/services/*.py — business logic modules: auth, users, posts, feed, likes, bookmarks, retweets, follows, notifications, polls, storage
- app/routers/*.py — routers mapping 1:1 with existing controllers (see mapping below)
- app/storage/*.py — Storage interface + LocalStorage adapter (path base, save, url builder); later add GCS adapter
- alembic/ — migrations (after models stabilize)

2) Database schema parity
Implement SQLAlchemy models with the same table names and column names as JPA entities (above). This ensures DTO building queries return the same shapes. Example mappings:
- users(id, name→username, password, google_id, email, display_name, profile_picture_url, banner_image_url, verified, bio, created_at, pinned_post_id)
- posts(id, user_id, parent_id, text, created_at)
- post_media(id, post_id, file_name, mime_type, url, created_at)
- likes(id, liker_id, post_id)
- bookmarks(id, bookmarked_by, bookmarked_post)
- retweets(id, reference_id, retweeter_id, type)
- notifications(id, receiver_id, sender_id, type, reference_id, text, seen, created_at)
- polls / poll_choices / poll_votes (mirror the poll controllers used)
- feed_entry (mirror repository usage in EdgeRank)

3) Router mapping (exact endpoint parity)
- auth.py (/api/auth)
  - POST /google-login (stub initially or implement Google token verification later)
  - GET /me (returns UserDTO of token’s userId)
  - POST /demo-signup (creates a temp user and returns { token, user })
- users.py (/api/users)
  - GET /get-user?id
  - POST /get-users (ids: number[])
  - GET /get-top-five (returns 4 IDs by default; consider optional `?limit=` support)
  - GET /search?q
  - GET /get-discover?cursor&limit
- posts.py (/api/posts)
  - POST /get-posts (ids: number[] → PostDTO[])
  - GET /get-post/{id}
  - POST /create (multipart: text?, parentId?, images[]?, pollChoices[]?, pollExpiry[]?)
  - POST /delete (body: postId)
  - POST /pin?postId, POST /unpin?postId
- likes.py (/api/likes)
  - POST /create, POST /delete (body: { likedPostId })
- bookmarks.py (/api/bookmarks)
  - POST /create, POST /delete (body: { bookmarkedPost })
- retweets.py (/api/retweets)
  - POST /create, POST /delete (body: { retweeterId, referenceId, type })
- follows.py (/api/follows)
  - POST /follow, POST /unfollow (body: { followedId })
- notifications.py (/api/notifications)
  - GET /get-unseen (auth required)
  - POST /get-notifications (ids: number[])
- polls.py (/api/polls)
  - GET /{pollId}/choices
  - POST /submit-vote (body: { pollId, choiceId })
  - GET /{pollId}/getPollVote
- feed.py (/api/feed)
  - GET /get-feed-page?type&cursor&userId?&limit

4) DTO parity (Pydantic schemas)
- PostDTO schema fields must match exactly:
```7:19:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostDTO.java
id, userId, text, createdAt, likedBy, bookmarkedBy, replies, parentId, retweetedBy, postMedia, pollId, pollExpiryTimeStamp
```
- UserDTO schema fields must match exactly:
```22:50:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/UserDTO.java
id, username, displayName, posts, likedPosts, followers, following, bookmarkedPosts, replies, retweets, profilePictureUrl, bannerImageUrl, pinnedPostId, verified, createdAt, email, bio
```

5) Auth & security
- HS256 with `JWT_SECRET` from environment; 24h expiry; subject is the integer userId:
```25:33:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/security/JwtService.java
private final long expirationMillis = 1000 * 60 * 60 * 24; // 24h
```
- FastAPI dependency `get_current_user_id()` will:
  - Read `Authorization: Bearer <token>`
  - Validate signature/expiry; extract `sub` as userId (int)
  - Raise 401 if invalid/missing for protected routes

6) Storage strategy
- Define `Storage` interface: `save(file) -> url` and `delete(url)` (optional).
- Implement `LocalStorage` for dev (e.g., `./uploads/`), return `http://localhost:8080/media/<filename>` via static mount.
- Later, add `GCSStorage` adapter to match:
```261:264:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostService.java
String url = cloudStorageService.upload(...)
PostMedia media = new PostMedia(postId, fileName, mimeType, url);
```

7) Feed and pagination
- Implement `/api/feed/get-feed-page` signature and response. Phase 1: fetch IDs by cursor+limit, sort by createdAt, return `{ posts: number[], nextCursor }`.
- Phase 2: port `EdgeRank` scoring (affinity, weights, time decay) as a Python module using the same inputs:
```49:56:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/feed/EdgeRank.java
postRanks = generatePostRankList(posts); computeTotalScore(...); sort desc
```

8) Service‑level behaviors to preserve
- Delete/Pin authorization by owner (compare token userId with resource owner):
```196:221:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostService.java
handlePinPost(...) checks post ownership; updates user.pinnedPostId
```
- Batch fetch endpoints `/get-posts`, `/get-users`, `/get-notifications` accept arrays of IDs and return arrays of DTOs.
- Polls flow (choices, submit vote, get vote):
```29:60:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/poll/PollsController.java
GET {pollId}/choices, POST submit-vote, GET getPollVote
```

9) Configuration & run
- Env vars: `DATABASE_URL`, `JWT_SECRET`, optional `STORAGE_BASE_PATH`, `STORAGE_PUBLIC_BASE_URL`
- Local run:
  - `uvicorn app.main:app --reload`
  - Use SQLite or MySQL; ensure Alembic migration aligns with JPA schema

10) Testing
- Unit tests for services (auth, posts, feed ranking)
- Integration tests for endpoints (parity on status codes and payload shapes)
- Golden tests for DTO structures vs fixtures matching current outputs

11) Deployment
- Build a `Dockerfile` (python:3.12-slim), install deps, run `uvicorn` (or gunicorn+uvicorn workers)
- Provide optional Nginx config to serve static media and reverse proxy API

---

## Frontend Impact: Required Changes or Additions

Goal: Zero functional changes by preserving API parity. Only configuration adjustments should be needed.

1) API base URL
- Point `VITE_API_URL` to the FastAPI server (port you choose), e.g., `http://localhost:8080` (unchanged if we keep 8080).
```1:1:ft/X-Clone-Frontend/src/constants/env.ts
export const API_URL = import.meta.env.VITE_API_URL;
```

2) CORS
- If FastAPI runs on a different origin from Vite dev server (5173), enable CORS on the backend or use a dev proxy/extension. No frontend code changes required.

3) Media uploads (temporary note)
- If initial FastAPI iteration stubs out media storage, avoid attaching images from the UI during early tests. The UI posts images under field name `images` in `/api/posts/create` — keep field names identical for future parity.

4) Auth
- Keep using the existing temporary account flow (POST `/api/auth/demo-signup`) and JWT in `localStorage`:
```10:21:ft/X-Clone-Frontend/src/components/common/buttons/UseTempAccountButton.tsx
fetch(`${API_URL}/api/auth/demo-signup`, { method: "POST" })
```
- `GET /api/auth/me` continues to hydrate the user:
```11:15:ft/X-Clone-Frontend/src/hooks/auth/useCurrentUser.tsx
fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
```

5) Endpoint and DTO parity (no code edits expected)
- All hooks in `src/hooks/**` depend on the endpoints listed above; because we will mirror URLs and DTO shapes, the frontend should not require changes beyond `VITE_API_URL`.
- Examples the backend must preserve:
```20:32:ft/X-Clone-Frontend/src/hooks/queries/useInfiniteFeed.tsx
new URL(`${API_URL}/api/feed/get-feed-page`) ... headers token optional
```
```17:27:ft/X-Clone-Frontend/src/hooks/mutations/useCreatePost.tsx
POST `${API_URL}/api/posts/create` (Authorization if token)
```
```19:29:ft/X-Clone-Frontend/src/hooks/mutations/useLikePost.tsx
POST `${API_URL}/api/likes/create|delete` with { likedPostId }
```
```21:33:ft/X-Clone-Frontend/src/hooks/mutations/useBookmarkPost.tsx
POST `${API_URL}/api/bookmarks/create|delete` with { bookmarkedPost }
```
```20:31:ft/X-Clone-Frontend/src/hooks/mutations/useRepostPost.tsx
POST `${API_URL}/api/retweets/create|delete`
```
```23:31:ft/X-Clone-Frontend/src/hooks/mutations/useFollowUser.tsx
POST `${API_URL}/api/follows/follow|unfollow` with { followedId }
```
```8:15:ft/X-Clone-Frontend/src/hooks/mutations/useSeenNotifications.tsx
GET `${API_URL}/api/notifications/get-unseen` (Bearer token)
```
```9:16:ft/X-Clone-Frontend/src/hooks/queries/usePollChoices.tsx
GET `${API_URL}/api/polls/${pollId}/choices`
```

6) Optional niceties after migration
- If backend changes default ports or introduces a proxy, update `VITE_API_URL` accordingly.
- If we add signed URLs or different media URL patterns, ensure `postMedia.url` continues to be a fully qualified URL as today:
```14:20:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostMedia.java
private String url; // returned to clients
```

---

## Phased Delivery Plan

Phase 0 — Project bootstrap
- Create FastAPI skeleton, SQLAlchemy models, Pydantic schemas, JWT utilities, basic routing, DB migrations.

Phase 1 — Auth & Users
- Implement `/api/auth/demo-signup`, `/api/auth/me`; minimal `/api/users/get-user`, `/get-users`, `/search`, `/get-discover`, `/get-top-five`.

Phase 2 — Posts & Interactions
- Implement `/api/posts/get-posts`, `/get-post/{id}`, `/create` (text+parentId only), `/delete`, `/pin`, `/unpin`.
- Implement `/api/likes`, `/api/bookmarks`, `/api/retweets`, `/api/follows`.

Phase 3 — Feed & Notifications & Polls
- Implement `/api/feed/get-feed-page` (simple sort+cursor), `/api/notifications`, `/api/polls` endpoints.
- Port EdgeRank scoring logic.

Phase 4 — Media storage
- Add LocalStorage adapter for `/api/posts/create` images[] support; later add GCS/S3 adapter.

Phase 5 — Hardening
- Add metrics/logging, rate limiting, input validation, test suites, and Docker packaging.

---

## Acceptance Criteria
- React app runs unchanged except for `VITE_API_URL` pointing to the new backend.
- All documented endpoints return identical shapes/fields to current DTOs.
- JWT auth round‑trip works: `/api/auth/demo-signup` → token stored → `/api/auth/me` returns UserDTO.
- Basic feed pagination works; EdgeRank parity delivered by Phase 3.
- Media either stubbed without error or fully functional via local storage (and later cloud).


---

## Endpoint Contracts and Examples (Parity Guide)

This section lists every endpoint with request/response shapes and status codes, matching current behavior. Implement exactly to avoid frontend changes.

Auth (/api/auth)
- POST /google-login
  - Body: { token: string }
  - Returns: { token: string, user: UserDTO }
  - Current source:
```30:41:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/auth/AuthController.java
@PostMapping("/google-login") ... return ResponseEntity.ok(Map.of(
        "token", token,
        "user", dtoToReturn
));
```
- GET /me
  - Headers: Authorization: Bearer <jwt>
  - Returns: UserDTO (401 if missing/invalid)
  - Source:
```60:75:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/auth/AuthController.java
@GetMapping("/me") ... if (!jwtService.isTokenValid(token)) return 401; ... return ResponseEntity.ok(dto);
```
- POST /demo-signup
  - Returns: { token: string, user: UserDTO }
  - Source:
```77:83:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/auth/AuthController.java
@PostMapping("/demo-signup") ... return ResponseEntity.ok(Map.of("token", token, "user", dtoToReturn));
```

Users (/api/users)
- GET /get-user?id: number → UserDTO
- POST /get-users (body: number[]): UserDTO[]
- GET /get-top-five: returns 4 user IDs by default
```39:42:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/UserController.java
return ResponseEntity.ok(userRepository.findUserIdsByFollowerCount(99999, 4));
```
- GET /search?q: string → number[]
```51:54:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/UserController.java
@GetMapping("/search")
public List<Integer> searchUsers(@RequestParam String q) { ... }
```
- GET /get-discover?cursor&limit: paginated top users (returns DTOs)

Posts (/api/posts)
- POST /get-posts (body: number[]): PostDTO[]
- GET /get-post/{id}: PostDTO
- POST /create (multipart/form-data):
  - Fields: text?: string, parentId?: number, images[]?: file, pollChoices[]?: string, pollExpiry[]?: string
  - Behavior: requires text or images else 500 (IllegalStateException)
```104:115:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostController.java
if (text.length() < 1 && images == null) { throw new IllegalStateException("Text or images are mandatory"); }
```
- POST /delete (body is raw JSON number): returns 200 on success; 400/403 on unauthorized; cascades delete of replies
```57:65:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostController.java
public ResponseEntity<?> deletePost(@RequestBody Integer postId, Authentication auth) { ... }
```
```244:252:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/PostService.java
public void deleteReplies(Post post) { ... for (Post child : children) { deleteReplies(child); ... postRepository.delete(child); } }
```
- POST /pin?postId and /unpin?postId (query param): returns updated UserDTO

Likes (/api/likes)
- Body: { likedPostId: number }
- POST /create → 200 + PostDTO; 409 on conflict
- POST /delete → 200 + PostDTO; 404 on not found
```21:41:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/like/LikeController.java
@PostMapping("/create") ... 409 on duplicate
@PostMapping("/delete") ... 404 on not found
```

Bookmarks (/api/bookmarks)
- Body: { bookmarkedPost: number }
- POST /create → 200 + PostDTO; 409 on conflict
- POST /delete → 200 + PostDTO

Retweets (/api/retweets)
- Body: { retweeterId: number, referenceId: number, type: "post" }
- POST /create → 200 + PostDTO; 409 on conflict
- POST /delete → 200 + PostDTO; 404 on not found

Follows (/api/follows)
- Body: { followedId: number }
- POST /follow → 200 + followed UserDTO; 409 on conflict
- POST /unfollow → 200 + followed UserDTO; 404 on not found

Notifications (/api/notifications)
- GET /get-unseen → number[] (requires auth; marks seen)
```19:23:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/notification/NotificationController.java
@GetMapping("/get-unseen") ... getUsersUnseenIdsAndMarkAllAsSeen(authUserId)
```
- POST /get-notifications (body: number[]) → List of notification DTOs

Polls (/api/polls)
- GET /{pollId}/choices → PollChoice[]
- POST /submit-vote (body: { pollId, choiceId }) → PollChoice[]; 409 on duplicate
- GET /{pollId}/getPollVote → number (choiceId or -1); 401 if not authenticated
```48:60:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/post/poll/PollsController.java
@GetMapping("/{pollId}/getPollVote") ... 401 if not authenticated; returns votedChoiceId
```

Feed (/api/feed)
- GET /get-feed-page?type&cursor&userId?&limit → { posts: number[], nextCursor: number|null }
- Auth requirement depends on lower‑cased `type`:
```30:41:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/feed/FeedController.java
boolean requiresAuth = switch (type.toLowerCase()) {
    case "bookmarks", "notifications", "foryou", "following" -> true;
    default -> false;
};
```
- Note (quirk): Frontend passes "For You" (with space). Current Java checks "foryou" (no space). The effect is auth is not enforced for "For You" today. Replicate this behavior for parity (or normalize both sides consistently if you choose to improve later).

JWT Contract
- Algorithm: HS256; `sub` claim is userId as string; 24h expiry
```25:33:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/security/JwtService.java
.setSubject(String.valueOf(userId)) ... .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
```
- Headers: `Authorization: Bearer <token>`; invalid/missing → 401 on protected endpoints

Body Shapes (request)
- NewLike: { likedPostId: number } (likerId ignored; actor from JWT)
```1:8:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/like/NewLike.java
public class NewLike { private Integer likerId; private Integer likedPostId; }
```
- NewBookmark: { bookmarkedPost: number } (bookmarkedBy ignored; actor from JWT)
```1:7:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/bookmark/NewBookmark.java
public class NewBookmark { private Integer bookmarkedBy; private Integer bookmarkedPost; }
```
- NewRetweet: { retweeterId: number, referenceId: number, type: string }
```1:9:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/retweet/NewRetweet.java
public class NewRetweet { public Integer retweeterId; public Integer referenceId; public String type; }
```
- NewFollow: { followedId: number } (followerId ignored; actor from JWT)
```1:8:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/follow/NewFollow.java
public class NewFollow { public Integer followerId; public Integer followedId; }
```

---

## Data Model Reference (SQLAlchemy mirroring JPA)

Table names and key columns to replicate:
- users(id PK, name as username, password, google_id, email, display_name, profile_picture_url, banner_image_url, verified, bio, created_at, pinned_post_id)
```15:16:ft/X-Clone-Backend/src/main/java/com/xclone/xclone/domain/user/User.java
@Column(nullable = false, unique = true, length = 64, name = "name")
private String username;
```
- posts(id PK, user_id, parent_id, text(<=180), created_at)
- post_media(id PK, post_id, file_name, mime_type, url, created_at)
- likes(id PK, liker_id, post_id, created_at)
- bookmarks(id PK, bookmarked_by, bookmarked_post, created_at)
- retweets(id PK, reference_id, retweeter_id, type, created_at)
- notifications(id PK, receiver_id, sender_id, type, reference_id, text, seen, created_at)
- poll, poll_choice, poll_vote (mirror fields used by controllers)
- feed_entry(id PK, user_id, post_id, position, created_at) — align with usage in EdgeRank.saveFeed

Note: Keep column names exactly as shown in JPA entities to avoid DTO breakage.

---

## Known Parity Quirks to Preserve
- Feed auth mapping uses `foryou` (no space) vs frontend sending "For You"; auth not enforced for that type today. Replicate or coordinate a cross‑repo fix later.
- `/api/posts/delete` expects a raw JSON number (not an object).
- Interaction bodies include both actor and target in Java DTOs, but controllers use JWT principal for actor; you may ignore actor fields from body and trust JWT.
- `/api/users/get-top-five` returns 4 IDs by default.

---

## Python Dependencies and Dev Commands (for a less experienced agent)

Recommended packages (requirements.txt or pyproject):
- fastapi
- uvicorn[standard]
- pydantic-settings
- SQLAlchemy
- alembic
- PyJWT
- passlib[bcrypt]
- python-multipart (form-data parsing for uploads)
- aiofiles (static file serving if needed)
- pymysql (or mysqlclient) — if using MySQL; otherwise sqlite3 built-in

Dev run (keep port 8080 to match frontend expectation):
- `uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload`
- Env: `DATABASE_URL`, `JWT_SECRET` (and storage paths if using local media)


