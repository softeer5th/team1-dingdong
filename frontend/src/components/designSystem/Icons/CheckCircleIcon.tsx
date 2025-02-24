import { colors } from "@/styles/colors";
interface CheckCircleIconProps {
  size?: number;
  stroke?: string;
}

export default function CheckCircleIcon({
  size = 16,
  stroke = colors.orange900,
}: CheckCircleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.0001 14.4C11.5347 14.4 14.4001 11.5346 14.4001 8.00001C14.4001 4.46538 11.5347 1.60001 8.0001 1.60001C4.46548 1.60001 1.6001 4.46538 1.6001 8.00001C1.6001 11.5346 4.46548 14.4 8.0001 14.4ZM10.9658 6.96569C11.2782 6.65327 11.2782 6.14674 10.9658 5.83432C10.6534 5.5219 10.1468 5.5219 9.83441 5.83432L7.2001 8.46863L6.16578 7.43432C5.85336 7.1219 5.34683 7.1219 5.03441 7.43432C4.72199 7.74674 4.72199 8.25327 5.03441 8.56569L6.63441 10.1657C6.94683 10.4781 7.45336 10.4781 7.76578 10.1657L10.9658 6.96569Z"
        fill={stroke}
      />
    </svg>
  );
}
