import { useState, useEffect } from 'react';
import { COLORS } from '../../../constants/colors';
import { toast } from 'react-toastify';
import { getModules } from '../../../services/module.service';
import {
  createModule, updateModule, deleteModule,
  createUnit, updateUnit, deleteUnit,
  getLessonsAdmin, createLesson, updateLesson, deleteLesson,
} from '../../../services/cms.service';
import type { LearningModule } from '../../../models/learning';
import type { UnitSimple, LessonSimple } from '../../../services/cms.service';
import {
  PlusIcon, PencilSquareIcon, TrashIcon,
  CheckIcon, XMarkIcon, ChevronRightIcon,
  FolderOpenIcon, BookOpenIcon, DocumentTextIcon,
} from '@heroicons/react/24/outline';

// ── Inline edit/create form component ────────────────────────────────────────
function InlineForm({
  initial, fields, onSave, onCancel,
}: {
  initial: Record<string, string>;
  fields: { key: string; label: string; type?: string; options?: string[] }[];
  onSave: (values: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(values); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border" style={{ background: COLORS.bodyBg, borderColor: `${COLORS.primary}30` }}>
      {fields.map(f => (
        <div key={f.key}>
          <label className="text-xs font-medium block mb-1" style={{ color: COLORS.textSecondary }}>{f.label}</label>
          {f.options ? (
            <select value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type={f.type ?? 'text'} value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full p-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border }} />
          )}
        </div>
      ))}
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: COLORS.border, color: COLORS.textSecondary }}>Hủy</button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: COLORS.primary }}>
          <CheckIcon className="w-3.5 h-3.5" />{saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}

