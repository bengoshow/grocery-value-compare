
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  decimals = 2,
  prefix = '',
  suffix = '',
  className
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const startValue = displayValue;
      const difference = value - startValue;
      const startTime = performance.now();
      
      const updateValue = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          // Easing function: cubic-bezier
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const newValue = startValue + difference * easeProgress;
          setDisplayValue(newValue);
          requestAnimationFrame(updateValue);
        } else {
          setDisplayValue(value);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(updateValue);
    }
  }, [value, displayValue, duration]);
  
  const formattedValue = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
  
  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <span
        className={cn(
          "inline-block transition-transform",
          isAnimating && "animate-number-change"
        )}
      >
        {formattedValue}
      </span>
    </span>
  );
};

export default AnimatedNumber;
