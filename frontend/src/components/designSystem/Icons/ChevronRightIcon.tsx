import { colors } from "@/styles/colors";
interface ChevronRightIconProps {
  size?: number;
  fill?: string;
}

export default function ChevronRightIcon({
  size = 24,
  fill = colors.gray50,
}: ChevronRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.79289 5.79289C9.18342 5.40237 9.81658 5.40237 10.2071 5.79289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L10.2071 18.2071C9.81658 18.5976 9.18342 18.5976 8.79289 18.2071C8.40237 17.8166 8.40237 17.1834 8.79289 16.7929L13.5858 12L8.79289 7.20711C8.40237 6.81658 8.40237 6.18342 8.79289 5.79289Z"
        fill={fill}
      />
    </svg>
  );
}
