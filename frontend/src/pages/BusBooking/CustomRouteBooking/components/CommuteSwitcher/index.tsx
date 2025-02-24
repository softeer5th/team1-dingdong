import HomeIcon from "@/components/designSystem/Icons/HomeIcon";
import {
  CommuteViewBox,
  DeparturePoint,
  Destination,
  LocationName,
  PointTitle,
  Subtitle,
  SubtitleText,
  TitleText,
  Wrapper,
} from "./styles";
import SchoolIcon from "@/components/designSystem/Icons/SchoolIcon";
import { CommuteType } from "@/pages/BusBooking/types/commuteType";
import {
  TimeSchedule,
  TimeScheduleAction,
} from "@/pages/BusBooking/store/types";
import { timeScheduleActions } from "@/pages/BusBooking/store/actions";

type BoardingInfo = {
  schoolName: string;
  stationName: string;
};

interface CommuteSwitcherProps {
  boardingInfo: BoardingInfo;
  commuteType: CommuteType;
  setCommuteType: React.Dispatch<React.SetStateAction<CommuteType>>; // 핀을 움직여서, 바텀 시트를 보여준다.
  selectedTimeSchedule: TimeSchedule; // 총 반영된 선택된 시간
  dispatch: React.Dispatch<TimeScheduleAction>; // 선택시, 업데이트에 사용할 dispatch
}

export default function CommuteSwitcher({
  boardingInfo,
  dispatch,
  commuteType,
  setCommuteType,
}: CommuteSwitcherProps) {
  const switcherHandler = () => {
    setCommuteType(commuteType === "등교" ? "하교" : "등교");
    dispatch(timeScheduleActions.clearAll());
  };
  return (
    <Wrapper>
      <Subtitle onClick={switcherHandler}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
            stroke="#FF6F00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <SubtitleText>{commuteType}</SubtitleText>
      </Subtitle>
      <CommuteViewBox>
        <DeparturePoint>
          <PointTitle>
            {commuteType === "등교" ? <HomeIcon /> : <SchoolIcon />}

            <TitleText>{commuteType === "등교" ? "집" : "학교"}</TitleText>
          </PointTitle>

          <LocationName>
            {commuteType === "등교"
              ? boardingInfo.stationName
              : boardingInfo.schoolName}
          </LocationName>
        </DeparturePoint>

        <Destination>
          <PointTitle>
            {commuteType === "하교" ? <HomeIcon /> : <SchoolIcon />}
            <TitleText>{commuteType === "하교" ? "집" : "학교"}</TitleText>
          </PointTitle>
          <LocationName>
            {commuteType === "하교"
              ? boardingInfo.stationName
              : boardingInfo.schoolName}
          </LocationName>
        </Destination>
      </CommuteViewBox>
    </Wrapper>
  );
}
