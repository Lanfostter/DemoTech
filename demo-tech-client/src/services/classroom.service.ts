import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';

export interface ClassroomDto {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  studentCount: number;
}

export interface StudentDto {
  id: string;
  name: string;
  email: string;
  joinedAt?: string;
}

export interface AssignmentDto {
  id: string;
  lessonId: string;
  lessonTitle?: string;
  deadline: string;
  note?: string;
}

export interface CreateClassroomInput {
  name: string;
  description?: string;
}

export interface CreateAssignmentInput {
  lessonId: string;
  deadline: string;
  note?: string;
}

export const createClassroom = async (input: CreateClassroomInput): Promise<ClassroomDto> => {
  const res = await api.post<ClassroomDto>('/classrooms', input) as unknown as ApiResponse<ClassroomDto>;
  return res.data;
};

export const getClassrooms = async (): Promise<ClassroomDto[]> => {
  const res = await api.get<ClassroomDto[]>('/classrooms') as unknown as ApiResponse<ClassroomDto[]>;
  return res.data ?? [];
};

export const joinClassroom = async (inviteCode: string): Promise<ClassroomDto> => {
  const res = await api.post<ClassroomDto>('/classrooms/join', { inviteCode }) as unknown as ApiResponse<ClassroomDto>;
  return res.data;
};

export const getClassroomStudents = async (classroomId: string): Promise<StudentDto[]> => {
  const res = await api.get<StudentDto[]>(`/classrooms/${classroomId}/students`) as unknown as ApiResponse<StudentDto[]>;
  return res.data ?? [];
};

export const createAssignment = async (classroomId: string, input: CreateAssignmentInput): Promise<AssignmentDto> => {
  const res = await api.post<AssignmentDto>(`/classrooms/${classroomId}/assignments`, input) as unknown as ApiResponse<AssignmentDto>;
  return res.data;
};