// ── Color picker options ──────────────────────────────────────────────────────
const MODULE_COLOR_OPTIONS = ['#4361EE', '#7209B7', '#06D6A0', '#FFB703', '#EF233C', '#06B6D4', '#F97316', '#8B5CF6'];
const LESSON_TYPES = ['grammar', 'reading', 'listening', 'writing', 'speaking', 'vocabulary', 'exam'];
const LESSON_TYPE_LABEL: Record<string, string> = {
  grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe',
  writing: 'Viết', speaking: 'Nói', vocabulary: 'Từ vựng', exam: 'Kiểm tra',
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminContentPage() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selModule, setSelModule] = useState<LearningModule | null>(null);
  const [units, setUnits] = useState<UnitSimple[]>([]);
  const [selUnit, setSelUnit] = useState<UnitSimple | null>(null);
  const [lessons, setLessons] = useState<LessonSimple[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState<'create' | string | null>(null); // null | 'create' | editId
  const [unitForm, setUnitForm] = useState<'create' | string | null>(null);
  const [lessonForm, setLessonForm] = useState<'create' | string | null>(null);

  const loadModules = () => {
    setLoading(true);
    getModules().then(setModules).catch(() => toast.error('Không tải được modules')).finally(() => setLoading(false));
  };

  const loadUnits = (moduleId: string) => {
    import('../../../api/axios').then(({ default: api }) => {
      (api.get(`/modules/${moduleId}/units`) as any).then((res: any) => {
        setUnits((res.data ?? []).map((u: any) => ({
          id: u.id, title: u.title, sortOrder: u.sortOrder,
          unlockThreshold: u.unlockThreshold ?? 80,
        })));
      });
    });
  };

  const loadLessons = (unitId: string) => {
    getLessonsAdmin(unitId).then(res => setLessons((res as any).data ?? [])).catch(() => {});
  };

  useEffect(() => { loadModules(); }, []);

  const handleSelectModule = (m: LearningModule) => {
    setSelModule(m); setSelUnit(null); setLessons([]);
    setUnitForm(null); setLessonForm(null);
    loadUnits(m.id);
  };

  const handleSelectUnit = (u: UnitSimple) => {
    setSelUnit(u); setLessons([]); setLessonForm(null);
    loadLessons(u.id);
  };

  // ── Module actions ──────────────────────────────────────────────────────────
  const handleCreateModule = async (values: Record<string, string>) => {
    await createModule({
      type: values.type || 'custom',
      title: values.title,
      description: values.description || '',
      targetGrades: values.targetGrades || '',
      color: values.color || '#4361EE',
      sortOrder: Number(values.sortOrder) || 99,
    });
    toast.success('Tạo chủ đề thành công'); setModuleForm(null); loadModules();
  };

  const handleUpdateModule = async (id: string, values: Record<string, string>) => {
    await updateModule(id, { title: values.title, description: values.description, color: values.color });
    toast.success('Đã cập nhật'); setModuleForm(null); loadModules();
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Xóa chủ đề này? Tất cả bài học bên trong sẽ bị ẩn.')) return;
    await deleteModule(id);
    toast.success('Đã xóa'); if (selModule?.id === id) { setSelModule(null); setUnits([]); } loadModules();
  };

  // ── Unit actions ────────────────────────────────────────────────────────────
  const handleCreateUnit = async (values: Record<string, string>) => {
    if (!selModule) return;
    await createUnit(selModule.id, { title: values.title, sortOrder: Number(values.sortOrder) || 99, unlockThreshold: Number(values.unlockThreshold) || 80 });
    toast.success('Tạo chương thành công'); setUnitForm(null); loadUnits(selModule.id);
  };

  const handleUpdateUnit = async (id: string, values: Record<string, string>) => {
    await updateUnit(id, { title: values.title, sortOrder: Number(values.sortOrder) });
    toast.success('Đã cập nhật'); setUnitForm(null);
    if (selModule) loadUnits(selModule.id);
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm('Xóa chương này?')) return;
    await deleteUnit(id);
    toast.success('Đã xóa'); if (selUnit?.id === id) { setSelUnit(null); setLessons([]); }
    if (selModule) loadUnits(selModule.id);
  };

  // ── Lesson actions ──────────────────────────────────────────────────────────
  const handleCreateLesson = async (values: Record<string, string>) => {
    if (!selUnit) return;
    await createLesson(selUnit.id, {
      title: values.title, lessonType: values.lessonType || 'grammar',
      durationMinutes: Number(values.durationMinutes) || 15,
      sortOrder: Number(values.sortOrder) || 99,
      difficulty: Number(values.difficulty) || 3,
    });
    toast.success('Tạo bài học thành công'); setLessonForm(null); loadLessons(selUnit.id);
  };

  const handleUpdateLesson = async (id: string, values: Record<string, string>) => {
    await updateLesson(id, { title: values.title, lessonType: values.lessonType, durationMinutes: Number(values.durationMinutes), difficulty: Number(values.difficulty) });
    toast.success('Đã cập nhật'); setLessonForm(null);
    if (selUnit) loadLessons(selUnit.id);
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Xóa bài học này?')) return;
    await deleteLesson(id);
    toast.success('Đã xóa');
    if (selUnit) loadLessons(selUnit.id);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Quản lý nội dung</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Tạo và quản lý Chủ đề → Chương → Bài học → Bài tập</p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-5">
          <span style={{ color: COLORS.primary, fontWeight: 500 }}>Chủ đề</span>
          {selModule && <><ChevronRightIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} /><span style={{ color: COLORS.primary, fontWeight: 500 }}>{selModule.title}</span></>}
          {selUnit && <><ChevronRightIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} /><span style={{ color: COLORS.primary, fontWeight: 500 }}>{selUnit.title}</span></>}
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: selUnit ? '1fr 1fr 1fr' : selModule ? '1fr 1fr' : '1fr' }}>

          {/* ── Column 1: Modules ── */}
          <Panel
            title="Chủ đề (Module)"
            icon={FolderOpenIcon}
            onAdd={() => setModuleForm('create')}
            loading={loading}>
            {moduleForm === 'create' && (
              <InlineForm
                initial={{ title: '', description: '', type: 'custom', color: '#4361EE', targetGrades: '', sortOrder: '99' }}
                fields={[
                  { key: 'title', label: 'Tên chủ đề *' },
                  { key: 'description', label: 'Mô tả' },
                  { key: 'type', label: 'Loại (key)', type: 'text' },
                  { key: 'targetGrades', label: 'Lớp mục tiêu (vd: 9,10)' },
                  { key: 'color', label: 'Màu (hex)', options: MODULE_COLOR_OPTIONS },
                  { key: 'sortOrder', label: 'Thứ tự', type: 'number' },
                ]}
                onSave={handleCreateModule}
                onCancel={() => setModuleForm(null)}
              />
            )}
            {modules.map(m => (
              <div key={m.id}>
                {moduleForm === m.id ? (
                  <InlineForm
                    initial={{ title: m.title, description: m.description, color: m.color }}
                    fields={[
                      { key: 'title', label: 'Tên chủ đề' },
                      { key: 'description', label: 'Mô tả' },
                      { key: 'color', label: 'Màu', options: MODULE_COLOR_OPTIONS },
                    ]}
                    onSave={v => handleUpdateModule(m.id, v)}
                    onCancel={() => setModuleForm(null)}
                  />
                ) : (
                  <ItemRow
                    label={m.title}
                    sub={`${m.unitCount} chương`}
                    color={m.color}
                    active={selModule?.id === m.id}
                    onClick={() => handleSelectModule(m)}
                    onEdit={() => setModuleForm(m.id)}
                    onDelete={() => handleDeleteModule(m.id)}
                  />
                )}
              </div>
            ))}
            {modules.length === 0 && !loading && !moduleForm && (
              <p className="text-sm text-center py-6" style={{ color: COLORS.textMuted }}>Chưa có chủ đề nào</p>
            )}
          </Panel>

          {/* ── Column 2: Units ── */}
          {selModule && (
            <Panel title={`Chương — ${selModule.title}`} icon={BookOpenIcon} onAdd={() => setUnitForm('create')}>
              {unitForm === 'create' && (
                <InlineForm
                  initial={{ title: '', sortOrder: String(units.length + 1), unlockThreshold: '0' }}
                  fields={[
                    { key: 'title', label: 'Tên chương *' },
                    { key: 'sortOrder', label: 'Thứ tự', type: 'number' },
                    { key: 'unlockThreshold', label: 'Điểm mở khóa chương sau (%)', type: 'number' },
                  ]}
                  onSave={handleCreateUnit}
                  onCancel={() => setUnitForm(null)}
                />
              )}
              {units.map(u => (
                <div key={u.id}>
                  {unitForm === u.id ? (
                    <InlineForm
                      initial={{ title: u.title, sortOrder: String(u.sortOrder), unlockThreshold: String(u.unlockThreshold) }}
                      fields={[
                        { key: 'title', label: 'Tên chương' },
                        { key: 'sortOrder', label: 'Thứ tự', type: 'number' },
                        { key: 'unlockThreshold', label: 'Điểm mở khóa (%)', type: 'number' },
                      ]}
                      onSave={v => handleUpdateUnit(u.id, v)}
                      onCancel={() => setUnitForm(null)}
                    />
                  ) : (
                    <ItemRow
                      label={u.title}
                      sub={`Mở khóa: ${u.unlockThreshold}%`}
                      active={selUnit?.id === u.id}
                      onClick={() => handleSelectUnit(u)}
                      onEdit={() => setUnitForm(u.id)}
                      onDelete={() => handleDeleteUnit(u.id)}
                    />
                  )}
                </div>
              ))}
              {units.length === 0 && !unitForm && (
                <p className="text-sm text-center py-6" style={{ color: COLORS.textMuted }}>Chưa có chương nào</p>
              )}
            </Panel>
          )}

          {/* ── Column 3: Lessons ── */}
          {selUnit && (
            <Panel title={`Bài học — ${selUnit.title}`} icon={DocumentTextIcon} onAdd={() => setLessonForm('create')}>
              {lessonForm === 'create' && (
                <InlineForm
                  initial={{ title: '', lessonType: 'grammar', durationMinutes: '15', sortOrder: String(lessons.length + 1), difficulty: '3' }}
                  fields={[
                    { key: 'title', label: 'Tên bài học *' },
                    { key: 'lessonType', label: 'Loại bài học', options: LESSON_TYPES },
                    { key: 'durationMinutes', label: 'Thời gian (phút)', type: 'number' },
                    { key: 'difficulty', label: 'Độ khó (1-5)', type: 'number' },
                    { key: 'sortOrder', label: 'Thứ tự', type: 'number' },
                  ]}
                  onSave={handleCreateLesson}
                  onCancel={() => setLessonForm(null)}
                />
              )}
              {lessons.map(l => (
                <div key={l.id}>
                  {lessonForm === l.id ? (
                    <InlineForm
                      initial={{ title: l.title, lessonType: l.lessonType, durationMinutes: String(l.durationMinutes), difficulty: String(l.difficulty) }}
                      fields={[
                        { key: 'title', label: 'Tên bài học' },
                        { key: 'lessonType', label: 'Loại', options: LESSON_TYPES },
                        { key: 'durationMinutes', label: 'Thời gian (phút)', type: 'number' },
                        { key: 'difficulty', label: 'Độ khó (1-5)', type: 'number' },
                      ]}
                      onSave={v => handleUpdateLesson(l.id, v)}
                      onCancel={() => setLessonForm(null)}
                    />
                  ) : (
                    <ItemRow
                      label={l.title}
                      sub={`${LESSON_TYPE_LABEL[l.lessonType] ?? l.lessonType} · ${l.durationMinutes} phút · ⭐${l.difficulty}`}
                      badge={l.lessonType}
                      onClick={() => {}}
                      onEdit={() => setLessonForm(l.id)}
                      onDelete={() => handleDeleteLesson(l.id)}
                    />
                  )}
                </div>
              ))}
              {lessons.length === 0 && !lessonForm && (
                <p className="text-sm text-center py-6" style={{ color: COLORS.textMuted }}>Chưa có bài học nào</p>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reusable sub-components ────────────────────────────────────────────────────

function Panel({
  title, icon: Icon, onAdd, loading, children,
}: {
  title: string; icon: React.ElementType; onAdd: () => void; loading?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: COLORS.primary }} />
          <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{title}</span>
          {loading && <span className="text-xs" style={{ color: COLORS.textMuted }}>đang tải...</span>}
        </div>
        <button onClick={onAdd} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
          style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
          <PlusIcon className="w-3.5 h-3.5" /> Thêm
        </button>
      </div>
      <div className="divide-y p-2 space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto" style={{ borderColor: COLORS.border }}>
        {children}
      </div>
    </div>
  );
}

function ItemRow({
  label, sub, badge, color, active, onClick, onEdit, onDelete,
}: {
  label: string; sub?: string; badge?: string; color?: string;
  active?: boolean; onClick: () => void; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group"
      style={{
        background: active ? `${COLORS.primary}10` : 'transparent',
        border: active ? `1px solid ${COLORS.primary}30` : '1px solid transparent',
      }}>
      {color && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: active ? COLORS.primary : COLORS.textPrimary }}>{label}</p>
        {sub && <p className="text-xs truncate mt-0.5" style={{ color: COLORS.textMuted }}>{sub}</p>}
        {badge && (
          <span className="text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block"
            style={{ background: `${COLORS.primary}12`, color: COLORS.primary }}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); onEdit(); }}
          className="p-1 rounded-lg hover:opacity-70" style={{ color: COLORS.primary }}>
          <PencilSquareIcon className="w-3.5 h-3.5" />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded-lg hover:opacity-70" style={{ color: COLORS.danger }}>
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
