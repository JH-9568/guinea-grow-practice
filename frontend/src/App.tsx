import { useMemo, useState } from 'react'
import './App.css'
import {
  answerMockQuiz,
  createMockGuineaPig,
  createMockUser,
  generateMockQuizzes,
  getMoodMessage,
  summarizeGuineaPig,
  type GuineaPig,
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

function StartScreen({ onStart }: { onStart: (nickname: string) => void }) {
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
              Start
            </button>
          </div>
        </form>
      </div>
      <GuineaPigVisual mood="idle" />
    </section>
  )
}

function DashboardScreen({
  records,
  user,
  onCreate,
  onOpenPig,
}: {
  records: PigRecord[]
  user: User
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

      {records.length === 0 ? (
        <div className="state-panel state-panel--large">
          <strong>No guinea pigs yet</strong>
          <p>Create your first study pet from a file name and lecture text.</p>
          <button className="secondary-button" type="button" onClick={onCreate}>
            Create first guinea pig
          </button>
        </div>
      ) : (
        <div className="pig-grid">
          {records.map(({ guineaPig, quizzes }) => {
            const summary = summarizeGuineaPig(guineaPig, quizzes)
            return (
              <button
                className="pig-card"
                key={guineaPig.id}
                type="button"
                onClick={() => onOpenPig(guineaPig.id)}
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
            )
          })}
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
    <section className="content-band content-band--narrow">
      <div className="section-heading">
        <span>
          <p className="eyebrow">Create</p>
          <h1>Create a guinea pig from lecture material.</h1>
        </span>
        <button className="secondary-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
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
          rows={8}
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
  const [records, setRecords] = useState<PigRecord[]>([])
  const [activePigId, setActivePigId] = useState<string | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [demoState, setDemoState] = useState<DemoState>('ready')

  const activeRecord = useMemo(
    () => records.find((record) => record.guineaPig.id === activePigId) ?? null,
    [activePigId, records],
  )
  const selectedQuiz =
    activeRecord?.quizzes.find((quiz) => quiz.id === selectedQuizId) ?? null

  function start(nickname: string) {
    setUser(createMockUser(nickname))
    setScreen('dashboard')
  }

  function createPig(sourceFileName: string, lectureText: string) {
    if (!user || lectureText.length < 20) {
      setDemoState('error')
      return
    }

    setDemoState('loading')
    window.setTimeout(() => {
      const result = createMockGuineaPig({ userId: user.id, sourceFileName, lectureText })
      setRecords((current) => [...current, result])
      setActivePigId(result.guineaPig.id)
      setSelectedQuizId(result.quizzes[0]?.id ?? null)
      setDemoState('ready')
      setScreen('detail')
    }, 240)
  }

  function openPig(id: string) {
    const record = records.find((item) => item.guineaPig.id === id)
    setActivePigId(id)
    setSelectedQuizId(record?.quizzes[0]?.id ?? null)
    setScreen('detail')
  }

  function generateMoreQuizzes() {
    if (!activeRecord) return
    setRecords((current) =>
      current.map((record) =>
        record.guineaPig.id === activeRecord.guineaPig.id
          ? {
              ...record,
              quizzes: [
                ...record.quizzes,
                ...generateMockQuizzes(record.guineaPig.id, record.guineaPig.sourceFileName, 5),
              ],
            }
          : record,
      ),
    )
  }

  function submitAnswer(quizId: string, selectedIndex: number) {
    if (!activeRecord) return
    const quiz = activeRecord.quizzes.find((item) => item.id === quizId)
    if (!quiz || quiz.status !== 'unsolved') return

    const result = answerMockQuiz({
      guineaPig: activeRecord.guineaPig,
      quiz,
      selectedIndex,
    })

    setRecords((current) =>
      current.map((record) =>
        record.guineaPig.id === activeRecord.guineaPig.id
          ? {
              guineaPig: result.guineaPig,
              quizzes: record.quizzes.map((item) => (item.id === quizId ? result.quiz : item)),
            }
          : record,
      ),
    )
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

      {screen === 'start' && <StartScreen onStart={start} />}
      {screen === 'dashboard' && user && (
        <DashboardScreen
          records={records}
          user={user}
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
          onBack={() => setScreen('dashboard')}
          onGenerateMore={generateMoreQuizzes}
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
