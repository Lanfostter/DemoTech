import { useState, useEffect } from 'react';
import { COLORS } from '../../../constants/colors';
import api from '../../../api/axios';
import type { ApiResponse } from '../../../models/api-response';
import { toast } from 'react-toastify';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ExerciseRow {
  id: string;
  exerciseType: string;
  sortOrder: number;
  totalPoints: number;
  questionJson: string;
  difficulty: string;
}

interface LessonOption {
  id: string;
  title: string;
  lessonType: string;
}

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Trắc nghiệm',
  fill_in_the_blank: 'Điền vào chỗ trống',
  rewrite: 'Viết lại câu',
  ordering: 'Sắp xếp từ',
};

const MCQ_TEMPLATE = JSON.stringify({
  text: "Câu hỏi ở đây. He ___ to school.",
  options: [
    { id: "a", text: "go" },
    { id: "b", text: "goes" },
    { id: "c", text: "going" },
  ],
  allowMultiple: false,
}, null, 2);

const MCQ_ANSWER = JSON.stringify({ optionId: "b" }, null, 2);

const FIB_TEMPLATE = JSON.stringify({
  text: "She ___ (go) to school every day.",
  blanks: 1,
}, null, 2);

const FIB_ANSWER = JSON.stringify({ answers: ["goes"] }, null, 2);

const REWRITE_TEMPLATE = JSON.stringify({
  text: "Rewrite using passive voice: The teacher corrected the test.",
}, null, 2);

const REWRITE_ANSWER = JSON.stringify({ text: "The test was corrected by the teacher." }, null, 2);

