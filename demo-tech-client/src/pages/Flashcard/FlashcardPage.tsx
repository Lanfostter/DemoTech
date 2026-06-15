import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import { getVocabulary, reviewVocabulary } from '../../services/vocabulary.service';
import type { VocabularyItem, FlashcardResult } from '../../models/learning';

interface ReviewButton {
  result: FlashcardResult;
  label: string;
  color: string;
  days: string;
}

const REVIEW_BUTTONS: ReviewButton[] = [
  { result: 'again', label: 'Again', color: COLORS.danger,   days: '1 ngày' },
  { result: 'hard',  label: 'Hard',  color: COLORS.warning,  days: '2 ngày' },
  { result: 'good',  label: 'Good',  color: COLORS.success,  days: '4 ngày' },
  { result: 'easy',  label: 'Easy',  color: COLORS.primary,  days: '7+ ngày' },
];

const EMOJI_COLOR: Record<FlashcardResult, string> = {
  again: '🔴', hard: '🟠', good: '🟢', easy: '🔵',
};

export default function FlashcardPage() {
  const navigate = useNavigate();

  const [cards, setCards] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getVocabulary(true)
      .then(data => setCards(data))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const current = cards[currentIndex];
  const total = cards.length;

  const handleFlip = () => setFlipped(!flipped);

  const handleReview = async (result: FlashcardResult) => {
    if (!current || reviewing) return;
    setReviewing(true);
    try {
      await reviewVocabulary(current.id, result);
      setDoneCount(doneCount + 1);
      if (currentIndex >= cards.length - 1) {
        setFinished(true);
      } else {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
      }
    } catch {
      // silently handle
    } finally {
      setReviewing(false);
    }
  };

  const masteryColor = (level: number) => {
    if (level <= 1) return COLORS.danger;
    if (level <= 2) return COLORS.warning;
    if (level <= 3) return COLORS.primary;
    return COLORS.success;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl animate-pulse mx-auto mb-4" style={{ background: COLORS.border }} />
          <p style={{ color: COLORS.textSecondary }}>Đang tải từ vựng...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center max-w-sm px-6">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
            Không có từ nào cần ôn hôm nay!
          </h2>
          <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
            Quay lại vào ngày mai để tiếp tục ôn tập.
          </p>
          <button onClick={() => navigate('/vocabulary')}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
            Xem sổ từ vựng
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center max-w-sm px-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Hoàn thành!</h2>
          <p className="text-sm mb-2" style={{ color: COLORS.textSecondary }}>Bạn đã ôn {doneCount} từ hôm nay</p>
          <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Tiếp tục duy trì streak nhé! 🔥</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/vocabulary')}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: COLORS.bodyBg, color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
              Sổ từ vựng
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>Ôn từ vựng hôm nay</h1>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>{total - currentIndex} từ còn lại</p>
          </div>
          <button onClick={() => navigate('/vocabulary')}
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{ color: COLORS.textSecondary, background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
            Thoát
          </button>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: COLORS.textMuted }}>{doneCount}/{total}</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: COLORS.border }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / total) * 100}%`, background: COLORS.primary }} />
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 mb-6 cursor-pointer transition-all select-none"
          style={{
            background: COLORS.cardBg,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minHeight: 240,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          onClick={handleFlip}>
          {!flipped ? (
            <div className="text-center">
              {/* Mastery level indicator */}
              <div className="flex justify-center mb-4">
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: `${masteryColor(current.masteryLevel)}18`, color: masteryColor(current.masteryLevel) }}>
                  Level {current.masteryLevel}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2 tracking-wide uppercase"
                style={{ color: COLORS.textPrimary }}>
                {current.word}
              </h2>
              <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>{current.definition}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm" style={{ color: COLORS.primary }}>Lật thẻ ↩</span>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: COLORS.textPrimary }}>
                {current.word}
              </h3>
              <div style={{ borderBottom: `1px solid ${COLORS.border}` }} className="mb-4 pb-3">
                <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>{current.translation}</p>
                <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>{current.definition}</p>
              </div>
              {current.example && (
                <p className="text-sm italic" style={{ color: COLORS.textSecondary }}>
                  "{current.example}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Review buttons */}
        {flipped && (
          <div className="grid grid-cols-4 gap-2">
            {REVIEW_BUTTONS.map(btn => (
              <button
                key={btn.result}
                onClick={() => handleReview(btn.result)}
                disabled={reviewing}
                className="flex flex-col items-center py-3 rounded-xl transition-all"
                style={{
                  background: `${btn.color}12`,
                  border: `1px solid ${btn.color}30`,
                  cursor: reviewing ? 'not-allowed' : 'pointer',
                  opacity: reviewing ? 0.6 : 1,
                }}>
                <span className="text-lg mb-1">{EMOJI_COLOR[btn.result]}</span>
                <span className="text-xs font-semibold" style={{ color: btn.color }}>{btn.label}</span>
                <span className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{btn.days}</span>
              </button>
            ))}
          </div>
        )}

        {!flipped && (
          <p className="text-center text-sm" style={{ color: COLORS.textMuted }}>
            Nhấp vào thẻ để xem nghĩa
          </p>
        )}
      </div>
    </div>
  );
}
