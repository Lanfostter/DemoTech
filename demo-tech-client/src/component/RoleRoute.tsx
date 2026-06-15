import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RoleRoute({ allowedRoles, children, redirectTo = '/dashboard' }: RoleRouteProps) {
  const { user } = useAuth();
  const userRoles = user?.roles ?? [];
  const hasAccess = allowedRoles.some(r => userRoles.includes(r));
  if (!hasAccess) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
