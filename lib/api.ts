import axios from "axios"
import type { Question, QuestionWithAnswer, TestResult } from "../types"

const API_BASE_URL = "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Admin CRUD operations
export const adminAPI = {
  // Create question
  createQuestion: async (question: {
    questionText: string
    options: string[]
    correctAnswer: number
  }): Promise<QuestionWithAnswer> => {
    const response = await api.post("/admin/questions", question)
    return response.data
  },

  // Get all questions
  getAllQuestions: async (): Promise<QuestionWithAnswer[]> => {
    const response = await api.get("/admin/questions")
    return response.data
  },

  // Get single question
  getQuestion: async (id: number): Promise<QuestionWithAnswer> => {
    const response = await api.get(`/admin/questions/${id}`)
    return response.data
  },

  // Update question
  updateQuestion: async (
    id: number,
    question: Partial<{
      questionText: string
      options: string[]
      correctAnswer: number
    }>,
  ): Promise<QuestionWithAnswer> => {
    const response = await api.patch(`/admin/questions/${id}`, question)
    return response.data
  },

  // Delete question
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/admin/questions/${id}`)
  },
}

// User test operations
export const testAPI = {
  // Get test questions
  getTestQuestions: async (): Promise<Question[]> => {
    const response = await api.get("/test/questions")
    return response.data
  },

  // Submit test results
  submitTest: async (answers: number[]): Promise<TestResult> => {
    const response = await api.post("/test/submit", { answers })
    return response.data
  },
}
