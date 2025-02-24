// 위도 경도를 기반으로 도로명 주소를 반환합니다.
export const getAddressFromCoords = (
  lat: number,
  lng: number
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const position = new kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(
      position.getLng(),
      position.getLat(),
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const roadAddress = result[0].address?.address_name || null;
          resolve(roadAddress);
        } else {
          reject(new Error("주소 변환 실패"));
        }
      }
    );
  });
};
