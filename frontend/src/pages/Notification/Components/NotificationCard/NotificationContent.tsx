import { AlarmText, Description, LinkBox } from "./styles";

import { colors } from "@/styles/colors";

import ChevronRightIcon from "@/components/designSystem/Icons/ChevronRightIcon";
import TicketCardContent from "./TicketCardContent";
import { useNavigate } from "react-router-dom";
import {
  NotificationType,
  ReservationInfo,
} from "../../model/notificationCardType";

export interface NotificationContentProps {
  reservationInfo: ReservationInfo | null;
  type: NotificationType;
  isRead: boolean;
  money: number | null;
}

export default function NotificationContent({
  reservationInfo,
  type,
  isRead,
  money,
}: NotificationContentProps) {
  const navigate = useNavigate();

  const renderFailedContent = (refundAmount: number) => (
    <AlarmText>
      <Description>{refundAmount}원이 딩동머니로 자동입금되었어요.</Description>
      <LinkBox onClick={() => navigate("/reservations")}>
        다음 배차를 예매하는 건 어떨까요?
        <ChevronRightIcon size={18} fill={colors.orange900} />
      </LinkBox>
    </AlarmText>
  );

  const renderWelcomeContent = (welcomeDingDongMoney: number) => (
    <AlarmText>
      <Description>
        웰컴 딩동머니로 {welcomeDingDongMoney}원이 적립되었어요.
      </Description>
      <LinkBox onClick={() => navigate("/home")}>
        버스를 예매해 볼까요?
        <ChevronRightIcon size={18} fill={colors.orange900} />
      </LinkBox>
    </AlarmText>
  );

  switch (type) {
    case "BUS_START":
    case "ALLOCATION_SUCCESS":
      return (
        <TicketCardContent
          reservationInfo={reservationInfo}
          type={type}
          isRead={isRead}
          money={money}
        />
      );
    case "ALLOCATION_FAILED":
      return (
        <>
          {renderFailedContent(money!)}
          <TicketCardContent
            isRead={isRead}
            type={type}
            money={money}
            reservationInfo={reservationInfo}
          />
        </>
      );
    case "WELCOME":
      return renderWelcomeContent(money!);
    default:
      return null;
  }
}
