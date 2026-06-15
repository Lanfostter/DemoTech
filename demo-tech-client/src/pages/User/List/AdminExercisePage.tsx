import { useState, useEffect } from 'react';
import { COLORS } from '../../../constants/colors';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import {
  PlusIcon, PencilSquareIcon, TrashIcon,
  XMarkIcon, CheckIcon, PlusCircleIcon, MinusCircleIcon,
} from '@heroicons/react/24/outline';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ExerciseRow {
  id: string;
  exerciseType: string;
  sortOrder: number;
  totalPoints: number;
  questionJson: string;
  correctAnswerJson?: string;
  explanation?: string;
  difficulty: string;
}

interface McqOption { id: string; text: string }

interface ExerciseFormState {
  exerciseType: string;
  sortOrder: number;
  totalPoints: number;
  difficulty: number;
  explanation: string;
  // MCQ
  mcqQuestion: string;
  mcqOptions: McqOption[];
  mcqCorrect: string;          // option id
  // Fill in the blank
  fibQuestion: string;         // dùng ___ cho chỗ trống
  fibAnswers: string[];
  // Rewrite
  rewriteInstruction: string;
  rewriteAnswer: string;
  // Ordering
  orderingWords: string[];
}

const DEFAULT_FORM: ExerciseFormState = {
  exerciseType: 'multiple_choice',
  sortOrder: 1,
  totalPoints: 10,
  difficulty: 3,
  explanation: '',
  mcqQuestion: '',
  mcqOptions: [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ],
  mcqCorrect: 'a',
  fibQuestion: '',
  fibAnswers: [''],
  rewriteInstruction: '',
  rewriteAnswer: '',
  orderingWords: ['', ''],
};

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '🔘 Trắc nghiệm',
  fill_in_the_blank: '✏️ Điền vào chỗ trống',
  rewrite: '🔄 Viết lại câu',
  ordering: '🔀 Sắp xếp từ',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

// ── JSON builders ──────────────────────────────────────────────────────────────

function buildJson(f: ExerciseFormState): { questionJson: string; correctAnswerJson: string } {
  switch (f.exerciseType) {
    case 'multiple_choice':
      return {
        questionJson: JSON.stringify({
          text: f.mcqQuestion,
          options: f.mcqOptions.map(o => ({ id: o.id, text: o.text })),
          allowMultiple: false,
        }),
        correctAnswerJson: JSON.stringify({ optionId: f.mcqCorrect }),
      };
    case 'fill_in_the_blank':
      return {
        questionJson: JSON.stringify({ text: f.fibQuestion, blanks: f.fibAnswers.length }),
        correctAnswerJson: JSON.stringify({ answers: f.fibAnswers }),
      };
    case 'rewrite':
      return {
        questionJson: JSON.stringify({ text: f.rewriteInstruction }),
        correctAnswerJson: JSON.stringify({ text: f.rewriteAnswer }),
      };
    case 'ordering':
      return {
        questionJson: JSON.stringify({ words: [...f.orderingWords].sort(() => Math.random() - 0.5) }),
        correctAnswerJson: JSON.stringify({ order: f.orderingWords }),
      };
    default:
      return { questionJson: '{}', correctAnswerJson: '{}' };
  }
}

