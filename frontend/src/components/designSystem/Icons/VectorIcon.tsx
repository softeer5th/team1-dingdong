import { colors } from "@/styles/colors";
interface VectorIconProps {
  width?: number;
  height?: number;
  stroke?: string;
}

export default function VectorIcon({
  width = 6,
  height = 10,
  stroke = colors.gray70,
}: VectorIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 6 10"
      fill="none">
      <path d="M1 1L5 5L1 9" stroke={stroke} strokeLinecap="round" />
    </svg>
  );
}
