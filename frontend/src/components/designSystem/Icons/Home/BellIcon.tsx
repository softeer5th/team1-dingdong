import { colors } from "@/styles/colors";

export default function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12.0001 2.4C8.02368 2.4 4.80013 5.62355 4.80013 9.6V13.9029L3.9516 14.7515C3.60841 15.0947 3.50574 15.6108 3.69148 16.0592C3.87721 16.5076 4.31478 16.8 4.80013 16.8H19.2001C19.6855 16.8 20.1231 16.5076 20.3088 16.0592C20.4945 15.6108 20.3919 15.0947 20.0487 14.7515L19.2001 13.9029V9.6C19.2001 5.62355 15.9766 2.4 12.0001 2.4Z"
        fill={colors.gray100}
      />
      <path
        d="M12.0001 21.6C10.0119 21.6 8.4001 19.9882 8.4001 18H15.6001C15.6001 19.9882 13.9883 21.6 12.0001 21.6Z"
        fill={colors.gray100}
      />
    </svg>
  );
}
