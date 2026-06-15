import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { getExercises, submitAnswer } from '../../services/exercise.service';
import type { ExerciseDto, SubmissionResult } from '../../services/exercise.service';
import ExerciseQuestion from './ExerciseQuestion';
import ExerciseResult from './ExerciseResult';

export default function ExercisePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<(SubmissionResult | null)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    getExercises(lessonId)
      .then(data => {
        const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
        setExercises(sorted);
        setResults(new Array(sorted.length).fill(null));
      })
      .catch(() => setExercises([]))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const current = exercises[currentIndex];
  const currentResult = results[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  const handleSubmit = async (answer: string) => {
    if (!current) return;
    setSubmitting(true);
    try {
      const result = await submitAnswer(current.id, answer);
      const newResults = [...results];
      newResults[currentIndex] = result;
      setResults(newResults);
      setShowResult(true);
    } catch {
      // silently handle error
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex >= exercises.length - 1) {
      // Navigate to completion page
      const totalScore = results.reduce((acc, r) => acc + (r?.score ?? 0), 0);
      const maxScore = exercises.reduce((acc, e) => acc + e.totalPoints, 0);
      navigate(`/lessons/${lessonId}/complete`, {
        state: { score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0, results, exercises },
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    }
  };

  const handleExit = () => {
    navigate(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center">
          <div className="animate-pulse text-lg mb-2" style={{ color: COLORS.textSecondary }}>Đang tải bài tập...</div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-lg font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Chưa có bài tập</p>
          <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>Bài học này chưa có bài tập nào.</p>
          <button onClick={() => navigate(`/lessons/${lessonId}`)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 px-6 py-4"
        style={{ background: COLORS.cardBg, borderBottom: `1px solid ${COLORS.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => currentIndex > 0 && (setCurrentIndex(currentIndex - 1), setShowResult(false))}
            className="text-sm font-medium px-2 py-1 rounded-lg transition-colors"
            style={{
              color: currentIndex > 0 ? COLORS.primary : COLORS.textMuted,
              background: 'none', border: 'none',
              cursor: currentIndex > 0 ? 'pointer' : 'not-allowed',
            }}>
            ←
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span style={{ color: COLORS.textSecondary }}>Câu {currentIndex + 1}/{exercises.length}</span>
              <span style={{ color: COLORS.textMuted }}>{Math.round(progress)}%</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: COLORS.border }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: COLORS.primary }} />
            </div>
          </div>

          <button onClick={handleExit}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: COLORS.bodyBg, border: 'none', cursor: 'pointer', color: COLORS.textMuted }}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        {current && (
          <>
            {!showResult && (
              <ExerciseQuestion
                exercise={current}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            )}
            {showResult && currentResult && (
              <div>
                {/* Show question context in result mode */}
                <div className="rounded-2xl p-4 mb-2" style={{ background: COLORS.cardBg, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>Câu {currentIndex + 1}/{exercises.length}</p>
                </div>
                <ExerciseResult
                  result={currentResult}
                  onNext={handleNext}
                  isLast={currentIndex >= exercises.length - 1}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
