import { colors } from "@/styles/colors";
import styled from "styled-components";

export default function DayRepeatCheckIcon() {
  return (
    <IconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6621 0.250726C12.0759 0.616475 12.1148 1.24844 11.7491 1.66226L4.67839 9.66226C4.48008 9.88663 4.19167 10.0103 3.89243 9.99934C3.59319 9.98836 3.31462 9.84386 3.1333 9.60556L0.204004 5.75594C-0.130433 5.31643 -0.0452541 4.68902 0.394257 4.35458C0.833769 4.02015 1.46118 4.10532 1.79562 4.54484L3.98691 7.4246L10.2505 0.337765C10.6163 -0.0760544 11.2482 -0.115023 11.6621 0.250726Z"
          fill={colors.white}
        />
      </svg>
    </IconWrapper>
  );
}
const IconWrapper = styled.div`
  position: absolute;
`;
