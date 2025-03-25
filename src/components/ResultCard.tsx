
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedNumber from './AnimatedNumber';

interface ResultCardProps {
  name: string;
  price: number;
  quantity: number;
  size: number;
  unit: string;
  totalSize: number;
  pricePerUnit: number;
  isBetterValue: boolean;
  savingsPercent: number | null;
  unitLabel?: string;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  name,
  price,
  quantity,
  size,
  unit,
  totalSize,
  pricePerUnit,
  isBetterValue,
  savingsPercent,
  unitLabel = 'oz',
  index
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Staggered animation entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150 * index);
    
    return () => clearTimeout(timer);
  }, [index]);

  // Format price per unit to fixed decimal places
  const formattedPricePerUnit = pricePerUnit.toFixed(3);

  const getUnitDisplay = () => {
    if (unit === 'count') return 'item';
    return unit;
  };

  return (
    <div 
      className={cn(
        "card-soft opacity-0 transition-all duration-700 ease-in-out transform",
        isVisible && "opacity-100 translate-y-0",
        !isVisible && "translate-y-4",
        isBetterValue 
          ? "border-l-4 border-l-blue-500 border-t border-r border-b border-gray-100" 
          : "border border-gray-100"
      )}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          
          {isBetterValue && (
            <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Best Value
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="text-base font-medium">${price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">Quantity:</span>
                <span className="text-base">
                  {quantity} × {size} {getUnitDisplay()}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">Total Size:</span>
                <span className="text-base">
                  <AnimatedNumber 
                    value={totalSize} 
                    decimals={1}
                    suffix={` ${unitLabel}`}
                  />
                </span>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg",
            isBetterValue ? "bg-gradient-to-b from-blue-50 to-blue-100" : "bg-gray-50"
          )}>
            <div className="text-sm text-gray-500 mb-1">Price per {unitLabel}</div>
            <div className={cn(
              "text-xl sm:text-2xl font-semibold",
              isBetterValue ? "text-blue-700" : "text-gray-700"
            )}>
              <AnimatedNumber 
                value={pricePerUnit} 
                prefix="$" 
                decimals={3}
              />
            </div>
            
            {!isBetterValue && savingsPercent !== null && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-red-600">{savingsPercent.toFixed(1)}% more expensive</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
