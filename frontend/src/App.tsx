import { useState } from 'react'
import './App.css'
import {
  answerQuiz,
  createGuineaPig,
  createUser,
  generateQuizzes,
  getGuineaPig,
  getGuineaPigs,
  getQuizzes,
  getMoodMessage,
  type GuineaPig,
  type GuineaPigSummary,
  type Quiz,
  type User,
} from './mockStudyPetApi'

type Screen = 'start' | 'dashboard' | 'create' | 'detail'
type DemoState = 'ready' | 'loading' | 'error'
type PigRecord = {
  guineaPig: GuineaPig
  quizzes: Quiz[]
}

function getStageLabel(stage: GuineaPig['stage']) {
  if (stage === 'adult') return '어른'
  if (stage === 'teen') return '청소년'
  if (stage === 'child') return '어린이'
  return '아기'
}

function getMoodLabel(mood: GuineaPig['mood']) {
  if (mood === 'happy') return '행복'
  if (mood === 'sad') return '시무룩'
  if (mood === 'levelup') return '레벨업'
  return '평온'
}

function getQuizStatusLabel(status: Quiz['status']) {
  if (status === 'correct') return '정답'
  if (status === 'wrong') return '오답'
  return '미풀이'
}

function GuineaPigVisual({ mood }: { mood: GuineaPig['mood'] }) {
  return (
    <div className={`pet-preview pet-preview--${mood}`} aria-label={`기니피그 상태: ${getMoodLabel(mood)}`}>
      <div className="pet-preview__halo" />
      <div className="pet">
        <div className="pet__ear pet__ear--left" />
        <div className="pet__ear pet__ear--right" />
        <div className="pet__face">
          <span className="pet__eye" />
          <span className="pet__eye" />
          <span className="pet__mouth" />
        </div>
        <div className="pet__belly" />
        {(mood === 'happy' || mood === 'levelup') && <div className="hay" aria-hidden="true" />}
      </div>
      <div className="pet-preview__surface" />
    </div>
  )
}

