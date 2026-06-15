import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { createClassroom } from '../../services/classroom.service';
import type { ClassroomDto } from '../../services/classroom.service';

interface Props {
  onClose: () => void;
  onCreated: (classroom: ClassroomDto) => void;
}

export default function CreateClassroomModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) { setError('Vui lòng nhập tên lớp.'); return; }
    setSaving(true);
    setError('');
    try {
      const classroom = await createClassroom({ name: name.trim(), description: description.trim() || undefined });
      onCreated(classroom);
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
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>Tạo lớp mới</h2>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: COLORS.bodyBg, border: 'none', cursor: 'pointer', color: COLORS.textMuted }}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Tên lớp *
            </label>
            <input style={inputStyle} placeholder="e.g. Lớp 9A — Ngữ pháp Nâng cao"
              value={name} onChange={e => setName(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Mô tả (tùy chọn)
            </label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              placeholder="Mô tả ngắn về lớp học..."
              value={description} onChange={e => setDescription(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)} />
          </div>
          {error && <p className="text-sm" style={{ color: COLORS.danger }}>{error}</p>}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: COLORS.bodyBg, color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
            Hủy
          </button>
          <button onClick={handleCreate} disabled={saving} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: saving ? COLORS.border : COLORS.primary, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Đang tạo...' : 'Tạo lớp'}
          </button>
        </div>
      </div>
    </div>
  );
}
