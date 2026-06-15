import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { LearningModule, Unit, LessonListItem, LessonContent } from '../models/learning';

interface ModuleApiResponse {
  id: string;
  type: string;
  title: string;
  description: string;
  targetGrades: string;
  unitCount: number;
  lessonCount: number;
  completionPercent: number;
  color: string;
}

interface UnitApiResponse {
  id: string;
  title: string;
  sortOrder: number;
  lessonCount: number;
  completedLessons: number;
  locked: boolean;
  lessons: LessonApiResponse[];
}

interface LessonApiResponse {
  id: string;
  title: string;
  lessonType: string;
  durationMinutes: number;
  sortOrder: number;
  completed: boolean;
  locked: boolean;
  score: number | null;
}

export const getModules = async (): Promise<LearningModule[]> => {
  const res = await api.get<ModuleApiResponse[]>('/modules') as unknown as ApiResponse<ModuleApiResponse[]>;
  return (res.data ?? []).map(m => ({
    id: m.id,
    type: m.type as LearningModule['type'],
    title: m.title,
    description: m.description,
    targetGrades: m.targetGrades ? m.targetGrades.split(',').map(Number).filter(Boolean) : [],
    unitCount: m.unitCount,
    lessonCount: m.lessonCount,
    completionPercent: m.completionPercent,
    color: m.color || '#4361EE',
  }));
};

export const getLessonContent = async (lessonId: string): Promise<LessonContent> => {
  const res = await api.get<LessonContent>(`/modules/lessons/${lessonId}/content`) as unknown as ApiResponse<LessonContent>;
  if (!res.data) throw new Error('Content not found');
  return res.data;
};

export const getUnits = async (moduleId: string): Promise<{ unit: Unit; lessons: LessonListItem[] }[]> => {
  const res = await api.get<UnitApiResponse[]>(`/modules/${moduleId}/units`) as unknown as ApiResponse<UnitApiResponse[]>;
  return (res.data ?? []).map(u => ({
    unit: {
      id: u.id,
      moduleId,
      title: u.title,
      order: u.sortOrder,
      lessonCount: u.lessonCount,
      completedLessons: u.completedLessons,
      isLocked: u.locked,
    },
    lessons: (u.lessons ?? []).map(l => ({
      id: l.id,
      unitId: u.id,
      title: l.title,
      type: l.lessonType as LessonListItem['type'],
      durationMinutes: l.durationMinutes,
      isCompleted: l.completed,
      isLocked: l.locked,
      score: l.score,
    })),
  }));
};
