import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SidebarContainer = styled.nav`
  width: 250px;
  background-color: #ff8c00;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 60px;
    padding: 20px 10px;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  
  &.active {
    background-color: #ffa500;
  }
  
  &:hover {
    background-color: #ff7f50;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <NavItem to="/map">경로 생성</NavItem>
      <NavItem to="/bus-management">버스 관리</NavItem>
      <NavItem to="/users">사용자 관리</NavItem>
      <NavItem to="/routes">노선 관리</NavItem>
      <NavItem to="/api-test">API 테스트</NavItem>
      <NavItem to="/bus-schedule-test">버스 시간 테스트</NavItem>
    </SidebarContainer>
  );
};

export default Sidebar; 