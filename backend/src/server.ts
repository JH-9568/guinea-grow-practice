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

type GeneratedQuiz = {
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

const app = express()
const port = Number(process.env.PORT ?? 3000)
const openAiApiKey = process.env.OPENAI_API_KEY
const openAiModel = process.env.OPENAI_MODEL ?? 'gpt-5-mini'

const users = new Map<string, User>()
const guineaPigs = new Map<string, GuineaPig>()
const quizzes = new Map<string, Quiz>()
const lectureTexts = new Map<string, string>()

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

app.post('/api/guinea-pigs', async (request, response) => {
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
  const generatedQuizzes = await generateQuizzes(guineaPig.id, lectureText, 5)

  guineaPigs.set(guineaPig.id, guineaPig)
  lectureTexts.set(guineaPig.id, lectureText)
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

app.post('/api/guinea-pigs/:id/quizzes/generate', async (request, response) => {
  const guineaPig = guineaPigs.get(request.params.id)

  if (!guineaPig) {
    sendError(response, 'Guinea pig not found.', 404)
    return
  }

  const rawCount = request.body?.count
  const count = Number.isInteger(rawCount) && rawCount > 0 ? Math.min(rawCount, 20) : 5
  const lectureText = lectureTexts.get(guineaPig.id) ?? guineaPig.sourceFileName
  const generatedQuizzes = await generateQuizzes(guineaPig.id, lectureText, count)
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

async function generateQuizzes(guineaPigId: string, lectureText: string, count: number): Promise<Quiz[]> {
  const generatedQuizzes = await generateAiQuizzes(lectureText, count).catch(() => null)

  if (generatedQuizzes) {
    return generatedQuizzes.map((quiz) => createQuiz(guineaPigId, quiz))
  }

  return generateMockQuizzes(guineaPigId, lectureText, count)
}

function generateMockQuizzes(guineaPigId: string, lectureText: string, count: number): Quiz[] {
  const topic = extractTopic(lectureText)
  const subject = `${topic}${subjectParticle(topic)}`
  const object = `${topic}${objectParticle(topic)}`

  return Array.from({ length: count }, (_unused, index) => ({
    id: `quiz_${quizSequence++}`,
    guineaPigId,
    question: index === 0 ? `${subject} 무엇인가요?` : `${object} 가장 잘 설명한 답은 무엇인가요?`,
    choices: [
      `${subject} 이 강의 자료의 핵심 개념입니다.`,
      `${subject} 저장 장치의 한 종류입니다.`,
      `${subject} 로그인 방식입니다.`,
      `${subject} 이 강의와 관련이 없습니다.`,
    ],
    answerIndex: 0,
    explanation: `mock 퀴즈 생성기가 강의 텍스트에서 "${topic}"${objectParticle(topic)} 핵심 표현으로 선택했습니다.`,
    status: 'unsolved',
    selectedIndex: null,
  }))
}

async function generateAiQuizzes(lectureText: string, count: number): Promise<GeneratedQuiz[] | null> {
  if (!openAiApiKey) return null

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      instructions:
        'You generate Korean multiple-choice study quizzes from lecture notes. Return only data matching the JSON schema.',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `다음 강의 자료를 바탕으로 객관식 퀴즈 ${count}개를 만들어줘. 각 문항은 선택지 4개, 정답 인덱스, 짧은 해설을 포함해야 해.\n\n${lectureText}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'lecture_quizzes',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['quizzes'],
            properties: {
              quizzes: {
                type: 'array',
                minItems: count,
                maxItems: count,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['question', 'choices', 'answerIndex', 'explanation'],
                  properties: {
                    question: { type: 'string' },
                    choices: {
                      type: 'array',
                      minItems: 4,
                      maxItems: 4,
                      items: { type: 'string' },
                    },
                    answerIndex: {
                      type: 'integer',
                      minimum: 0,
                      maximum: 3,
                    },
                    explanation: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }),
  })

  if (!response.ok) return null

  const payload = await response.json()
  const outputText = extractResponseText(payload)
  if (!outputText) return null

  const parsed = JSON.parse(outputText) as unknown
  if (!isRecord(parsed) || !Array.isArray(parsed.quizzes)) return null

  const generatedQuizzes = parsed.quizzes
    .map(toGeneratedQuiz)
    .filter((quiz): quiz is GeneratedQuiz => quiz !== null)

  return generatedQuizzes.length === count ? generatedQuizzes : null
}

function createQuiz(guineaPigId: string, quiz: GeneratedQuiz): Quiz {
  return {
    id: `quiz_${quizSequence++}`,
    guineaPigId,
    question: quiz.question,
    choices: quiz.choices,
    answerIndex: quiz.answerIndex,
    explanation: quiz.explanation,
    status: 'unsolved',
    selectedIndex: null,
  }
}

function toGeneratedQuiz(value: unknown): GeneratedQuiz | null {
  if (!isRecord(value)) return null
  const question = value.question
  const choices = value.choices
  const answerIndex = value.answerIndex
  const explanation = value.explanation

  if (typeof question !== 'string' || !question.trim()) return null
  if (!Array.isArray(choices) || choices.length !== 4) return null
  if (!choices.every((choice) => typeof choice === 'string' && choice.trim())) return null
  if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
    return null
  }
  if (typeof explanation !== 'string' || !explanation.trim()) return null

  return {
    question: question.trim(),
    choices: choices.map((choice) => choice.trim()),
    answerIndex,
    explanation: explanation.trim(),
  }
}

function extractResponseText(payload: unknown): string | null {
  if (!isRecord(payload)) return null
  if (typeof payload.output_text === 'string') return payload.output_text
  if (!Array.isArray(payload.output)) return null

  for (const outputItem of payload.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) continue

    for (const contentItem of outputItem.content) {
      if (!isRecord(contentItem)) continue
      if (typeof contentItem.text === 'string') return contentItem.text
    }
  }

  return null
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

  return firstKeyword?.replace(/(은|는|이|가|을|를|와|과|로|으로|에|에서)$/, '') ?? '강의 개념'
}

function subjectParticle(value: string): '은' | '는' {
  return hasFinalConsonant(value) ? '은' : '는'
}

function objectParticle(value: string): '을' | '를' {
  return hasFinalConsonant(value) ? '을' : '를'
}

function hasFinalConsonant(value: string): boolean {
  const lastCode = value.charCodeAt(value.length - 1)
  const hangulStart = 0xac00
  const hangulEnd = 0xd7a3

  if (lastCode < hangulStart || lastCode > hangulEnd) return false

  return (lastCode - hangulStart) % 28 !== 0
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
