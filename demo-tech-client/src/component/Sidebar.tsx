import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const STUDENT_NAV = [
  { name: 'Tổng quan',  path: '/dashboard',    icon: HomeIcon },
  { name: 'Bài học',    path: '/modules',       icon: BookOpenIcon },
  { name: 'Từ vựng',    path: '/vocabulary',    icon: SparklesIcon },
  { name: 'Bài tập',    path: '/assignments',   icon: ClipboardDocumentListIcon },
  { name: 'Báo cáo',    path: '/reports',       icon: ChartBarIcon },
];

const ADMIN_NAV = [
  { name: 'Dashboard',       path: '/dashboard',          icon: HomeIcon },
  { name: 'Người dùng',      path: '/users',              icon: UserGroupIcon },
  { name: 'Chủ đề & Bài học', path: '/admin/content',    icon: BookOpenIcon },
  { name: 'Bài tập',         path: '/admin/exercises',    icon: PencilSquareIcon },
  { name: 'Lớp học',         path: '/classrooms',         icon: UserGroupIcon },
  { name: 'Báo cáo',         path: '/reports',            icon: ChartBarIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const navItems = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="flex flex-col h-screen flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 72 : 240,
        background: COLORS.sidebarBg,
      }}
    >
      {/* Logo */}
      <div className="flex items-center px-4 h-16 flex-shrink-0" style={{ borderBottom: `1px solid ${COLORS.borderDark}` }}>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: COLORS.primary }}
        >
          <span className="text-white font-bold text-sm">E</span>
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-white text-base tracking-wide">EnglishPro</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 28, height: 28, color: COLORS.textMuted }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.sidebarHover)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {collapsed
            ? <ChevronRightIcon className="w-4 h-4" />
            : <ChevronLeftIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className="flex items-center rounded-xl transition-colors relative"
              style={{
                height: 44,
                padding: collapsed ? '0 14px' : '0 12px',
                gap: 12,
                color: active ? COLORS.primary : COLORS.textMuted,
                background: active ? COLORS.primaryLight : 'transparent',
                borderLeft: active ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = COLORS.sidebarHover;
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1" style={{ borderTop: `1px solid ${COLORS.borderDark}`, paddingTop: 12 }}>
        <Link
          to="/settings"
          title={collapsed ? 'Cài đặt' : undefined}
          className="flex items-center rounded-xl transition-colors"
          style={{
            height: 44,
            padding: collapsed ? '0 14px' : '0 12px',
            gap: 12,
            color: COLORS.textMuted,
            background: isActive('/settings') ? COLORS.primaryLight : 'transparent',
            textDecoration: 'none',
            fontSize: 14,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.sidebarHover)}
          onMouseLeave={e => (e.currentTarget.style.background = isActive('/settings') ? COLORS.primaryLight : 'transparent')}
        >
          <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Cài đặt</span>}
        </Link>

        {/* User + Logout */}
        <div
          className="flex items-center rounded-xl"
          style={{ height: 52, padding: collapsed ? '0 10px' : '0 8px', gap: 10 }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-semibold text-sm"
            style={{ width: 36, height: 36, background: COLORS.primary, fontSize: 13 }}
          >
            {user?.name?.[0]?.toUpperCase() ?? user?.sub?.[0]?.toUpperCase() ?? 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate" style={{ lineHeight: '1.2' }}>
                  {user?.name ?? user?.sub ?? 'Học sinh'}
                </p>
                <p className="text-xs truncate" style={{ color: COLORS.textMuted }}>Học sinh</p>
              </div>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="flex-shrink-0 rounded-lg p-1.5 transition-colors"
                style={{ color: COLORS.textMuted }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = COLORS.danger;
                  e.currentTarget.style.background = 'rgba(239,35,60,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = COLORS.textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
