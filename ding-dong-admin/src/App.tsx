import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import BusManagement from './pages/BusManagement';
import MapWithInputs from './pages/MapWithInputs';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 인증 상태 확인 로직
        setIsLoading(false);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="main" element={
              <PrivateRoute>
                <MapWithInputs />
              </PrivateRoute>
            } />
            <Route path="bus-management" element={
              <PrivateRoute>
                <BusManagement />
              </PrivateRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App; 