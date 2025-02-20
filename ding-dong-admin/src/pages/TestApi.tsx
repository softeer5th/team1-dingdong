import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import httpClient from '../utils/httpClient';
import { format } from 'date-fns';
import { useLogin } from '../hooks/useLogin';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #ffa500;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResultText = styled.pre`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TimeSelect = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
`;

const DateInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

interface SavedUser {
  email: string;
  password: string;
}

function TestApi() {
  const { isLoggedIn, loading, error } = useLogin();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [direction, setDirection] = useState('TO_SCHOOL');
  const [result, setResult] = useState('');
  
  // 날짜/시간 상태 관리
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // 시간 옵션 생성 (9시 ~ 18시)
  const hours = Array.from({ length: 10 }, (_, i) => String(i + 9).padStart(2, '0'));
  
  // 분 옵션 (0분, 30분)
  const minutes = ['00', '30'];

  // 날짜/시간 문자열 생성
  const getDateTime = () => {
    const date = new Date(`${selectedDate}T${selectedHour}:${selectedMinute}:00`);
    const kstOffset = 9 * 60; // 서울은 UTC+9
    const kstDate = new Date(date.getTime() + (kstOffset * 60000));
    return kstDate.toISOString();
  };

  const handleAddUser = () => {
    if (!newUserEmail) return;
    
    setSavedUsers(prev => [...prev, {
      email: newUserEmail,
      password: 'abcd1234!@'
    }]);
    setNewUserEmail('');
  };

  const handleRemoveUser = (emailToRemove: string) => {
    setSavedUsers(prev => prev.filter(user => user.email !== emailToRemove));
  };

  const processReservation = async (user: SavedUser) => {
    try {
      // 1. 로그인
      const loginResponse = await httpClient.post('/api/auth/login', {
        email: user.email,
        password: user.password,
      });

      // 2. 토큰 발급
      const tokenResponse = await httpClient.post('/api/users/reservations/token/general', {
        direction,
        dates: [{ date: getDateTime() }],
      });
      const token = tokenResponse.data.token;

      // 3. 토큰 사용
      const reservationResponse = await httpClient.post('/api/users/reservations/general', {
        token,
        direction,
        dates: [{ date: getDateTime() }],
      });

      return {
        email: user.email,
        success: true,
        result: reservationResponse.data
      };
    } catch (error) {
      return {
        email: user.email,
        success: false,
        error
      };
    }
  };

  const handleBatchReservation = async () => {
    const results = [];
    for (const user of savedUsers) {
      const result = await processReservation(user);
      results.push(result);
    }
    setResult(JSON.stringify(results, null, 2));
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = newUserEmail.trim();
      
      // 숫자만 입력된 경우 처리
      const number = parseInt(inputValue, 10);
      const email = number === 0 ? 'test@test.com' : `test${number}@test.com`;
      if (!isNaN(number)) {
        setSavedUsers(prev => {
          if (prev.some(user => user.email === email)) {
            alert('이미 존재하는 이메일입니다.');
            return prev;
          }
          return [...prev, {
            email: email,
            password: 'abcd1234!@'
          }];
        });
        setNewUserEmail('');
      } else {
        alert('숫자만 입력해주세요.');
      }
    }
  };

  const formatDisplayEmail = (email: string) => {
    if (email === 'test@test.com') return '0';
    const match = email.match(/test(\d+)@test\.com/);
    return match ? match[1] : email;
  };

  useEffect(() => {
    console.log('현재 저장된 사용자들:', savedUsers);
  }, [savedUsers]);

  return (
    <Container>
      <Section>
        <h2>사용자 관리</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            type="text"
            placeholder="숫자 입력 (0: test@test.com)"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            onKeyDown={handleEmailInputKeyDown}
          />
          <Button onClick={handleAddUser}>추가</Button>
        </div>
        <div style={{ marginTop: '10px' }}>
          {savedUsers.map(user => (
            <div key={user.email} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '5px',
              borderBottom: '1px solid #eee'
            }}>
              <span>{user.email}</span>
              <Button onClick={() => handleRemoveUser(user.email)}>삭제</Button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2>예약 설정</h2>
        <Select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="TO_SCHOOL">TO_SCHOOL</option>
          <option value="TO_HOME">TO_HOME</option>
        </Select>
        <DateTimeContainer>
          <DateInput
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={`${new Date().getFullYear()}-01-01`}
            max={`${new Date().getFullYear() + 1}-12-31`}
          />
          <TimeSelect 
            value={selectedHour} 
            onChange={(e) => setSelectedHour(e.target.value)}
          >
            {hours.map(hour => (
              <option key={hour} value={hour}>
                {hour}시
              </option>
            ))}
          </TimeSelect>
          <TimeSelect 
            value={selectedMinute} 
            onChange={(e) => setSelectedMinute(e.target.value)}
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>
                {minute}분
              </option>
            ))}
          </TimeSelect>
        </DateTimeContainer>
        <Button 
          onClick={handleBatchReservation}
          disabled={savedUsers.length === 0}
        >
          일괄 예약 처리
        </Button>
      </Section>

      <Section>
        <h2>결과</h2>
        <ResultText>{result}</ResultText>
      </Section>
    </Container>
  );
}

export default TestApi; 