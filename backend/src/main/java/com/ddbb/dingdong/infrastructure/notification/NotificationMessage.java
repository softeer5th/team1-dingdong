package com.ddbb.dingdong.infrastructure.notification;

public record NotificationMessage(
        String title,
        String content
) {
    public static final NotificationMessage ALLOCATE_SUCCESS = new NotificationMessage("배차에 성공했습니다.", "탭을 눌러 자세한 내용을 확인해보세요.");
    public static final NotificationMessage ALLOCATE_FAIL = new NotificationMessage("배차에 실패했습니다.", "탭을 눌러 자세한 내용을 확인해보세요.");

}
