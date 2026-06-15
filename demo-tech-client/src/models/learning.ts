export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';
export type LearningGoal = 'exam_9to10' | 'exam_university' | 'communication' | 'toeic';
export type ModuleType =
  | 'grade6' | 'grade7' | 'grade8'
  | 'exam_9to10'
  | 'grade10' | 'grade11'
  | 'exam_university'
  | 'communication'
  | 'toeic';
export type LessonType = 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary' | 'exam';
export type ExerciseType = 'fill_in_the_blank' | 'multiple_choice' | 'rewrite' | 'translation' | 'ordering' | 'speaking';
export type AssignmentStatus = 'todo' | 'in_progress' | 'submitted' | 'graded';
export type FlashcardResult = 'again' | 'hard' | 'good' | 'easy';
export type ErrorTag =
  | 'wrong_tense'
  | 'wrong_preposition'
  | 'passive_voice_error'
  | 'relative_clause_error'
  | 'spelling'
  | 'vocabulary_weak';

export interface LearningModule {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  targetGrades: number[];
  unitCount: number;
  lessonCount: number;
  completionPercent: number;
  color: string;
}

export interface Unit {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lessonCount: number;
  completedLessons: number;
  isLocked: boolean;
}

export interface LessonListItem {
  id: string;
  unitId: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  isCompleted: boolean;
  score: number | null;
  isLocked: boolean;
}

export interface StreakDay {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  isActive: boolean;
}

export interface StreakMilestone {
  days: number;
  achieved: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  todayCompleted: boolean;
  milestones: StreakMilestone[];
  calendar: StreakDay[];
}

export interface DailyTask {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'flashcard_review';
  title: string;
  durationMinutes: number;
  sourceId: string;
  reason: string;
  isCompleted: boolean;
}

export interface DailySession {
  estimatedMinutes: number;
  completedMinutes: number;
  tasks: DailyTask[];
}

export interface Assignment {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  teacherName: string;
  lessonType: LessonType;
  deadline: string;
  status: AssignmentStatus;
  score?: number;
  daysLeft: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  translation: string;
  audioUrl: string | null;
  example: string | null;
  nextReviewAt: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface VocabularyStats {
  totalWords: number;
  wordsDueToday: number;
  masteredWords: number;
  retentionRate: number;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  order: number;
  question: Record<string, unknown>;
  totalPoints: number;
  aiGradingEnabled: boolean;
  tags: string[];
}

export interface ExerciseSubmissionResult {
  id: string;
  score: number;
  isCorrect: boolean;
  errors: ErrorTag[];
  aiExplanation: string;
  correctAnswer: unknown;
  pointsEarned: number;
}

// Reading lesson content
export interface VocabEntry {
  word: string;
  definition: string;
  example: string;
  phonetic?: string;
}

export interface ReadingQuestion {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ReadingParagraph {
  en: string;
  vi: string;
}

export interface ReadingContent {
  paragraphs: ReadingParagraph[];
  vocabulary: VocabEntry[];
  questions: ReadingQuestion[];
}

// Listening lesson content
export interface ScriptLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface ListeningContent {
  audioUrl: string;
  script: ScriptLine[];
  vocabulary: { word: string; definition: string; example: string }[];
  questions: ReadingQuestion[];
}

export interface LessonContent {
  lessonId: string;
  contentType: 'reading' | 'listening';
  contentJson: string;
}
