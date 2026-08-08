import Image from "next/image";

type FounderBadgeProps = {
  size?: number;
  className?: string;
};

export default function FounderBadge({
  size = 180,
  className = "",
}: FounderBadgeProps) {
  return (
    <Image
      src="/images/founder-badge.webp"
      alt="RapYard Founders Badge"
      width={size}
      height={size}
      priority
      className={`object-contain ${className}`}
    />
  );
}