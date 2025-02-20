import React, { useState } from 'react';
import styled from 'styled-components';
import httpClient from '../utils/httpClient';

const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const LeftPanel = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  flex: 1;
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

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #ffa500;
  }
`;

const ResultArea = styled.pre`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
`;

interface ApiEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  queryParams?: string[];
  pathVariables?: string[];
  hasRequestBody?: boolean;
}

type ApiCategory = 'USER' | 'RESERVATION' | 'BUS';

const API_ENDPOINTS: Record<ApiCategory, ApiEndpoint[]> = {
  USER: [
    { name: '지갑 잔액 조회', method: 'GET', path: '/api/users/wallet/balance', queryParams: ['authUser'] },
    { name: '지갑 히스토리 조회', method: 'GET', path: '/api/users/wallet/history', queryParams: ['authUser', 'page', 'pageSize'] },
    { name: '무료 충전 가능 여부 확인', method: 'GET', path: '/api/users/wallet/charge/free/available', queryParams: ['authUser'] },
    { name: '무료 충전', method: 'POST', path: '/api/users/wallet/charge/free', queryParams: ['authUser'] },
    { name: '시간표 조회', method: 'GET', path: '/api/users/timetable', queryParams: ['authUser'] },
    { name: '시간표 수정', method: 'PUT', path: '/api/users/timetable', queryParams: ['authUser'], hasRequestBody: true },
    { name: '집 위치 수정', method: 'PUT', path: '/api/users/home', queryParams: ['user'], hasRequestBody: true },
  ],
  RESERVATION: [
    { name: '일반 예약 토큰 발급', method: 'POST', path: '/api/users/reservations/token/general', queryParams: ['user'], hasRequestBody: true },
    { name: '일반 예약 확정', method: 'POST', path: '/api/users/reservations/general', queryParams: ['user'], hasRequestBody: true },
    { name: '예약 목록 조회', method: 'GET', path: '/api/users/reservations', queryParams: ['user', 'sort', 'category', 'page', 'pageSize'] },
    { name: '예약 취소', method: 'DELETE', path: '/api/users/reservations/{reservationId}', queryParams: ['user'], pathVariables: ['reservationId'] },
  ],
  BUS: [
    { name: '버스 시간표 조회', method: 'GET', path: '/api/bus/schedule/time', queryParams: ['direction', 'authUser'] },
    { name: '버스 경로 조회', method: 'GET', path: '/api/bus/path/{busScheduleId}', queryParams: ['authUser'], pathVariables: ['busScheduleId'] },
    { name: '버스 정류장 위치 조회', method: 'GET', path: '/api/bus/bus-stop/location/{busScheduleId}', queryParams: ['authUser'], pathVariables: ['busScheduleId'] },
  ]
};

const ParamsSection = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ParamInput = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  label {
    min-width: 120px;
    font-size: 14px;
  }

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

function ApiTest() {
  const [currentUser, setCurrentUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory>('USER');
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathVariables, setPathVariables] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState('');
  const [result, setResult] = useState('');

  const handleLogin = async () => {
    try {
      await httpClient.post('/api/auth/login', {
        email: currentUser,
        password: 'abcd1234!@',
      });
      setResult('로그인 성공');
    } catch (error) {
      setResult('로그인 실패: ' + JSON.stringify(error, null, 2));
    }
  };

  const handleEndpointChange = (path: string) => {
    setSelectedEndpoint(path);
    setQueryParams({});
    setPathVariables({});
    setRequestBody('');
  };

  const buildUrl = (endpoint: ApiEndpoint) => {
    let url = endpoint.path;
    
    // Path Variables 처리
    if (endpoint.pathVariables) {
      endpoint.pathVariables.forEach(variable => {
        url = url.replace(`{${variable}}`, pathVariables[variable] || '');
      });
    }

    // Query Parameters 처리
    const queryString = endpoint.queryParams
      ?.map(param => queryParams[param] ? `${param}=${encodeURIComponent(queryParams[param])}` : null)
      .filter(Boolean)
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  };

  const handleRequest = async () => {
    try {
      const endpoint = API_ENDPOINTS[selectedCategory].find(e => e.path === selectedEndpoint);
      if (!endpoint) return;

      const url = buildUrl(endpoint);
      let response;
      const requestData = requestBody ? JSON.parse(requestBody) : {};

      switch (endpoint.method) {
        case 'GET':
          response = await httpClient.get(url);
          break;
        case 'POST':
          response = await httpClient.post(url, requestData);
          break;
        case 'PUT':
          response = await httpClient.put(url, requestData);
          break;
        case 'DELETE':
          response = await httpClient.delete(url);
          break;
      }

      setResult(JSON.stringify(response?.data || {}, null, 2));
    } catch (error) {
      setResult('요청 실패: ' + JSON.stringify(error, null, 2));
    }
  };

  const selectedEndpointData = API_ENDPOINTS[selectedCategory].find(e => e.path === selectedEndpoint);

  return (
    <Container>
      <LeftPanel>
        <Section>
          <h3>사용자 설정</h3>
          <Input
            type="email"
            placeholder="이메일 주소"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
          <Button onClick={handleLogin}>로그인</Button>
        </Section>

        <Section>
          <h3>API 선택</h3>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ApiCategory)}
          >
            {Object.keys(API_ENDPOINTS).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <Select
            value={selectedEndpoint}
            onChange={(e) => handleEndpointChange(e.target.value)}
            style={{ marginTop: '10px' }}
          >
            <option value="">API 선택</option>
            {API_ENDPOINTS[selectedCategory]?.map(endpoint => (
              <option key={endpoint.path} value={endpoint.path}>
                {endpoint.name} ({endpoint.method})
              </option>
            ))}
          </Select>

          {selectedEndpointData && (
            <>
              {selectedEndpointData.queryParams && (
                <ParamsSection>
                  <h4>Query Parameters</h4>
                  {selectedEndpointData.queryParams.map(param => (
                    <ParamInput key={param}>
                      <label>{param}:</label>
                      <input
                        value={queryParams[param] || ''}
                        onChange={(e) => setQueryParams(prev => ({ ...prev, [param]: e.target.value }))}
                        placeholder={param}
                      />
                    </ParamInput>
                  ))}
                </ParamsSection>
              )}

              {selectedEndpointData.pathVariables && (
                <ParamsSection>
                  <h4>Path Variables</h4>
                  {selectedEndpointData.pathVariables.map(variable => (
                    <ParamInput key={variable}>
                      <label>{variable}:</label>
                      <input
                        value={pathVariables[variable] || ''}
                        onChange={(e) => setPathVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                        placeholder={variable}
                      />
                    </ParamInput>
                  ))}
                </ParamsSection>
              )}

              {selectedEndpointData.hasRequestBody && (
                <ParamsSection>
                  <h4>Request Body (JSON)</h4>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="JSON 형식으로 입력"
                    style={{ width: '100%', height: '200px' }}
                  />
                </ParamsSection>
              )}
            </>
          )}
        </Section>

        <Button onClick={handleRequest}>요청 보내기</Button>
      </LeftPanel>

      <RightPanel>
        <Section>
          <h3>응답 결과</h3>
          <ResultArea>{result}</ResultArea>
        </Section>
      </RightPanel>
    </Container>
  );
}

export default ApiTest; 