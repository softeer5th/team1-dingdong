import { getAddressFromCoords } from "@/utils/geoLocation/coordinateToAddress";
import { useEffect, useState } from "react";
// 좌표에서 주소로 바꿔주고 렌더링을 합니다.
export const useAddress = (
  position: { lat: number; lng: number },
  setRoadAddress: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 카카오맵 로드 상태 체크
  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        setIsKakaoLoaded(true);
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };
    checkKakaoLoaded();
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || !position) return;
    const fetchAddress = async () => {
      try {
        const address = await getAddressFromCoords(position.lat, position.lng);

        setRoadAddress(address);
      } catch (error) {
        console.error(error);
        setRoadAddress("주소를 가져올 수 없습니다");
      }
    };

    fetchAddress();
  }, [position, setRoadAddress, isKakaoLoaded]);
};
