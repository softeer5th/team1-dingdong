import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import httpClient from '../utils/httpClient';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useLogin } from '../hooks/useLogin';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const StatusIndicator = styled.div<{ isConnected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isConnected ? '#4CAF50' : '#f44336'};
`;

const StatusText = styled.span`
  font-size: 14px;
  color: #666;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MapContainer = styled.div`
  flex-grow: 1;
  height: 600px;
`;

function BusManagement() {
  const { isLoggedIn, loading, error } = useLogin();
  const { webSocket, connect } = useWebSocket();
  const [scheduleId, setScheduleId] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const [busLocation, setBusLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const handleSearchRoute = async () => {
    try {
      setRoutePath([]);
      setBusLocation(null);
      setIsRouteLoaded(false);

      const response = await httpClient.get(`/api/bus/path/${scheduleId}`);
      console.log('Route data:', response.data);
      const routePoints = response.data.points;
      setIsRouteLoaded(true);

      if (map && routePoints.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        const path = routePoints.map((point: { longitude: number; latitude: number }) => {
          const latLng = new google.maps.LatLng(point.latitude, point.longitude);
          bounds.extend(latLng);
          return latLng;
        });

        setRoutePath(path);
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const handleStartBus = async () => {
    try {
      await httpClient.post(`/api/admin/bus/${scheduleId}`, {
        'interval': 10,
        'delay': 0,
        'timeUnit': 'MILLISECONDS',
      })
      .then(() => {
        console.log('Bus started successfully');
      });
    } catch (error) {
      console.error('Error starting bus:', error);
    }
  };

  const handleStopBus = async () => {
    try {
      await httpClient.delete(`/api/admin/bus/${scheduleId}`)
      .then(() => {
        console.log('Bus stopped successfully');
      });
    } catch (error) {
      console.error('Error unsubscribing from bus:', error);
    }
  };

  const handleReconnect = () => {
    connect();
  };

  useEffect(() => {
    if (webSocket instanceof WebSocket && scheduleId) {
      const handleMessage = (message: MessageEvent) => {
        try {
          const data = JSON.parse(message.data);
          setBusLocation({ lat: data.latitude, lng: data.longitude });
          console.log("버스 정보", data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      webSocket.addEventListener("message", handleMessage);

      console.log("구독 시작", webSocket);
      httpClient.post(`/api/bus/subscription/${scheduleId}`)
        .then(() => console.log("구독 성공"))
        .catch((error) => console.log("구독 실패", error))
        .finally(() => console.log("구독 요청 완료"));

      return () => {
        httpClient.delete(`/api/bus/subscription/${scheduleId}`)
          .then(() => console.log("구독 해제 성공"))
          .catch((error) => console.log("구독 해제 실패", error));
        webSocket.removeEventListener("message", handleMessage);
      };
    }
  }, [webSocket, scheduleId]);

  useEffect(() => {
    if (map && busLocation) {
      map.panTo(busLocation);
    }
  }, [busLocation, map]);

  if (loading) {
    return <Container>로그인 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <StatusContainer>
        <StatusIndicator isConnected={!!webSocket} />
        <StatusText>
          {webSocket ? '웹소켓 연결됨' : '웹소켓 연결 끊김'}
        </StatusText>
        {!webSocket && (
          <Button onClick={handleReconnect}>
            재연결
          </Button>
        )}
      </StatusContainer>
      <InputContainer>
        <Input
          type="text"
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
          placeholder="버스 스케줄 ID 입력"
        />
        <Button onClick={handleSearchRoute}>경로 조회</Button>
        <Button 
          onClick={handleStartBus}
          disabled={!isRouteLoaded}
        >
          버스 출발
        </Button>
        <Button 
          onClick={handleStopBus}
          disabled={!isRouteLoaded}
        >
          버스 운행 종료
        </Button>
      </InputContainer>
      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: 37.5143, lng: 127.0319 }}
          zoom={15}
          onLoad={setMap}
        >
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#0066ff',
                strokeOpacity: 1.0,
                strokeWeight: 5,
              }}
            />
          )}
          {busLocation && (
            <Marker
              position={busLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              title="버스 위치"
            />
          )}
        </GoogleMap>
      </MapContainer>
    </Container>
  );
}

export default BusManagement; 