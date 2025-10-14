"use client";

import { ReactNode } from "react";

interface PhoneBadgeProps {
  label: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
}

export default function BadgeWithAdornment({
  label,
  startAdornment,
  endAdornment,
  className = "",
}: PhoneBadgeProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-md h-9 flex items-center px-4">
        {startAdornment && <span className="mr-2">{startAdornment}</span>}
        <span className="font-medium tracking-wide text-gray-700">{label}</span>
        {endAdornment && <span className="ml-2">{endAdornment}</span>}
      </div>
    </div>
  );
}
