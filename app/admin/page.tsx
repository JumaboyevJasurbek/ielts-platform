"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Edit, Trash2, Search, Home, Save, X } from "lucide-react"
import { adminAPI } from "@/lib/api"
import type { QuestionWithAnswer } from "@/types"

export default function AdminPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithAnswer | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getAllQuestions()
      setQuestions(data)
    } catch (err) {
      setError("Failed to load questions. Please try again.")
      console.error("Error loading questions:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })
  }

  const handleAddQuestion = async () => {
    try {
      if (!formData.questionText.trim() || formData.options.some((opt) => !opt.trim())) {
        setError("Please fill in all fields")
        return
      }

      const newQuestion = await adminAPI.createQuestion({
        questionText: formData.questionText,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      })

      setQuestions([...questions, newQuestion])
      setIsAddDialogOpen(false)
      resetForm()
      setError(null)
    } catch (err) {
      setError("Failed to add question. Please try again.")
      console.error("Error adding question:", err)
    }
  }

  const handleEditQuestion = async () => {
    if (!editingQuestion) return

    try {
      if (!formData.questionText.trim() || formData.options.some((opt) => !opt.trim())) {
        setError("Please fill in all fields")
        return
      }

      const updatedQuestion = await adminAPI.updateQuestion(editingQuestion.id, {
        questionText: formData.questionText,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      })

      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? updatedQuestion : q)))
      setEditingQuestion(null)
      resetForm()
      setError(null)
    } catch (err) {
      setError("Failed to update question. Please try again.")
      console.error("Error updating question:", err)
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    try {
      await adminAPI.deleteQuestion(id)
      setQuestions(questions.filter((q) => q.id !== id))
      setError(null)
    } catch (err) {
      setError("Failed to delete question. Please try again.")
      console.error("Error deleting question:", err)
    }
  }

  const openEditDialog = (question: QuestionWithAnswer) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    })
  }

  const closeEditDialog = () => {
    setEditingQuestion(null)
    resetForm()
    setError(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
    setError(null)
  }

  const filteredQuestions = questions.filter((question) =>
    question.questionText.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage IELTS test questions</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2 bg-transparent">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{questions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredQuestions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">System Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="text-center p-8">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "No questions match your search."
                    : "No questions available. Add some questions to get started."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">Question {index + 1}</CardTitle>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{question.questionText}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(question)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this question? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Badge
                          variant={optionIndex === question.correctAnswer ? "default" : "secondary"}
                          className={
                            optionIndex === question.correctAnswer
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                          }
                        >
                          {String.fromCharCode(65 + optionIndex)}
                        </Badge>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Question Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>Create a new question for the IELTS mock test.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter the question text..."
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options]
                        newOptions[index] = e.target.value
                        setFormData({ ...formData, options: newOptions })
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={formData.correctAnswer.toString()}
                  onValueChange={(value) => setFormData({ ...formData, correctAnswer: Number.parseInt(value) })}
                  className="flex gap-4 mt-2"
                >
                  {formData.options.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`correct-${index}`} />
                      <Label htmlFor={`correct-${index}`}>{String.fromCharCode(65 + index)}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestion}>
                <Save className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        <Dialog open={!!editingQuestion} onOpenChange={() => closeEditDialog()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>Update the question details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-question-text">Question Text</Label>
                <Textarea
                  id="edit-question-text"
                  placeholder="Enter the question text..."
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options]
                        newOptions[index] = e.target.value
                        setFormData({ ...formData, options: newOptions })
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={formData.correctAnswer.toString()}
                  onValueChange={(value) => setFormData({ ...formData, correctAnswer: Number.parseInt(value) })}
                  className="flex gap-4 mt-2"
                >
                  {formData.options.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`edit-correct-${index}`} />
                      <Label htmlFor={`edit-correct-${index}`}>{String.fromCharCode(65 + index)}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleEditQuestion}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
