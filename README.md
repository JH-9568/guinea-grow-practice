# GuineaGrow

강의자료를 업로드하면 기니피그가 태어나고, 퀴즈를 맞힐수록 성장하는 학습형 육성 웹게임입니다.

## 서비스 개요

GuineaGrow는 지루한 강의자료 복습 과정을 게임처럼 바꾸는 웹 서비스입니다.

사용자는 강의 PDF, PPT, 노트 내용을 기반으로 하나의 기니피그를 생성합니다.  
생성된 기니피그는 해당 강의자료와 연결되며, AI가 만든 퀴즈를 풀 때마다 성장합니다.

정답을 맞히면 기니피그가 경험치를 얻고 점점 커지며, 일정 경험치에 도달하면 외형이 업그레이드됩니다.

## 핵심 컨셉

> 하나의 강의자료 = 하나의 기니피그

예를 들어 `운영체제 Lecture 1.pdf`를 넣으면, 해당 자료 전용 새끼 기니피그가 생성됩니다.  
사용자는 그 기니피그가 가진 퀴즈를 풀며 복습하고, 정답을 맞힐수록 기니피그를 성장시킬 수 있습니다.

## 주요 기능

- 닉네임 기반 간단 로그인
- 강의자료 기반 기니피그 생성
- 기니피그별 퀴즈 목록 제공
- 퀴즈 정답 제출
- 정답 시 XP 증가
- XP에 따른 기니피그 성장
- 레벨별 외형 변화
- 퀴즈 추가 생성 기능
- 추후 AI 기반 퀴즈 생성 확장 예정

## 성장 시스템

기니피그는 퀴즈 정답을 맞힐 때마다 경험치를 얻습니다.

- 정답: +20 XP
- 오답: +0 XP
- 100 XP마다 레벨업

성장 단계는 다음과 같습니다.

| Level | Stage |
|---|---|
| Lv.1 | Baby |
| Lv.2 | Child |
| Lv.3 | Teen |
| Lv.4+ | Adult |

기니피그는 같은 단계 안에서도 XP에 따라 조금씩 커지고, 레벨이 오르면 외형이 업그레이드됩니다.
<img width="1536" height="1024" alt="hungry-stages" src="https://github.com/user-attachments/assets/eed170eb-cb89-4e0b-8055-c1199e1a6fb0" />
<img width="1536" height="1024" alt="smart" src="https://github.com/user-attachments/assets/2fe6222a-2975-4393-93e0-0dd541faf029" />
<img width="1536" height="1024" alt="shy" src="https://github.com/user-attachments/assets/9b6c663f-cf31-4d94-9fb7-8c6ad61e505f" />
<img width="1536" height="1024" alt="playful" src="https://github.com/user-attachments/assets/fd697191-f546-43bf-ad86-218389f86719" />


## 기니피그 타입

현재 기획 중인 기니피그 타입은 다음과 같습니다.

| Type | Concept |
|---|---|
| hungry | 먹보 타입 |
| smart | 공부/똑똑이 타입 |
| shy | 소심하고 포근한 타입 |
| playful | 장난꾸러기/활발한 타입 |

각 타입은 Baby, Child, Teen, Adult의 4단계 성장 이미지를 가집니다.

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- In-memory storage for MVP

### AI

초기 MVP에서는 mock quiz generator를 사용합니다.  
이후 lecture text를 기반으로 실제 AI 퀴즈 생성 기능을 연결할 예정입니다.

## 개발 방식: AI Agent Harness Engineering

이 프로젝트는 단순히 AI에게 코드를 생성시키는 방식이 아니라, AI 에이전트가 안정적으로 작업할 수 있도록 사전에 개발 하네스를 구성한 뒤 구현을 진행했습니다.

### Harness Engineering

프로젝트 시작 전에 다음 문서들을 먼저 작성하여 AI 에이전트의 작업 범위와 판단 기준을 제한했습니다.

- `AGENTS.md`: 에이전트 작업 원칙, 금지사항, 검증 기준 정의
- `docs/PRODUCT.md`: 서비스 목적, 핵심 사용자, MVP 범위 정의
- `docs/SCREEN_FLOW.md`: 화면 흐름과 사용자 행동 시나리오 정의
- `docs/API_CONTRACT.md`: 프론트엔드와 백엔드 간 API 요청/응답 형식 정의
- `docs/TASKS.md`: 기능별 작업을 `[FE]`, `[BE]`, `[INT]`, `[AI]` 단위로 분리
- `docs/PROMPTS.md`: 반복적으로 사용할 Codex 작업 프롬프트 정리

이를 통해 AI 에이전트가 전체 프로젝트를 임의로 재작성하거나, 프론트엔드와 백엔드의 계약을 깨는 일을 줄이고자 했습니다.

### getdesign.md 활용

UI 디자인 방향은 `getdesign.md`를 활용해 디자인 시스템 문서인 `DESIGN.md`를 먼저 구성한 뒤 개발에 반영했습니다.

`DESIGN.md`는 색상, 타이포그래피, 레이아웃, 컴포넌트 스타일의 기준 역할을 하며, AI 에이전트가 일관된 화면을 생성할 수 있도록 하는 디자인 가이드로 사용했습니다.

단순히 “예쁘게 만들어줘”라고 지시하는 대신, 디자인 문서를 기반으로 다음 기준을 유지했습니다.

- 일관된 색상과 여백
- 부드럽고 귀여운 학습 게임 분위기
- 카드 기반 UI
- 명확한 화면 계층 구조
- 기니피그 성장 게임에 맞는 따뜻한 비주얼 톤

### Codex 기반 개발 흐름

개발 과정에서는 Codex를 활용하되, 모든 작업을 한 번에 맡기지 않고 문서 기반으로 작업 범위를 나누어 진행했습니다.

예시 작업 단위:

- 프론트엔드 mock MVP 구현
- 백엔드 mock API 구현
- 프론트엔드-백엔드 통합
- 기니피그 성장 UI 개선
- AI 퀴즈 생성 기능 확장

각 작업은 다음 원칙을 따릅니다.

1. 관련 문서 먼저 읽기
2. 지정된 영역만 수정하기
3. 불필요한 리팩토링 금지
4. 빌드 또는 테스트 실행
5. 변경 파일과 남은 위험 요소 요약

## 프로젝트 구조

```txt
guinea-grow/
├── AGENTS.md
├── DESIGN.md
├── README.md
├── docs/
│   ├── PRODUCT.md
│   ├── SCREEN_FLOW.md
│   ├── API_CONTRACT.md
│   ├── TASKS.md
│   └── PROMPTS.md
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── guinea-pigs/
│   └── src/
└── backend/
    └── src/
