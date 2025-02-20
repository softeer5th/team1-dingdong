import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import httpClient from '../utils/httpClient';

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await httpClient.post('/api/auth/login', {
          email: 'admin@admin.com',
          password: 'abcd1234!@',
        });
        setIsAuthenticated(true);
      } catch (loginError) {
        console.error('자동 로그인 실패:', loginError);
        setIsAuthenticated(false);
      }
    };
    autoLogin();
  }, []);

  if (isAuthenticated === null) {
    return <div>인증 상태 확인 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/api-test" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute; 