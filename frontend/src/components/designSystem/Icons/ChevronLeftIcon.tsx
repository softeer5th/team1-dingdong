import { colors } from "@/styles/colors";
interface ChevronLeftIconProps {
  size?: number;
  fill?: string;
}

export default function ChevronLeftIcon({
  size = 24,
  fill = colors.gray50,
}: ChevronLeftIconProps) {
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
        d="M15.7071 5.79289C15.3166 5.40237 14.6834 5.40237 14.2929 5.79289L8.79289 11.2929C8.40237 11.6834 8.40237 12.3166 8.79289 12.7071L14.2929 18.2071C14.6834 18.5976 15.3166 18.5976 15.7071 18.2071C16.0976 17.8166 16.0976 17.1834 15.7071 16.7929L10.9142 12L15.7071 7.20711C16.0976 6.81658 16.0976 6.18342 15.7071 5.79289Z"
        fill={fill}
      />
    </svg>
  );
}
