import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Users from './pages/Users'
import BusSchedule from './pages/BusSchedule';
import MapWithInputs from './pages/MapWithInputs';
import BusManagement from './pages/BusManagement';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ApiTest from './pages/ApiTest';
import PrivateRoute from './components/PrivateRoute';
import httpClient from './utils/httpClient';
import BusScheduleTest from './pages/BusScheduleTest';

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
            <Route path="api-test" element={<ApiTest />} />
            <Route index element={
              <PrivateRoute>
                <Navigate to="/map" replace />
              </PrivateRoute>
            } />
            <Route path="users" element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
            <Route path="routes" element={
              <PrivateRoute>
                <BusSchedule />
              </PrivateRoute>
            } />
            <Route path="map" element={
              <PrivateRoute>
                <MapWithInputs />
              </PrivateRoute>
            } />
            <Route path="bus-management" element={
              <PrivateRoute>
                <BusManagement />
              </PrivateRoute>
            } />
            <Route path="bus-schedule-test" element={<BusScheduleTest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App; 