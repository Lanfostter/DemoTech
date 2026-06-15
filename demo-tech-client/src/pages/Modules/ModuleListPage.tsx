import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, TrophyIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { COLORS, MODULE_COLORS } from '../../constants/colors';
import { getModules } from '../../services/module.service';
import type { LearningModule } from '../../models/learning';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  exam_9to10:      <AcademicCapIcon className="w-6 h-6" />,
  exam_university: <AcademicCapIcon className="w-6 h-6" />,
  communication:   <ChatBubbleLeftRightIcon className="w-6 h-6" />,
  toeic:           <TrophyIcon className="w-6 h-6" />,
  grade6:          <BookOpenIcon className="w-6 h-6" />,
  grade7:          <BookOpenIcon className="w-6 h-6" />,
  grade8:          <BookOpenIcon className="w-6 h-6" />,
  grade10:         <BookOpenIcon className="w-6 h-6" />,
  grade11:         <BookOpenIcon className="w-6 h-6" />,
};

export default function ModuleListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModules()
      .then(setModules)
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = modules.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const enrolled = filtered.filter(m => m.completionPercent > 0);
  const available = filtered.filter(m => m.completionPercent === 0);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bài học</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Chọn module phù hợp với mục tiêu của bạn</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 mb-6"
          style={{ background: COLORS.cardBg, height: 44, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <MagnifyingGlassIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.textMuted }} />
          <input type="text" placeholder="Tìm kiếm module..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm" style={{ color: COLORS.textPrimary }} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: COLORS.border }} />
            ))}
          </div>
        ) : (
          <>
            {enrolled.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.textSecondary }}>Đang học ({enrolled.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {enrolled.map(mod => <ModuleCard key={mod.id} module={mod} onSelect={() => navigate(`/modules/${mod.id}`)} />)}
                </div>
              </>
            )}
            {available.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.textSecondary }}>Chưa bắt đầu ({available.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {available.map(mod => <ModuleCard key={mod.id} module={mod} onSelect={() => navigate(`/modules/${mod.id}`)} />)}
                </div>
              </>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-16" style={{ color: COLORS.textSecondary }}>
                <BookOpenIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không tìm thấy module nào</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ModuleCard({ module: mod, onSelect }: { module: LearningModule; onSelect: () => void }) {
  const color = mod.color || MODULE_COLORS[mod.type] || COLORS.primary;
  const Icon = MODULE_ICONS[mod.type] ?? <BookOpenIcon className="w-6 h-6" />;
  return (
    <div className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md"
      style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      onClick={onSelect}>
      <div className="flex items-center justify-center rounded-xl mb-4" style={{ width: 48, height: 48, background: `${color}18` }}>
        <span style={{ color }}>{Icon}</span>
      </div>
      <h3 className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>{mod.title}</h3>
      <p className="text-xs leading-relaxed mb-3" style={{ color: COLORS.textSecondary }}>{mod.description}</p>
      <div className="flex gap-3 mb-3">
        <span className="text-xs" style={{ color: COLORS.textMuted }}>📚 {mod.unitCount} chủ đề</span>
        <span className="text-xs" style={{ color: COLORS.textMuted }}>📝 {mod.lessonCount} bài</span>
      </div>
      {mod.completionPercent > 0 && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Tiến độ</span>
            <span className="text-xs font-semibold" style={{ color }}>{mod.completionPercent}%</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 5, background: COLORS.border }}>
            <div className="h-full rounded-full" style={{ width: `${mod.completionPercent}%`, background: color }} />
          </div>
        </div>
      )}
      <button className="w-full rounded-xl py-2 text-xs font-semibold"
        style={{ background: `${color}18`, color, border: 'none', cursor: 'pointer' }}>
        {mod.completionPercent > 0 ? 'Tiếp tục học →' : 'Bắt đầu →'}
      </button>
    </div>
  );
}