export default function AdminExercisePage() {
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    exerciseType: 'multiple_choice',
    sortOrder: 1,
    totalPoints: 10,
    questionJson: MCQ_TEMPLATE,
    correctAnswerJson: MCQ_ANSWER,
    explanation: '',
    difficulty: 3,
  });

  // Load all lessons from all modules
  useEffect(() => {
    api.get('/modules').then((res: any) => {
      const modules = res.data ?? [];
      const lessonPromises = modules.map((m: any) =>
        api.get(`/modules/${m.id}/units`).then((unitRes: any) => {
          const units = unitRes.data ?? [];
          return units.flatMap((u: any) =>
            (u.lessons ?? []).map((l: any) => ({
              id: l.id,
              title: `${m.title} › ${u.title} › ${l.title}`,
              lessonType: l.lessonType,
            }))
          );
        })
      );
      Promise.all(lessonPromises).then(all => setLessons(all.flat()));
    });
  }, []);

  const loadExercises = (lessonId: string) => {
    if (!lessonId) return;
    setLoading(true);
    api.get(`/exercises/lesson/${lessonId}`)
      .then((res: any) => setExercises((res.data ?? [])))
      .finally(() => setLoading(false));
  };

  const handleLessonChange = (id: string) => {
    setSelectedLesson(id);
    loadExercises(id);
    setShowForm(false);
    setEditId(null);
  };

  const handleTypeChange = (type: string) => {
    let q = MCQ_TEMPLATE, a = MCQ_ANSWER;
    if (type === 'fill_in_the_blank') { q = FIB_TEMPLATE; a = FIB_ANSWER; }
    else if (type === 'rewrite') { q = REWRITE_TEMPLATE; a = REWRITE_ANSWER; }
    setForm(f => ({ ...f, exerciseType: type, questionJson: q, correctAnswerJson: a }));
  };

  const handleSubmit = async () => {
    if (!selectedLesson) { toast.error('Chọn bài học trước'); return; }
    try {
      const payload = { ...form, lessonId: selectedLesson };
      if (editId) {
        await api.put(`/exercises/${editId}`, payload);
        toast.success('Đã cập nhật bài tập');
      } else {
        await api.post('/exercises', payload);
        toast.success('Đã tạo bài tập mới');
      }
      setShowForm(false);
      setEditId(null);
      loadExercises(selectedLesson);
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleEdit = (ex: ExerciseRow) => {
    setForm({
      exerciseType: ex.exerciseType,
      sortOrder: ex.sortOrder,
      totalPoints: ex.totalPoints,
      questionJson: ex.questionJson,
      correctAnswerJson: '',
      explanation: '',
      difficulty: Number(ex.difficulty) || 3,
    });
    setEditId(ex.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài tập này?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      toast.success('Đã xóa');
      loadExercises(selectedLesson);
    } catch {
      toast.error('Không thể xóa');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Quản lý bài tập</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Tạo, sửa, xóa câu hỏi cho từng bài học</p>
          </div>
          {selectedLesson && (
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(f => ({ ...f, exerciseType: 'multiple_choice', questionJson: MCQ_TEMPLATE, correctAnswerJson: MCQ_ANSWER })); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: COLORS.primary }}>
              <PlusIcon className="w-4 h-4" /> Thêm bài tập
            </button>
          )}
        </div>

        {/* Lesson selector */}
        <div className="rounded-2xl p-4" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <label className="text-sm font-medium block mb-2" style={{ color: COLORS.textPrimary }}>Chọn bài học</label>
          <select value={selectedLesson} onChange={e => handleLessonChange(e.target.value)}
            className="w-full p-2.5 rounded-xl text-sm border"
            style={{ borderColor: COLORS.border, color: COLORS.textPrimary, background: COLORS.bodyBg }}>
            <option value="">-- Chọn bài học --</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>

        {/* Exercise list */}
        {selectedLesson && (
          <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                {loading ? 'Đang tải...' : `${exercises.length} bài tập`}
              </p>
            </div>
            {exercises.length === 0 && !loading ? (
              <div className="py-12 text-center" style={{ color: COLORS.textSecondary }}>
                <p className="text-sm">Chưa có bài tập nào. Nhấn "Thêm bài tập" để tạo.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: COLORS.border }}>
                {exercises.map((ex, i) => (
                  <div key={ex.id} className="flex items-center gap-4 px-5 py-4">
                    <span className="text-sm font-bold w-6 flex-shrink-0" style={{ color: COLORS.textMuted }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
                          {TYPE_LABELS[ex.exerciseType] ?? ex.exerciseType}
                        </span>
                        <span className="text-xs" style={{ color: COLORS.textMuted }}>{ex.totalPoints} điểm · độ khó {ex.difficulty}</span>
                      </div>
                      <p className="text-sm mt-1 truncate" style={{ color: COLORS.textSecondary }}>
                        {(() => {
                          try { return JSON.parse(ex.questionJson).text ?? ex.questionJson; }
                          catch { return ex.questionJson; }
                        })()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(ex)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: COLORS.primary }}>
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ex.id)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: COLORS.danger }}>
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${COLORS.primary}30` }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                {editId ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ color: COLORS.textMuted }}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Loại bài tập</label>
                <select value={form.exerciseType} onChange={e => handleTypeChange(e.target.value)}
                  className="w-full p-2 rounded-lg text-sm border"
                  style={{ borderColor: COLORS.border }}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Thứ tự</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))}
                    className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Điểm</label>
                  <input type="number" value={form.totalPoints} onChange={e => setForm(f => ({ ...f, totalPoints: +e.target.value }))}
                    className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Độ khó (1-5)</label>
                  <input type="number" min={1} max={5} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: +e.target.value }))}
                    className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Question JSON</label>
              <textarea value={form.questionJson} onChange={e => setForm(f => ({ ...f, questionJson: e.target.value }))} rows={6}
                className="w-full p-2 rounded-lg text-xs border font-mono"
                style={{ borderColor: COLORS.border, resize: 'vertical' }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Correct Answer JSON</label>
              <textarea value={form.correctAnswerJson} onChange={e => setForm(f => ({ ...f, correctAnswerJson: e.target.value }))} rows={3}
                className="w-full p-2 rounded-lg text-xs border font-mono"
                style={{ borderColor: COLORS.border, resize: 'vertical' }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>Giải thích (hiển thị sau khi trả lời)</label>
              <input type="text" value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                placeholder="Ví dụ: Third person singular uses 'goes'."
                className="w-full p-2 rounded-lg text-sm border"
                style={{ borderColor: COLORS.border }} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-4 py-2 rounded-xl text-sm" style={{ background: COLORS.border, color: COLORS.textSecondary }}>
                Hủy
              </button>
              <button onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: COLORS.primary }}>
                <CheckIcon className="w-4 h-4" />
                {editId ? 'Cập nhật' : 'Tạo bài tập'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
