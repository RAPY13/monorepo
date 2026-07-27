// components/badges/FounderBadge.tsx

import Image from "next/image";

export default function FounderBadge({
  size = 220,
}: {
  size?: number;
}) {
  return (
    <Image
      src="/badges/founder-badge.png"
      alt="Founder Badge"
      width={size}
      height={size}
      priority
    />
  );
}