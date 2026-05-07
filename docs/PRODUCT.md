# PRODUCT.md

## Service Name

GuineaGrow

## One-line Description

GuineaGrow turns each lecture file into a virtual guinea pig that grows as the user solves quizzes generated from that lecture material.

## Problem

Students often lose focus during lectures and struggle to review lecture PDFs, PPTs, and notes actively.

Existing study tools usually provide summaries or quizzes, but they do not create a continuous motivation loop.  
As a result, students may generate study materials once and then stop using them.

## Target User

- Students who want a more engaging way to review lecture notes
- Students who lose focus during class
- Students who want to turn boring course materials into a game-like study routine

## Core Concept

One lecture file equals one guinea pig.

When the user creates a guinea pig from a lecture file, the system generates quizzes based on that material.  
Each correct answer gives XP to the guinea pig.  
As the user solves more quizzes, the guinea pig grows.

## User Value

- Turns passive lecture materials into active quizzes
- Makes studying feel like raising a pet
- Gives users a reason to continue reviewing the same material
- Connects learning progress to visible pet growth

## MVP Features

1. User enters a nickname to start.
2. User sees a dashboard of created guinea pigs.
3. User creates a new guinea pig from lecture material.
4. User provides a source file name and lecture text.
5. System randomly creates a baby guinea pig.
6. System generates 5 quizzes from the lecture content.
7. User sees guinea pig status on the left and quiz list on the right.
8. User solves quizzes one by one.
9. Correct answers increase XP and may level up the guinea pig.
10. Wrong answers show explanation but do not increase XP.
11. User can generate more quizzes for the same guinea pig.

## MVP Simplifications

- Use nickname-based mock login instead of real authentication.
- Use lecture text input instead of real PDF/PPT parsing at first.
- Use mock quiz generation before connecting a real AI API.
- Use in-memory backend storage before adding a database.
- Use simple CSS/SVG/emoji-based guinea pig visuals before custom illustrations.

## Out of Scope

- Real payment
- Complex account system
- OAuth login
- Full LMS integration
- Advanced pet customization
- Real-time multiplayer
- Production-grade database
- Mobile app
