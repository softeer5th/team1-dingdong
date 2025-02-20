import React, { useState } from 'react';
import styled from 'styled-components';
import httpClient from '../utils/httpClient';
import { format, parseISO } from 'date-fns';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

const TimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 20px;
`;

const TimeButton = styled.button<{ isSelected: boolean }>`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${props => props.isSelected ? '#ff8c00' : 'white'};
  color: ${props => props.isSelected ? 'white' : 'black'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#ffa500' : '#f5f5f5'};
  }
`;

const ErrorPopup = styled.div`
  background-color: #ffcccc;
  border: 1px solid #ff0000;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
`;

interface Schedule {
  busScheduleId: number;
  busStopId: number;
  busStop: {
    name: string;
    time: string;
    longitude: number;
    latitude: number;
  };
  busInfo: {
    name: string;
    reservedSeat: number;
    totalSeat: number;
  };
}

function BusScheduleTest() {
  const [email, setEmail] = useState('');
  const [direction, setDirection] = useState('TO_SCHOOL');
  const [availableTimes, setAvailableTimes] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await httpClient.post('/api/auth/login', {
        email,
        password: 'abcd1234!@',
      });
      fetchAvailableTimes();
    } catch (error) {
      setError('로그인에 실패했습니다.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const fetchAvailableTimes = async () => {
    try {
      const response = await httpClient.get(`/api/bus/schedule/time?direction=${direction}`);
      const times = response.data.schedules.map((time: string) => parseISO(time));
      setAvailableTimes(times);
      setSelectedTime(null);
      setSchedules([]);
    } catch (error) {
      console.error('시간 조회 실패:', error);
    }
  };

  const handleTimeSelect = async (time: Date) => {
    setSelectedTime(time);
    try {
      const response = await httpClient.get('/api/bus/available', {
        params: {
          direction,
          time: new Date(time.getTime() + (9 * 60 * 60 * 1000)).toISOString()
        }
      });
      setSchedules(response.data.result);
    } catch (error) {
      console.error('스케줄 조회 실패:', error);
    }
  };

  const formatDateTime = (date: Date) => {
    return format(date, 'yyyy-MM-dd HH:mm');
  };

  return (
    <Container>
      <Section>
        <h2>버스 스케줄 테스트</h2>
        <InputContainer>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleLogin}>로그인</Button>
        </InputContainer>
        
        {error && (
          <ErrorPopup>
            {error}
          </ErrorPopup>
        )}

        <InputContainer>
          <Select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="TO_SCHOOL">등교</option>
            <option value="TO_HOME">하교</option>
          </Select>
          <Button onClick={fetchAvailableTimes}>시간 조회</Button>
        </InputContainer>

        {availableTimes.length > 0 && (
          <Section>
            <h3>탑승 가능 시간</h3>
            <TimeList>
              {availableTimes.map((time) => (
                <TimeButton
                  key={time.toISOString()}
                  isSelected={selectedTime?.getTime() === time.getTime()}
                  onClick={() => handleTimeSelect(time)}
                >
                  {formatDateTime(time)}
                </TimeButton>
              ))}
            </TimeList>
          </Section>
        )}

        {schedules.length > 0 && (
          <Section>
            <h3>버스 정류장 정보</h3>
            <ResultTable>
              <thead>
                <tr>
                  <th>정류장</th>
                  <th>시간</th>
                  <th>버스</th>
                  <th>좌석</th>
                  <th>위치</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={`${schedule.busScheduleId}-${schedule.busStopId}`}>
                    <td>{schedule.busStop.name}</td>
                    <td>{formatDateTime(parseISO(schedule.busStop.time))}</td>
                    <td>{schedule.busInfo.name}</td>
                    <td>{`${schedule.busInfo.reservedSeat}/${schedule.busInfo.totalSeat}`}</td>
                    <td>{`${schedule.busStop.latitude.toFixed(4)}, ${schedule.busStop.longitude.toFixed(4)}`}</td>
                  </tr>
                ))}
              </tbody>
            </ResultTable>
          </Section>
        )}
      </Section>
    </Container>
  );
}

export default BusScheduleTest; 