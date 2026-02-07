import React from "react";

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-icon"
    >
      <defs>
        <linearGradient
          id="logo-bg"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-bg)" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="36"
        fontFamily="Arial, sans-serif"
        fill="#fff"
      >
        🍽
      </text>
    </svg>
  );
}
