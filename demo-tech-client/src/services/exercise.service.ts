import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';

export interface ExerciseDto {
  id: string;
  exerciseType: 'fill_in_the_blank' | 'multiple_choice' | 'rewrite' | 'ordering';
  sortOrder: number;
  totalPoints: number;
  questionJson: string;
  explanation: string;
  difficulty: number;
}

export interface SubmissionResult {
  id: string;
  score: number;
  isCorrect: boolean;
  errors: string[];
  aiExplanation: string;
  correctAnswer: string;
  pointsEarned: number;
}

export const getExercises = async (lessonId: string): Promise<ExerciseDto[]> => {
  const res = await api.get<ExerciseDto[]>(`/exercises/lesson/${lessonId}`) as unknown as ApiResponse<ExerciseDto[]>;
  return res.data ?? [];
};

export const submitAnswer = async (exerciseId: string, answer: string): Promise<SubmissionResult> => {
  const res = await api.post<SubmissionResult>(`/exercises/${exerciseId}/submit`, { answer }) as unknown as ApiResponse<SubmissionResult>;
  return res.data;
};
