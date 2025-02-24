// 집 위치 설정에서 드래그 관련 로직 분리.
import { useCallback, useRef, useState } from "react";

interface PinPosition {
  // 핀의 위치(위도와 경도)
  lat: number;
  lng: number;
}

interface UsePinDragProps {
  initialPosition: PinPosition;
  onPositionChange?: (position: PinPosition) => void;
}

export const usePinDrag = ({
  initialPosition,
  onPositionChange,
}: UsePinDragProps) => {
  const [pinPosition, setPinPosition] = useState(initialPosition);
  const startPoint = useRef({ x: 0, y: 0 });
  const overlayPoint = useRef<kakao.maps.Point>();
  const mapRef = useRef<kakao.maps.Map>();
  const isDragging = useRef(false);

  const onPinMove = useCallback(
    (e: MouseEvent) => {
      // 드래깅 중이 아니라면 함수 종료
      if (!isDragging.current) return;

      e.preventDefault();
      const map = mapRef.current;
      if (!map || !overlayPoint.current) return;

      const proj = map.getProjection();
      const deltaX = e.clientX - startPoint.current.x; // 움직인 거리
      const deltaY = e.clientY - startPoint.current.y;

      const newPoint = new kakao.maps.Point(
        overlayPoint.current.x + deltaX, // 지도 상 첫 위치 + 움직인 거리 => 새로운 위치
        overlayPoint.current.y + deltaY
      );

      const newPos = proj.coordsFromContainerPoint(newPoint);
      const newPosition = {
        lat: newPos.getLat(),
        lng: newPos.getLng(),
      };

      setPinPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [onPositionChange]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onPinMove);
  }, [onPinMove]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const map = mapRef.current;
      if (!map) return;

      const proj = map.getProjection();
      kakao.maps.event.preventMap();

      // 드래깅 시작 플래그 설정
      isDragging.current = true;

      // 현재 마우스 위치 저장
      startPoint.current = {
        x: e.clientX,
        y: e.clientY,
      };

      // 현재 핀의 컨테이너 포인트 저장
      overlayPoint.current = proj.containerPointFromCoords(
        new kakao.maps.LatLng(pinPosition.lat, pinPosition.lng)
      );

      document.addEventListener("mousemove", onPinMove);
    },
    [onPinMove, pinPosition]
  );

  return {
    pinPosition,
    mapRef,
    onMouseDown,
    onMouseUp,
  };
};
