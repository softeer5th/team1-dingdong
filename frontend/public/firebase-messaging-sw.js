// 서비스 워커 파일
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function () {
  console.log("fcm sw activate..");
});
self.addEventListener("push", function (e) {
  if (!e.data.json()) return;
  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
  };
  console.log(resultData.title, {
    body: resultData.body,
  });
  e.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// push 이벤트의 객체가 notificationclick 이벤트 객체에 부모.
// 즉, 여기서 notificationclick 이벤트 객체에 값이 전이된다.
const NOTIFICATION_URL = "https://www.ding-dong-bus.shop/notification";

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;
  // URL이 유효한지 확인
  if (urlToOpen) {
    event.waitUntil(self.clients.openWindow(urlToOpen));
  } else {
    event.waitUntil(self.clients.openWindow(NOTIFICATION_URL));
  }
});
