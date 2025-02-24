import {useEffect, useState} from "react";
import {PositionType} from "@/pages/BusTracker/page.tsx";

export default function useCurrentLocation() {
    const [location, setLocation] = useState<PositionType>({ lat: -1, lng: -1 });

    useEffect(() => {
        if ("geolocation" in navigator) {
            /* 위치정보 사용 가능 */
            const success = (pos: GeolocationPosition) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
            }

            const error = (err: GeolocationPositionError) => {
                console.warn("ERROR(" + err.code + "): " + err.message);
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }

            const id = navigator.geolocation.watchPosition(success, error, options);

            return () => {
                navigator.geolocation.clearWatch(id);

            }
        } else {
            /* 위치정보 사용 불가능 */
            console.warn("위치 권한이 거부됨. watchPosition 실행하지 않음.");
        }

    }, []);

    return location;
}