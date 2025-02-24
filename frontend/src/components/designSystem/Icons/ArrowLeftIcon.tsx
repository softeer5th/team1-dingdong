import { colors } from "@/styles/colors";
interface ArrowLeftIconProps {
  size?: number;
  stroke?: string;
}

export default function ArrowLeftIcon({
  size = 38,
  stroke = colors.gray100,
}: ArrowLeftIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2758 24.7492C15.6241 25.1109 16.1889 25.1109 16.5372 24.7492C16.8855 24.3875 16.8855 23.801 16.5372 23.4393L13.0678 19.8366L26.1638 19.8366C26.6256 19.8366 27 19.4622 27 19.0004C27 18.5386 26.6256 18.1642 26.1638 18.1642L13.0671 18.1642L16.5372 14.5607C16.8855 14.199 16.8855 13.6125 16.5372 13.2508C16.1889 12.8891 15.6241 12.8891 15.2758 13.2508L10.3702 18.3451C10.0219 18.7068 10.0219 19.2932 10.3702 19.6549L15.2758 24.7492Z"
        fill={stroke}
      />
    </svg>
  );
}
