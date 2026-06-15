import { useState, useEffect } from 'react';
import {
  PlusIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';
import { getClassrooms } from '../../services/classroom.service';
import type { ClassroomDto } from '../../services/classroom.service';
import CreateClassroomModal from './CreateClassroomModal';
import AssignLessonModal from './AssignLessonModal';

interface ActiveAssign {
  classroomId: string;
  classroomName: string;
}

export default function ClassroomPage() {
  const [classrooms, setClassrooms] = useState<ClassroomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeAssign, setActiveAssign] = useState<ActiveAssign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    getClassrooms()
      .then(setClassrooms)
      .catch(() => setClassrooms([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCode = (inviteCode: string, id: string) => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Lớp học của tôi</h1>
            <p className="text-sm mt-0.5" style={{ color: COLORS.textSecondary }}>Quản lý lớp học và giao bài tập</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
            <PlusIcon className="w-4 h-4" />
            Tạo lớp mới
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ background: COLORS.border }} />
            ))}
          </div>
        ) : classrooms.length === 0 ? (
          <div className="text-center py-20">
            <UserGroupIcon className="w-14 h-14 mx-auto mb-4 opacity-20" style={{ color: COLORS.textSecondary }} />
            <p className="text-base font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Chưa có lớp học</p>
            <p className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>
              Tạo lớp học đầu tiên để bắt đầu giao bài cho học sinh.
            </p>
            <button onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: COLORS.primary, border: 'none', cursor: 'pointer' }}>
              Tạo lớp mới
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {classrooms.map(cls => (
              <div key={cls.id} className="rounded-2xl p-5"
                style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}` }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{cls.name}</h2>
                    {cls.description && (
                      <p className="text-sm mt-0.5" style={{ color: COLORS.textSecondary }}>{cls.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl flex-shrink-0"
                    style={{ background: COLORS.bodyBg }}>
                    <UserGroupIcon className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                    <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{cls.studentCount}</span>
                  </div>
                </div>

                {/* Invite code */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
                  style={{ background: COLORS.bodyBg, border: `1px dashed ${COLORS.border}` }}>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>Mã lớp:</span>
                  <span className="text-sm font-bold tracking-widest" style={{ color: COLORS.primary }}>{cls.inviteCode}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveAssign({ classroomId: cls.id, classroomName: cls.name })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: `${COLORS.primary}12`, color: COLORS.primary, border: 'none', cursor: 'pointer' }}>
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                    Giao bài
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: `${COLORS.success}12`, color: COLORS.success, border: 'none', cursor: 'pointer' }}>
                    <UserGroupIcon className="w-4 h-4" />
                    Xem học sinh
                  </button>
                  <button
                    onClick={() => handleCopyCode(cls.inviteCode, cls.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 ml-auto"
                    style={{
                      background: copiedId === cls.id ? `${COLORS.success}12` : COLORS.bodyBg,
                      color: copiedId === cls.id ? COLORS.success : COLORS.textSecondary,
                      border: `1px solid ${COLORS.border}`, cursor: 'pointer',
                    }}>
                    <ClipboardIcon className="w-4 h-4" />
                    {copiedId === cls.id ? 'Đã sao chép!' : 'Sao chép mã'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateClassroomModal
          onClose={() => setShowCreate(false)}
          onCreated={cls => setClassrooms(prev => [cls, ...prev])}
        />
      )}

      {activeAssign && (
        <AssignLessonModal
          classroomId={activeAssign.classroomId}
          classroomName={activeAssign.classroomName}
          onClose={() => setActiveAssign(null)}
          onAssigned={() => setActiveAssign(null)}
        />
      )}
    </div>
  );
}
