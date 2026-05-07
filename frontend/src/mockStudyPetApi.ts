export type User = {
  id: string
  nickname: string
  createdAt: string
}

export type GuineaPig = {
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

export type GuineaPigSummary = GuineaPig & {
  quizCount: number
  unsolvedQuizCount: number
}

export type Quiz = {
  id: string
  guineaPigId: string
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
  status: 'unsolved' | 'correct' | 'wrong'
  selectedIndex: number | null
}

type ApiSuccess<T> = {
  success: true
  data: T
}

type ApiError = {
  success: false
  message: string
}

type CreateGuineaPigResponse = {
  guineaPig: GuineaPig
  quizzes: Quiz[]
}

type GenerateQuizzesResponse = {
  quizzes: Quiz[]
}

type AnswerQuizResponse = {
  quiz: Pick<Quiz, 'id' | 'status' | 'selectedIndex'>
  isCorrect: boolean
  gainedXp: number
  guineaPig: Pick<GuineaPig, 'id' | 'level' | 'xp' | 'stage' | 'mood'>
  explanation: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export async function createUser(nickname: string): Promise<User> {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ nickname }),
  })
}

export async function getGuineaPigs(userId: string): Promise<GuineaPigSummary[]> {
  return request<GuineaPigSummary[]>(`/guinea-pigs?userId=${encodeURIComponent(userId)}`)
}

export async function createGuineaPig({
  userId,
  sourceFileName,
  lectureText,
}: {
  userId: string
  sourceFileName: string
  lectureText: string
}): Promise<CreateGuineaPigResponse> {
  return request<CreateGuineaPigResponse>('/guinea-pigs', {
    method: 'POST',
    body: JSON.stringify({ userId, sourceFileName, lectureText }),
  })
}

export async function getGuineaPig(id: string): Promise<GuineaPig> {
  return request<GuineaPig>(`/guinea-pigs/${id}`)
}

export async function getQuizzes(guineaPigId: string): Promise<Quiz[]> {
  return request<Quiz[]>(`/guinea-pigs/${guineaPigId}/quizzes`)
}

export async function generateQuizzes(guineaPigId: string, count = 5): Promise<Quiz[]> {
  const response = await request<GenerateQuizzesResponse>(`/guinea-pigs/${guineaPigId}/quizzes/generate`, {
    method: 'POST',
    body: JSON.stringify({ count }),
  })

  return response.quizzes
}

export async function answerQuiz(quizId: string, selectedIndex: number): Promise<AnswerQuizResponse> {
  return request<AnswerQuizResponse>(`/quizzes/${quizId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ selectedIndex }),
  })
}

export function getMoodMessage(mood: GuineaPig['mood']) {
  if (mood === 'happy') return '정답이에요! 기니피그가 행복하게 건초를 먹고 있어요.'
  if (mood === 'sad') return '조금 아쉬워요. 기니피그가 고개를 갸웃거려요.'
  if (mood === 'levelup') return '레벨 업! 기니피그가 한 단계 성장했어요.'
  return '기니피그가 건초를 오물오물 먹고 있어요.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  const payload = (await response.json()) as ApiSuccess<T> | ApiError

  if (!payload.success) {
    throw new Error(payload.message)
  }

  return payload.data
}
