import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { getVocabulary, getVocabularyStats } from '../../services/vocabulary.service';
import type { VocabularyItem, VocabularyStats } from '../../models/learning';
import AddVocabularyModal from './AddVocabularyModal';

type Filter = 'all' | 'due' | 'mastered';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'due', label: 'Đến hạn' },
  { key: 'mastered', label: 'Đã thuộc' },
];

const masteryColor = (level: number) => {
  if (level <= 1) return COLORS.danger;
  if (level <= 2) return COLORS.warning;
  if (level <= 3) return COLORS.primary;
  return COLORS.success;
};

const masteryLabel = (level: number) => {
  if (level === 0) return 'Mới';
  if (level === 1) return 'Level 1';
  if (level === 2) return 'Level 2';
  if (level === 3) return 'Level 3';
  if (level === 4) return 'Level 4';
  return 'Thuộc';
};

const formatReviewDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

export default function VocabularyPage() {
  const navigate = useNavigate();
  const [vocab, setVocab] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    Promise.all([
      getVocabulary().catch(() => []),
      getVocabularyStats().catch(() => null),
    ]).then(([words, s]) => {
      setVocab(words);
      setStats(s);
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const filtered = vocab.filter(v => {
    if (filter === 'due') return new Date(v.nextReviewAt) <= now;
    if (filter === 'mastered') return v.masteryLevel >= 5;
    return true;
  });

  const dueCount = vocab.filter(v => new Date(v.nextReviewAt) <= now).length;

  const handleAdded = (item: VocabularyItem) => {
    setVocab(prev => [item, ...prev]);
    if (stats) setStats({ ...stats, totalWords: stats.totalWords + 1 });
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Sổ từ vựng</h1>
            <p className="text-sm mt-0.5" style={{ color: COLORS.textSecondary }}>Quản lý từ vựng của bạn</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white"
            style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
            <PlusIcon className="w-4 h-4" />
            Thêm từ mới
          </button>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Tổng từ', value: stats.totalWords, color: COLORS.primary },
              { label: 'Đến hạn hôm nay', value: stats.wordsDueToday, color: COLORS.warning },
              { label: 'Đã thuộc', value: stats.masteredWords, color: COLORS.success },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Flashcard CTA */}
        {dueCount > 0 && (
          <button
            onClick={() => navigate('/flashcard')}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl mb-5 transition-all hover:opacity-90"
            style={{ background: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}30`, cursor: 'pointer' }}>
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                  Ôn flashcard ngay ({dueCount} từ)
                </p>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  Bạn có {dueCount} từ cần ôn hôm nay
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>→</span>
          </button>
        )}

        {/* Filter */}
        <div className="flex rounded-xl p-1 mb-4 gap-1 w-fit"
          style={{ background: COLORS.cardBg, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f.key ? COLORS.primary : 'transparent',
                color: filter === f.key ? '#fff' : COLORS.textSecondary,
                border: 'none', cursor: 'pointer',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: COLORS.border }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📖</div>
            <p className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Chưa có từ vựng</p>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              {filter === 'all' ? 'Thêm từ mới để bắt đầu xây dựng sổ từ vựng.' : 'Không có từ nào trong bộ lọc này.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(v => {
              const isDue = new Date(v.nextReviewAt) <= now;
              return (
                <div key={v.id} className="rounded-2xl p-4"
                  style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${isDue ? `${COLORS.warning}40` : COLORS.border}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base uppercase tracking-wide" style={{ color: COLORS.textPrimary }}>
                          {v.word}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background: `${masteryColor(v.masteryLevel)}18`, color: masteryColor(v.masteryLevel) }}>
                          {masteryLabel(v.masteryLevel)}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>{v.translation}</p>
                      {v.example && (
                        <p className="text-xs mt-1 italic" style={{ color: COLORS.textMuted }}>"{v.example}"</p>
                      )}
                      <p className="text-xs mt-2" style={{ color: isDue ? COLORS.warning : COLORS.textMuted }}>
                        {isDue ? '🔔 Đến hạn ôn' : `Ôn lại: ${formatReviewDate(v.nextReviewAt)}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddVocabularyModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}
