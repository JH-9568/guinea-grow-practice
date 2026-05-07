# API_CONTRACT.md

## Base URL

http://localhost:3000/api

## Common Response Format

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Data Types

### User

```ts
type User = {
  id: string;
  nickname: string;
  createdAt: string;
};
```

### GuineaPig

```ts
type GuineaPig = {
  id: string;
  userId: string;
  name: string;
  sourceFileName: string;
  color: "brown" | "white" | "cream" | "mixed";
  personality: "hungry" | "smart" | "shy" | "playful";
  level: number;
  xp: number;
  stage: "baby" | "child" | "teen" | "adult";
  mood: "idle" | "happy" | "sad" | "levelup";
  createdAt: string;
};
```

### Quiz

```ts
type Quiz = {
  id: string;
  guineaPigId: string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  status: "unsolved" | "correct" | "wrong";
  selectedIndex: number | null;
};
```

---

## Endpoints

### Health Check

GET /health

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

### Create User

POST /users

Request:

```json
{
  "nickname": "Jinhyung"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_1",
    "nickname": "Jinhyung",
    "createdAt": "2026-05-07T10:00:00.000Z"
  }
}
```

Validation:
- nickname is required.
- nickname max length is 30.

---

### Get Guinea Pigs

GET /guinea-pigs?userId={userId}

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "pig_1",
      "userId": "user_1",
      "name": "Mochi",
      "sourceFileName": "Operating Systems Lecture 1.pdf",
      "color": "brown",
      "personality": "hungry",
      "level": 1,
      "xp": 40,
      "stage": "baby",
      "mood": "idle",
      "quizCount": 5,
      "unsolvedQuizCount": 3,
      "createdAt": "2026-05-07T10:00:00.000Z"
    }
  ]
}
```

---

### Create Guinea Pig

POST /guinea-pigs

Request:

```json
{
  "userId": "user_1",
  "sourceFileName": "Operating Systems Lecture 1.pdf",
  "lectureText": "A process is a program in execution..."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "guineaPig": {
      "id": "pig_1",
      "userId": "user_1",
      "name": "Mochi",
      "sourceFileName": "Operating Systems Lecture 1.pdf",
      "color": "brown",
      "personality": "hungry",
      "level": 1,
      "xp": 0,
      "stage": "baby",
      "mood": "idle",
      "createdAt": "2026-05-07T10:00:00.000Z"
    },
    "quizzes": [
      {
        "id": "quiz_1",
        "guineaPigId": "pig_1",
        "question": "What is a process?",
        "choices": [
          "A program in execution",
          "A storage device",
          "A network protocol",
          "A hardware interrupt"
        ],
        "answerIndex": 0,
        "explanation": "A process is commonly defined as a program in execution.",
        "status": "unsolved",
        "selectedIndex": null
      }
    ]
  }
}
```

Validation:
- userId is required.
- sourceFileName is required.
- lectureText is required.
- lectureText should be at least 20 characters.

---

### Get Guinea Pig Detail

GET /guinea-pigs/:id

Response:

```json
{
  "success": true,
  "data": {
    "id": "pig_1",
    "userId": "user_1",
    "name": "Mochi",
    "sourceFileName": "Operating Systems Lecture 1.pdf",
    "color": "brown",
    "personality": "hungry",
    "level": 1,
    "xp": 40,
    "stage": "baby",
    "mood": "idle",
    "createdAt": "2026-05-07T10:00:00.000Z"
  }
}
```

---

### Get Quizzes

GET /guinea-pigs/:id/quizzes

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "quiz_1",
      "guineaPigId": "pig_1",
      "question": "What is a process?",
      "choices": [
        "A program in execution",
        "A storage device",
        "A network protocol",
        "A hardware interrupt"
      ],
      "answerIndex": 0,
      "explanation": "A process is commonly defined as a program in execution.",
      "status": "unsolved",
      "selectedIndex": null
    }
  ]
}
```

---

### Generate More Quizzes

POST /guinea-pigs/:id/quizzes/generate

Request:

```json
{
  "count": 5
}
```

Response:

```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "id": "quiz_6",
        "guineaPigId": "pig_1",
        "question": "What is a thread?",
        "choices": [
          "A lightweight unit of execution",
          "A type of hard disk",
          "A login method",
          "A file extension"
        ],
        "answerIndex": 0,
        "explanation": "A thread is a lightweight unit of execution within a process.",
        "status": "unsolved",
        "selectedIndex": null
      }
    ]
  }
}
```

---

### Submit Quiz Answer

POST /quizzes/:id/answer

Request:

```json
{
  "selectedIndex": 0
}
```

Response:

```json
{
  "success": true,
  "data": {
    "quiz": {
      "id": "quiz_1",
      "status": "correct",
      "selectedIndex": 0
    },
    "isCorrect": true,
    "gainedXp": 20,
    "guineaPig": {
      "id": "pig_1",
      "level": 1,
      "xp": 20,
      "stage": "baby",
      "mood": "happy"
    },
    "explanation": "A process is commonly defined as a program in execution."
  }
}
```

Rules:
- Correct answer gives +20 XP.
- Wrong answer gives +0 XP.
- Every 100 XP increases level by 1.
- Level 1 = baby.
- Level 2 = child.
- Level 3 = teen.
- Level 4 or higher = adult.