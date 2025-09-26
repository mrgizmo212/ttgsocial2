<!--
WIP: Direct Messages (DM) Feature Plan — hidden from members

Goal
- Add basic 1:1 messaging with auth-protected REST endpoints and a minimal UI in Messages.

Backend (FastAPI)
Data model (SQLite)
- messages(id PK, from_user_id, to_user_id, text, seen BOOL, created_at TIMESTAMP)

Endpoints
- POST /api/dm/send
  - Auth required. Body: { toUserId: number, text: string }
  - Validates recipient exists and text length > 0, <= 2,000
  - Saves message; returns { id, fromUserId, toUserId, text, createdAt, seen: false }

- GET /api/dm/conversations?cursor=0&limit=20
  - Auth required. For the actor, returns recent conversations (other user IDs with last message timestamp) sorted desc.
  - Response: { users: number[], nextCursor: number|null }

- GET /api/dm/thread?userId={id}&cursor=0&limit=50
  - Auth required. Returns messages (both directions) with that user, sorted desc by createdAt with cursor pagination.
  - Response: { messages: DM[], nextCursor: number|null }

- GET /api/dm/unread-count
  - Auth required. Returns map of otherUserId -> unread count.

- POST /api/dm/mark-seen
  - Auth required. Body: { userId: number, upToId?: number }
  - Marks messages from userId to actor as seen (all or up toId).

Security & constraints
- Actor must be either sender or recipient to read any message in a thread.
- Rate limit send (server-side later), basic text validation now.

Frontend (React/Vite)
Types
- type DM = { id: number; fromUserId: number; toUserId: number; text: string; createdAt: string; seen: boolean }

Hooks
- useInfiniteDMThread(otherUserId): infinite query on /api/dm/thread
- useSendDM(otherUserId): mutation to POST /api/dm/send with optimistic prepend
- useDMConversations(): list of user IDs from /api/dm/conversations
- useDMUnread(): unread counters

UI
- Messages page: left column conversations, right pane thread.
- Compose box at thread bottom; Enter to send, Shift+Enter newline.
- Optimistic message add; on success reconcile ID/timestamps.

Pagination model
- Conversations: cursor = lastUserId or lastTimestamp; ordered by latest activity desc.
- Thread: cursor = lastMessageId; ordered by id desc; nextCursor = last returned id if page full.

Acceptance Criteria
- Can send text to another user; message appears instantly in UI.
- Opening thread marks messages as seen; unread counts drop.
- Conversations list shows other users, sorted by latest activity, excluding self.
- Handles empty states (no conversations, no messages yet).

Phase 2 (later)
- WS/SSE for live updates.
- Attachments (images) with existing storage adapter.
- Group chats.
-->


