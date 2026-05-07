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

function GuineaPigVisual({ mood }: { mood: GuineaPig['mood'] }) {
  return (
    <div className={`pet-preview pet-preview--${mood}`} aria-label={`Guinea pig mood: ${mood}`}>
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
        <h1>Turn lecture notes into a guinea pig you can grow.</h1>
        <p>
          Start with a nickname, create a guinea pig from lecture text, then raise it by
          solving mock quizzes.
        </p>
        <form className="start-form" onSubmit={submit}>
          <label htmlFor="nickname">Nickname</label>
          <div className="input-row">
            <input
              id="nickname"
              maxLength={30}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Jinhyung"
              value={nickname}
            />
            <button className="primary-button" type="submit" disabled={!nickname.trim()}>
              {appState === 'loading' ? 'Starting' : 'Start'}
            </button>
          </div>
          {appState === 'error' && errorMessage && (
            <div className="state-panel state-panel--error">
              <strong>Could not start</strong>
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
          <p className="eyebrow">Dashboard</p>
          <h1>{user.nickname}&apos;s guinea pigs</h1>
        </span>
        <button className="primary-button" type="button" onClick={onCreate}>
          Create Guinea Pig
        </button>
      </div>

      {appState === 'loading' && (
        <div className="state-panel state-panel--loading">
          <span className="loader" />
          <strong>Loading guinea pigs</strong>
        </div>
      )}

      {appState === 'error' && errorMessage && (
        <div className="state-panel state-panel--error">
          <strong>Could not load dashboard</strong>
          <p>{errorMessage}</p>
        </div>
      )}

      {appState !== 'loading' && summaries.length === 0 ? (
        <div className="state-panel state-panel--large">
          <strong>No guinea pigs yet</strong>
          <p>Create your first study pet from a file name and lecture text.</p>
          <button className="secondary-button" type="button" onClick={onCreate}>
            Create first guinea pig
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
                Lv. {summary.level} · {summary.stage} · {summary.unsolvedQuizCount} unsolved
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
  const [sourceFileName, setSourceFileName] = useState('Operating Systems Lecture 1.pdf')
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
          <p className="eyebrow">Create</p>
          <h1>Create a guinea pig from lecture material.</h1>
        </span>
        <button className="secondary-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="create-layout">
        <aside className="create-preview panel">
          <GuineaPigVisual mood="idle" />
          <div>
            <p className="eyebrow">New study pet</p>
            <h2>One lecture becomes one guinea pig.</h2>
            <p>
              Paste lecture text for now. The backend will create a baby guinea pig and
              five starter quizzes from this material.
            </p>
          </div>
        </aside>

        <form className="create-form panel" onSubmit={submit}>
          <label htmlFor="sourceFileName">Source file name</label>
          <input
            id="sourceFileName"
            onChange={(event) => setSourceFileName(event.target.value)}
            value={sourceFileName}
          />
          <label htmlFor="lectureText">Lecture text</label>
          <textarea
            id="lectureText"
            onChange={(event) => setLectureText(event.target.value)}
            rows={10}
            value={lectureText}
          />
          {demoState === 'loading' && (
            <div className="state-panel state-panel--loading">
              <span className="loader" />
              <strong>Generating a baby guinea pig</strong>
            </div>
          )}
          {demoState === 'error' && (
            <div className="state-panel state-panel--error">
              <strong>Could not create guinea pig</strong>
              <p>Lecture text must be at least 20 characters.</p>
            </div>
          )}
          <button
            className="primary-button"
            type="submit"
            disabled={!sourceFileName.trim() || lectureText.trim().length < 20 || demoState === 'loading'}
          >
            Create
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
          Back to dashboard
        </button>
        <GuineaPigVisual mood={guineaPig.mood} />
        <div className="pet-copy">
          <p className="eyebrow">{guineaPig.sourceFileName}</p>
          <h1>{guineaPig.name}</h1>
          <p>{getMoodMessage(guineaPig.mood)}</p>
        </div>
        <div className="stat-grid">
          <span>Level <strong>{guineaPig.level}</strong></span>
          <span>Stage <strong>{guineaPig.stage}</strong></span>
          <span>Mood <strong>{guineaPig.mood}</strong></span>
        </div>
        <XpBar xp={guineaPig.xp} />
      </aside>

      <main className="panel quiz-panel">
        <div className="panel__heading">
          <span>
            <p className="eyebrow">Quiz list</p>
            <h1>{solvedCount}/{quizzes.length} solved</h1>
          </span>
          <button className="secondary-button" type="button" onClick={onGenerateMore}>
            Generate More Quizzes
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
                <strong>Quiz {index + 1}</strong>
                <small>{quiz.question}</small>
              </span>
              <span className={`status-badge status-badge--${quiz.status}`}>{quiz.status}</span>
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
            <p className="eyebrow">Quiz</p>
            <h1 id="quiz-title">{quiz.question}</h1>
          </span>
          <button className="text-button" type="button" onClick={onClose}>
            Close
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
            <strong>{quiz.status === 'correct' ? 'Correct' : 'Not quite'}</strong>
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
            Submit answer
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
      setErrorMessage('Lecture text must be at least 20 characters.')
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
