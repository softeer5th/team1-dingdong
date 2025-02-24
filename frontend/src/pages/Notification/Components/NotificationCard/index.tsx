import { NotificationCardType } from "../../model/notificationCardType";
import { Subtitle, Time, Title, TitleType, Wrapper } from "./styles";

import { formatDate } from "@/utils/notification/dateFormatter";
import NotificationContent from "./NotificationContent";
import NotificationIcon from "./NotificationIcon";

interface NotificationCardProps {
  $cursorPointer: boolean;
  onClick: () => void;
  notificationData: NotificationCardType;
}

export default function NotificationCard({
  $cursorPointer,
  onClick,
  notificationData,
}: NotificationCardProps) {
  const titleType = {
    ALLOCATION_SUCCESS: "배차 확정 안내!",
    ALLOCATION_FAILED: "배차 실패 입금",
    BUS_START: "출발 안내",
    WELCOME: "환영 해요",
  };

  return (
    <Wrapper
      $isRead={notificationData.read}
      onClick={onClick}
      $cursorPointer={$cursorPointer}
    >
      <Subtitle>
        <Title>
          <NotificationIcon type={notificationData.type} />
          <TitleType>{titleType[notificationData.type]}</TitleType>
        </Title>
        <Time>{formatDate(notificationData.timeStamp)}</Time>
      </Subtitle>
      <NotificationContent
        type={notificationData.type}
        reservationInfo={notificationData.reservationInfo}
        isRead={notificationData.read}
        money={notificationData.money}
      />
    </Wrapper>
  );
}
