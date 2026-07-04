import React from "react";

export const FoundersBadge: React.FC = () => (
  <svg
    width="260"
    height="260"
    viewBox="0 0 260 260"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer rope border */}
    <circle
      cx="130"
      cy="130"
      r="120"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="10"
      strokeDasharray="4 6"
    />

    {/* Inner shield background */}
    <path
      d="M80 70 H180 L200 120 L180 180 H80 L60 120 Z"
      fill="#000000"
      stroke="#D4AF37"
      strokeWidth="4"
    />

    {/* Radiant star above F */}
    <g transform="translate(130,80)">
      <circle r="18" fill="#111" />
      <polygon
        points="0,-12 3,-4 12,-4 5,2 8,10 0,5 -8,10 -5,2 -12,-4 -3,-4"
        fill="#FFD700"
      />
      {/* Rays */}
      <line x1="0" y1="-22" x2="0" y2="-32" stroke="#FFD700" strokeWidth="2" />
      <line x1="0" y1="22" x2="0" y2="32" stroke="#FFD700" strokeWidth="2" />
      <line x1="-22" y1="0" x2="-32" y2="0" stroke="#FFD700" strokeWidth="2" />
      <line x1="22" y1="0" x2="32" y2="0" stroke="#FFD700" strokeWidth="2" />
    </g>

    {/* Golden F */}
    <text
      x="130"
      y="135"
      textAnchor="middle"
      fontFamily="serif"
      fontSize="64"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="2"
    >
      F
    </text>

    {/* Crossed quill (left) */}
    <path
      d="M95 150 C80 170 75 190 78 205 C85 195 95 185 110 175 Z"
      fill="#C0C0C0"
      stroke="#888"
      strokeWidth="2"
    />
    <line x1="90" y1="190" x2="110" y2="175" stroke="#777" strokeWidth="2" />

    {/* Crossed key (right) */}
    <g transform="rotate(35 165 150)">
      <rect x="160" y="150" width="40" height="6" fill="#FFD700" />
      <circle cx="160" cy="153" r="10" fill="none" stroke="#FFD700" strokeWidth="3" />
      <rect x="198" y="148" width="6" height="16" fill="#FFD700" />
    </g>

    {/* Laurel branches */}
    <g fill="none" stroke="#FFD700" strokeWidth="3">
      <path d="M95 95 C80 115 75 130 80 145" />
      <path d="M165 95 C180 115 185 130 180 145" />
      {/* Small leaves */}
      <path d="M88 110 C82 115 80 120 82 125" />
      <path d="M172 110 C178 115 180 120 178 125" />
    </g>

    {/* Banner */}
    <g transform="translate(130,200)">
      <rect
        x="-80"
        y="-18"
        width="160"
        height="36"
        rx="8"
        fill="#000000"
        stroke="#D4AF37"
        strokeWidth="3"
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="16"
        letterSpacing="2"
        fill="#FFD700"
      >
        FOUNDERS BADGE
      </text>
    </g>

    {/* Bottom star */}
    <polygon
      points="130,225 134,235 145,235 136,242 140,252 130,246 120,252 124,242 115,235 126,235"
      fill="#FFD700"
    />
  </svg>
);

export default FoundersBadge;
