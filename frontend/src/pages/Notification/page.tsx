import PopHeader from "@/components/Headers/PopHeader";
import { NotificationCardWrapper, NotificationLimit } from "./styles";
// import { useLoaderData } from "react-router-dom";
import NotificationCard from "./Components/NotificationCard";
import { NotificationCardType } from "./model/notificationCardType";
import { useLoaderData, useNavigate } from "react-router-dom";
import { queryClient } from "@/main";
import { useEffect } from "react";

export default function Notification() {
  const {
    notifications: { content: notificationArray },
  } = useLoaderData()[0];

  const navigate = useNavigate();

  const notificationCardClick = (reservationId: number) => {
    navigate("/reservations", {
      state: { reservationId },
    });
  };
  const notificationsServerData =
    notificationArray?.length > 0 ? notificationArray : [];

  useEffect(() => {
    // 다시 접속을 했을 때 업데이트된 알림 항목을 가져오기 위해, 키를 무효화 시킵니다.
    queryClient.removeQueries({
      queryKey: ["/api/users/notifications"],
    });
  }, []);
  return (
    <>
      <PopHeader text="알림"></PopHeader>
      <NotificationCardWrapper>
        {notificationsServerData.map((v: NotificationCardType) => (
          <NotificationCard
            $cursorPointer={v?.reservationInfo !== null}
            notificationData={v}
            onClick={() => {
              if (!v?.reservationInfo) {
                return;
              }
              notificationCardClick(v?.reservationInfo?.reservationId);
            }}
          />
        ))}
      </NotificationCardWrapper>
      <NotificationLimit>30일 동안의 알림만 저장됩니다.</NotificationLimit>
    </>
  );
}
