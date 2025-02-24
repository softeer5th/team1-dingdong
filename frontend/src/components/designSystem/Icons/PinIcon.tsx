import { colors } from "@/styles/colors";
interface PinIconProps {
  stroke?: string;
}
export default function PinIcon({ stroke = colors.gray100 }: PinIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="16"
      viewBox="0 0 4 16"
      fill="none">
      <line
        x1="2"
        y1="4.37114e-08"
        x2="2"
        y2="13"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle cx="2" cy="14" r="2" fill={stroke} />
    </svg>
  );
}
