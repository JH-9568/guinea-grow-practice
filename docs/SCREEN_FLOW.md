# SCREEN_FLOW.md

## Main User Flow

1. User opens GuineaGrow.
2. User enters a nickname.
3. User enters the dashboard.
4. User clicks "Create Guinea Pig".
5. User enters a lecture file name and lecture text.
6. System creates a random baby guinea pig.
7. System generates 5 quizzes based on the lecture material.
8. User enters the guinea pig detail page.
9. User sees the guinea pig on the left and quiz list on the right.
10. User selects a quiz.
11. User answers the quiz.
12. If correct, the guinea pig gains XP and shows a happy/eating animation.
13. If wrong, the guinea pig does not gain XP and an explanation is shown.
14. User can generate more quizzes for the same guinea pig.
15. User can return to the dashboard and manage multiple guinea pigs.

---

## Screens

### 1. Landing / Start Screen

Purpose:
- Explain the service quickly.
- Let the user start with a nickname.

Main Components:
- Hero title
- Short service description
- Nickname input
- Start button
- Cute guinea pig visual

Backend Dependency:
- POST /api/users

---

### 2. Dashboard Screen

Purpose:
- Show all guinea pigs created by the user.
- Let the user create a new guinea pig.

Main Components:
- Header with nickname
- "Create Guinea Pig" button
- Guinea pig cards
- Empty state when no guinea pigs exist

Guinea Pig Card:
- Name
- Source file name
- Level
- XP
- Stage
- Unsolved quiz count

Backend Dependency:
- GET /api/guinea-pigs?userId={userId}

---

### 3. Create Guinea Pig Screen

Purpose:
- Create a new guinea pig from lecture material.

Main Components:
- Source file name input
- Lecture text area
- Create button
- Loading state
- Error state

MVP Note:
- Show file-based concept, but use lecture text input first.
- Real PDF/PPT parsing is a later feature.

Backend Dependency:
- POST /api/guinea-pigs

---

### 4. Guinea Pig Detail Screen

Purpose:
- Main study/game screen.
- Let user grow the guinea pig by solving quizzes.

Layout:
- Left panel: guinea pig visual and growth status
- Right panel: quiz list and quiz generation button

Left Panel Components:
- Guinea pig visual
- Name
- Source file name
- Level
- XP bar
- Stage
- Mood/status message
- Hay/eating animation when correct

Right Panel Components:
- Quiz list
- Quiz status badges: unsolved, correct, wrong
- "Generate More Quizzes" button

Backend Dependency:
- GET /api/guinea-pigs/:id
- GET /api/guinea-pigs/:id/quizzes
- POST /api/guinea-pigs/:id/quizzes/generate

---

### 5. Quiz Modal / Quiz Screen

Purpose:
- Let the user solve one quiz at a time.

Main Components:
- Question
- Four choices
- Submit button
- Correct/wrong feedback
- Explanation
- Close/next action

Behavior:
- User selects one answer.
- User submits.
- If correct, XP increases.
- If wrong, XP does not increase.
- Explanation is shown after submission.

Backend Dependency:
- POST /api/quizzes/:id/answer

---

## Guinea Pig Mood Rules

idle:
- Default state.
- Message: "Your guinea pig is nibbling hay."

happy:
- Triggered after a correct answer.
- Message: "Correct! Your guinea pig is happily eating hay."

sad:
- Triggered after a wrong answer.
- Message: "Not quite. Your guinea pig tilts its head."

levelup:
- Triggered when XP reaches the next level.
- Message: "Level up! Your guinea pig has grown."

---

## Growth Rules

- Correct answer: +20 XP
- Wrong answer: +0 XP
- Every 100 XP increases level by 1

Stages:
- Level 1: baby
- Level 2: child
- Level 3: teen
- Level 4+: adult
