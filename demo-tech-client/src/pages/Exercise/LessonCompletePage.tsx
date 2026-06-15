import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import type { SubmissionResult } from '../../services/exercise.service';

interface LocationState {
  score?: number;
  results?: (SubmissionResult | null)[];
  exercises?: { id: string; totalPoints: number; questionJson: string }[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke={COLORS.border} strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>{score}</span>
        <span className="text-sm" style={{ color: COLORS.textSecondary }}>/ 100</span>
      </div>
    </div>
  );
}

export default function LessonCompletePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const score = state?.score ?? 0;
  const results = state?.results ?? [];

  const correctCount = results.filter(r => r?.isCorrect).length;
  const wrongCount = results.filter(r => r !== null && !r.isCorrect).length;
  const skippedCount = results.filter(r => r === null).length;
  const xpEarned = Math.round(score * 0.5);
  const minutesStudied = 15;

  const wrongResults = results
    .map((r, i) => ({ result: r, index: i }))
    .filter(({ result }) => result !== null && !result.isCorrect);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Bài học hoàn thành!</h1>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>Tuyệt vời! Bạn đã hoàn thành bài tập.</p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl p-8 flex flex-col items-center"
            style={{ background: COLORS.cardBg, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <ScoreRing score={score} />
            <p className="text-sm font-medium mt-3" style={{ color: COLORS.textSecondary }}>điểm</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '🔥', label: 'phút học', value: minutesStudied },
            { icon: '⭐', label: 'XP nhận được', value: `+${xpEarned}` },
            { icon: '📅', label: 'Streak', value: '24 ngày' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-4 text-center"
              style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>{item.value}</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Results summary */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.textPrimary }}>Kết quả</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm font-semibold" style={{ color: COLORS.success }}>{correctCount} đúng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <span className="text-sm font-semibold" style={{ color: COLORS.danger }}>{wrongCount} sai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⏭</span>
              <span className="text-sm font-semibold" style={{ color: COLORS.textMuted }}>{skippedCount} bỏ qua</span>
            </div>
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongResults.length > 0 && (
          <div className="rounded-2xl p-5 mb-6"
            style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.textPrimary }}>Câu sai cần ôn lại</h2>
            <div className="space-y-3">
              {wrongResults.map(({ result, index }) => (
                result && (
                  <div key={index} className="flex items-center justify-between gap-3 py-2"
                    style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                        Câu {index + 1} → Đáp án: <span className="font-semibold" style={{ color: COLORS.textPrimary }}>{result.correctAnswer}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/lessons/${lessonId}/exercise`)}
                      className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: `${COLORS.primary}18`, color: COLORS.primary, border: 'none', cursor: 'pointer' }}>
                      Ôn lại →
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/modules')}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: COLORS.bodyBg, color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
            Về module
          </button>
          <button
            onClick={() => navigate('/modules')}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
            Bài tiếp theo →
          </button>
        </div>
      </div>
    </div>
  );
}
