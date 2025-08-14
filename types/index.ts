export interface Question {
  id: number
  questionText: string
  options: string[]
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: number
}

export interface TestResult {
  score: number
  totalQuestions: number
  percentage: number
  correctAnswers: number[]
  userAnswers: number[]
  feedback: string
}

export interface UserAnswer {
  questionId: number
  selectedOption: number
}
