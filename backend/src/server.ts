import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

type ApiSuccess<T> = {
  success: true
  data: T
}

type ApiError = {
  success: false
  message: string
}

type User = {
  id: string
  nickname: string
  createdAt: string
}

type GuineaPig = {
  id: string
  userId: string
  name: string
  sourceFileName: string
  color: 'brown' | 'white' | 'cream' | 'mixed'
  personality: 'hungry' | 'smart' | 'shy' | 'playful'
  level: number
  xp: number
  stage: 'baby' | 'child' | 'teen' | 'adult'
  mood: 'idle' | 'happy' | 'sad' | 'levelup'
  createdAt: string
}

type GuineaPigSummary = GuineaPig & {
  quizCount: number
  unsolvedQuizCount: number
}

type Quiz = {
  id: string
  guineaPigId: string
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
  status: 'unsolved' | 'correct' | 'wrong'
  selectedIndex: number | null
}

const app = express()
const port = Number(process.env.PORT ?? 3000)

const users = new Map<string, User>()
const guineaPigs = new Map<string, GuineaPig>()
const quizzes = new Map<string, Quiz>()

let userSequence = 1
let pigSequence = 1
let quizSequence = 1

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  sendSuccess(response, { status: 'ok' })
})

app.post('/api/users', (request, response) => {
  const nickname = stringField(request.body, 'nickname')

  if (!nickname) {
    sendError(response, 'nickname is required.', 400)
    return
  }

  if (nickname.length > 30) {
    sendError(response, 'nickname max length is 30.', 400)
    return
  }

  const user: User = {
    id: `user_${userSequence++}`,
    nickname,
    createdAt: now(),
  }
  users.set(user.id, user)

  sendSuccess(response, user)
})

app.get('/api/guinea-pigs', (request, response) => {
  const userId = stringQuery(request.query.userId)

  if (!userId) {
    sendError(response, 'userId is required.', 400)
    return
  }

  const data = Array.from(guineaPigs.values())
    .filter((guineaPig) => guineaPig.userId === userId)
    .map(toGuineaPigSummary)

  sendSuccess(response, data)
})

app.post('/api/guinea-pigs', (request, response) => {
  const userId = stringField(request.body, 'userId')
  const sourceFileName = stringField(request.body, 'sourceFileName')
  const lectureText = stringField(request.body, 'lectureText')

  if (!userId) {
    sendError(response, 'userId is required.', 400)
    return
  }

  if (!sourceFileName) {
    sendError(response, 'sourceFileName is required.', 400)
    return
  }

  if (!lectureText) {
    sendError(response, 'lectureText is required.', 400)
    return
  }

  if (lectureText.length < 20) {
    sendError(response, 'lectureText should be at least 20 characters.', 400)
    return
  }

  const guineaPig = createGuineaPig(userId, sourceFileName, lectureText)
  const generatedQuizzes = generateQuizzes(guineaPig.id, lectureText, 5)

  guineaPigs.set(guineaPig.id, guineaPig)
  generatedQuizzes.forEach((quiz) => quizzes.set(quiz.id, quiz))

  sendSuccess(response, {
    guineaPig,
    quizzes: generatedQuizzes,
  })
})

app.get('/api/guinea-pigs/:id', (request, response) => {
  const guineaPig = guineaPigs.get(request.params.id)

  if (!guineaPig) {
    sendError(response, 'Guinea pig not found.', 404)
    return
  }

  sendSuccess(response, guineaPig)
})

app.get('/api/guinea-pigs/:id/quizzes', (request, response) => {
  if (!guineaPigs.has(request.params.id)) {
    sendError(response, 'Guinea pig not found.', 404)
    return
  }

  sendSuccess(response, getQuizzesForPig(request.params.id))
})

app.post('/api/guinea-pigs/:id/quizzes/generate', (request, response) => {
  const guineaPig = guineaPigs.get(request.params.id)

  if (!guineaPig) {
    sendError(response, 'Guinea pig not found.', 404)
    return
  }

  const rawCount = request.body?.count
  const count = Number.isInteger(rawCount) && rawCount > 0 ? Math.min(rawCount, 20) : 5
  const generatedQuizzes = generateQuizzes(guineaPig.id, guineaPig.sourceFileName, count)
  generatedQuizzes.forEach((quiz) => quizzes.set(quiz.id, quiz))

  sendSuccess(response, {
    quizzes: generatedQuizzes,
  })
})

