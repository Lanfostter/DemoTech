import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import type { LearningGoal } from '../../models/learning';

interface Goal {
  key: LearningGoal;
  icon: string;
  label: string;
}

const GOALS: Goal[] = [
  { key: 'exam_9to10',     icon: '🎓', label: 'Ôn thi vào lớp 10' },
  { key: 'exam_university', icon: '📚', label: 'Ôn thi Đại học' },
  { key: 'communication',  icon: '💬', label: 'Giao tiếp hàng ngày' },
  { key: 'toeic',          icon: '🏆', label: 'Luyện thi TOEIC' },
];

interface PlacementQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1 },
  { question: 'They ___ in the park yesterday.', options: ['play', 'plays', 'played', 'playing'], correctIndex: 2 },
  { question: 'If I were rich, I ___ travel the world.', options: ['will', 'would', 'can', 'shall'], correctIndex: 1 },
  { question: 'The book ___ by a famous author.', options: ['write', 'wrote', 'is written', 'written'], correctIndex: 2 },
  { question: '___ you ever been to Paris?', options: ['Do', 'Did', 'Have', 'Has'], correctIndex: 2 },
];

const LEVEL_LABELS: Record<number, string> = {
  0: 'Sơ cấp',
  1: 'Sơ cấp',
  2: 'Trung cấp',
  3: 'Trung cấp',
  4: 'Khá',
  5: 'Nâng cao',
};

const MODULE_SUGGESTIONS: Record<LearningGoal, string> = {
  exam_9to10:      'Ôn thi vào lớp 10',
  exam_university: 'Ôn thi Đại học',
  communication:   'Giao tiếp cơ bản',
  toeic:           'TOEIC Foundation',
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(PLACEMENT_QUESTIONS.length).fill(null));
  const [score, setScore] = useState(0);

  const handleGoalSelect = (goal: LearningGoal) => {
    setSelectedGoal(goal);
    setStep(2);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQ] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQ] === null) return;
    if (currentQ < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const correct = selectedAnswers.filter(
        (ans, i) => ans === PLACEMENT_QUESTIONS[i].correctIndex
      ).length;
      setScore(correct);
      setStep(3);
    }
  };

  const handleStart = () => {
    localStorage.setItem('onboarding_done', 'true');
    navigate('/dashboard', { replace: true });
  };

  const q = PLACEMENT_QUESTIONS[currentQ];
  const progress = ((currentQ) / PLACEMENT_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.bodyBg} 100%)` }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl mb-3"
            style={{ width: 56, height: 56, background: COLORS.primary }}>
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>EnglishPro</h1>
        </div>

        {/* Step 1: Goal selection */}
        {step === 1 && (
          <div className="rounded-2xl p-8" style={{ background: COLORS.cardBg, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Chào mừng bạn!</h2>
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>Bạn học tiếng Anh để làm gì?</p>
            </div>
            <div className="space-y-3">
              {GOALS.map(goal => (
                <button
                  key={goal.key}
                  onClick={() => handleGoalSelect(goal.key)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all hover:opacity-90"
                  style={{
                    background: selectedGoal === goal.key ? `${COLORS.primary}12` : COLORS.bodyBg,
                    border: `2px solid ${selectedGoal === goal.key ? COLORS.primary : COLORS.border}`,
                    cursor: 'pointer',
                  }}>
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Placement test */}
        {step === 2 && (
          <div className="rounded-2xl p-8" style={{ background: COLORS.cardBg, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div className="mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: COLORS.textSecondary }}>Câu {currentQ + 1}/{PLACEMENT_QUESTIONS.length}</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: COLORS.border }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: COLORS.primary }} />
              </div>
            </div>

            <h2 className="text-base font-semibold mb-5" style={{ color: COLORS.textPrimary }}>
              {q.question}
            </h2>

            <div className="space-y-2 mb-6">
              {q.options.map((opt, i) => (
                <button key={i}
                  onClick={() => handleAnswerSelect(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: selectedAnswers[currentQ] === i ? `${COLORS.primary}12` : COLORS.bodyBg,
                    border: `2px solid ${selectedAnswers[currentQ] === i ? COLORS.primary : COLORS.border}`,
                    cursor: 'pointer',
                  }}>
                  <div className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 18, height: 18,
                      border: `2px solid ${selectedAnswers[currentQ] === i ? COLORS.primary : COLORS.border}`,
                      background: selectedAnswers[currentQ] === i ? COLORS.primary : 'transparent',
                    }}>
                    {selectedAnswers[currentQ] === i && (
                      <div className="rounded-full" style={{ width: 7, height: 7, background: '#fff' }} />
                    )}
                  </div>
                  <span className="text-sm" style={{ color: COLORS.textPrimary }}>{opt}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQ] === null}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                background: selectedAnswers[currentQ] !== null ? COLORS.primary : COLORS.border,
                border: 'none',
                cursor: selectedAnswers[currentQ] !== null ? 'pointer' : 'not-allowed',
              }}>
              {currentQ < PLACEMENT_QUESTIONS.length - 1 ? 'Tiếp theo →' : 'Xem kết quả'}
            </button>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="rounded-2xl p-8 text-center" style={{ background: COLORS.cardBg, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
              Lộ trình của bạn đã sẵn sàng!
            </h2>
            <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
              Chúng tôi đã xây dựng lộ trình phù hợp cho bạn.
            </p>

            <div className="rounded-xl p-5 mb-5 text-left"
              style={{ background: COLORS.bodyBg, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Trình độ của bạn</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: `${COLORS.primary}18`, color: COLORS.primary }}>
                  {LEVEL_LABELS[score] ?? 'Trung cấp'}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {PLACEMENT_QUESTIONS.map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded-full"
                    style={{
                      background: i < score ? COLORS.success : COLORS.border,
                    }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                {score}/{PLACEMENT_QUESTIONS.length} câu đúng
              </p>
            </div>

            {selectedGoal && (
              <div className="rounded-xl p-4 mb-6"
                style={{ background: `${COLORS.primary}08`, border: `1px solid ${COLORS.primary}20` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Module gợi ý</p>
                <p className="text-sm font-bold" style={{ color: COLORS.primary }}>
                  {MODULE_SUGGESTIONS[selectedGoal]}
                </p>
              </div>
            )}

            <button onClick={handleStart}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
              Bắt đầu học ngay →
            </button>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {([1, 2, 3] as const).map(s => (
            <div key={s} className="rounded-full transition-all"
              style={{
                width: step === s ? 24 : 8,
                height: 8,
                background: step >= s ? COLORS.primary : COLORS.border,
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
