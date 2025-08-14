"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  BookOpen,
} from "lucide-react";
import type { TestResult } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem("testResult");
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error("Error parsing test result:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  const handleRetakeTest = () => {
    sessionStorage.removeItem("testResult");
    router.push("/test");
  };

  const handleGoHome = () => {
    sessionStorage.removeItem("testResult");
    router.push("/");
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90)
      return {
        level: "Excellent",
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    if (percentage >= 80)
      return {
        level: "Very Good",
        color: "bg-blue-500",
        textColor: "text-blue-700",
      };
    if (percentage >= 70)
      return {
        level: "Good",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
      };
    if (percentage >= 60)
      return {
        level: "Fair",
        color: "bg-orange-500",
        textColor: "text-orange-700",
      };
    return {
      level: "Needs Improvement",
      color: "bg-red-500",
      textColor: "text-red-700",
    };
  };

  const getDetailedFeedback = (percentage: number) => {
    if (percentage >= 90) {
      return "Outstanding performance! You demonstrate excellent command of English and are well-prepared for the IELTS exam.";
    }
    if (percentage >= 80) {
      return "Very good work! You show strong English skills with minor areas for improvement. Keep practicing to maintain this level.";
    }
    if (percentage >= 70) {
      return "Good progress! You have a solid foundation in English. Focus on areas where you made mistakes to improve further.";
    }
    if (percentage >= 60) {
      return "Fair performance. You understand the basics but need more practice. Review the questions you got wrong and study those topics.";
    }
    return "Keep working hard! Focus on fundamental English skills and take more practice tests to improve your performance.";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No test results found.
            </p>
            <Button onClick={handleGoHome}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performance = getPerformanceLevel(result.percentage);
  const incorrectAnswers =
    result.totalQuestions - result.correctAnswers?.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-16 h-16 ${performance.color} rounded-full flex items-center justify-center`}
            >
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's how you performed on your IELTS mock test
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {result.score}/{result.totalQuestions}
              </div>
              <Badge className={`${performance.color} text-white`}>
                {performance.level}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Percentage
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {result.percentage.toFixed(1)}%
              </div>
              <Progress value={result.percentage} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">
                      {result.correctAnswers?.length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    <span className="font-semibold">{incorrectAnswers}</span>
                  </div>
                  <div className="text-xs text-gray-500">Incorrect</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {result.feedback || getDetailedFeedback(result.percentage)}
            </p>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Question by Question Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.userAnswers?.map((userAnswer, index) => {
              const isCorrect = result.correctAnswers.includes(index);
              const questionNumber = index + 1;

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Question {questionNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Your answer: Option {userAnswer + 1}</span>
                      {!isCorrect && (
                        <span className="text-green-600 dark:text-green-400">
                          Correct answer: Option{" "}
                          {result.correctAnswers.find((_, i) => i === index) !==
                          undefined
                            ? "N/A"
                            : "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetakeTest}
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Test
          </Button>
          <Button
            variant="outline"
            onClick={handleGoHome}
            size="lg"
            className="flex items-center gap-2 bg-transparent"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Study Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Study Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  To Improve Your Score:
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Review questions you got wrong</li>
                  <li>• Practice reading comprehension daily</li>
                  <li>• Expand your vocabulary</li>
                  <li>• Take more mock tests</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Test-Taking Strategy:
                </h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Read questions carefully</li>
                  <li>• Eliminate wrong answers first</li>
                  <li>• Manage your time effectively</li>
                  <li>• Don't leave questions blank</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
