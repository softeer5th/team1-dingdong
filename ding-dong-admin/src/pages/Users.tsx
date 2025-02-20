import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMap, Marker } from '@react-google-maps/api';
import httpClient from '../utils/httpClient';
import { format } from 'date-fns';

interface UserLocation {
  userId: string;
  email: string;
  stationLatitude: number;
  stationLongitude: number;
  houseLatitude: number;
  houseLongitude: number;
  stationName: string;
}

interface SavedUser {
  email: string;
  password: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  position: relative;
`;

const MapContainer = styled.div`
  height: 600px;
  width: 100%;
`;

const AddButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 12px 24px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    background-color: #ffa500;
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.save {
    background-color: #ff8c00;
    color: white;
    
    &:hover {
      background-color: #ffa500;
    }
  }
  
  &.cancel {
    background-color: #ccc;
    color: white;
    
    &:hover {
      background-color: #999;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #ffa500;
  }
`;

const RightPanel = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`;

const SelectedUsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TimeSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function Users() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [initialCenter, setInitialCenter] = useState({ lat: 37.5143, lng: 127.0319 }); // 기본값은 학동역
  const [selectedUsers, setSelectedUsers] = useState<SavedUser[]>([]);
  const [direction, setDirection] = useState('TO_SCHOOL');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [reservationResult, setReservationResult] = useState('');

  // 시간 옵션 생성 - 방향에 따라 다르게 설정
  const hours = direction === 'TO_SCHOOL' 
    ? Array.from({ length: 10 }, (_, i) => String(i + 9).padStart(2, '0'))  // 9시 ~ 18시
    : Array.from({ length: 11 }, (_, i) => String(i + 11).padStart(2, '0')); // 11시 ~ 21시

  // 방향 변경 시 시간 초기화
  useEffect(() => {
    if (direction === 'TO_SCHOOL') {
      setSelectedHour('09');
    } else {
      setSelectedHour('11');
    }
  }, [direction]);

  // 분 옵션 (0분, 30분)
  const minutes = ['00', '30'];

  const getDateTime = () => {
    const date = new Date(`${selectedDate}T${selectedHour}:${selectedMinute}:00`);
    const kstOffset = 9 * 60;
    const kstDate = new Date(date.getTime() + (kstOffset * 60000));
    return kstDate.toISOString();
  };

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await httpClient.post('/api/auth/login', {
          email: 'admin@admin.com',
          password: 'Abcd1234!@',
        });
        console.log('관리자 로그인 성공');
        // 최초 한 번만 유저 정보 조회
        const response = await httpClient.get('/api/admin/test/users/all');
        const result : UserLocation[] = response.data.items.map((user:any) => {
          return {
            userId: user.userId,
            email: user.email,
            stationLongitude: user.stationLongitude,
            stationLatitude: user.stationLatitude,
            houseLatitude: user.houseLatitude,
            houseLongitude: user.houseLongitude,
            stationName: user.stationName,
          }
        });
        setUsers(result);
      } catch (error) {
        console.error('관리자 로그인 실패:', error);
      }
    };

    autoLogin();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 현재 위치로 초기 중심 설정
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInitialCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  const handleAddUser = async () => {
    try {
      if (map) {
        const center = map.getCenter();
        if (center) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: center }, async (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const roadNameAddress = results[0].formatted_address;
              const response = await httpClient.post('/api/admin/test/users/fast-signup', {
                name: "test",
                email: newUserEmail,
                password: "Abcd1234!@",
                stationLatitude: center.lat(),
                stationLongitude: center.lng(),
                houseRoadNameAddress: roadNameAddress,
              });
              
              // 새 사용자를 기존 목록에 추가
              setUsers(prevUsers => [...prevUsers, {
                userId: response.data.userId,
                email: newUserEmail,
                stationLatitude: center.lat(),
                stationLongitude: center.lng(),
                houseLatitude: 0,
                houseLongitude: 0,
                stationName: "myStation"
              }]);
              
              setShowOverlay(false);
              setNewUserEmail('');
            } else {
              console.error('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleMarkerDragEnd = async (userId: string, latLng: google.maps.LatLng) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const position = latLng;

      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject('Geocode was not successful');
          }
        });
      });

      // 주소 컴포넌트에서 필요한 부분만 추출
      const addressComponents = results[0].address_components;
      const shortAddress = addressComponents
        .filter(component => 
          component.types.includes('sublocality') || 
          component.types.includes('street_number') ||
          component.types.includes('route')
        )
        .map(component => component.short_name)
        .join(' ');

      await httpClient.put(`/api/admin/test/users`, {
        userId: userId,
        stationLatitude: position.lat(),
        stationName: shortAddress,  // 짧은 주소 사용
        stationLongitude: position.lng(),
        stationRoadAddressName: shortAddress,  // 짧은 주소 사용
      });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  const handleMarkerClick = (user: UserLocation) => {
    setSelectedUsers(prev => {
      const exists = prev.some(u => u.email === user.email);
      if (exists) {
        return prev.filter(u => u.email !== user.email);
      } else {
        return [...prev, { email: user.email, password: 'Abcd1234!@' }];
      }
    });
  };

  const processReservation = async (user: SavedUser) => {
    try {
      // 1. 로그인
      await httpClient.post('/api/auth/login', {
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
    for (const user of selectedUsers) {
      const result = await processReservation(user);
      results.push(result);
    }
    setReservationResult(JSON.stringify(results, null, 2));

    // 모든 예약이 끝난 후 admin으로 다시 로그인
    try {
      await httpClient.post('/api/auth/login', {
        email: 'admin@admin.com',
        password: 'Abcd1234!@',
      });
      console.log('관리자 재로그인 성공');
    } catch (error) {
      console.error('관리자 재로그인 실패:', error);
    }
  };

  return (
    <Container>
      <ButtonContainer>
        <ActionButton onClick={() => window.location.reload()}>
          새로고침
        </ActionButton>
        <ActionButton onClick={() => setShowOverlay(true)}>
          + 사용자 추가
        </ActionButton>
      </ButtonContainer>
      
      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={initialCenter}  // 초기 중심 위치만 설정
          zoom={15}
          onLoad={setMap}
        >
          {users.map((user) => (
            <Marker
              key={user.userId}
              position={{
                lat: user.stationLatitude,
                lng: user.stationLongitude,
              }}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  handleMarkerDragEnd(user.userId, e.latLng);
                }
              }}
              onClick={() => handleMarkerClick(user)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: selectedUsers.some(u => u.email === user.email) ? '#ff0000' : '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              title={`Email: ${user.email}`}
            />
          ))}
        </GoogleMap>
      </MapContainer>

      <RightPanel>
        <h3>예약 설정</h3>
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
              <option key={hour} value={hour}>{hour}시</option>
            ))}
          </TimeSelect>
          <TimeSelect 
            value={selectedMinute} 
            onChange={(e) => setSelectedMinute(e.target.value)}
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>{minute}분</option>
            ))}
          </TimeSelect>
        </DateTimeContainer>

        <h3>선택된 사용자 ({selectedUsers.length})</h3>
        <SelectedUsersList>
          {selectedUsers.map(user => (
            <UserItem key={user.email}>
              <span>{user.email}</span>
              <Button onClick={() => setSelectedUsers(prev => prev.filter(u => u.email !== user.email))}>
                삭제
              </Button>
            </UserItem>
          ))}
        </SelectedUsersList>

        <Button 
          onClick={handleBatchReservation}
          disabled={selectedUsers.length === 0}
        >
          일괄 예약 처리
        </Button>

        {reservationResult && (
          <div>
            <h3>예약 결과</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {reservationResult}
            </pre>
          </div>
        )}
      </RightPanel>

      <Overlay isVisible={showOverlay}>
        <h3>새 사용자 추가</h3>
        <Input
          type="email"
          placeholder="이메일 주소"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
        <ButtonGroup>
          <Button className="cancel" onClick={() => setShowOverlay(false)}>
            취소
          </Button>
          <Button className="save" onClick={handleAddUser}>
            저장
          </Button>
        </ButtonGroup>
      </Overlay>
    </Container>
  );
}

export default Users; 