import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FireIcon, BoltIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import StreakCalendar from '../../component/StreakCalendar';
import { COLORS, MODULE_COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getStreak } from '../../services/streak.service';
import { getModules } from '../../services/module.service';
import { getDailySession } from '../../services/dashboard.service';
import type { StreakInfo, DailySession, LearningModule } from '../../models/learning';

const TASK_ICONS: Record<string, React.ReactNode> = {
  vocabulary:       <BoltIcon className="w-4 h-4" />,
  grammar:          <BookOpenIcon className="w-4 h-4" />,
  flashcard_review: <FireIcon className="w-4 h-4" />,
  reading:          <BookOpenIcon className="w-4 h-4" />,
};

const TASK_COLORS: Record<string, string> = {
  vocabulary: '#06D6A0', grammar: '#4361EE', flashcard_review: '#FFB703', reading: '#7209B7',
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Chào buổi sáng';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function todayLabel(): string {
  return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [daily, setDaily] = useState<DailySession | null>(null);
  const [loadingStreak, setLoadingStreak] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);

  const displayName = user?.name ?? user?.sub ?? 'bạn';
  const completedTasks = daily?.tasks.filter(t => t.isCompleted).length ?? 0;
  const totalTasks = daily?.tasks.length ?? 3;
  const sessionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  useEffect(() => {
    getStreak()
      .then(setStreak)
      .catch(() => setStreak(null))
      .finally(() => setLoadingStreak(false));

    getModules()
      .then(setModules)
      .catch(() => setModules([]))
      .finally(() => setLoadingModules(false));

    getDailySession()
      .then(setDaily)
      .catch(() => setDaily(null));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
            {greeting()}, {displayName}! 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: COLORS.textSecondary }}>{todayLabel()}</p>
        </div>

        {/* Row 1: Streak + Daily Session */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Streak Card */}
          <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: COLORS.cardBg, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {loadingStreak ? (
              <div className="h-32 flex items-center justify-center" style={{ color: COLORS.textMuted }}>
                Đang tải streak...
              </div>
            ) : streak ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-7 h-7" style={{ color: '#FF6B35' }} />
                    <span className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>{streak.currentStreak}</span>
                    <span className="ml-1 text-sm font-medium" style={{ color: COLORS.textSecondary }}>ngày liên tiếp</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    {streak.milestones.map(m => (
                      <div
                        key={m.days}
                        title={`${m.days} ngày${m.achieved ? ' — Đã đạt!' : ''}`}
                        className="flex items-center justify-center rounded-full text-xs font-bold"
                        style={{ width: 36, height: 36, background: m.achieved ? '#FF6B35' : COLORS.border, color: m.achieved ? '#fff' : COLORS.textMuted }}
                      >{m.days}</div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>Kỷ lục</p>
                    <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{streak.longestStreak} ngày</p>
                  </div>
                </div>
                <StreakCalendar days={streak.calendar} />
              </>
            ) : (
              <div className="h-32 flex items-center justify-center" style={{ color: COLORS.textMuted }}>
                Chưa có dữ liệu streak. Bắt đầu học để tạo streak!
              </div>
            )}
          </div>

          {/* Daily Session Panel */}
          <div className="rounded-2xl p-5 flex flex-col" style={{ background: COLORS.cardBg, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Phiên học hôm nay</h2>
              <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.textSecondary }}>
                <ClockIcon className="w-3.5 h-3.5" /> 15 phút
              </span>
            </div>

            <div className="flex items-center gap-3 my-3">
              <div className="relative" style={{ width: 52, height: 52 }}>
                <svg width={52} height={52} viewBox="0 0 52 52">
                  <circle cx={26} cy={26} r={22} fill="none" stroke={COLORS.border} strokeWidth={4} />
                  <circle cx={26} cy={26} r={22} fill="none" stroke={COLORS.primary} strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - sessionPercent / 100)}`}
                    strokeLinecap="round" transform="rotate(-90 26 26)" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: COLORS.primary }}>
                  {sessionPercent}%
                </span>
              </div>
              <div>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>{completedTasks}/{totalTasks} nhiệm vụ</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{daily?.completedMinutes ?? 0}/{daily?.estimatedMinutes ?? 15} phút</p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {(daily?.tasks ?? []).map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer"
                  style={{ background: task.isCompleted ? '#F0FDF4' : COLORS.bodyBg, opacity: task.isCompleted ? 0.7 : 1 }}
                  onClick={() => !task.isCompleted && navigate('/modules')}
                >
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: 30, height: 30, background: task.isCompleted ? '#DCF9ED' : `${TASK_COLORS[task.type]}18`, color: task.isCompleted ? COLORS.success : TASK_COLORS[task.type] }}>
                    {task.isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : TASK_ICONS[task.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate"
                      style={{ color: task.isCompleted ? COLORS.textSecondary : COLORS.textPrimary, textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                      {task.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{task.durationMinutes} phút</p>
                  </div>
                  {!task.isCompleted && <ArrowRightIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: COLORS.textMuted }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Module Progress */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: COLORS.textPrimary }}>Module đang học</h2>
          <button onClick={() => navigate('/modules')}
            className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
            Xem tất cả <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {loadingModules ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-40 animate-pulse" style={{ background: COLORS.border }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.slice(0, 3).map(mod => {
              const color = mod.color || MODULE_COLORS[mod.type] || COLORS.primary;
              return (
                <div key={mod.id}
                  className="rounded-2xl p-5 cursor-pointer transition-transform hover:scale-[1.01]"
                  style={{ background: COLORS.cardBg, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  onClick={() => navigate(`/modules/${mod.id}`)}>
                  <div className="flex items-center justify-center rounded-xl mb-3" style={{ width: 44, height: 44, background: `${color}18` }}>
                    <BookOpenIcon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: COLORS.textPrimary }}>{mod.title}</h3>
                  <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
                    {mod.unitCount} chủ đề · {mod.lessonCount} bài học
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: COLORS.border }}>
                      <div className="h-full rounded-full" style={{ width: `${mod.completionPercent}%`, background: color }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color }}>{mod.completionPercent}%</span>
                  </div>
                  <button className="mt-3 w-full rounded-xl py-2 text-xs font-semibold"
                    style={{ background: `${color}18`, color, border: 'none', cursor: 'pointer' }}>
                    {mod.completionPercent > 0 ? 'Tiếp tục học →' : 'Bắt đầu học →'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
