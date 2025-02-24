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
    const checkAuth = async () => {
      try {
        // 세션 체크 API 호출
        await httpClient.get('/api/auth/status');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('인증 확인 실패:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>인증 상태 확인 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute; 