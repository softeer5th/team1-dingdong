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
import { SelectedDateType, timeType } from "../../page";

interface CommuteSwitcherProps {
  schoolName: string;
  setSelectedHourMinute: React.Dispatch<React.SetStateAction<timeType | null>>;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<SelectedDateType | null>
  >;
  commuteType: CommuteType;
  setCommuteType: React.Dispatch<React.SetStateAction<CommuteType>>; // 핀을 움직여서, 바텀 시트를 보여준다.
}

export default function FixedBookingCommuteSwitcher({
  schoolName,
  setSelectedHourMinute,
  setSelectedDate,
  commuteType,
  setCommuteType,
}: CommuteSwitcherProps) {
  const switcherHandler = () => {
    setSelectedHourMinute(null);
    setSelectedDate(null);
    setCommuteType(commuteType === "등교" ? "하교" : "등교");
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
            {commuteType === "등교" ? "-" : schoolName}
          </LocationName>
        </DeparturePoint>

        <Destination>
          <PointTitle>
            {commuteType === "하교" ? <HomeIcon /> : <SchoolIcon />}
            <TitleText>{commuteType === "하교" ? "집" : "학교"}</TitleText>
          </PointTitle>
          <LocationName>
            {commuteType === "하교" ? "-" : schoolName}
          </LocationName>
        </Destination>
      </CommuteViewBox>
    </Wrapper>
  );
}
