import { Outlet } from "react-router-dom";
import { PageWrapper, LayoutWrapper } from "./styles";

export default function Layout() {
  return (
    <LayoutWrapper>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </LayoutWrapper>
  );
}
