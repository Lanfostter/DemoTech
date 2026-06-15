import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { Assignment } from '../models/learning';

interface AssignmentApiResponse {
  id: string;
  lessonId: string;
  lessonTitle: string;
  lessonType: string;
  moduleTitle: string;
  teacherName: string;
  deadline: string;
  status: string;
  score: number | null;
  daysLeft: number;
}

export const getAssignments = async (): Promise<Assignment[]> => {
  const res = await api.get<AssignmentApiResponse[]>('/assignments') as unknown as ApiResponse<AssignmentApiResponse[]>;
  return (res.data ?? []).map(a => ({
    id: a.id,
    lessonId: a.lessonId,
    lessonTitle: a.lessonTitle,
    moduleTitle: a.moduleTitle,
    teacherName: a.teacherName,
    lessonType: a.lessonType as Assignment['lessonType'],
    deadline: a.deadline,
    status: a.status as Assignment['status'],
    score: a.score ?? undefined,
    daysLeft: a.daysLeft,
  }));
};