function parseJsonToForm(ex: ExerciseRow): Partial<ExerciseFormState> {
  try {
    const q = JSON.parse(ex.questionJson ?? '{}');
    const a = JSON.parse(ex.correctAnswerJson ?? '{}');
    switch (ex.exerciseType) {
      case 'multiple_choice':
        return {
          mcqQuestion: q.text ?? '',
          mcqOptions: q.options?.length ? q.options : DEFAULT_FORM.mcqOptions,
          mcqCorrect: a.optionId ?? 'a',
        };
      case 'fill_in_the_blank':
        return {
          fibQuestion: q.text ?? '',
          fibAnswers: a.answers?.length ? a.answers : [''],
        };
      case 'rewrite':
        return { rewriteInstruction: q.text ?? '', rewriteAnswer: a.text ?? '' };
      case 'ordering':
        return { orderingWords: a.order?.length ? a.order : q.words ?? [''] };
    }
  } catch { /* ignore */ }
  return {};
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminExercisePage() {
  const [lessons, setLessons] = useState<{ id: string; title: string }[]>([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ExerciseFormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/modules').then((res: any) => {
      const modules = res.data ?? [];
      Promise.all(
        modules.map((m: any) =>
          api.get(`/modules/${m.id}/units`).then((r: any) =>
            (r.data ?? []).flatMap((u: any) =>
              (u.lessons ?? []).map((l: any) => ({
                id: l.id,
                title: `${m.title} › ${u.title} › ${l.title}`,
              }))
            )
          )
        )
      ).then(all => setLessons((all as any[]).flat()));
    });
  }, []);

  const loadExercises = (id: string) => {
    setLoading(true);
    api.get(`/exercises/lesson/${id}`)
      .then((res: any) => setExercises(res.data ?? []))
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setForm({ ...DEFAULT_FORM, sortOrder: exercises.length + 1 });
    setEditId(null);
    setShowForm(true);
    setTimeout(() => document.getElementById('ex-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const openEdit = (ex: ExerciseRow) => {
    const parsed = parseJsonToForm(ex);
    setForm({
      ...DEFAULT_FORM,
      exerciseType: ex.exerciseType,
      sortOrder: ex.sortOrder,
      totalPoints: ex.totalPoints,
      difficulty: Number(ex.difficulty) || 3,
      explanation: ex.explanation ?? '',
      ...parsed,
    });
    setEditId(ex.id);
    setShowForm(true);
    setTimeout(() => document.getElementById('ex-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSave = async () => {
    if (!selectedLesson) { toast.error('Chọn bài học trước'); return; }
    const { questionJson, correctAnswerJson } = buildJson(form);
    const payload = {
      lessonId: selectedLesson,
      exerciseType: form.exerciseType,
      sortOrder: form.sortOrder,
      totalPoints: form.totalPoints,
      difficulty: form.difficulty,
      explanation: form.explanation,
      questionJson,
      correctAnswerJson,
    };
    setSaving(true);
    try {
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
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài tập này?')) return;
    await api.delete(`/exercises/${id}`);
    toast.success('Đã xóa');
    loadExercises(selectedLesson);
  };

  const set = (key: keyof ExerciseFormState, val: any) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Quản lý bài tập</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Tạo, sửa, xóa câu hỏi cho từng bài học</p>
          </div>
          {selectedLesson && !showForm && (
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: COLORS.primary }}>
              <PlusIcon className="w-4 h-4" /> Thêm câu hỏi
            </button>
          )}
        </div>

        {/* Lesson picker */}
        <div className="rounded-2xl p-4" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <label className="text-sm font-medium block mb-2" style={{ color: COLORS.textPrimary }}>Chọn bài học</label>
          <select value={selectedLesson}
            onChange={e => { setSelectedLesson(e.target.value); loadExercises(e.target.value); setShowForm(false); }}
            className="w-full p-2.5 rounded-xl text-sm border"
            style={{ borderColor: COLORS.border, background: COLORS.bodyBg }}>
            <option value="">-- Chọn bài học --</option>
            {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </div>

        {/* Exercise list */}
        {selectedLesson && (
          <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                {loading ? 'Đang tải...' : `${exercises.length} câu hỏi`}
              </p>
            </div>
            {exercises.length === 0 && !loading ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-2xl">📝</p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: COLORS.border }}>
                {exercises.map((ex, i) => {
                  let questionText = ex.questionJson;
                  try { questionText = JSON.parse(ex.questionJson).text ?? questionText; } catch { /* */ }
                  return (
                    <div key={ex.id} className="flex items-start gap-4 px-5 py-4">
                      <span className="text-sm font-bold mt-0.5 w-5 flex-shrink-0" style={{ color: COLORS.textMuted }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1"
                          style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
                          {TYPE_LABELS[ex.exerciseType] ?? ex.exerciseType}
                        </span>
                        <p className="text-sm" style={{ color: COLORS.textPrimary }}>{questionText}</p>
                        <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{ex.totalPoints} điểm · độ khó {ex.difficulty}/5</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => openEdit(ex)}
                          className="p-1.5 rounded-lg" style={{ color: COLORS.primary }}>
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ex.id)}
                          className="p-1.5 rounded-lg" style={{ color: COLORS.danger }}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Visual Exercise Form ── */}
        {showForm && (
          <div id="ex-form" className="rounded-2xl p-5 space-y-5"
            style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${COLORS.primary}30` }}>

            {/* Form header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold" style={{ color: COLORS.textPrimary }}>
                {editId ? '✏️ Chỉnh sửa câu hỏi' : '➕ Thêm câu hỏi mới'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ color: COLORS.textMuted }}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Exercise type tabs */}
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: COLORS.textSecondary }}>Loại câu hỏi</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <button key={k} onClick={() => set('exerciseType', k)}
                    className="py-2 px-3 rounded-xl text-sm font-medium text-left transition-all"
                    style={{
                      background: form.exerciseType === k ? `${COLORS.primary}15` : COLORS.bodyBg,
                      border: `2px solid ${form.exerciseType === k ? COLORS.primary : COLORS.border}`,
                      color: form.exerciseType === k ? COLORS.primary : COLORS.textSecondary,
                    }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* ── MCQ form ── */}
            {form.exerciseType === 'multiple_choice' && (
              <div className="space-y-4">
                <Field label="Câu hỏi">
                  <textarea value={form.mcqQuestion} onChange={e => set('mcqQuestion', e.target.value)}
                    rows={2} placeholder="Nhập câu hỏi, ví dụ: She ___ to school every day."
                    className="w-full p-2.5 rounded-xl text-sm border resize-none"
                    style={{ borderColor: COLORS.border }} />
                </Field>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Các đáp án</label>
                    {form.mcqOptions.length < 5 && (
                      <button onClick={() => {
                        const ids = ['a','b','c','d','e'];
                        const newId = ids[form.mcqOptions.length];
                        set('mcqOptions', [...form.mcqOptions, { id: newId, text: '' }]);
                      }} className="text-xs flex items-center gap-1" style={{ color: COLORS.primary }}>
                        <PlusCircleIcon className="w-3.5 h-3.5" /> Thêm đáp án
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {form.mcqOptions.map((opt, i) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <button onClick={() => set('mcqCorrect', opt.id)}
                          className="w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all"
                          title="Chọn làm đáp án đúng"
                          style={{
                            borderColor: form.mcqCorrect === opt.id ? COLORS.success : COLORS.border,
                            background: form.mcqCorrect === opt.id ? COLORS.success : 'transparent',
                          }}>
                          {form.mcqCorrect === opt.id && <CheckIcon className="w-3 h-3 text-white" />}
                        </button>
                        <span className="text-sm font-bold w-5 flex-shrink-0" style={{ color: COLORS.textMuted }}>
                          {OPTION_LETTERS[i]}.
                        </span>
                        <input value={opt.text}
                          onChange={e => set('mcqOptions', form.mcqOptions.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o))}
                          placeholder={`Đáp án ${OPTION_LETTERS[i]}`}
                          className="flex-1 p-2 rounded-lg text-sm border"
                          style={{
                            borderColor: form.mcqCorrect === opt.id ? COLORS.success : COLORS.border,
                            background: form.mcqCorrect === opt.id ? `${COLORS.success}08` : 'white',
                          }} />
                        {form.mcqOptions.length > 2 && (
                          <button onClick={() => set('mcqOptions', form.mcqOptions.filter(o => o.id !== opt.id))}
                            style={{ color: COLORS.danger }}>
                            <MinusCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
                    ● Nhấn vào vòng tròn để chọn đáp án đúng
                  </p>
                </div>
              </div>
            )}

            {/* ── Fill in the blank form ── */}
            {form.exerciseType === 'fill_in_the_blank' && (
              <div className="space-y-4">
                <Field label='Câu hỏi (dùng ___ để đánh dấu chỗ trống)'>
                  <textarea value={form.fibQuestion}
                    onChange={e => {
                      const blanks = (e.target.value.match(/___/g) ?? []).length;
                      const answers = Array.from({ length: Math.max(1, blanks) }, (_, i) => form.fibAnswers[i] ?? '');
                      setForm(f => ({ ...f, fibQuestion: e.target.value, fibAnswers: answers }));
                    }}
                    rows={2} placeholder='Ví dụ: She ___ (go) to school every day.'
                    className="w-full p-2.5 rounded-xl text-sm border resize-none"
                    style={{ borderColor: COLORS.border }} />
                  {form.fibQuestion && (
                    <div className="mt-2 p-2.5 rounded-xl text-sm" style={{ background: `${COLORS.primary}08`, color: COLORS.textPrimary }}>
                      {form.fibQuestion.split('___').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="inline-block mx-1 px-3 rounded border font-medium"
                              style={{ borderColor: COLORS.primary, color: COLORS.primary, background: `${COLORS.primary}12` }}>
                              {form.fibAnswers[i] || '___'}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </Field>
                <div>
                  <label className="text-xs font-medium block mb-2" style={{ color: COLORS.textSecondary }}>
                    Đáp án cho từng chỗ trống
                  </label>
                  <div className="space-y-2">
                    {form.fibAnswers.map((ans, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs font-semibold w-16 flex-shrink-0" style={{ color: COLORS.textMuted }}>Chỗ {i + 1}</span>
                        <input value={ans}
                          onChange={e => set('fibAnswers', form.fibAnswers.map((a, j) => j === i ? e.target.value : a))}
                          placeholder="Đáp án đúng"
                          className="flex-1 p-2 rounded-lg text-sm border"
                          style={{ borderColor: COLORS.border }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Rewrite form ── */}
            {form.exerciseType === 'rewrite' && (
              <div className="space-y-4">
                <Field label="Yêu cầu / Câu gốc">
                  <textarea value={form.rewriteInstruction}
                    onChange={e => set('rewriteInstruction', e.target.value)}
                    rows={2} placeholder="Ví dụ: Rewrite using passive voice: The teacher corrected the test."
                    className="w-full p-2.5 rounded-xl text-sm border resize-none"
                    style={{ borderColor: COLORS.border }} />
                </Field>
                <Field label="Đáp án mẫu">
                  <input value={form.rewriteAnswer}
                    onChange={e => set('rewriteAnswer', e.target.value)}
                    placeholder="Ví dụ: The test was corrected by the teacher."
                    className="w-full p-2.5 rounded-xl text-sm border"
                    style={{ borderColor: COLORS.border }} />
                </Field>
              </div>
            )}

            {/* ── Ordering form ── */}
            {form.exerciseType === 'ordering' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
                    Các từ / cụm từ (theo thứ tự đúng)
                  </label>
                  <button onClick={() => set('orderingWords', [...form.orderingWords, ''])}
                    className="text-xs flex items-center gap-1" style={{ color: COLORS.primary }}>
                    <PlusCircleIcon className="w-3.5 h-3.5" /> Thêm từ
                  </button>
                </div>
                <div className="space-y-2">
                  {form.orderingWords.map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: COLORS.textMuted }}>{i + 1}</span>
                      <input value={w}
                        onChange={e => set('orderingWords', form.orderingWords.map((x, j) => j === i ? e.target.value : x))}
                        placeholder={`Từ / cụm từ thứ ${i + 1}`}
                        className="flex-1 p-2 rounded-lg text-sm border"
                        style={{ borderColor: COLORS.border }} />
                      {form.orderingWords.length > 2 && (
                        <button onClick={() => set('orderingWords', form.orderingWords.filter((_, j) => j !== i))}
                          style={{ color: COLORS.danger }}>
                          <MinusCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl text-sm" style={{ background: `${COLORS.primary}08` }}>
                  <p className="text-xs font-medium mb-2" style={{ color: COLORS.textSecondary }}>Xem trước (học sinh sẽ sắp xếp lại):</p>
                  <div className="flex flex-wrap gap-2">
                    {[...form.orderingWords].filter(Boolean).sort(() => 0.5 - Math.random()).map((w, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Common fields */}
            <div className="grid grid-cols-3 gap-3 pt-1" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              <Field label="Điểm">
                <input type="number" value={form.totalPoints}
                  onChange={e => set('totalPoints', +e.target.value)}
                  className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
              </Field>
              <Field label="Độ khó (1-5)">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => set('difficulty', n)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: form.difficulty === n ? COLORS.primary : COLORS.bodyBg,
                        color: form.difficulty === n ? '#fff' : COLORS.textSecondary,
                        border: `1px solid ${form.difficulty === n ? COLORS.primary : COLORS.border}`,
                      }}>{n}</button>
                  ))}
                </div>
              </Field>
              <Field label="Thứ tự hiển thị">
                <input type="number" value={form.sortOrder}
                  onChange={e => set('sortOrder', +e.target.value)}
                  className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
              </Field>
            </div>

            <Field label="Giải thích đáp án (hiển thị sau khi học sinh trả lời)">
              <input value={form.explanation}
                onChange={e => set('explanation', e.target.value)}
                placeholder="Ví dụ: Third person singular present simple dùng 'goes'."
                className="w-full p-2.5 rounded-xl text-sm border"
                style={{ borderColor: COLORS.border }} />
            </Field>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: COLORS.border, color: COLORS.textSecondary }}>
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: COLORS.primary }}>
                <CheckIcon className="w-4 h-4" />
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo câu hỏi'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: COLORS.textSecondary }}>{label}</label>
      {children}
    </div>
  );
}