app.post('/api/quizzes/:id/answer', (request, response) => {
  const quiz = quizzes.get(request.params.id)

  if (!quiz) {
    sendError(response, 'Quiz not found.', 404)
    return
  }

  const selectedIndex = request.body?.selectedIndex

  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= quiz.choices.length) {
    sendError(response, 'selectedIndex must be a valid choice index.', 400)
    return
  }

  if (quiz.status !== 'unsolved') {
    sendError(response, 'Quiz has already been answered.', 400)
    return
  }

  const guineaPig = guineaPigs.get(quiz.guineaPigId)

  if (!guineaPig) {
    sendError(response, 'Guinea pig not found.', 404)
    return
  }

  const isCorrect = selectedIndex === quiz.answerIndex
  const gainedXp = isCorrect ? 20 : 0
  const nextXp = guineaPig.xp + gainedXp
  const nextLevel = Math.floor(nextXp / 100) + 1
  const updatedGuineaPig: GuineaPig = {
    ...guineaPig,
    xp: nextXp,
    level: nextLevel,
    stage: getStage(nextLevel),
    mood: nextLevel > guineaPig.level ? 'levelup' : isCorrect ? 'happy' : 'sad',
  }
  const updatedQuiz: Quiz = {
    ...quiz,
    status: isCorrect ? 'correct' : 'wrong',
    selectedIndex,
  }

  guineaPigs.set(updatedGuineaPig.id, updatedGuineaPig)
  quizzes.set(updatedQuiz.id, updatedQuiz)

  sendSuccess(response, {
    quiz: {
      id: updatedQuiz.id,
      status: updatedQuiz.status,
      selectedIndex: updatedQuiz.selectedIndex,
    },
    isCorrect,
    gainedXp,
    guineaPig: {
      id: updatedGuineaPig.id,
      level: updatedGuineaPig.level,
      xp: updatedGuineaPig.xp,
      stage: updatedGuineaPig.stage,
      mood: updatedGuineaPig.mood,
    },
    explanation: updatedQuiz.explanation,
  })
})

app.use((_request, response) => {
  sendError(response, 'Route not found.', 404)
})

app.listen(port, () => {
  console.log(`GuineaGrow API listening on http://localhost:${port}/api`)
})

function sendSuccess<T>(response: express.Response<ApiSuccess<T>>, data: T, statusCode = 200) {
  response.status(statusCode).json({
    success: true,
    data,
  })
}

function sendError(response: express.Response<ApiError>, message: string, statusCode = 400) {
  response.status(statusCode).json({
    success: false,
    message,
  })
}

function createGuineaPig(userId: string, sourceFileName: string, lectureText: string): GuineaPig {
  const seed = sourceFileName.length + lectureText.length
  const names = ['Mochi', 'Nori', 'Bori', 'Pip', 'Coco']
  const colors: GuineaPig['color'][] = ['brown', 'white', 'cream', 'mixed']
  const personalities: GuineaPig['personality'][] = ['hungry', 'smart', 'shy', 'playful']

  return {
    id: `pig_${pigSequence++}`,
    userId,
    name: names[seed % names.length] ?? 'Mochi',
    sourceFileName,
    color: colors[seed % colors.length] ?? 'brown',
    personality: personalities[seed % personalities.length] ?? 'hungry',
    level: 1,
    xp: 0,
    stage: 'baby',
    mood: 'idle',
    createdAt: now(),
  }
}

function generateQuizzes(guineaPigId: string, lectureText: string, count: number): Quiz[] {
  const topic = extractTopic(lectureText)

  return Array.from({ length: count }, (_unused, index) => ({
    id: `quiz_${quizSequence++}`,
    guineaPigId,
    question: index === 0 ? `What is ${topic}?` : `Which answer best describes ${topic}?`,
    choices: [
      `${topic} is a key concept from the lecture material.`,
      `${topic} is a storage device.`,
      `${topic} is a login method.`,
      `${topic} is unrelated to the lecture.`,
    ],
    answerIndex: 0,
    explanation: `${topic} was selected from the lecture text by the mock quiz generator.`,
    status: 'unsolved',
    selectedIndex: null,
  }))
}

function toGuineaPigSummary(guineaPig: GuineaPig): GuineaPigSummary {
  const pigQuizzes = getQuizzesForPig(guineaPig.id)

  return {
    ...guineaPig,
    quizCount: pigQuizzes.length,
    unsolvedQuizCount: pigQuizzes.filter((quiz) => quiz.status === 'unsolved').length,
  }
}

function getQuizzesForPig(guineaPigId: string): Quiz[] {
  return Array.from(quizzes.values()).filter((quiz) => quiz.guineaPigId === guineaPigId)
}

function getStage(level: number): GuineaPig['stage'] {
  if (level >= 4) return 'adult'
  if (level === 3) return 'teen'
  if (level === 2) return 'child'
  return 'baby'
}

function extractTopic(lectureText: string): string {
  const firstKeyword = lectureText
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .split(/\s+/)
    .find((word) => word.length > 3)

  return firstKeyword ?? 'a lecture concept'
}

function stringField(body: unknown, fieldName: string): string | null {
  if (!isRecord(body)) return null
  const value = body[fieldName]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function stringQuery(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function now(): string {
  return new Date().toISOString()
}
