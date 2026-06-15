import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { addVocabulary } from '../../services/vocabulary.service';
import type { VocabularyItem } from '../../models/learning';

interface Props {
  onClose: () => void;
  onAdded: (item: VocabularyItem) => void;
}

export default function AddVocabularyModal({ onClose, onAdded }: Props) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!word.trim() || !definition.trim() || !translation.trim()) {
      setError('Vui lòng điền từ, định nghĩa và nghĩa tiếng Việt.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const item = await addVocabulary({
        word: word.trim(),
        definition: definition.trim(),
        translation: translation.trim(),
        example: example.trim() || undefined,
      });
      onAdded(item);
      onClose();
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 14,
    color: COLORS.textPrimary,
    background: COLORS.bodyBg,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl w-full max-w-md mx-4"
        style={{ background: COLORS.cardBg, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>Thêm từ mới</h2>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: COLORS.bodyBg, border: 'none', cursor: 'pointer', color: COLORS.textMuted }}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Từ vựng *
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. metamorphosis"
              value={word}
              onChange={e => setWord(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Định nghĩa (tiếng Anh) *
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. a process of transformation"
              value={definition}
              onChange={e => setDefinition(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Nghĩa tiếng Việt *
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. sự biến đổi, sự lột xác"
              value={translation}
              onChange={e => setTranslation(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Ví dụ (tùy chọn)
            </label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              placeholder="e.g. The caterpillar undergoes metamorphosis..."
              value={example}
              onChange={e => setExample(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: COLORS.danger }}>{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: COLORS.bodyBg, color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
            Hủy
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: saving ? COLORS.border : COLORS.primary, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Đang lưu...' : 'Thêm từ'}
          </button>
        </div>
      </div>
    </div>
  );
}
