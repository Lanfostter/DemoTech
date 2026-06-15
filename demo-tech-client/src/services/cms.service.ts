import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { LearningModule } from '../models/learning';

export interface UnitSimple { id: string; title: string; sortOrder: number; unlockThreshold: number }
export interface LessonSimple { id: string; title: string; lessonType: string; durationMinutes: number; sortOrder: number; difficulty: number }

// Module
export const createModule = (data: { type: string; title: string; description: string; targetGrades: string; color: string; sortOrder: number }) =>
  api.post('/modules', data) as unknown as ApiResponse<LearningModule>;

export const updateModule = (id: string, data: Partial<{ title: string; description: string; type: string; color: string; targetGrades: string; sortOrder: number }>) =>
  api.put(`/modules/${id}`, data) as unknown as ApiResponse<LearningModule>;

export const deleteModule = (id: string) =>
  api.delete(`/modules/${id}`) as unknown as ApiResponse<null>;

// Unit
export const getUnitsAdmin = (moduleId: string) =>
  api.get(`/modules/${moduleId}/units`) as unknown as ApiResponse<any[]>;

export const createUnit = (moduleId: string, data: { title: string; sortOrder: number; unlockThreshold: number }) =>
  api.post(`/modules/${moduleId}/units`, data) as unknown as ApiResponse<UnitSimple>;

export const updateUnit = (unitId: string, data: Partial<{ title: string; sortOrder: number; unlockThreshold: number }>) =>
  api.put(`/modules/units/${unitId}`, data) as unknown as ApiResponse<UnitSimple>;

export const deleteUnit = (unitId: string) =>
  api.delete(`/modules/units/${unitId}`) as unknown as ApiResponse<null>;

// Lesson
export const getLessonsAdmin = (unitId: string) =>
  api.get(`/modules/units/${unitId}/lessons`) as unknown as ApiResponse<LessonSimple[]>;

export const createLesson = (unitId: string, data: { title: string; lessonType: string; durationMinutes: number; sortOrder: number; difficulty: number; contentJson?: string }) =>
  api.post(`/modules/units/${unitId}/lessons`, data) as unknown as ApiResponse<LessonSimple>;

export const updateLesson = (lessonId: string, data: Partial<{ title: string; lessonType: string; durationMinutes: number; sortOrder: number; difficulty: number; contentJson: string }>) =>
  api.put(`/modules/units/lessons/${lessonId}`, data) as unknown as ApiResponse<LessonSimple>;

export const deleteLesson = (lessonId: string) =>
  api.delete(`/modules/units/lessons/${lessonId}`) as unknown as ApiResponse<null>;
