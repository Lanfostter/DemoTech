import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { createAssignment } from '../../services/classroom.service';
import { getUnits } from '../../services/module.service';
import { getModules } from '../../services/module.service';
import type { LessonListItem } from '../../models/learning';

interface Props {
  classroomId: string;
  classroomName: string;
  onClose: () => void;
  onAssigned: () => void;
}

interface LessonOption {
  id: string;
  title: string;
  unitTitle: string;
  moduleTitle: string;
}

export default function AssignLessonModal({ classroomId, classroomName, onClose, onAssigned }: Props) {
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getModules()
      .then(async modules => {
        const allLessons: LessonOption[] = [];
        for (const mod of modules) {
          const unitData = await getUnits(mod.id).catch(() => []);
          for (const { unit, lessons: ls } of unitData) {
            for (const l of ls as LessonListItem[]) {
              allLessons.push({
                id: l.id,
                title: l.title,
                unitTitle: unit.title,
                moduleTitle: mod.title,
              });
            }
          }
        }
        setLessons(allLessons);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));
  }, []);

  const handleAssign = async () => {
    if (!selectedLesson) { setError('Vui lòng chọn bài học.'); return; }
    if (!deadline) { setError('Vui lòng chọn hạn nộp.'); return; }
    setSaving(true);
    setError('');
    try {
      await createAssignment(classroomId, {
        lessonId: selectedLesson,
        deadline,
        note: note.trim() || undefined,
      });
      onAssigned();
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
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>Giao bài</h2>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>{classroomName}</p>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, background: COLORS.bodyBg, border: 'none', cursor: 'pointer', color: COLORS.textMuted }}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Chọn bài học *
            </label>
            {loadingLessons ? (
              <div className="h-10 rounded-xl animate-pulse" style={{ background: COLORS.border }} />
            ) : (
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={selectedLesson}
                onChange={e => setSelectedLesson(e.target.value)}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}>
                <option value="">-- Chọn bài học --</option>
                {lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.moduleTitle} › {l.unitTitle} › {l.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Hạn nộp *
            </label>
            <input type="datetime-local" style={inputStyle}
              value={deadline} onChange={e => setDeadline(e.target.value)}
              onFocus={e => (e.target.style.borderColor = COLORS.primary)}
              onBlur={e => (e.target.style.borderColor = COLORS.border)} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.textSecondary }}>
              Ghi chú (tùy chọn)
            </label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              placeholder="Hướng dẫn cho học sinh..."
              value={note} onChange={e => setNote(e.target.value)}
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
          <button onClick={handleAssign} disabled={saving || loadingLessons}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: saving ? COLORS.border : COLORS.primary, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Đang giao...' : 'Giao bài'}
          </button>
        </div>
      </div>
    </div>
  );
}
