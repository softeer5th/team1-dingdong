import { Outlet, useLocation } from "react-router-dom";
import { PageWrapper, LayoutWrapper } from "./styles";
import {useEffect} from "react";

export default function Layout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

  return (
    <LayoutWrapper>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </LayoutWrapper>
  );
}
