import { createRoot, Root } from "react-dom/client";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import Toast from "@/components/Toast";

interface ToastInterface {
  message: string;
  key: string;
  bottom: string;
  reserveUnmount: boolean;
}

export default function useToast(bottom: string = "-20px") {
  const rootRef = useRef<{
    root: Root;
    toastContainer: HTMLDivElement;
  }>();
  const toastSet = useRef<Set<ToastInterface>>(new Set<ToastInterface>());

  const addToast = useCallback((message: string) => {
    // 토스트 컨테이너 등록 안되었으면 등록
    if (rootRef.current == null) {
      const { root, toastContainer } = mountToastContainer();
      rootRef.current = {
        root: root,
        toastContainer: toastContainer,
      };
    }
    const newToast: ToastInterface = {
      message: message,
      key: new Date().toISOString(),
      bottom: "100%",
      reserveUnmount: false,
    };

    // 토스트 추가
    toastSet.current.add(newToast);

    // 토스트 삭제 예약
    reserveUnmountToast({
      toastSet: toastSet.current,
      toast: newToast,
      root: rootRef.current.root,
      bottom: bottom,
      toastContainer: rootRef.current.toastContainer,
    });

    // 토스트 렌더링
    renderToast({ toastSet: toastSet.current, root: rootRef.current.root });

    // 다음 페인트에서 높이 계산해서 다시 렌더링하는 것 예약
    updateToast({
      bottom: bottom,
      toastSet: toastSet.current,
      toastContainer: rootRef.current.toastContainer,
      root: rootRef.current.root,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rootRef.current != null) {
        // 토스트 컨테이너 제거
        unmountToastContainer(
          rootRef.current.root,
          rootRef.current.toastContainer
        );
      }
    };
  }, []);

  return addToast;
}

// 헬퍼 함수
function mountToastContainer() {
  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);

  // React 18의 createRoot를 사용하여 LoadingModal 렌더링
  const root = createRoot(toastContainer);

  // url 변경 되면 제거
  window.addEventListener(
    "popstate",
    () => {
      unmountToastContainer(root, toastContainer);
    },
    { once: true }
  );

  return { root, toastContainer };
}

function unmountToastContainer(root: Root, modalContainer: HTMLDivElement) {
  root.unmount(); // 컴포넌트를 unmount
  modalContainer.remove(); // 컨테이너를 DOM에서 제거
}

interface CreateToastProps {
  toastSet: Set<ToastInterface>;
}
function createToast({ toastSet }: CreateToastProps): ReactNode[] {
  const taostNode: ReactNode[] = [];
  toastSet.forEach((toast) => {
    taostNode.push(
      <Toast key={toast.key} message={toast.message} bottom={toast.bottom} />
    );
  });
  return taostNode;
}

interface RenderToastProps {
  toastSet: Set<ToastInterface>;
  root: Root;
}
function renderToast({ toastSet, root }: RenderToastProps) {
  // 토스트 컴포넌트 배열 생성
  const toastNodeList = createToast({ toastSet: toastSet });

  // 렌더링
  root.render(toastNodeList);
}

interface UpdateToastProps {
  toastSet: Set<ToastInterface>;
  root: Root;
  toastContainer: HTMLDivElement;
  bottom: string;
}
function updateToast({
  toastSet,
  root,
  toastContainer,
  bottom,
}: UpdateToastProps) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        let totalHeight = 0;

        const toastElementList = Array.from(toastContainer.childNodes);
        const toastList = Array.from(toastSet);
        toastList.forEach((toast, index) => {
          // 언마운트 예약된 녀석이면 무시
          if (toast.reserveUnmount) return;

          toast.bottom = `calc(${bottom} - ${totalHeight}px)`;

          const height = (toastElementList[index] as HTMLElement).offsetHeight;
          totalHeight += height;

          // 이거는 토스트 간격
          totalHeight += 10;
        });
        renderToast({ toastSet, root });
      } catch (error) {
        // url 변경되면 토스트 높이 계산 에러 뜨는데, 무시해도 되니깐 여기서 에러 잡아주기
      }
    });
  });
}

interface ReserveUnmounToastProps {
  toastSet: Set<ToastInterface>;
  toast: ToastInterface;
  toastContainer: HTMLDivElement;
  bottom: string;
  root: Root;
}
function reserveUnmountToast({
  toastSet,
  toast,
  root,
  toastContainer,
  bottom,
}: ReserveUnmounToastProps) {
  setTimeout(() => {
    // 토스트 아래로 사라지게
    toast.bottom = "100%";
    toast.reserveUnmount = true;

    // 바꾼 이후 다시 렌더링
    updateToast({
      bottom: bottom,
      toastSet: toastSet,
      toastContainer: toastContainer,
      root: root,
    });

    // 애니메이션 0.3초후
    setTimeout(() => {
      // 토스트 삭제
      toastSet.delete(toast);

      // 삭제된거 반영
      updateToast({
        bottom: bottom,
        toastSet: toastSet,
        toastContainer: toastContainer,
        root: root,
      });
    }, 300);
  }, 5000);
}
