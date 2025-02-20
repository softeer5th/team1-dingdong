import React, { useState } from 'react';
import styled from 'styled-components';
import { GoogleMap } from '@react-google-maps/api';
import { useLogin } from '../hooks/useLogin';
import { format } from 'date-fns';

const Container = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;

  label {
    font-weight: 500;
    color: #666;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff8c00;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff8c00;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ffa500;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  overflow-y: auto;
  max-height: 400px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 500;
    position: sticky;
    top: 0;
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &.selected {
      background-color: #fff3e0;
    }
  }
`;

const MapContainer = styled.div`
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
`;

const ErrorPopup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff4444;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

interface BusSchedule {
  id: number;
  direction: 'TO_SCHOOL' | 'TO_HOME';
  departure: string;
  arrival: string;
  reserved: number;
  totalSeats: number;
}

function BusSchedule() {
  const { isLoggedIn, loading, error: loginError } = useLogin();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('09:00');
  const [direction, setDirection] = useState<'TO_SCHOOL' | 'TO_HOME'>('TO_SCHOOL');
  const [schedule, setSchedule] = useState<BusSchedule[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleSearch = async () => {
    try {
      // API 호출 예시 (실제 API에 맞게 수정 필요)
      setSchedule([
        {
          id: 1,
          direction: 'TO_SCHOOL',
          departure: `${date}T${time}`,
          arrival: `${date}T${format(new Date(`${date}T${time}`).getTime() + 3600000, 'HH:mm')}`,
          reserved: 20,
          totalSeats: 45
        },
        {
          id: 2,
          direction: 'TO_HOME',
          departure: `${date}T${time}`,
          arrival: `${date}T${format(new Date(`${date}T${time}`).getTime() + 5400000, 'HH:mm')}`,
          reserved: 15,
          totalSeats: 45
        },
      ]);
    } catch (err) {
      setError('스케줄 조회 중 오류가 발생했습니다.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRowClick = (bus: BusSchedule) => {
    setSelectedBus(bus);
    // 여기에 선택된 버스의 경로를 지도에 표시하는 로직 추가
  };

  const formatDateTime = (isoString: string) => {
    return format(new Date(isoString), 'HH:mm');
  };

  if (loading) {
    return <Container>로그인 중...</Container>;
  }

  if (loginError) {
    return <Container>{loginError}</Container>;
  }

  return (
    <Container>
      <LeftPanel>
        <Section>
          <h2>버스 스케줄 조회</h2>
          <InputGroup>
            <label>날짜</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </InputGroup>
          
          <InputGroup>
            <label>시간</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              step="1800"
            />
          </InputGroup>

          <InputGroup>
            <label>방향</label>
            <Select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'TO_SCHOOL' | 'TO_HOME')}
            >
              <option value="TO_SCHOOL">등교</option>
              <option value="TO_HOME">하교</option>
            </Select>
          </InputGroup>

          <Button onClick={handleSearch}>조회</Button>
        </Section>

        <Section>
          <h2>스케줄 목록</h2>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>방향</th>
                  <th>출발</th>
                  <th>도착</th>
                  <th>예약/총좌석</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((bus) => (
                  <tr
                    key={bus.id}
                    onClick={() => handleRowClick(bus)}
                    className={selectedBus?.id === bus.id ? 'selected' : ''}
                  >
                    <td>{bus.id}</td>
                    <td>{bus.direction === 'TO_SCHOOL' ? '등교' : '하교'}</td>
                    <td>{formatDateTime(bus.departure)}</td>
                    <td>{formatDateTime(bus.arrival)}</td>
                    <td>{`${bus.reserved}/${bus.totalSeats}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Section>
      </LeftPanel>

      <RightPanel>
        <Section>
          <h2>버스 경로</h2>
          {selectedBus && (
            <div style={{ marginBottom: '10px' }}>
              <strong>선택된 버스:</strong> {selectedBus.id} ({selectedBus.direction === 'TO_SCHOOL' ? '등교' : '하교'})
            </div>
          )}
          <MapContainer>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 37.5143, lng: 127.0319 }}
              zoom={15}
              onLoad={setMap}
            >
              {/* 여기에 경로 표시 로직 추가 */}
            </GoogleMap>
          </MapContainer>
        </Section>
      </RightPanel>

      {error && (
        <ErrorPopup>
          {error}
        </ErrorPopup>
      )}
    </Container>
  );
}

export default BusSchedule; 