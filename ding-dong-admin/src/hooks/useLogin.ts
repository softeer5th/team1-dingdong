import { useEffect, useState } from 'react';
import httpClient from '../utils/httpClient';

export const useLogin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        await httpClient.post('/api/auth/login', {
          email: 'admin@admin.com',
          password: 'abcd1234!@',
        });
      } catch (err) {
        setError('로그인에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    login();
  }, []);

  return { loading, error };
};