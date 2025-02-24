import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f5f5; // 메인 콘텐츠 배경색
  box-sizing: border-box; // 패딩과 마진을 포함한 전체 크기 계산
  display: flex;
  flex-direction: column;
`;

function Layout() {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout; 