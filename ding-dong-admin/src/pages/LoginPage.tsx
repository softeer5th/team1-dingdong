import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import httpClient from '../utils/httpClient';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #ffa500;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await httpClient.get('/api/auth/status');
        navigate('/main'); // 이미 로그인된 경우 메인 페이지로 이동
      } catch (err) {
        console.error('로그인 상태 확인 중 오류:', err);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await httpClient.post('/api/auth/login', { email, password });
      navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          required
        />
        <Button type="submit">로그인</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </LoginContainer>
  );
}

export default LoginPage; 