function XpBar({ xp }: { xp: number }) {
  const progress = xp % 100

  return (
    <div className="xp">
      <div className="meta-row">
        <span>XP</span>
        <strong>{progress}/100</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function StartScreen({
  appState,
  errorMessage,
  onStart,
}: {
  appState: DemoState
  errorMessage: string | null
  onStart: (nickname: string) => void
}) {
  const [nickname, setNickname] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = nickname.trim()
    if (trimmed) onStart(trimmed.slice(0, 30))
  }

  return (
    <section className="hero-tile">
      <div className="hero-tile__copy">
        <p className="eyebrow">GuineaGrow</p>
        <h1>강의 노트를 성장하는 기니피그로 바꿔보세요.</h1>
        <p>
          닉네임으로 시작하고, 강의 텍스트로 기니피그를 만든 뒤 퀴즈를 풀며
          키워보세요.
        </p>
        <form className="start-form" onSubmit={submit}>
          <label htmlFor="nickname">닉네임</label>
          <div className="input-row">
            <input
              id="nickname"
              maxLength={30}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="예: 지니"
              value={nickname}
            />
            <button className="primary-button" type="submit" disabled={!nickname.trim()}>
              {appState === 'loading' ? '시작 중' : '시작하기'}
            </button>
          </div>
          {appState === 'error' && errorMessage && (
            <div className="state-panel state-panel--error">
              <strong>시작할 수 없어요</strong>
              <p>{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
      <GuineaPigVisual mood="idle" />
    </section>
  )
}

function DashboardScreen({
  summaries,
  user,
  appState,
  errorMessage,
  onCreate,
  onOpenPig,
}: {
  summaries: GuineaPigSummary[]
  user: User
  appState: DemoState
  errorMessage: string | null
  onCreate: () => void
  onOpenPig: (id: string) => void
}) {
  return (
    <section className="content-band">
      <div className="section-heading">
        <span>
          <p className="eyebrow">대시보드</p>
          <h1>{user.nickname}님의 기니피그</h1>
        </span>
        <button className="primary-button" type="button" onClick={onCreate}>
          기니피그 만들기
        </button>
      </div>

      {appState === 'loading' && (
        <div className="state-panel state-panel--loading">
          <span className="loader" />
          <strong>기니피그를 불러오는 중</strong>
        </div>
      )}

      {appState === 'error' && errorMessage && (
        <div className="state-panel state-panel--error">
          <strong>대시보드를 불러올 수 없어요</strong>
          <p>{errorMessage}</p>
        </div>
      )}

      {appState !== 'loading' && summaries.length === 0 ? (
        <div className="state-panel state-panel--large">
          <strong>아직 기니피그가 없어요</strong>
          <p>강의 파일명과 강의 텍스트로 첫 공부 펫을 만들어보세요.</p>
          <button className="secondary-button" type="button" onClick={onCreate}>
            첫 기니피그 만들기
          </button>
        </div>
      ) : (
        <div className="pig-grid">
          {summaries.map((summary) => (
            <button
              className="pig-card"
              key={summary.id}
              type="button"
              onClick={() => onOpenPig(summary.id)}
            >
              <span className="pig-card__avatar" aria-hidden="true" />
              <span>
                <strong>{summary.name}</strong>
                <small>{summary.sourceFileName}</small>
              </span>
              <span className="pig-card__stats">
                Lv. {summary.level} · {getStageLabel(summary.stage)} · 미풀이 {summary.unsolvedQuizCount}개
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function CreateScreen({
  demoState,
  onBack,
  onCreate,
}: {
  demoState: DemoState
  onBack: () => void
  onCreate: (sourceFileName: string, lectureText: string) => void
}) {
  const [sourceFileName, setSourceFileName] = useState('운영체제 1강.pdf')
  const [lectureText, setLectureText] = useState(
    'A process is a program in execution. Threads are lightweight units of execution within a process. The operating system schedules processes and manages memory.',
  )

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sourceFileName.trim() && lectureText.trim().length >= 20) {
      onCreate(sourceFileName.trim(), lectureText.trim())
    }
  }

  return (
    <section className="content-band create-screen">
      <div className="section-heading">
        <span>
          <p className="eyebrow">생성</p>
          <h1>강의 자료로 기니피그를 만들어요.</h1>
        </span>
        <button className="secondary-button" type="button" onClick={onBack}>
          돌아가기
        </button>
      </div>
      <div className="create-layout">
        <aside className="create-preview panel">
          <GuineaPigVisual mood="idle" />
          <div>
            <p className="eyebrow">새 공부 펫</p>
            <h2>강의 하나가 기니피그 한 마리가 됩니다.</h2>
            <p>
              지금은 강의 텍스트를 붙여넣어 시작합니다. 백엔드가 아기 기니피그와
              시작 퀴즈 5개를 만들어줍니다.
            </p>
          </div>
        </aside>

        <form className="create-form panel" onSubmit={submit}>
          <label htmlFor="sourceFileName">자료 파일명</label>
          <input
            id="sourceFileName"
            onChange={(event) => setSourceFileName(event.target.value)}
            value={sourceFileName}
          />
          <label htmlFor="lectureText">강의 텍스트</label>
          <textarea
            id="lectureText"
            onChange={(event) => setLectureText(event.target.value)}
            rows={10}
            value={lectureText}
          />
          {demoState === 'loading' && (
            <div className="state-panel state-panel--loading">
              <span className="loader" />
              <strong>아기 기니피그를 만드는 중</strong>
            </div>
          )}
          {demoState === 'error' && (
            <div className="state-panel state-panel--error">
              <strong>기니피그를 만들 수 없어요</strong>
              <p>강의 텍스트는 최소 20자 이상이어야 합니다.</p>
            </div>
          )}
          <button
            className="primary-button"
            type="submit"
          disabled={!sourceFileName.trim() || lectureText.trim().length < 20 || demoState === 'loading'}
        >
          만들기
        </button>
        </form>
      </div>
    </section>
  )
}

function DetailScreen({
  record,
  selectedQuiz,
  onBack,
  onGenerateMore,
  onOpenQuiz,
}: {
  record: PigRecord
  selectedQuiz: Quiz | null
  onBack: () => void
  onGenerateMore: () => void
  onOpenQuiz: (quiz: Quiz) => void
}) {
  const { guineaPig, quizzes } = record
  const solvedCount = quizzes.filter((quiz) => quiz.status !== 'unsolved').length

  return (
    <section className="detail-layout">
      <aside className="panel pet-panel">
        <button className="text-button" type="button" onClick={onBack}>
          대시보드로 돌아가기
        </button>
        <GuineaPigVisual mood={guineaPig.mood} />
        <div className="pet-copy">
          <p className="eyebrow">{guineaPig.sourceFileName}</p>
          <h1>{guineaPig.name}</h1>
          <p>{getMoodMessage(guineaPig.mood)}</p>
        </div>
        <div className="stat-grid">
          <span>레벨 <strong>{guineaPig.level}</strong></span>
          <span>성장 단계 <strong>{getStageLabel(guineaPig.stage)}</strong></span>
          <span>기분 <strong>{getMoodLabel(guineaPig.mood)}</strong></span>
        </div>
        <XpBar xp={guineaPig.xp} />
      </aside>

      <main className="panel quiz-panel">
        <div className="panel__heading">
          <span>
            <p className="eyebrow">퀴즈 목록</p>
            <h1>{solvedCount}/{quizzes.length}개 풀이 완료</h1>
          </span>
          <button className="secondary-button" type="button" onClick={onGenerateMore}>
            퀴즈 더 만들기
          </button>
        </div>
        <div className="quiz-list">
          {quizzes.map((quiz, index) => (
            <button
              className={selectedQuiz?.id === quiz.id ? 'quiz-card quiz-card--active' : 'quiz-card'}
              key={quiz.id}
              type="button"
              onClick={() => onOpenQuiz(quiz)}
            >
              <span>
                <strong>퀴즈 {index + 1}</strong>
                <small>{quiz.question}</small>
              </span>
              <span className={`status-badge status-badge--${quiz.status}`}>
                {getQuizStatusLabel(quiz.status)}
              </span>
            </button>
          ))}
        </div>
      </main>
    </section>
  )
}

function QuizModal({
  quiz,
  onClose,
  onSubmit,
}: {
  quiz: Quiz
  onClose: () => void
  onSubmit: (quizId: string, selectedIndex: number) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(quiz.selectedIndex)

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <div className="panel__heading">
          <span>
            <p className="eyebrow">퀴즈</p>
            <h1 id="quiz-title">{quiz.question}</h1>
          </span>
          <button className="text-button" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="choice-list">
          {quiz.choices.map((choice, index) => (
            <button
              className={selectedIndex === index ? 'choice choice--selected' : 'choice'}
              key={choice}
              type="button"
              onClick={() => setSelectedIndex(index)}
              disabled={quiz.status !== 'unsolved'}
            >
              {choice}
            </button>
          ))}
        </div>
        {quiz.status !== 'unsolved' && (
          <div className={quiz.status === 'correct' ? 'state-panel' : 'state-panel state-panel--error'}>
            <strong>{quiz.status === 'correct' ? '정답이에요' : '아쉬워요'}</strong>
            <p>{quiz.explanation}</p>
          </div>
        )}
        {quiz.status === 'unsolved' && (
          <button
            className="primary-button"
            type="button"
            onClick={() => selectedIndex !== null && onSubmit(quiz.id, selectedIndex)}
            disabled={selectedIndex === null}
          >
            답 제출하기
          </button>
        )}
      </section>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [user, setUser] = useState<User | null>(null)
  const [summaries, setSummaries] = useState<GuineaPigSummary[]>([])
  const [activeRecord, setActiveRecord] = useState<PigRecord | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [demoState, setDemoState] = useState<DemoState>('ready')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedQuiz =
    activeRecord?.quizzes.find((quiz) => quiz.id === selectedQuizId) ?? null

  async function start(nickname: string) {
    setDemoState('loading')
    setErrorMessage(null)

    try {
      const createdUser = await createUser(nickname)
      setUser(createdUser)
      await loadDashboard(createdUser.id)
      setScreen('dashboard')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  async function loadDashboard(userId: string) {
    setDemoState('loading')
    setErrorMessage(null)

    try {
      const data = await getGuineaPigs(userId)
      setSummaries(data)
      setDemoState('ready')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  async function createPig(sourceFileName: string, lectureText: string) {
    if (!user || lectureText.length < 20) {
      setErrorMessage('강의 텍스트는 최소 20자 이상이어야 합니다.')
      setDemoState('error')
      return
    }

    setDemoState('loading')
    setErrorMessage(null)

    try {
      const result = await createGuineaPig({ userId: user.id, sourceFileName, lectureText })
      setActiveRecord(result)
      setSelectedQuizId(null)
      await loadDashboard(user.id)
      setDemoState('ready')
      setScreen('detail')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  async function openPig(id: string) {
    setDemoState('loading')
    setErrorMessage(null)

    try {
      const [guineaPig, quizzes] = await Promise.all([getGuineaPig(id), getQuizzes(id)])
      setActiveRecord({ guineaPig, quizzes })
      setSelectedQuizId(null)
      setDemoState('ready')
      setScreen('detail')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  async function generateMore() {
    if (!activeRecord) return
    setErrorMessage(null)

    try {
      const generated = await generateQuizzes(activeRecord.guineaPig.id, 5)
      setActiveRecord({
        ...activeRecord,
        quizzes: [...activeRecord.quizzes, ...generated],
      })
      if (user) await loadDashboard(user.id)
      setScreen('detail')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  async function submitAnswer(quizId: string, selectedIndex: number) {
    if (!activeRecord) return
    const quiz = activeRecord.quizzes.find((item) => item.id === quizId)
    if (!quiz || quiz.status !== 'unsolved') return

    try {
      const result = await answerQuiz(quizId, selectedIndex)
      setActiveRecord({
        guineaPig: {
          ...activeRecord.guineaPig,
          ...result.guineaPig,
        },
        quizzes: activeRecord.quizzes.map((item) =>
          item.id === quizId
            ? {
                ...item,
                ...result.quiz,
                explanation: result.explanation,
              }
            : item,
        ),
      })
      if (user) await loadDashboard(user.id)
      setScreen('detail')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setDemoState('error')
    }
  }

  return (
    <main className="app-shell">
      <nav className="global-nav" aria-label="Main navigation">
        <span className="brand-mark" aria-hidden="true" />
        <button className="nav-link" type="button" onClick={() => setScreen(user ? 'dashboard' : 'start')}>
          GuineaGrow
        </button>
        {user && <span>{user.nickname}</span>}
      </nav>

      {screen === 'start' && (
        <StartScreen appState={demoState} errorMessage={errorMessage} onStart={start} />
      )}
      {screen === 'dashboard' && user && (
        <DashboardScreen
          summaries={summaries}
          user={user}
          appState={demoState}
          errorMessage={errorMessage}
          onCreate={() => setScreen('create')}
          onOpenPig={openPig}
        />
      )}
      {screen === 'create' && (
        <CreateScreen
          demoState={demoState}
          onBack={() => setScreen('dashboard')}
          onCreate={createPig}
        />
      )}
      {screen === 'detail' && activeRecord && (
        <DetailScreen
          record={activeRecord}
          selectedQuiz={selectedQuiz}
          onBack={() => {
            if (user) void loadDashboard(user.id)
            setScreen('dashboard')
          }}
          onGenerateMore={generateMore}
          onOpenQuiz={(quiz) => setSelectedQuizId(quiz.id)}
        />
      )}
      {selectedQuiz && screen === 'detail' && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuizId(null)}
          onSubmit={submitAnswer}
        />
      )}
    </main>
  )
}

export default App
