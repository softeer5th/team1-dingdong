interface CancelIconProps {
  size?: number;
  stroke?: string;
}

export default function CancelIcon({
  size = 24,
  stroke = "#111827",
}: CancelIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none">
      <path
        d="M6 18L18 6M6 6L18 18"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
