import { COLORS } from '../../constants/colors';
import type { SubmissionResult } from '../../services/exercise.service';

interface Props {
  result: SubmissionResult;
  onNext: () => void;
  isLast: boolean;
}

export default function ExerciseResult({ result, onNext, isLast }: Props) {
  return (
    <div className="rounded-2xl p-5 mt-4"
      style={{
        background: result.isCorrect ? `${COLORS.success}10` : `${COLORS.danger}10`,
        border: `1px solid ${result.isCorrect ? COLORS.success : COLORS.danger}40`,
      }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{result.isCorrect ? '✅' : '❌'}</span>
        <span className="font-semibold" style={{ color: result.isCorrect ? COLORS.success : COLORS.danger }}>
          {result.isCorrect ? `Đúng! +${result.pointsEarned} điểm` : 'Chưa đúng'}
        </span>
      </div>

      {!result.isCorrect && result.correctAnswer && (
        <div className="mb-3">
          <span className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
            Đáp án đúng:{' '}
          </span>
          <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>
            {result.correctAnswer}
          </span>
        </div>
      )}

      {result.aiExplanation && (
        <div className="text-sm p-3 rounded-xl mb-4"
          style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textSecondary }}>
          <span className="font-medium" style={{ color: COLORS.textPrimary }}>Giải thích: </span>
          {result.aiExplanation}
        </div>
      )}

      {result.errors && result.errors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Lỗi thường gặp:</p>
          <ul className="space-y-1">
            {result.errors.map((err, i) => (
              <li key={i} className="text-xs" style={{ color: COLORS.danger }}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
        style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
        {isLast ? 'Xem kết quả →' : 'Câu tiếp theo →'}
      </button>
    </div>
  );
}
