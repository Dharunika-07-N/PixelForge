# PixelForge AI - Complete API Documentation

## 1. Authentication
Endpoints for user management and security.

### Signup
- **POST** `/api/auth/signup`
- **Body**: `{ "email": "...", "password": "...", "name": "..." }`
- **Response**: `201 Created`

### Login
- **Managed by NextAuth.js**
- **Endpoint**: `/api/auth/callback/credentials`

## 2. Project Management
### List Projects
- **GET** `/api/projects`
- **Response**: `Array<Project>`

### Create Project
- **POST** `/api/projects`
- **Body**: `{ "name": "...", "description": "..." }`

## 3. Upload & Extraction
### Analyze Design
- **POST** `/api/optimize/analyze`
- **Body**: `{ "pageId": "..." }`
- **Process**: Runs comprehensive AI analysis on layout, typography, colors, and accessibility.

### Feedback Loop
- **POST** `/api/optimize/feedback`
- **Body**: `{ "optimizationId": "...", "feedback": "...", "category": "..." }`
- **Process**: Refines the design based on user input.

## 4. Code Generation
### Generate Code
- **POST** `/api/optimize/generate-code`
- **Body**: `{ "optimizationId": "...", "framework": "react" }`
- **Response**:
```json
{
  "frontend": {
    "component": "...",
    "types": "...",
    "styles": "..."
  },
  "backend": {
    "route": "...",
    "validation": "..."
  },
  "database": {
    "schema": "..."
  }
}
```

## 5. Preview System
### Get Preview
- **GET** `/api/optimize/[id]/preview` (Draft)
- **Process**: Serves a sandboxed environment for the generated code.

## 6. Real-time Updates
- **WebSocket Events** (Future):
  - `extraction:start`
  - `extraction:progress`
  - `extraction:complete`
  - `code:ready`

## 7. Error Handling
Common Error Codes:
- `UNAUTHORIZED`: 401
- `FORBIDDEN`: 403
- `NOT_FOUND`: 404
- `EMPTY_CANVAS`: 400
- `AI_ERROR`: 500

## 8. Rate Limiting
- **Free Tier**: 5 extractions / day.
- **Pro Tier**: 100 extractions / day.
- **Enterprise**: Unlimited.
