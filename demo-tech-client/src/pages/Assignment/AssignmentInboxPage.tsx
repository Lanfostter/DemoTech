import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentListIcon, ExclamationTriangleIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { getAssignments } from '../../services/assignment.service';
import { joinClassroom } from '../../services/classroom.service';
import type { Assignment, AssignmentStatus, LessonType } from '../../models/learning';

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe',
  writing: 'Viết', speaking: 'Nói', vocabulary: 'Từ vựng', exam: 'Kiểm tra',
};
const LESSON_TYPE_EMOJI: Record<LessonType, string> = {
  grammar: '📖', reading: '📰', listening: '🎧', writing: '✏️', speaking: '🎙️', vocabulary: '⚡', exam: '📋',
};
const STATUS_LABEL: Record<AssignmentStatus, string> = {
  todo: 'Chưa làm', in_progress: 'Đang làm', submitted: 'Đã nộp', graded: 'Đã chấm',
};
const STATUS_COLOR: Record<AssignmentStatus, string> = {
  todo: COLORS.warning, in_progress: COLORS.primary, submitted: COLORS.success, graded: COLORS.success,
};

type Tab = 'all' | 'todo' | 'done';
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'todo', label: 'Chưa làm' },
  { key: 'done', label: 'Đã nộp' },
];

export default function AssignmentInboxPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleJoinClassroom = async () => {
    if (!inviteCode.trim()) return;
    setJoining(true);
    setJoinMsg(null);
    try {
      const cls = await joinClassroom(inviteCode.trim().toUpperCase());
      setJoinMsg({ type: 'success', text: `Đã tham gia lớp: ${cls.name}` });
      setInviteCode('');
    } catch {
      setJoinMsg({ type: 'error', text: 'Mã lớp không hợp lệ. Vui lòng thử lại.' });
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    getAssignments()
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments
    .filter(a => {
      if (tab === 'todo') return a.status === 'todo' || a.status === 'in_progress';
      if (tab === 'done') return a.status === 'submitted' || a.status === 'graded';
      return true;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const todoCount = assignments.filter(a => a.status === 'todo').length;

  const countTab = (t: Tab) => {
    if (t === 'all') return assignments.length;
    if (t === 'todo') return assignments.filter(a => a.status === 'todo' || a.status === 'in_progress').length;
    return assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bài tập</h1>
            {todoCount > 0 && (
              <span className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ width: 22, height: 22, background: COLORS.danger }}>{todoCount}</span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Bài tập được giáo viên giao</p>
        </div>

        <div className="flex rounded-xl p-1 mb-5 gap-1" style={{ background: COLORS.cardBg, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: tab === t.key ? COLORS.primary : 'transparent', color: tab === t.key ? '#fff' : COLORS.textSecondary, border: 'none', cursor: 'pointer' }}>
              {t.label} ({countTab(t.key)})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: COLORS.border }} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => {
              const isDone = a.status === 'submitted' || a.status === 'graded';
              const isUrgent = a.daysLeft >= 0 && a.daysLeft <= 2 && !isDone;
              return (
                <div key={a.id}
                  className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
                  style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: isUrgent ? `4px solid ${COLORS.danger}` : '4px solid transparent' }}
                  onClick={() => navigate(`/lessons/${a.lessonId}`)}>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-lg"
                      style={{ width: 44, height: 44, background: COLORS.bodyBg }}>
                      {LESSON_TYPE_EMOJI[a.lessonType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{a.lessonTitle}</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                          style={{ background: `${STATUS_COLOR[a.status]}18`, color: STATUS_COLOR[a.status] }}>
                          {a.status === 'graded' && a.score !== undefined ? `✓ ${a.score} điểm` : STATUS_LABEL[a.status]}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
                        {a.teacherName} · {a.moduleTitle} · {LESSON_TYPE_LABEL[a.lessonType]}
                      </p>
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          {isUrgent && <ExclamationTriangleIcon className="w-3.5 h-3.5" style={{ color: COLORS.danger }} />}
                          {isDone && <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: COLORS.success }} />}
                          {!isDone && !isUrgent && <ClipboardDocumentListIcon className="w-3.5 h-3.5" style={{ color: COLORS.textMuted }} />}
                          <span className="text-xs" style={{ color: isUrgent ? COLORS.danger : isDone ? COLORS.success : COLORS.textSecondary }}>
                            {isDone ? 'Đã nộp'
                              : a.daysLeft < 0 ? `Quá hạn ${Math.abs(a.daysLeft)} ngày`
                              : a.daysLeft === 0 ? 'Hạn hôm nay!'
                              : `Còn ${a.daysLeft} ngày`}
                          </span>
                        </div>
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: isDone ? COLORS.bodyBg : `${COLORS.primary}18`, color: isDone ? COLORS.textSecondary : COLORS.primary, border: 'none', cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); navigate(`/lessons/${a.lessonId}`); }}>
                          {isDone ? 'Xem kết quả' : a.status === 'in_progress' ? 'Tiếp tục' : 'Làm bài ngay'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16" style={{ color: COLORS.textSecondary }}>
                <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không có bài tập nào</p>
              </div>
            )}
          </div>
        )}
        {/* Join classroom section */}
        <div className="mt-8 rounded-2xl p-5"
          style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <UserGroupIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
            <h2 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Tham gia lớp học</h2>
          </div>
          <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
            Nhập mã lớp do giáo viên cung cấp để tham gia và nhận bài tập.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoinClassroom()}
              placeholder="Mã lớp (VD: ABC123)"
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textPrimary,
                background: COLORS.bodyBg,
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            />
            <button
              onClick={handleJoinClassroom}
              disabled={joining || !inviteCode.trim()}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{
                background: joining || !inviteCode.trim() ? COLORS.border : COLORS.primary,
                border: 'none',
                cursor: joining || !inviteCode.trim() ? 'not-allowed' : 'pointer',
              }}>
              {joining ? '...' : 'Tham gia'}
            </button>
          </div>
          {joinMsg && (
            <p className="text-xs mt-2" style={{ color: joinMsg.type === 'success' ? COLORS.success : COLORS.danger }}>
              {joinMsg.type === 'success' ? '✅' : '❌'} {joinMsg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
