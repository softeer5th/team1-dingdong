import { colors } from "@/styles/colors";
interface DayRepeatBoxIconProps {
  size?: number;
  fill?: string;
}

export default function DayRepeatBoxIcon({
  size = 20,
  fill = colors.gray40,
}: DayRepeatBoxIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none">
      <rect width="20" height="20" rx="4" fill={fill} />
    </svg>
  );
}
