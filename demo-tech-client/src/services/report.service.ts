import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';

export interface DailyPoint { date: string; count: number }
export interface WeeklyPoint { week: string; avgScore: number; count: number }
export interface ScoreDistribution { perfect: number; good: number; fair: number; poor: number }

export interface StudentReport {
  totalExercises: number;
  avgScore: number;
  totalLessonsCompleted: number;
  totalVocab: number;
  dailySeries: DailyPoint[];
  weeklySeries: WeeklyPoint[];
  scoreDistribution: ScoreDistribution;
}

export const getStudentReport = async (): Promise<StudentReport> => {
  const res = await api.get<StudentReport>('/reports/student') as unknown as ApiResponse<StudentReport>;
  return res.data;
};
