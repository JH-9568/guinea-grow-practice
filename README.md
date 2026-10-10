# GuineaGrow

**오늘 푼 퀴즈만큼, 내 기니피그도 자랍니다.**

강의별 기니피그를 만들고 퀴즈를 풀며 성장시키는 학습 웹 MVP입니다. 문서·화면 흐름·API 계약을 먼저 정리하고 구현하는 연습 프로젝트이기도 합니다.

[프로젝트 소개](https://jinhyeong-studio.jinhyeong9568-663.workers.dev/projects/guineagrow)

<img src="https://github.com/user-attachments/assets/eed170eb-cb89-4e0b-8055-c1199e1a6fb0" alt="GuineaGrow 기니피그 캐릭터" width="320" />

## 학습 루프

**닉네임 입력 → 강의 선택 → 퀴즈 풀이 → 경험치 획득 → 캐릭터 성장**

- 강의 하나와 기니피그 하나를 연결
- 정답마다 20 XP, 100 XP마다 레벨 상승
- 4단계 성장 상태와 기록 확인

## 구현과 현재 범위

**React · TypeScript · Vite / Express · TypeScript**

프론트엔드와 API 서버를 분리하고 [API 계약](docs/API_CONTRACT.md)을 공유합니다.

현재 퀴즈는 **모의 데이터**이며 실제 AI 문제 생성은 구현하지 않았습니다. 서버는 인메모리 저장소를 사용하므로 재시작하면 데이터가 사라집니다. 닉네임 선택은 보안 인증이 아닙니다.

## 실행

각 폴더에서 별도 터미널로 실행합니다.

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

환경 설정은 [.env.example](.env.example)을 참고합니다. 각 폴더의 `npm run build`로 빌드를 확인합니다.

## 문서

[제품](docs/PRODUCT.md) · [화면 흐름](docs/SCREEN_FLOW.md) · [API 계약](docs/API_CONTRACT.md) · [작업 계획](docs/TASKS.md) · [개발 규칙](AGENTS.md)
