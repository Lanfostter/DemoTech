import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { DailySession, DailyTask } from '../models/learning';

interface DailySessionApi {
  estimatedMinutes: number;
  completedMinutes: number;
  tasks: {
    id: string;
    type: string;
    title: string;
    durationMinutes: number;
    sourceId: string;
    reason: string;
    completed: boolean;
  }[];
}

export const getDailySession = async (): Promise<DailySession> => {
  const res = await api.get<DailySessionApi>('/dashboard/daily-session') as unknown as ApiResponse<DailySessionApi>;
  const data = res.data;
  return {
    estimatedMinutes: data.estimatedMinutes,
    completedMinutes: data.completedMinutes,
    tasks: data.tasks.map((t): DailyTask => ({
      id: t.id,
      type: t.type as DailyTask['type'],
      title: t.title,
      durationMinutes: t.durationMinutes,
      sourceId: t.sourceId,
      reason: t.reason,
      isCompleted: t.completed,
    })),
  };
};
