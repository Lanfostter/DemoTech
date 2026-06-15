import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LockClosedIcon, CheckCircleIcon, PlayCircleIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { COLORS } from '../../constants/colors';
import { getUnits } from '../../services/module.service';
import { getModules } from '../../services/module.service';
import type { LessonListItem, LessonType } from '../../models/learning';

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe',
  writing: 'Viết', speaking: 'Nói', vocabulary: 'Từ vựng', exam: 'Kiểm tra',
};
const LESSON_TYPE_COLOR: Record<LessonType, string> = {
  grammar: '#4361EE', reading: '#7209B7', listening: '#06D6A0',
  writing: '#FFB703', speaking: '#EF233C', vocabulary: '#06B6D4', exam: '#F97316',
};

interface UnitRow {
  id: string;
  title: string;
  order: number;
  lessonCount: number;
  completedLessons: number;
  isLocked: boolean;
  lessons: LessonListItem[];
}

export default function UnitListPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleColor, setModuleColor] = useState<string>(COLORS.primary);
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) return;
    Promise.all([
      getUnits(moduleId),
      getModules(),
    ]).then(([unitData, allModules]) => {
      const mod = allModules.find(m => m.id === moduleId);
      if (mod) { setModuleTitle(mod.title); setModuleColor(mod.color || COLORS.primary); }

      const rows: UnitRow[] = unitData.map(({ unit, lessons }) => ({
        id: unit.id,
        title: unit.title,
        order: unit.order,
        lessonCount: unit.lessonCount,
        completedLessons: unit.completedLessons,
        isLocked: unit.isLocked,
        lessons,
      }));
      setUnits(rows);
      if (rows.length > 0) setOpenUnits([rows[0].id]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [moduleId]);

  const toggleUnit = (id: string) =>
    setOpenUnits(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/modules')}
            className="text-sm hover:opacity-70" style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Bài học
          </button>
          <span style={{ color: COLORS.textMuted }}>/</span>
          <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{moduleTitle}</span>
        </div>
        <h1 className="text-xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{moduleTitle}</h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="rounded-2xl h-16 animate-pulse" style={{ background: COLORS.border }} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {units.map(unit => {
              const isOpen = openUnits.includes(unit.id);
              const pct = unit.lessonCount > 0 ? Math.round((unit.completedLessons / unit.lessonCount) * 100) : 0;
              return (
                <div key={unit.id} className="rounded-2xl overflow-hidden"
                  style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: unit.isLocked ? 0.6 : 1 }}>
                  <button className="w-full flex items-center gap-3 px-5 py-4 text-left"
                    style={{ background: 'transparent', border: 'none', cursor: unit.isLocked ? 'not-allowed' : 'pointer' }}
                    onClick={() => !unit.isLocked && toggleUnit(unit.id)} disabled={unit.isLocked}>
                    {unit.isLocked
                      ? <LockClosedIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.textMuted }} />
                      : pct === 100
                        ? <CheckCircleSolid className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.success }} />
                        : <div className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ width: 20, height: 20, background: moduleColor, color: '#fff' }}>{unit.order}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{unit.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>
                        {unit.completedLessons}/{unit.lessonCount} bài · {pct}%
                      </p>
                    </div>
                    {!unit.isLocked && (
                      <div className="flex items-center gap-2">
                        <div className="rounded-full overflow-hidden" style={{ width: 60, height: 4, background: COLORS.border }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: moduleColor }} />
                        </div>
                        {isOpen ? <ChevronDownIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                          : <ChevronRightIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} />}
                      </div>
                    )}
                  </button>

                  {isOpen && !unit.isLocked && (
                    <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      {unit.lessons.map((lesson, idx) => (
                        <button key={lesson.id}
                          className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
                          style={{ background: 'transparent', border: 'none', cursor: lesson.isLocked ? 'not-allowed' : 'pointer',
                            borderBottom: idx < unit.lessons.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                            opacity: lesson.isLocked ? 0.5 : 1 }}
                          onClick={() => !lesson.isLocked && navigate(`/lessons/${lesson.id}`)}
                          disabled={lesson.isLocked}
                          onMouseEnter={e => { if (!lesson.isLocked) e.currentTarget.style.background = COLORS.bodyBg; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                          <div className="flex-shrink-0">
                            {lesson.isLocked ? <LockClosedIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                              : lesson.isCompleted ? <CheckCircleIcon className="w-4 h-4" style={{ color: COLORS.success }} />
                              : <PlayCircleIcon className="w-4 h-4" style={{ color: COLORS.primary }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: `${LESSON_TYPE_COLOR[lesson.type]}18`, color: LESSON_TYPE_COLOR[lesson.type] }}>
                                {LESSON_TYPE_LABEL[lesson.type]}
                              </span>
                              <span className="text-xs" style={{ color: COLORS.textMuted }}>{lesson.durationMinutes} phút</span>
                            </div>
                          </div>
                          {lesson.score !== null && (
                            <span className="text-sm font-bold flex-shrink-0"
                              style={{ color: (lesson.score ?? 0) >= 80 ? COLORS.success : COLORS.warning }}>
                              {lesson.score}đ
                            </span>
                          )}
                          {!lesson.isLocked && !lesson.isCompleted && (
                            <span className="text-xs font-semibold flex-shrink-0" style={{ color: COLORS.primary }}>Làm ngay →</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
