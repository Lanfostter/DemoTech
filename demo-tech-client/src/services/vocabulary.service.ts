import api from '../api/axios';
import type { ApiResponse } from '../models/api-response';
import type { VocabularyItem, VocabularyStats, FlashcardResult } from '../models/learning';

interface VocabularyDto {
  id: string;
  word: string;
  definition: string;
  translation: string;
  audioUrl: string | null;
  example: string | null;
  nextReviewAt: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface ReviewResultDto {
  nextReviewAt: string;
  newIntervalDays: number;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface AddVocabularyInput {
  word: string;
  definition: string;
  translation: string;
  example?: string;
  sourceLessonId?: string;
}

const mapDto = (d: VocabularyDto): VocabularyItem => ({
  id: d.id,
  word: d.word,
  definition: d.definition,
  translation: d.translation,
  audioUrl: d.audioUrl,
  example: d.example,
  nextReviewAt: d.nextReviewAt,
  masteryLevel: d.masteryLevel,
});

export const getVocabulary = async (dueToday?: boolean): Promise<VocabularyItem[]> => {
  const params = dueToday !== undefined ? { dueToday } : {};
  const res = await api.get<VocabularyDto[]>('/vocabulary', { params }) as unknown as ApiResponse<VocabularyDto[]>;
  return (res.data ?? []).map(mapDto);
};

export const getVocabularyStats = async (): Promise<VocabularyStats> => {
  const res = await api.get<VocabularyStats>('/vocabulary/stats') as unknown as ApiResponse<VocabularyStats>;
  return res.data;
};

export const addVocabulary = async (input: AddVocabularyInput): Promise<VocabularyItem> => {
  const res = await api.post<VocabularyDto>('/vocabulary', input) as unknown as ApiResponse<VocabularyDto>;
  return mapDto(res.data);
};

export const reviewVocabulary = async (id: string, result: FlashcardResult): Promise<ReviewResultDto> => {
  const res = await api.post<ReviewResultDto>(`/vocabulary/${id}/review`, { result }) as unknown as ApiResponse<ReviewResultDto>;
  return res.data;
};
