import { colors } from "@/styles/colors";
interface PolygonProps {
  fill?: string;
}
export default function Polygon({ fill = colors.gray100 }: PolygonProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none">
      <path d="M7 -6.1196e-07L14 8L0 8L7 -6.1196e-07Z" fill={fill} />
    </svg>
  );
}
