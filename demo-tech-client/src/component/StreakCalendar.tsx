
import type { StreakDay } from '../models/learning';
import { STREAK_INTENSITY } from '../constants/colors';

interface StreakCalendarProps {
  days: StreakDay[];
  className?: string;
}

function getIntensityLevel(minutes: number): number {
  if (minutes === 0) return 0;
  if (minutes < 10) return 1;
  if (minutes < 20) return 2;
  if (minutes < 30) return 3;
  if (minutes < 45) return 4;
  return 5;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const WEEK_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

export default function StreakCalendar({ days, className = '' }: StreakCalendarProps) {
  const today = new Date().toISOString().split('T')[0];

  // Build a 15-week grid (105 days), ending today
  const TOTAL_DAYS = 105;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const grid: { date: string; minutes: number }[] = [];
  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = days.find(day => day.date === dateStr);
    grid.push({ date: dateStr, minutes: found?.minutesStudied ?? 0 });
  }

  // Pad so grid starts on Sunday
  const firstDayOfWeek = new Date(grid[0].date).getDay(); // 0=Sun
  const padded: ({ date: string; minutes: number } | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...grid,
  ];

  // Split into weeks (columns)
  const weeks: ({ date: string; minutes: number } | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // Month labels: find first cell of each month in the grid
  const monthPositions: { col: number; month: number }[] = [];
  weeks.forEach((week, col) => {
    week.forEach(cell => {
      if (cell && new Date(cell.date).getDate() === 1) {
        monthPositions.push({ col, month: new Date(cell.date).getMonth() });
      }
    });
  });

  return (
    <div className={`select-none ${className}`}>
      {/* Month labels */}
      <div className="flex mb-1" style={{ paddingLeft: 24 }}>
        {weeks.map((_, col) => {
          const mp = monthPositions.find(m => m.col === col);
          return (
            <div key={col} style={{ width: 13, marginRight: 2, fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>
              {mp ? MONTH_LABELS[mp.month] : ''}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Day-of-week labels */}
        <div className="flex flex-col mr-2" style={{ gap: 2 }}>
          {WEEK_LABELS.map((label, i) => (
            <div
              key={label}
              style={{ height: 11, fontSize: 9, color: '#94A3B8', lineHeight: '11px', visibility: i % 2 === 0 ? 'visible' : 'hidden' }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex" style={{ gap: 2 }}>
          {weeks.map((week, col) => (
            <div key={col} className="flex flex-col" style={{ gap: 2 }}>
              {week.map((cell, row) => {
                if (!cell) {
                  return <div key={row} style={{ width: 11, height: 11 }} />;
                }
                const level = getIntensityLevel(cell.minutes);
                const isToday = cell.date === today;
                return (
                  <div
                    key={row}
                    title={`${formatDate(cell.date)} · ${cell.minutes > 0 ? cell.minutes + ' phút' : 'Chưa học'}`}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 2,
                      background: STREAK_INTENSITY[level],
                      outline: isToday ? '2px solid #fff' : undefined,
                      outlineOffset: isToday ? 1 : undefined,
                      cursor: 'default',
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center mt-2" style={{ gap: 6 }}>
        <span style={{ fontSize: 10, color: '#94A3B8' }}>Ít</span>
        {STREAK_INTENSITY.map((color, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: color }} />
        ))}
        <span style={{ fontSize: 10, color: '#94A3B8' }}>Nhiều</span>
      </div>
    </div>
  );
}
