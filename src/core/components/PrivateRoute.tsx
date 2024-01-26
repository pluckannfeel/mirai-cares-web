import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthProvider';

type PrivateRouteProps = {
  roles?: string[];
  children: JSX.Element;
};

const PrivateRoute = ({ roles, children }: PrivateRouteProps) => {
  const { hasRole, userInfo } = useAuth();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PrivateRoute;
