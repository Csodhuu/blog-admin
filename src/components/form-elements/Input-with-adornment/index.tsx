"use client";

import { Input } from "@/components/ui/input";
import { ReactNode, useRef, useLayoutEffect, useState } from "react";

interface InputWithAdornmentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export default function InputWithAdornment({ startAdornment, endAdornment, className, style, ...props }: InputWithAdornmentProps) {
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const [startWidth, setStartWidth] = useState(0);
  const [endWidth, setEndWidth] = useState(0);

  useLayoutEffect(() => {
    if (startRef.current) setStartWidth(startRef.current.offsetWidth);
    if (endRef.current) setEndWidth(endRef.current.offsetWidth);
  }, [startAdornment, endAdornment]);

  return (
    <div className="relative w-full">
      {startAdornment && (
        <div ref={startRef} className="absolute left-3 top-0 h-full flex items-center text-gray-400 pointer-events-none">
          {startAdornment}
        </div>
      )}
      {endAdornment && (
        <div ref={endRef} className="absolute right-3 top-0 h-full flex items-center text-gray-400 pointer-events-none">
          {endAdornment}
        </div>
      )}
      <Input
        {...props}
        className={className}
        style={{
          paddingLeft: startAdornment ? startWidth + 12 : undefined,
          paddingRight: endAdornment ? endWidth + 12 : undefined,
          ...style,
        }}
      />
    </div>
  );
}
