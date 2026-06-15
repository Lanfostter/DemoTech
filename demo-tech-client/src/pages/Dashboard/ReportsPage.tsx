import { useState, useEffect } from 'react';
import { COLORS } from '../../constants/colors';
import { getStudentReport } from '../../services/report.service';
import type { StudentReport, WeeklyPoint } from '../../services/report.service';
import {
  AcademicCapIcon,
  BookOpenIcon,
  FireIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentReport()
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl h-32 animate-pulse" style={{ background: COLORS.border }} />
          ))}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <p style={{ color: COLORS.textSecondary }}>Không thể tải báo cáo.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Bài tập đã làm', value: report.totalExercises, icon: AcademicCapIcon, color: COLORS.primary },
    { label: 'Điểm trung bình', value: `${report.avgScore}%`, icon: ChartBarIcon, color: COLORS.success },
    { label: 'Bài học hoàn thành', value: report.totalLessonsCompleted, icon: BookOpenIcon, color: COLORS.warning },
    { label: 'Từ vựng đã lưu', value: report.totalVocab, icon: FireIcon, color: COLORS.secondary },
  ];

  const maxWeekCount = Math.max(...report.weeklySeries.map(w => w.avgScore), 1);

  const dist = report.scoreDistribution;
  const totalDist = (dist.perfect + dist.good + dist.fair + dist.poor) || 1;
  const distBars = [
    { label: 'Xuất sắc (100%)', value: dist.perfect, color: COLORS.success },
    { label: 'Tốt (70-99%)', value: dist.good, color: COLORS.primary },
    { label: 'Trung bình (40-69%)', value: dist.fair, color: COLORS.warning },
    { label: 'Cần cố gắng (<40%)', value: dist.poor, color: COLORS.danger },
  ];

  // Activity heatmap: last 30 days
  const maxActivity = Math.max(...report.dailySeries.map(d => d.count), 1);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Báo cáo học tập</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Thống kê tiến độ của bạn</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly score chart */}
        <div className="rounded-2xl p-5" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Điểm trung bình theo tuần</h2>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {report.weeklySeries.map((w: WeeklyPoint, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium" style={{ color: COLORS.textPrimary }}>
                  {w.avgScore > 0 ? `${w.avgScore}%` : ''}
                </span>
                <div className="w-full rounded-t-lg transition-all" style={{
                  height: `${(w.avgScore / maxWeekCount) * 96}px`,
                  minHeight: w.avgScore > 0 ? 8 : 2,
                  background: w.avgScore > 0 ? COLORS.primary : COLORS.border,
                }} />
                <span className="text-xs" style={{ color: COLORS.textMuted }}>{w.week}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: COLORS.textMuted }}>
            {report.weeklySeries.filter(w => w.count > 0).length} tuần có hoạt động trong 7 tuần qua
          </p>
        </div>

        {/* Activity heatmap (30 days) */}
        <div className="rounded-2xl p-5" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Hoạt động 30 ngày qua</h2>
          <div className="flex flex-wrap gap-1.5">
            {report.dailySeries.map((d, i) => {
              const intensity = d.count === 0 ? 0 : Math.ceil((d.count / maxActivity) * 4);
              const bg = intensity === 0 ? COLORS.border
                : intensity === 1 ? '#C7D2FE'
                : intensity === 2 ? '#818CF8'
                : intensity === 3 ? COLORS.primary
                : '#3730A3';
              return (
                <div key={i} title={`${d.date}: ${d.count} bài`}
                  className="rounded-sm" style={{ width: 20, height: 20, background: bg }} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Ít</span>
            {['#E5E7EB', '#C7D2FE', '#818CF8', COLORS.primary, '#3730A3'].map((c, i) => (
              <div key={i} className="rounded-sm" style={{ width: 14, height: 14, background: c }} />
            ))}
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Nhiều</span>
          </div>
        </div>

        {/* Score distribution */}
        <div className="rounded-2xl p-5" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Phân phối điểm số</h2>
          <div className="space-y-3">
            {distBars.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: COLORS.textSecondary }}>{b.label}</span>
                  <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{b.value} bài</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 8, background: COLORS.border }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${(b.value / totalDist) * 100}%`,
                    background: b.color,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
