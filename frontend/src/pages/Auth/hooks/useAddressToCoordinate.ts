import { getCoordsFromAddress } from "@/utils/geoLocation/getCoordinateToAddress";
import { useEffect, useState } from "react";
// 좌표에서 주소로 바꿔주고 렌더링을 합니다.
export type GeoLocationType = {
  latitude: number;
  longitude: number;
};
export const useGeoLocationAddress = (
  roadAddress: string,
  setGeoLocation: React.Dispatch<React.SetStateAction<GeoLocationType | null>>
) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 카카오맵 로드 상태 체크
  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };

    checkKakaoLoaded();
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || !roadAddress) return;
    const fetchAddress = async () => {
      try {
        const location = await getCoordsFromAddress(roadAddress);
        setGeoLocation({
          latitude: location?.lat as number,
          longitude: location?.lng as number,
        });
      } catch (error) {
        console.error(error);
        setGeoLocation(null);
      }
    };

    fetchAddress();
  }, [roadAddress, setGeoLocation, isKakaoLoaded]);
};
