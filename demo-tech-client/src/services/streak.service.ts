import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { StreakInfo } from '../models/learning';

export const getStreak = async (): Promise<StreakInfo> => {
  const res = await api.get<StreakInfo>('/streak') as unknown as ApiResponse<StreakInfo>;
  return res.data;
};
