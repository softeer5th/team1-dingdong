import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import BusManagement from './pages/BusManagement';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PrivateRoute from './components/PrivateRoute';
import httpClient from './utils/httpClient';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await httpClient.post('/api/auth/login', {
          email: 'admin@admin.com',
          password: 'Abcd1234!@',
        });
        console.log('관리자 로그인 성공');
      } catch (error) {
        console.error('관리자 로그인 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, []);

  if (isLoading) {
    return <div>로그인 중...</div>;
  }

  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="bus-management" element={
              <PrivateRoute>
                <BusManagement />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App; 