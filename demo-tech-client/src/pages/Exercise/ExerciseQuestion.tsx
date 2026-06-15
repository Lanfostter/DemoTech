import { useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import type { ExerciseDto } from '../../services/exercise.service';

interface FillBlankQuestion {
  prompt?: string;
  sentence?: string;
  hint?: string;
}

interface MultipleChoiceQuestion {
  prompt?: string;
  sentence?: string;
  options?: string[];
}

interface GenericQuestion {
  prompt?: string;
  sentence?: string;
}

interface Props {
  exercise: ExerciseDto;
  onSubmit: (answer: string) => void;
  submitting: boolean;
}

export default function ExerciseQuestion({ exercise, onSubmit, submitting }: Props) {
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  let question: FillBlankQuestion | MultipleChoiceQuestion | GenericQuestion = {};
  try {
    question = JSON.parse(exercise.questionJson) as FillBlankQuestion | MultipleChoiceQuestion | GenericQuestion;
  } catch {
    question = { prompt: exercise.questionJson };
  }

  const handleSubmit = () => {
    if (exercise.exerciseType === 'multiple_choice') {
      if (selectedOption === null) return;
      const opts = (question as MultipleChoiceQuestion).options ?? [];
      onSubmit(opts[selectedOption] ?? String(selectedOption));
    } else {
      if (!textAnswer.trim()) return;
      onSubmit(textAnswer.trim());
    }
  };

  const prompt = (question as GenericQuestion).prompt ?? '';
  const sentence = (question as GenericQuestion).sentence ?? '';
  const hint = (question as FillBlankQuestion).hint ?? exercise.explanation ?? '';
  const options = (question as MultipleChoiceQuestion).options ?? [];

  const canSubmit = exercise.exerciseType === 'multiple_choice'
    ? selectedOption !== null
    : textAnswer.trim().length > 0;

  return (
    <div className="rounded-2xl p-6" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* Exercise type badge */}
      <div className="mb-4">
        <span className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: `${COLORS.primary}18`, color: COLORS.primary }}>
          {exercise.exerciseType === 'fill_in_the_blank' && 'Điền từ vào chỗ trống'}
          {exercise.exerciseType === 'multiple_choice' && 'Chọn đáp án đúng'}
          {exercise.exerciseType === 'rewrite' && 'Viết lại câu'}
          {exercise.exerciseType === 'ordering' && 'Sắp xếp từ'}
        </span>
        <span className="ml-2 text-xs" style={{ color: COLORS.textMuted }}>
          {exercise.totalPoints} điểm
        </span>
      </div>

      {/* Question text */}
      {prompt && (
        <p className="text-base font-medium mb-4" style={{ color: COLORS.textPrimary }}>{prompt}</p>
      )}
      {sentence && (
        <p className="text-lg font-semibold mb-5 p-4 rounded-xl"
          style={{ color: COLORS.textPrimary, background: COLORS.bodyBg }}>
          {sentence}
        </p>
      )}

      {/* Answer area */}
      {exercise.exerciseType === 'multiple_choice' ? (
        <div className="space-y-2 mb-5">
          {options.map((opt, i) => (
            <button key={i}
              onClick={() => setSelectedOption(i)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: selectedOption === i ? `${COLORS.primary}12` : COLORS.bodyBg,
                border: `2px solid ${selectedOption === i ? COLORS.primary : COLORS.border}`,
                cursor: 'pointer',
              }}>
              <div className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 20, height: 20,
                  border: `2px solid ${selectedOption === i ? COLORS.primary : COLORS.border}`,
                  background: selectedOption === i ? COLORS.primary : 'transparent',
                }}>
                {selectedOption === i && <div className="rounded-full" style={{ width: 8, height: 8, background: '#fff' }} />}
              </div>
              <span className="text-sm" style={{ color: COLORS.textPrimary }}>{opt}</span>
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={textAnswer}
          onChange={e => setTextAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()}
          placeholder="Nhập câu trả lời của bạn..."
          className="w-full px-4 py-3 rounded-xl text-sm mb-5 outline-none"
          style={{
            border: `2px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
            background: COLORS.bodyBg,
          }}
          onFocus={e => (e.target.style.borderColor = COLORS.primary)}
          onBlur={e => (e.target.style.borderColor = COLORS.border)}
        />
      )}

      {/* Hint */}
      {hint && (
        <div className="mb-4">
          <button onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: COLORS.warning, background: 'none', border: 'none', cursor: 'pointer' }}>
            <LightBulbIcon className="w-4 h-4" />
            {showHint ? 'Ẩn gợi ý' : 'Gợi ý'}
          </button>
          {showHint && (
            <div className="mt-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: `${COLORS.warning}12`, color: COLORS.textSecondary, border: `1px solid ${COLORS.warning}30` }}>
              {hint}
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: canSubmit && !submitting ? COLORS.primary : COLORS.border,
          color: canSubmit && !submitting ? '#fff' : COLORS.textMuted,
          cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
          border: 'none',
        }}>
        {submitting ? 'Đang kiểm tra...' : 'Kiểm tra →'}
      </button>
    </div>
  );
}
