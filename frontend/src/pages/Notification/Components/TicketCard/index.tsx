import {
  Banner,
  CardContainer,
  Content,
  EmptyCircle,
  HighlightText,
  StationInfo,
  StationName,
  Time,
} from "./styles";
import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
import { colors } from "@/styles/colors";
import { Body1SemiBold, Body2SemiBold } from "@/styles/typography";
import { NotificationContentProps } from "../NotificationCard/NotificationContent";
import { formatTime } from "@/utils/notification/dateFormatter";

export default function TicketCard({
  reservationInfo,
  type,
  isRead,
}: NotificationContentProps) {
  return (
    <CardContainer>
      <EmptyCircle
        $isRead={isRead}
        $direction="right"
        $cardType={type}
      ></EmptyCircle>
      <Banner $cardType={type}>
        {type === "ALLOCATION_SUCCESS" ? (
          <>
            <HighlightText>{reservationInfo!.startDate}</HighlightText>
            <Body1SemiBold>에 타야해요!</Body1SemiBold>
          </>
        ) : type === "BUS_START" ? (
          <>
            <HighlightText>버스가 출발 했어요!</HighlightText>
          </>
        ) : (
          <>
            <Body2SemiBold>
              {reservationInfo!.startDate}일 예정내역{" "}
            </Body2SemiBold>
          </>
        )}
      </Banner>
      <Content>
        <StationInfo>
          <StationName>{reservationInfo!.startStationName}</StationName>
          <Time>
            {reservationInfo!.expectedStartTime === null
              ? "-"
              : `${formatTime(reservationInfo!.expectedStartTime)} 탑승`}
          </Time>
        </StationInfo>
        <ChevronRightIcon size={32} fill={colors.gray30} />
        <StationInfo>
          <StationName>{reservationInfo!.endStationName}</StationName>
          <Time>
            {reservationInfo!.expectedEndTime
              ? `${formatTime(reservationInfo!.expectedEndTime)} 하차`
              : "-"}
          </Time>
        </StationInfo>
      </Content>
      <EmptyCircle
        $isRead={isRead}
        $direction="left"
        $cardType={type}
      ></EmptyCircle>
    </CardContainer>
  );
}
