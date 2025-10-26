# Quick Start Guide - Setup and Run

Quick guide to run the project.

---

## Quick Start (3 Steps)

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd multiple-choice-quizzes-BE/multiple-choice-quizzes-BE

# Install dependencies
npm install

# Create .env file
# Copy content from SETUP_GUIDE.md

# Run backend
npm run dev
```

**Backend .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/quiz-platform
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory
cd multiple-choice-quizzes-FE/questest

# Install dependencies
npm install

# Create .env.local file
# Copy content from SETUP_GUIDE.md

# Run frontend
npm run dev
```

**Frontend .env.local file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Step 3: Open Browser

```
http://localhost:3001
```

---

## Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB is running (local or Atlas)
- [ ] Backend .env file created
- [ ] Frontend .env.local file created
- [ ] npm install done for both projects
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001

---

## Test Connection

### Test Backend:
```bash
curl http://localhost:3000/api/health
```
### Swagger:
```bash
curl http://localhost:3000/api-docs/
```

### Test Frontend:
Open browser: `http://localhost:3001`

---

See detailed instructions in `SETUP_GUIDE.md`
