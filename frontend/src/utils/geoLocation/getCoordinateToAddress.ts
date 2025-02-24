export const getCoordsFromAddress = (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  if (window.kakao && window.kakao.maps) {
    kakao.maps.load(() => {
      console.log("Kakao Maps API 로드 완료!");
    });
  }
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) {
      reject(new Error("Kakao Maps SDK is not loaded"));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const { x, y } = result[0]; // x: 경도, y: 위도
        resolve({ lat: parseFloat(y), lng: parseFloat(x) });
      } else {
        reject(new Error("주소 변환 실패"));
      }
    });
  });
};
