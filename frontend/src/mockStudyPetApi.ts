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

const names = ['Mochi', 'Nori', 'Bori', 'Pip', 'Coco']
const colors: GuineaPig['color'][] = ['brown', 'white', 'cream', 'mixed']
const personalities: GuineaPig['personality'][] = ['hungry', 'smart', 'shy', 'playful']

export function createMockUser(nickname: string): User {
  return {
    id: 'user_1',
    nickname,
    createdAt: new Date().toISOString(),
  }
}

export function createMockGuineaPig({
  userId,
  sourceFileName,
  lectureText,
}: {
  userId: string
  sourceFileName: string
  lectureText: string
}) {
  const seed = sourceFileName.length + lectureText.length
  const guineaPig: GuineaPig = {
    id: `pig_${Date.now()}`,
    userId,
    name: names[seed % names.length] ?? 'Mochi',
    sourceFileName,
    color: colors[seed % colors.length] ?? 'brown',
    personality: personalities[seed % personalities.length] ?? 'hungry',
    level: 1,
    xp: 0,
    stage: 'baby',
    mood: 'idle',
    createdAt: new Date().toISOString(),
  }

  return {
    guineaPig,
    quizzes: generateMockQuizzes(guineaPig.id, lectureText, 5),
  }
}

export function summarizeGuineaPig(guineaPig: GuineaPig, quizzes: Quiz[]): GuineaPigSummary {
  return {
    ...guineaPig,
    quizCount: quizzes.length,
    unsolvedQuizCount: quizzes.filter((quiz) => quiz.status === 'unsolved').length,
  }
}

export function generateMockQuizzes(guineaPigId: string, lectureText: string, count: number): Quiz[] {
  const topic = extractTopic(lectureText)
  const nextIndex = Date.now().toString().slice(-4)

  return Array.from({ length: count }, (_, index) => ({
    id: `quiz_${nextIndex}_${index + 1}`,
    guineaPigId,
    question: `Which statement best matches the lecture note about ${topic}?`,
    choices: [
      `${topic} is the main concept explained in this lecture material.`,
      `${topic} is unrelated to this lecture material.`,
      'The lecture only contains administrative announcements.',
      'The material cannot be reviewed with quizzes.',
    ],
    answerIndex: 0,
    explanation: `The mock generator extracted "${topic}" as a key phrase from the lecture text.`,
    status: 'unsolved',
    selectedIndex: null,
  }))
}

export function answerMockQuiz({
  guineaPig,
  quiz,
  selectedIndex,
}: {
  guineaPig: GuineaPig
  quiz: Quiz
  selectedIndex: number
}) {
  const isCorrect = selectedIndex === quiz.answerIndex
  const gainedXp = isCorrect ? 20 : 0
  const nextXp = guineaPig.xp + gainedXp
  const nextLevel = Math.floor(nextXp / 100) + 1
  const didLevelUp = nextLevel > guineaPig.level

  const updatedQuiz: Quiz = {
    ...quiz,
    status: isCorrect ? 'correct' : 'wrong',
    selectedIndex,
  }

  const updatedGuineaPig: GuineaPig = {
    ...guineaPig,
    xp: nextXp,
    level: nextLevel,
    stage: getStage(nextLevel),
    mood: didLevelUp ? 'levelup' : isCorrect ? 'happy' : 'sad',
  }

  return {
    quiz: updatedQuiz,
    isCorrect,
    gainedXp,
    guineaPig: updatedGuineaPig,
    explanation: quiz.explanation,
  }
}

export function getMoodMessage(mood: GuineaPig['mood']) {
  if (mood === 'happy') return 'Correct! Your guinea pig is happily eating hay.'
  if (mood === 'sad') return 'Not quite. Your guinea pig tilts its head.'
  if (mood === 'levelup') return 'Level up! Your guinea pig has grown.'
  return 'Your guinea pig is nibbling hay.'
}

function getStage(level: number): GuineaPig['stage'] {
  if (level >= 4) return 'adult'
  if (level === 3) return 'teen'
  if (level === 2) return 'child'
  return 'baby'
}

function extractTopic(lectureText: string) {
  const words = lectureText
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)

  return words[0] ?? 'the lecture'
}
