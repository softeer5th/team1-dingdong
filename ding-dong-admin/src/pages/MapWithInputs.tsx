import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMap, Circle } from '@react-google-maps/api';
import httpClient from '../utils/httpClient';
import { ClusterData } from '../types/ClusterData';
import { useLogin } from '../hooks/useLogin';
import { format } from 'date-fns';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
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

const MapContainer = styled.div`
  flex-grow: 1;
  height: 400px; // 지도 높이 설정
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

const clusterColors: { [key: string]: string } = {};

function getClusterColor(clusterLabel: string): string {
  if (!clusterColors[clusterLabel]) {
    // HSL 색상 모델을 사용하여 밝은 색상 생성
    const hue = Math.random() * 360; // 색조는 무작위
    const saturation = 70 + Math.random() * 30; // 채도 70-100%
    const lightness = 65 + Math.random() * 15; // 명도 65-80%
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    clusterColors[clusterLabel] = color;
  }
  return clusterColors[clusterLabel];
}

function MapWithInputs() {
  const { isLoggedIn, loading, error } = useLogin();
  const [direction, setDirection] = useState('TO_SCHOOL');
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [selectedClusterLabels, setSelectedClusterLabels] = useState<string[]>([]);
  const [hoveredClusterLabel, setHoveredClusterLabel] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapCentered, setIsMapCentered] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5143, lng: 127.0319 });
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // 시간 옵션 생성 - 방향에 따라 다르게 설정
  const hours = direction === 'TO_SCHOOL' 
    ? Array.from({ length: 10 }, (_, i) => String(i + 8).padStart(2, '0'))  // 9시 ~ 18시
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

  const getCurrentDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = now.getHours();
    const minutes = now.getMinutes() >= 30 ? '30' : '00';
    
    // 현재 시간이 업무 시간(9-18시) 외인 경우 다음 업무일 9시로 설정
    let adjustedHours = hours;
    let adjustedDay = day;
    
    if (hours < 9) {
      adjustedHours = 9;  // 숫자로 변경
    } else if (hours > 18) {
      // 다음날 9시로 설정
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      adjustedDay = String(tomorrow.getDate()).padStart(2, '0');
      adjustedHours = 9;  // 숫자로 변경
    } else {
      adjustedHours = hours;  // 숫자 유지
    }

    return `${year}-${month}-${adjustedDay}T${String(adjustedHours).padStart(2, '0')}:${minutes}`;
  };

  const [dateTime, setDateTime] = useState(getCurrentDateTimeString());

  useEffect(() => {
    const newDateTime = `${selectedDate}T${selectedHour}:${selectedMinute}`;
    setDateTime(newDateTime);
  }, [selectedDate, selectedHour, selectedMinute]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await httpClient.post('/api/admin/reservations/pending/locations', {
        direction,
        dingdongTime: dateTime,
      });
      
      const newClusters = response.data.locations;
      setClusters(newClusters);

      // 모든 마커가 보이도록 bounds 조정
      if (map && newClusters.length > 0 && !isMapCentered) {
        const bounds = new google.maps.LatLngBounds();
        newClusters.forEach((location: any) => {
          bounds.extend({ lat: location.latitude, lng: location.longitude });
        });
        map.fitBounds(bounds);
        setIsMapCentered(true);
      }
    } catch (error) {
      console.error('Error fetching cluster data:', error);
    }
  };

  const handleClustering = async () => {
    try {
      await httpClient.post('/api/admin/clusters', {
        direction,
        dingdongTime: dateTime,
      });
      handleSearch();  // 클러스터링 후에는 결과를 보여주기 위해 조회 필요
    } catch (error) {
      console.error('Error sending clustering data:', error);
    }
  };

  const handleRouting = async () => {
    try {
      const clusterLabels = selectedClusterLabels.map(clusterLabel => ({ clusterLabel }));
      await httpClient.post('/api/admin/clusters/routes', {
        clusters: clusterLabels,
      });
      handleSearch();  // 라우팅 후에는 결과를 보여주기 위해 조회 필요
    } catch (error) {
      console.error('Error sending routing data:', error);
    }
  };

  const handleCircleClick = (clusterLabel: string) => {
    setSelectedClusterLabels((prevLabels) => {
      // 이미 선택된 라벨이면 제거, 아니면 추가
      return prevLabels.includes(clusterLabel)
        ? prevLabels.filter(label => label !== clusterLabel)
        : [...prevLabels, clusterLabel];
    });
  };

  const handleMapDragEnd = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setMapCenter({
          lat: center.lat(),
          lng: center.lng()
        });
      }
    }
  };

  if (loading) {
    return <Container>로그인 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <InputContainer>
        <DateTimeContainer>
          <DateInput
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={`${new Date().getFullYear()}-01-01`}
            max={`${new Date().getFullYear() + 1}-12-31`}
          />
          <TimeSelect 
            value={selectedHour} 
            onChange={handleHourChange}
          >
            {hours.map(hour => (
              <option key={hour} value={hour}>
                {hour}시
              </option>
            ))}
          </TimeSelect>
          <TimeSelect 
            value={selectedMinute} 
            onChange={handleMinuteChange}
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>
                {minute}분
              </option>
            ))}
          </TimeSelect>
        </DateTimeContainer>
        <Select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="TO_SCHOOL">TO_SCHOOL</option>
          <option value="TO_HOME">TO_HOME</option>
        </Select>
        <Button onClick={handleSearch}>조회</Button>
        <Button onClick={handleClustering}>클러스터링</Button>
        <Button onClick={handleRouting}>경로 생성</Button>
      </InputContainer>
      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={15}
          onLoad={setMap}
          onDragEnd={handleMapDragEnd}
        >
          {clusters.map((cluster, index) => {
            const color = cluster.clusterLabel === null ? '#000000' : getClusterColor(cluster.clusterLabel);
            const isSelected = selectedClusterLabels.includes(cluster.clusterLabel);
            return (
              <Circle
                key={index}
                center={{ lat: cluster.latitude, lng: cluster.longitude }}
                radius={15}
                options={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.8 : 0.6,
                  strokeColor: isSelected ? '#000000' : 'transparent',
                  strokeOpacity: 1,
                  strokeWeight: isSelected ? 3 : 0,
                }}
                onMouseOver={() => setHoveredClusterLabel(cluster.clusterLabel)}
                onMouseOut={() => setHoveredClusterLabel(null)}
                onClick={() => handleCircleClick(cluster.clusterLabel)}
              />
            );
          })}
        </GoogleMap>
        {hoveredClusterLabel !== null && (
          <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '5px', borderRadius: '4px' }}>
            Cluster Label: {hoveredClusterLabel}
          </div>
        )}
      </MapContainer>
    </Container>
  );
}

export default MapWithInputs; 