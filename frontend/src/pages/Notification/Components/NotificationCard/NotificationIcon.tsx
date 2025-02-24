// components/NotificationCard/NotificationIcon.tsx
import { NotificationCardType } from "../../model/notificationCardType";

import { colors } from "@/styles/colors";
import BellIcon from "@/components/designSystem/Icons/Home/BellIcon";
import BusIcon from "@/components/designSystem/Icons/Home/BusIcon";
import BusFailIcon from "@/components/designSystem/Icons/Notification/BusFailIcon";
import SmileIcon from "@/components/designSystem/Icons/Notification/SmileIcon";

interface NotificationIconProps {
  type: NotificationCardType["type"];
}

export default function NotificationIcon({ type }: NotificationIconProps) {
  const iconMap = {
    BUS_START: <BellIcon />,
    ALLOCATION_SUCCESS: <BusIcon fill={colors.gray90} width={15} height={18} />,
    ALLOCATION_FAILED: <BusFailIcon />,
    WELCOME: <SmileIcon />,
  };

  return iconMap[type] || null;
}
