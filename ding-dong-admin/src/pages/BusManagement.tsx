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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const MapContainer = styled.div`
  flex-grow: 1;
  height: 600px;
`;

const FormSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ApiStatus = styled.span<{ status: 'success' | 'error' | 'pending' | 'idle' }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'success': return '#4CAF50';
      case 'error': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  }};
  color: white;
`;

const ResponsiveFormSection = styled(FormSection)`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ResponsiveButtonContainer = styled(ButtonContainer)`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResponsiveInputContainer = styled(InputContainer)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function BusManagement() {
  const { isLoggedIn, loading, error } = useLogin();
  const { webSocket, connect } = useWebSocket();
  const [scheduleId, setScheduleId] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const [busLocation, setBusLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeId, setSubscribeId] = useState('');
  const [unsubscribeId, setUnsubscribeId] = useState('');
  const [currentSubscribedId, setCurrentSubscribedId] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  const [apiStatus, setApiStatus] = useState<{
    route: { status: 'success' | 'error' | 'pending' | 'idle', code?: number };
    bus: { status: 'success' | 'error' | 'pending' | 'idle', code?: number };
    subscription: { status: 'success' | 'error' | 'pending' | 'idle', code?: number };
  }>({
    route: { status: 'idle' },
    bus: { status: 'idle' },
    subscription: { status: 'idle' }
  });

  const handleSearchRoute = async () => {
    try {
      if (polyline) {
        polyline.setMap(null);
        setPolyline(null);
      }

      setApiStatus(prev => ({ ...prev, route: { status: 'pending' } }));
      setRoutePath([]);
      setBusLocation(null);
      setIsRouteLoaded(false);

      const response = await httpClient.get(`/api/bus/path/${scheduleId}`);
      setApiStatus(prev => ({ ...prev, route: { status: 'success', code: response.status } }));
      
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
        
        const newPolyline = new google.maps.Polyline({
          path: path,
          strokeColor: '#0066ff',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          map: map
        });
        
        setPolyline(newPolyline);
        map.fitBounds(bounds);
      }
    } catch (error: any) {
      setApiStatus(prev => ({ 
        ...prev, 
        route: { 
          status: 'error', 
          code: error.response?.status || 500 
        } 
      }));
      console.error('Error fetching route:', error);
    }
  };

  const handleStartBus = async () => {
    try {
      setApiStatus(prev => ({ ...prev, bus: { status: 'pending' } }));
      const response = await httpClient.post(`/api/admin/bus/${scheduleId}`, {
        'interval': 1,
        'delay': 0,
        'timeUnit': 'SECONDS',
      });
      setApiStatus(prev => ({ ...prev, bus: { status: 'success', code: response.status } }));
      console.log('Bus started successfully');
    } catch (error: any) {
      setApiStatus(prev => ({ 
        ...prev, 
        bus: { 
          status: 'error', 
          code: error.response?.status || 500 
        } 
      }));
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

  const handleClearRoute = () => {
    if (polyline) {
      polyline.setMap(null);
      setPolyline(null);
    }
    
    setRoutePath([]);
    setBusLocation(null);
    setIsRouteLoaded(false);
    setScheduleId('');
    
    if (map) {
      map.setZoom(15);
      map.setCenter({ lat: 37.5143, lng: 127.0319 });
    }
    
    setApiStatus(prev => ({
      ...prev,
      route: { status: 'idle' },
      bus: { status: 'idle' }
    }));
  };

  const handleSubscribe = async () => {
    if (!subscribeId) return;

    try {
      setApiStatus(prev => ({ ...prev, subscription: { status: 'pending' } }));
      const response = await httpClient.post(`/api/bus/subscription/${subscribeId}`);
      setApiStatus(prev => ({ 
        ...prev, 
        subscription: { status: 'success', code: response.status } 
      }));
      setCurrentSubscribedId(subscribeId);
    } catch (error: any) {
      setApiStatus(prev => ({ 
        ...prev, 
        subscription: { 
          status: 'error', 
          code: error.response?.status || 500 
        } 
      }));
      console.error('버스 구독 처리 중 오류:', error);
    }
  };

  const handleUnsubscribe = async () => {
    if (!unsubscribeId) return;

    try {
      setApiStatus(prev => ({ ...prev, subscription: { status: 'pending' } }));
      const response = await httpClient.delete(`/api/bus/subscription/${unsubscribeId}`);
      setApiStatus(prev => ({ 
        ...prev, 
        subscription: { status: 'success', code: response.status } 
      }));
      if (unsubscribeId === currentSubscribedId) {
        setCurrentSubscribedId(null);
      }
      setUnsubscribeId('');
    } catch (error: any) {
      setApiStatus(prev => ({ 
        ...prev, 
        subscription: { 
          status: 'error', 
          code: error.response?.status || 500 
        } 
      }));
      console.error('버스 구독 해제 중 오류:', error);
    }
  };

  useEffect(() => {
    if (webSocket instanceof WebSocket && scheduleId && isSubscribed) {
      webSocket.binaryType = 'arraybuffer';
      const handleMessage = (message: MessageEvent) => {
        try {
          const arrayBuffer = message.data;
          const dataView = new DataView(arrayBuffer);

          const longitude = dataView.getFloat64(0, false);
          const latitude = dataView.getFloat64(8, false);

          setBusLocation({ lat: latitude, lng: longitude });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      webSocket.addEventListener("message", handleMessage);

      webSocket.addEventListener("close", () => {
        if (isSubscribed) {
          handleSubscribe(); // 소켓이 끊겼을 때 다시 구독
        }
      });

      return () => {
        webSocket.removeEventListener("message", handleMessage);
        webSocket.removeEventListener("close", handleSubscribe);
      };
    }
  }, [webSocket, scheduleId, isSubscribed]);

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
        <StatusGroup>
          <StatusIndicator isConnected={!!webSocket} />
          <StatusText>
            {webSocket ? '웹소켓 연결됨' : '웹소켓 연결 끊김'}
          </StatusText>
          {!webSocket && (
            <Button onClick={handleReconnect}>재연결</Button>
          )}
        </StatusGroup>

        <StatusGroup>
          <StatusText>경로 조회:</StatusText>
          <ApiStatus status={apiStatus.route.status}>
            {apiStatus.route.status.toUpperCase()}
            {apiStatus.route.code && ` (${apiStatus.route.code})`}
          </ApiStatus>
        </StatusGroup>

        <StatusGroup>
          <StatusText>버스 제어:</StatusText>
          <ApiStatus status={apiStatus.bus.status}>
            {apiStatus.bus.status.toUpperCase()}
            {apiStatus.bus.code && ` (${apiStatus.bus.code})`}
          </ApiStatus>
        </StatusGroup>

        <StatusGroup>
          <StatusText>구독 상태:</StatusText>
          <ApiStatus status={apiStatus.subscription.status}>
            {apiStatus.subscription.status.toUpperCase()}
            {apiStatus.subscription.code && ` (${apiStatus.subscription.code})`}
          </ApiStatus>
        </StatusGroup>
      </StatusContainer>

      <ResponsiveFormSection>
        <FormGroup>
          <FormTitle>버스 경로 관리</FormTitle>
          <InputContainer>
            <Input
              type="text"
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              placeholder="버스 스케줄 ID 입력"
            />
            <ResponsiveButtonContainer>
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
              <Button 
                onClick={handleClearRoute}
                disabled={!isRouteLoaded}
              >
                경로 초기화
              </Button>
            </ResponsiveButtonContainer>
          </InputContainer>
        </FormGroup>

        <FormGroup>
          <FormTitle>버스 위치 구독</FormTitle>
          <ResponsiveInputContainer>
            <Input
              type="text"
              value={subscribeId}
              onChange={(e) => setSubscribeId(e.target.value)}
              placeholder="구독할 버스 ID 입력"
            />
            <Button 
              onClick={handleSubscribe}
              disabled={!subscribeId || subscribeId === currentSubscribedId}
            >
              구독
            </Button>
            <Input
              type="text"
              value={unsubscribeId}
              onChange={(e) => setUnsubscribeId(e.target.value)}
              placeholder="구독 해제할 버스 ID 입력"
            />
            <Button 
              onClick={handleUnsubscribe}
              disabled={!unsubscribeId}
            >
              구독 해제
            </Button>
          </ResponsiveInputContainer>
        </FormGroup>
      </ResponsiveFormSection>

      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: 37.5143, lng: 127.0319 }}
          zoom={15}
          onLoad={setMap}
        >
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