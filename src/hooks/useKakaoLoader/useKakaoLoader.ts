import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"
import {kakaoAppKey} from "@/env.ts";

export default function useKakaoLoader() {
    useKakaoLoaderOrigin({

        appkey: kakaoAppKey,
        libraries: ["clusterer", "drawing", "services"],
    })
}