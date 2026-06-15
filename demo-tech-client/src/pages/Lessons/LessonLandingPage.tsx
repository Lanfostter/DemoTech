import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  LockClosedIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { getExercises } from '../../services/exercise.service';
import { getAssignments } from '../../services/assignment.service';
import type { Assignment, LessonType } from '../../models/learning';

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  grammar: 'Ngữ pháp',
  reading: 'Đọc hiểu',
  listening: 'Nghe',
  writing: 'Viết',
  speaking: 'Nói',
  vocabulary: 'Từ vựng',
  exam: 'Kiểm tra',
};

interface LocationState {
  lessonTitle?: string;
  lessonType?: LessonType;
  durationMinutes?: number;
  unitTitle?: string;
  moduleTitle?: string;
}

interface Section {
  index: number;
  label: string;
  status: 'done' | 'active' | 'locked';
}

export default function LessonLandingPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [hasExercises, setHasExercises] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    Promise.all([
      getExercises(lessonId).catch(() => []),
      getAssignments().catch(() => []),
    ]).then(([exercises, assignments]) => {
      setHasExercises(exercises.length > 0);
      setExerciseCount(exercises.length);
      const found = assignments.find(a => a.lessonId === lessonId) ?? null;
      setAssignment(found);
    }).finally(() => setLoading(false));
  }, [lessonId]);

  const lessonTitle = state?.lessonTitle ?? 'Bài học';
  const lessonType = state?.lessonType ?? 'grammar';
  const duration = state?.durationMinutes ?? 15;
  const unitTitle = state?.unitTitle ?? 'Unit';
  const moduleTitle = state?.moduleTitle ?? 'Module';

  const sections: Section[] = [
    { index: 1, label: 'Lý thuyết ngữ pháp', status: 'done' },
    { index: 2, label: 'Bài tập thực hành', status: hasExercises ? 'active' : 'locked' },
    { index: 3, label: 'Đọc hiểu áp dụng', status: 'locked' },
    { index: 4, label: 'Kiểm tra', status: 'locked' },
  ];

  const completedCount = sections.filter(s => s.status === 'done').length;

  const formatDeadline = (deadline: string) => {
    const d = new Date(deadline);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: COLORS.border }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <button onClick={() => navigate('/modules')}
            style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {moduleTitle}
          </button>
          <span style={{ color: COLORS.textMuted }}>/</span>
          <span style={{ color: COLORS.textMuted }}>{unitTitle}</span>
          <span style={{ color: COLORS.textMuted }}>/</span>
          <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{lessonTitle}</span>
        </div>

        {/* Assignment badge */}
        {assignment && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl"
            style={{ background: `${COLORS.warning}18`, border: `1px solid ${COLORS.warning}40` }}>
            <ClipboardDocumentListIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.warning }} />
            <span className="text-sm font-medium" style={{ color: COLORS.warning }}>
              Giáo viên giao · Hạn: {formatDeadline(assignment.deadline)}
            </span>
            {assignment.daysLeft <= 2 && assignment.daysLeft >= 0 && (
              <ExclamationTriangleIcon className="w-4 h-4 ml-auto" style={{ color: COLORS.danger }} />
            )}
          </div>
        )}

        {/* Header card */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>{lessonTitle}</h1>
              <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.textSecondary }}>
                <span>📖 {LESSON_TYPE_LABEL[lessonType]}</span>
                <span>·</span>
                <span>{duration} phút</span>
                <span>·</span>
                <span>{'⭐'.repeat(3)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const dest = lessonType === 'reading'
                  ? `/lessons/${lessonId}/reading`
                  : lessonType === 'listening'
                  ? `/lessons/${lessonId}/listening`
                  : `/lessons/${lessonId}/exercise`;
                navigate(dest, { state: { lessonTitle, lessonType, durationMinutes: duration, unitTitle, moduleTitle } });
              }}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: COLORS.primary }}>
              {completedCount > 0 ? '▶ Tiếp tục' : '▶ Bắt đầu'}
            </button>
          </div>

          {/* Goals */}
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Mục tiêu bài học:</p>
            <ul className="space-y-1">
              {['Nhận biết cấu trúc ngữ pháp', 'Dùng đúng dạng thức', 'Viết câu áp dụng'].map((g, i) => (
                <li key={i} className="text-sm flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
                  <span style={{ color: COLORS.primary }}>•</span> {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: COLORS.textSecondary }}>Tiến độ</span>
              <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{completedCount}/{sections.length} phần</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: COLORS.border }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(completedCount / sections.length) * 100}%`, background: COLORS.primary }} />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <h2 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Nội dung</h2>
          </div>
          {sections.map((section, idx) => (
            <div key={section.index}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: idx < sections.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
              <div className="flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                style={{
                  width: 28, height: 28,
                  background: section.status === 'done' ? `${COLORS.success}18`
                    : section.status === 'active' ? `${COLORS.primary}18`
                    : COLORS.bodyBg,
                  color: section.status === 'done' ? COLORS.success
                    : section.status === 'active' ? COLORS.primary
                    : COLORS.textMuted,
                }}>
                {section.status === 'done' ? '✓' : section.index}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{
                  color: section.status === 'locked' ? COLORS.textMuted : COLORS.textPrimary,
                }}>
                  {section.label}
                </p>
              </div>
              <div className="flex-shrink-0">
                {section.status === 'done' && <CheckCircleIcon className="w-5 h-5" style={{ color: COLORS.success }} />}
                {section.status === 'active' && (
                  <button
                    onClick={() => {
                      const dest = lessonType === 'reading'
                        ? `/lessons/${lessonId}/reading`
                        : lessonType === 'listening'
                        ? `/lessons/${lessonId}/listening`
                        : `/lessons/${lessonId}/exercise`;
                      navigate(dest, { state: { lessonTitle, lessonType, durationMinutes: duration, unitTitle, moduleTitle } });
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: `${COLORS.primary}18`, color: COLORS.primary, border: 'none', cursor: 'pointer' }}>
                    <PlayCircleIcon className="w-4 h-4" />
                    Tiếp tục →
                  </button>
                )}
                {section.status === 'locked' && <LockClosedIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} />}
              </div>
            </div>
          ))}
        </div>

        {hasExercises && (
          <div className="mt-3 text-sm text-center" style={{ color: COLORS.textSecondary }}>
            {exerciseCount} bài tập đang chờ bạn
          </div>
        )}
      </div>
    </div>
  );
}
