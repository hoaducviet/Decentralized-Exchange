'use client'
import { useState, useEffect } from "react";

interface Props {
  value: string;
  delay: number;
}

export default function useDebounce({ value, delay }: Props) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}
